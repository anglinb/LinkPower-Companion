import CoreBluetooth
import Foundation
import Observation
import os

private let logger = Logger(subsystem: "com.peakdoo.app", category: "BLEDeviceConnection")

@Observable
@MainActor
final class BLEDeviceConnection: NSObject {

    // MARK: - Public state

    let deviceState = DeviceState()
    nonisolated(unsafe) let peripheral: CBPeripheral

    // MARK: - Private characteristic cache

    private var characteristicsByUUID: [CBUUID: CBCharacteristic] = [:]
    private var hasBegunSetup = false

    // MARK: - Request/Response continuation for link-power commands

    private var pendingLinkPowerContinuation: CheckedContinuation<Data?, Never>?
    private var pendingTimeoutTask: Task<Void, Never>?

    // MARK: - Init

    init(peripheral: CBPeripheral) {
        self.peripheral = peripheral
        super.init()
        peripheral.delegate = self
    }

    // MARK: - Connection Flow

    /// Kick off the post-GATT-connect setup sequence.
    func start() {
        Task { @MainActor [weak self] in
            guard let self else { return }
            // Small delay for iOS BLE stack to stabilize after GATT connection
            try? await Task.sleep(for: .seconds(2))
            self.peripheral.discoverServices(BLEUUIDs.allServices)
            logger.info("Discovering services...")
        }
    }

    // MARK: - Commands

    func setDCPort(enabled: Bool) {
        let value: UInt8 = enabled ? 0x01 : 0x00
        let data = Data([BLECommand.dcControl.rawValue, BLEAction.set.rawValue, value])
        writeToLinkPower(data)
        logger.info("DC port set to \(enabled ? "ON" : "OFF")")
    }

    func setTypeCOutput(enabled: Bool) {
        // val=1 for enable output, 0 for disable
        // when enabled: mode=0x03, when disabled: mode=0x01
        let mode: UInt8 = enabled ? 0x03 : 0x01
        let value: UInt8 = enabled ? 0x01 : 0x00
        let data = Data([
            BLECommand.typeCControl.rawValue,
            BLEAction.set.rawValue,
            mode,
            value,
        ])
        writeToLinkPower(data)
        logger.info("Type-C output set to \(enabled ? "ON" : "OFF")")
    }

    func setDCBypass(enabled: Bool) {
        let value: UInt8 = enabled ? 0x01 : 0x00
        let data = Data([BLECommand.dcBypassControl.rawValue, BLEAction.set.rawValue, value])
        writeToLinkPower(data)
        logger.info("DC bypass set to \(enabled ? "ON" : "OFF")")
    }

    func restart() {
        let data = Data([BLECommand.restart.rawValue, BLEAction.set.rawValue])
        writeToLinkPower(data, type: .withoutResponse)
        logger.info("Restart command sent")
    }

    // MARK: - Shutdown

    /// Shutdown the device by writing [0x46, 0x4D] to the factoryMode characteristic (0x4310).
    /// Recovery: plug in USB-C power.
    func shutdown() {
        guard let char = characteristicsByUUID[BLEUUIDs.factoryMode] else {
            logger.warning("Factory mode characteristic not found, cannot shutdown")
            return
        }
        peripheral.writeValue(Data([0x46, 0x4D]), for: char, type: .withResponse)
        logger.info("Shutdown command sent")
    }

    // MARK: - Factory Mode

    /// Switch device to factory mode via running mode control command (0xE0).
    func switchToFactoryMode() {
        let data = Data([BLECommand.runningModeControl.rawValue, BLEAction.set.rawValue, 0x01])
        writeToLinkPower(data, type: .withoutResponse)
        logger.info("Factory mode command sent")
    }

    // MARK: - BLE PIN

    /// Set the BLE pairing PIN (0-999999).
    func setBLEPin(_ pin: UInt32) {
        guard pin <= 999999 else {
            logger.warning("BLE PIN out of range: \(pin)")
            return
        }
        var data = Data([BLECommand.blePin.rawValue, BLEAction.set.rawValue])
        var pinLE = pin.littleEndian
        data.append(Data(bytes: &pinLE, count: 4))
        writeToLinkPower(data)
        logger.info("BLE PIN set command sent")
    }

    // MARK: - Power Limit

    /// Get the current power limit for a given type.
    /// Returns the level (0-4) or PowerLevel.notSetValue (-1) if not set, nil on failure.
    func getPowerLimit(type: PowerLimitType) async -> Int? {
        let command = Data([
            BLECommand.typeCPowerLimit.rawValue,
            BLEAction.get.rawValue,
            type.rawValue,
        ])

        guard let response = await sendCommandAndWait(command) else {
            logger.warning("getPowerLimit: no response for type \(type.rawValue)")
            return nil
        }

        // Response: [cmd, ?, result, level]
        guard response.count >= 4 else {
            logger.warning("getPowerLimit: response too short (\(response.count) bytes)")
            return nil
        }

        let result = response.uint8(at: 2) ?? 0xFF
        if result == 0xFF {
            // Not set
            return PowerLevel.notSetValue
        }
        guard result == 0 else {
            logger.warning("getPowerLimit: error result \(result)")
            return nil
        }

        let level = Int(response.uint8(at: 3) ?? 0)
        logger.info("Power limit type=\(type.rawValue) level=\(level)")
        return level
    }

    /// Set the power limit for a given type.
    func setPowerLimit(type: PowerLimitType, level: Int) async -> Bool {
        let command = Data([
            BLECommand.typeCPowerLimit.rawValue,
            BLEAction.set.rawValue,
            type.rawValue,
            UInt8(level),
        ])

        guard let response = await sendCommandAndWait(command) else {
            logger.warning("setPowerLimit: no response")
            return false
        }

        guard response.count >= 3 else { return false }
        let result = response.uint8(at: 2) ?? 0xFF
        let success = result == 0
        if success {
            logger.info("Power limit type=\(type.rawValue) set to level=\(level)")
        } else {
            logger.warning("setPowerLimit: failed with result \(result)")
        }
        return success
    }

    // MARK: - Request/Response Pattern

    /// Send a command via linkPowerChar and wait for the response (with 3 second timeout).
    ///
    /// The linkPowerChar (0x4302) does NOT have notifications enabled, so after writing
    /// we must explicitly read the characteristic to retrieve the device's response.
    func sendCommandAndWait(_ data: Data) async -> Data? {
        // Cancel any existing pending continuation
        if let existing = pendingLinkPowerContinuation {
            existing.resume(returning: nil)
            pendingLinkPowerContinuation = nil
        }
        pendingTimeoutTask?.cancel()

        guard let char = characteristicsByUUID[BLEUUIDs.linkPowerChar] else {
            logger.warning("linkPowerChar not found, cannot send command")
            return nil
        }

        // Write the command
        let hexString = data.map { String(format: "%02X", $0) }.joined(separator: " ")
        logger.debug("BLE TX [\(data.count) bytes]: \(hexString)")
        peripheral.writeValue(data, for: char, type: .withResponse)

        // Wait a moment for the device to process the command, then read the response
        try? await Task.sleep(for: .milliseconds(200))

        return await withCheckedContinuation { continuation in
            pendingLinkPowerContinuation = continuation

            // Timeout after 3 seconds
            pendingTimeoutTask = Task { @MainActor [weak self] in
                try? await Task.sleep(for: .seconds(3))
                guard !Task.isCancelled else { return }
                if let pending = self?.pendingLinkPowerContinuation {
                    self?.pendingLinkPowerContinuation = nil
                    self?.pendingTimeoutTask = nil
                    pending.resume(returning: nil)
                    logger.warning("Command timed out after 3 seconds")
                }
            }

            // Issue the read — this triggers didUpdateValueFor which resumes the continuation
            peripheral.readValue(for: char)
        }
    }

    /// Resume the pending continuation with the given data (called from characteristic update handler).
    private func resumePendingContinuation(with data: Data) {
        guard let continuation = pendingLinkPowerContinuation else { return }
        pendingLinkPowerContinuation = nil
        pendingTimeoutTask?.cancel()
        pendingTimeoutTask = nil
        let hexString = data.map { String(format: "%02X", $0) }.joined(separator: " ")
        logger.debug("BLE RX [\(data.count) bytes]: \(hexString)")
        continuation.resume(returning: data)
    }

    // MARK: - Timer / Scheduler Commands

    /// Load all timers from the device.
    /// 1. Send [0x06, 0x00, 0x00] to get timer count and IDs.
    /// 2. For each ID, send [0x06, 0x00, 0x01, id] to get timer details.
    func loadTimers() async -> [DeviceTimer]? {
        // Step 1: Query timer list
        let listCommand = Data([
            BLECommand.scheduledOnOff.rawValue,
            BLEAction.get.rawValue,
            0x00,
        ])

        guard let listResponse = await sendCommandAndWait(listCommand) else {
            logger.warning("loadTimers: no response for list command")
            return nil
        }

        // Response: byte[0]=cmd, byte[1]=subCmd, byte[2]=result, byte[3]=count, bytes[4..]=ids
        guard listResponse.count >= 4 else {
            logger.warning("loadTimers: response too short (\(listResponse.count) bytes)")
            return nil
        }

        let result = listResponse.uint8(at: 2) ?? 0xFF
        guard result == 0 else {
            logger.warning("loadTimers: list command returned error \(result)")
            return nil
        }

        let count = Int(listResponse.uint8(at: 3) ?? 0)
        guard count > 0 else {
            logger.info("loadTimers: no timers on device")
            return []
        }

        // Collect timer IDs
        var timerIds: [Int] = []
        for i in 0..<count {
            let offset = 4 + i
            if let timerId = listResponse.uint8(at: offset) {
                timerIds.append(Int(timerId))
            }
        }

        // Step 2: Fetch each timer
        var timers: [DeviceTimer] = []
        for timerId in timerIds {
            let getCommand = Data([
                BLECommand.scheduledOnOff.rawValue,
                BLEAction.get.rawValue,
                0x01,
                UInt8(timerId),
            ])

            // Small delay between sequential BLE commands
            try? await Task.sleep(for: .milliseconds(200))

            guard let timerResponse = await sendCommandAndWait(getCommand) else {
                logger.warning("loadTimers: no response for timer \(timerId)")
                continue
            }

            // Response: byte[0]=cmd, byte[1]=subCmd, byte[2]=result, byte[3]=id, bytes[4..12]=timer data
            guard timerResponse.count >= 13 else {
                logger.warning("loadTimers: timer response too short for id \(timerId)")
                continue
            }

            let timerResult = timerResponse.uint8(at: 2) ?? 0xFF
            guard timerResult == 0 else {
                logger.warning("loadTimers: timer \(timerId) returned error \(timerResult)")
                continue
            }

            if let timer = DeviceTimer.fromData(timerResponse, offset: 4, id: timerId) {
                timers.append(timer)
                logger.info("Loaded timer \(timerId): \(timer.action.label) at \(timer.timeString)")
            }
        }

        return timers
    }

    /// Save a timer to the device.
    func saveTimer(_ timer: DeviceTimer) async -> Bool {
        let commandData = timer.toCommandData()

        logger.info("saveTimer: id=\(timer.id == 0xFF ? "NEW" : String(timer.id)) action=\(timer.action.label) type=\(timer.type.label) time=\(timer.timeString) status=\(timer.status.label)")

        guard let response = await sendCommandAndWait(commandData) else {
            logger.warning("saveTimer: no response")
            return false
        }

        // Check result byte
        guard response.count >= 3 else {
            logger.warning("saveTimer: response too short (\(response.count) bytes)")
            return false
        }
        let result = response.uint8(at: 2) ?? 0xFF
        let success = result == 0
        if success {
            // For new timers, the device returns the assigned ID in byte 3
            if timer.id == 0xFF, response.count >= 4, let newId = response.uint8(at: 3) {
                logger.info("saveTimer: new timer assigned id=\(newId)")
            }
            logger.info("saveTimer: timer saved successfully")
        } else {
            logger.warning("saveTimer: save failed with result \(result)")
        }
        return success
    }

    /// Delete a timer from the device.
    func deleteTimer(id: Int) async -> Bool {
        let data = Data([
            BLECommand.scheduledOnOff.rawValue,
            BLEAction.set.rawValue,
            0x04,
            UInt8(id),
        ])

        guard let response = await sendCommandAndWait(data) else {
            logger.warning("deleteTimer: no response")
            return false
        }

        guard response.count >= 3 else { return false }
        let result = response.uint8(at: 2) ?? 0xFF
        let success = result == 0
        if success {
            logger.info("deleteTimer: timer \(id) deleted successfully")
        } else {
            logger.warning("deleteTimer: timer \(id) delete failed with result \(result)")
        }
        return success
    }

    // MARK: - Private Write Helpers

    private func writeToLinkPower(_ data: Data, type: CBCharacteristicWriteType = .withResponse) {
        guard let char = characteristicsByUUID[BLEUUIDs.linkPowerChar] else {
            logger.warning("Link-Power characteristic not found, cannot write")
            return
        }
        peripheral.writeValue(data, for: char, type: type)
    }

    private func writeToOTA(_ data: Data, type: CBCharacteristicWriteType = .withResponse) {
        guard let char = characteristicsByUUID[BLEUUIDs.otaChar] else {
            logger.warning("OTA characteristic not found, cannot write")
            return
        }
        peripheral.writeValue(data, for: char, type: type)
    }

    // MARK: - Setup Sequence (after service + characteristic discovery)

    private func beginSetup() {
        Task { @MainActor [weak self] in
            guard let self else { return }
            await self.performSetup()
        }
    }

    private func performSetup() async {
        // Step 1: Write OTA info command and read response
        writeToOTA(Data([OTACommand.info.rawValue]))
        logger.info("Wrote OTA info command (0x84)")

        // Wait for write response, then read OTA characteristic
        try? await Task.sleep(for: .milliseconds(500))
        if let otaChar = characteristicsByUUID[BLEUUIDs.otaChar] {
            peripheral.readValue(for: otaChar)
        }

        // Wait for read response
        try? await Task.sleep(for: .milliseconds(500))

        // Check OTA mode - full setup only in app mode
        guard let otaInfo = deviceState.otaInfo, otaInfo.mode == .app else {
            if deviceState.otaInfo?.mode == .ota {
                logger.info("Device is in OTA mode, skipping normal setup")
            } else {
                logger.warning("Could not determine OTA mode, attempting normal setup anyway")
            }
            return
        }

        // Step 2: App mode setup
        logger.info("Device in App mode, running full setup")

        // Set CID from OTA info
        deviceState.cid = otaInfo.cid

        // Read device information characteristics
        readDeviceInformation()

        // Read initial DC port status
        if let dcChar = characteristicsByUUID[BLEUUIDs.dcPortStatus] {
            peripheral.readValue(for: dcChar)
            peripheral.setNotifyValue(true, for: dcChar)
            logger.info("Subscribed to DC port notifications")
        }

        // For LP1/LP2: read battery and Type-C status
        let model = deviceState.model
        if model.isLP1 || model.isLP2 || model == .unknown {
            // Battery info
            if let battChar = characteristicsByUUID[BLEUUIDs.extBatteryInfo] {
                peripheral.readValue(for: battChar)
                peripheral.setNotifyValue(true, for: battChar)
                logger.info("Subscribed to battery notifications")
            }

            // Type-C port status
            if let typeCChar = characteristicsByUUID[BLEUUIDs.typeCPortStatus] {
                peripheral.readValue(for: typeCChar)
                peripheral.setNotifyValue(true, for: typeCChar)
                logger.info("Subscribed to Type-C notifications")
            }
        }

        // Query feature flags
        try? await Task.sleep(for: .milliseconds(300))
        queryFeatures()

        // Sync datetime
        try? await Task.sleep(for: .milliseconds(300))
        syncDateTime()

        // Load scheduled timers (matches PWA's setup flow)
        try? await Task.sleep(for: .milliseconds(300))
        if let timers = await loadTimers() {
            deviceState.timers = timers
            logger.info("Loaded \(timers.count) timers during setup")
        }

        deviceState.isConnected = true
        logger.info("Setup complete")
    }

    // MARK: - Device Information

    private func readDeviceInformation() {
        let chars: [CBUUID] = [
            BLEUUIDs.modelNumberString,
            BLEUUIDs.hardwareRevisionString,
            BLEUUIDs.firmwareRevisionString,
            BLEUUIDs.softwareRevisionString,
        ]
        for uuid in chars {
            if let char = characteristicsByUUID[uuid] {
                peripheral.readValue(for: char)
            }
        }
    }

    // MARK: - Feature Query

    private func queryFeatures() {
        let data = Data([BLECommand.features.rawValue, BLEAction.get.rawValue])
        writeToLinkPower(data)
        logger.info("Querying feature flags")
    }

    // MARK: - Date/Time Sync

    func syncDateTime() {
        guard let char = characteristicsByUUID[BLEUUIDs.currentTimeChar] else {
            logger.warning("Current Time characteristic not found")
            return
        }

        let now = Date()
        let calendar = Calendar.current
        let components = calendar.dateComponents(
            [.year, .month, .day, .hour, .minute, .second, .weekday],
            from: now
        )

        guard let year = components.year,
              let month = components.month,
              let day = components.day,
              let hour = components.hour,
              let minute = components.minute,
              let second = components.second,
              let weekday = components.weekday else {
            return
        }

        // Current Time Service format (10 bytes):
        // bytes 0-1: year (uint16 LE)
        // byte 2: month (1-12)
        // byte 3: day (1-31)
        // byte 4: hours (0-23)
        // byte 5: minutes (0-59)
        // byte 6: seconds (0-59)
        // byte 7: day of week (1=Monday..7=Sunday) - CoreBluetooth uses 1=Sunday
        // byte 8: fractions (1/256 sec)
        // byte 9: adjust reason
        var data = Data(count: 10)
        data[0] = UInt8(year & 0xFF)
        data[1] = UInt8((year >> 8) & 0xFF)
        data[2] = UInt8(month)
        data[3] = UInt8(day)
        data[4] = UInt8(hour)
        data[5] = UInt8(minute)
        data[6] = UInt8(second)
        // Convert Calendar weekday (1=Sunday..7=Saturday) to BLE (1=Monday..7=Sunday)
        let bleWeekday: UInt8 = weekday == 1 ? 7 : UInt8(weekday - 1)
        data[7] = bleWeekday
        data[8] = 0 // fractions
        data[9] = 0 // adjust reason

        peripheral.writeValue(data, for: char, type: .withResponse)
        deviceState.lastSyncTime = Date()
        logger.info("Synced date/time: \(year)-\(month)-\(day) \(hour):\(minute):\(second)")
    }

    // MARK: - Handle Incoming Data

    private func handleCharacteristicUpdate(_ characteristic: CBCharacteristic) {
        guard let data = characteristic.value else { return }
        let uuid = characteristic.uuid

        switch uuid {
        case BLEUUIDs.extBatteryInfo:
            if let battery = BLEDataParser.parseExtBatteryInfo(data) {
                deviceState.battery = battery
                logger.debug("Battery: level=\(battery.level)% status=\(battery.status.rawValue)")
            }

        case BLEUUIDs.dcPortStatus:
            if let dcPort = BLEDataParser.parseDCPortStatus(data) {
                deviceState.dcPort = dcPort
                logger.debug("DC port: enabled=\(dcPort.enabled) status=\(dcPort.status.rawValue)")
            }

        case BLEUUIDs.typeCPortStatus:
            if let typeC = BLEDataParser.parseTypeCPortStatus(data) {
                deviceState.typeCPort = typeC
                logger.debug("Type-C: enabled=\(typeC.enabled) status=\(typeC.status.rawValue)")
            }

        case BLEUUIDs.otaChar:
            if let otaInfo = BLEDataParser.parseOTAInfo(data) {
                deviceState.otaInfo = otaInfo
                logger.info("OTA info: mode=\(otaInfo.mode == .app ? "App" : "OTA") cid=\(String(describing: otaInfo.cid))")
            }

        case BLEUUIDs.modelNumberString:
            let value = String(data: data, encoding: .utf8)
            deviceState.model = DeviceModel.from(modelString: value)
            logger.info("Model: \(value ?? "nil") -> \(self.deviceState.model.displayName)")

        case BLEUUIDs.hardwareRevisionString:
            deviceState.variant = String(data: data, encoding: .utf8)
            logger.info("Variant: \(self.deviceState.variant ?? "nil")")

        case BLEUUIDs.firmwareRevisionString:
            deviceState.firmwareVersion = String(data: data, encoding: .utf8)
            logger.info("Firmware: \(self.deviceState.firmwareVersion ?? "nil")")

        case BLEUUIDs.softwareRevisionString:
            deviceState.otaVersion = String(data: data, encoding: .utf8)
            logger.info("OTA version: \(self.deviceState.otaVersion ?? "nil")")

        case BLEUUIDs.linkPowerChar:
            handleLinkPowerResponse(data)

        default:
            logger.debug("Unhandled characteristic update: \(uuid)")
        }
    }

    private func handleLinkPowerResponse(_ data: Data) {
        guard data.count >= 1 else { return }
        let commandByte = data[data.startIndex]

        // If there is a pending continuation waiting for a response, resume it first
        if pendingLinkPowerContinuation != nil {
            resumePendingContinuation(with: data)
            // Still process the data normally below for state updates
        }

        switch commandByte {
        case BLECommand.features.rawValue:
            // Feature flags response: [0xFE, 0x80, result, features(4 bytes LE)]
            guard data.count >= 7 else {
                logger.warning("Feature response too short: \(data.count) bytes")
                return
            }
            let result = data[data.startIndex + 2]
            guard result == 0 else {
                logger.warning("Feature query returned error: \(result)")
                return
            }
            if let raw = data.uint32LE(at: 3) {
                deviceState.features = FeatureFlags(rawValue: raw)
                logger.info("Features: 0x\(String(raw, radix: 16))")
            }

        case BLECommand.scheduledOnOff.rawValue:
            // Timer responses are handled via the continuation pattern
            logger.debug("Timer response: len=\(data.count)")

        case BLECommand.typeCPowerLimit.rawValue:
            // Power limit responses are handled via the continuation pattern
            logger.debug("Power limit response: len=\(data.count)")

        default:
            logger.debug("Link-Power response: cmd=0x\(String(format: "%02X", commandByte)) len=\(data.count)")
        }
    }
}

// MARK: - CBPeripheralDelegate

extension BLEDeviceConnection: CBPeripheralDelegate {

    nonisolated func peripheral(
        _ peripheral: CBPeripheral,
        didDiscoverServices error: (any Error)?
    ) {
        if let error {
            logger.error("Service discovery error: \(error.localizedDescription)")
            return
        }
        guard let services = peripheral.services else { return }

        for service in services {
            logger.info("Discovered service: \(service.uuid)")
            peripheral.discoverCharacteristics(nil, for: service)
        }
    }

    nonisolated func peripheral(
        _ peripheral: CBPeripheral,
        didDiscoverCharacteristicsFor service: CBService,
        error: (any Error)?
    ) {
        if let error {
            logger.error("Characteristic discovery error for \(service.uuid): \(error.localizedDescription)")
            return
        }
        guard let characteristics = service.characteristics else { return }

        Task { @MainActor [weak self] in
            guard let self else { return }

            for characteristic in characteristics {
                self.characteristicsByUUID[characteristic.uuid] = characteristic
                logger.info("Cached characteristic: \(characteristic.uuid)")
            }

            // Check if we've discovered characteristics for all services
            let allServicesDiscovered = peripheral.services?.allSatisfy { svc in
                svc.characteristics != nil
            } ?? false

            if allServicesDiscovered && !self.hasBegunSetup {
                self.hasBegunSetup = true
                logger.info("All service characteristics discovered, beginning setup")
                self.beginSetup()
            }
        }
    }

    nonisolated func peripheral(
        _ peripheral: CBPeripheral,
        didUpdateValueFor characteristic: CBCharacteristic,
        error: (any Error)?
    ) {
        if let error {
            logger.error("Read error for \(characteristic.uuid): \(error.localizedDescription)")
            return
        }

        Task { @MainActor [weak self] in
            guard let self else { return }
            self.handleCharacteristicUpdate(characteristic)
        }
    }

    nonisolated func peripheral(
        _ peripheral: CBPeripheral,
        didWriteValueFor characteristic: CBCharacteristic,
        error: (any Error)?
    ) {
        if let error {
            logger.error("Write error for \(characteristic.uuid): \(error.localizedDescription)")
        } else {
            logger.debug("Write succeeded for \(characteristic.uuid)")
        }
    }

    nonisolated func peripheral(
        _ peripheral: CBPeripheral,
        didUpdateNotificationStateFor characteristic: CBCharacteristic,
        error: (any Error)?
    ) {
        if let error {
            logger.error("Notification state error for \(characteristic.uuid): \(error.localizedDescription)")
        } else {
            let state = characteristic.isNotifying ? "enabled" : "disabled"
            logger.info("Notifications \(state) for \(characteristic.uuid)")
        }
    }
}
