import CoreBluetooth
import Foundation
import Observation
import os

// MARK: - Discovered Device

struct DiscoveredDevice: Identifiable {
    let id: UUID
    let name: String
    var rssi: Int
    nonisolated(unsafe) let peripheral: CBPeripheral
}

// MARK: - Connection State

enum ConnectionState: Sendable {
    case disconnected
    case connecting
    case connected
}

// MARK: - BLE Manager

private let logger = Logger(subsystem: "com.peakdoo.app", category: "BLEManager")

@Observable
@MainActor
final class BLEManager: NSObject {

    // MARK: - Public state

    private(set) var discoveredDevices: [DiscoveredDevice] = []
    private(set) var connectionState: ConnectionState = .disconnected
    private(set) var isScanning: Bool = false
    private(set) var connectionError: String?

    /// The active device connection (set after successful GATT connect).
    private(set) var deviceConnection: BLEDeviceConnection?

    // MARK: - Private properties

    private var centralManager: CBCentralManager!
    private var connectingPeripheral: CBPeripheral?
    private var retryCount: Int = 0
    private var lastAttemptedDevice: DiscoveredDevice?
    private static let maxRetries = 2
    private static let retryDelaySeconds: UInt64 = 2

    private static let lastPeripheralUUIDKey = "BLEManager.lastPeripheralUUID"

    /// Identifier used by iOS to restore this central manager when the
    /// app is relaunched in the background to deliver a BLE event after
    /// being terminated by the system. Must remain stable across
    /// versions — changing it disables restoration for existing users.
    private static let centralRestoreIdentifier = "co.briananglin.Peakdoo.central"

    // MARK: - Init

    override init() {
        super.init()
        centralManager = CBCentralManager(
            delegate: self,
            queue: nil,
            options: [
                CBCentralManagerOptionRestoreIdentifierKey: Self.centralRestoreIdentifier,
                // We surface our own UI when Bluetooth is off; suppress the
                // system alert so the app handles it gracefully.
                CBCentralManagerOptionShowPowerAlertKey: false,
            ]
        )
    }

    // MARK: - Public API

    func startScan() {
        guard centralManager.state == .poweredOn else {
            logger.warning("Cannot scan: Bluetooth is not powered on (state=\(self.centralManager.state.rawValue))")
            return
        }
        guard !isScanning else { return }

        discoveredDevices.removeAll()
        connectionError = nil
        isScanning = true
        centralManager.scanForPeripherals(
            withServices: [BLEUUIDs.linkPowerService],
            options: [CBCentralManagerScanOptionAllowDuplicatesKey: false]
        )
        logger.info("Started scanning for Link-Power devices")
    }

    func stopScan() {
        guard isScanning else { return }
        centralManager.stopScan()
        isScanning = false
        logger.info("Stopped scanning")
    }

    func connect(to device: DiscoveredDevice) {
        stopScan()
        connectionError = nil
        connectionState = .connecting
        connectingPeripheral = device.peripheral
        lastAttemptedDevice = device
        retryCount = 0
        centralManager.connect(device.peripheral, options: nil)
        logger.info("Connecting to \(device.name) (\(device.id))")

        if device.rssi < -90 && device.rssi != 0 {
            logger.warning("Weak signal (RSSI=\(device.rssi)). Connection may be unreliable.")
            connectionError = "Weak signal — move closer to the device for a more reliable connection."
        }
    }

    func disconnect() {
        if let connection = deviceConnection {
            centralManager.cancelPeripheralConnection(connection.peripheral)
        } else if let peripheral = connectingPeripheral {
            centralManager.cancelPeripheralConnection(peripheral)
        }
        cleanupConnection()
    }

    /// Attempt to reconnect to the last known peripheral on launch.
    func attemptAutoReconnect() {
        guard centralManager.state == .poweredOn else { return }
        guard let uuidString = UserDefaults.standard.string(forKey: Self.lastPeripheralUUIDKey),
              let uuid = UUID(uuidString: uuidString) else {
            return
        }

        let peripherals = centralManager.retrievePeripherals(withIdentifiers: [uuid])
        guard let peripheral = peripherals.first else {
            logger.info("Auto-reconnect: peripheral \(uuid) not found")
            return
        }

        let device = DiscoveredDevice(
            id: peripheral.identifier,
            name: peripheral.name ?? "Link-Power",
            rssi: 0,
            peripheral: peripheral
        )
        connect(to: device)
        logger.info("Auto-reconnect: attempting to connect to \(uuid)")
    }

    // MARK: - Private helpers

    private func cleanupConnection() {
        deviceConnection = nil
        connectingPeripheral = nil
        lastAttemptedDevice = nil
        retryCount = 0
        connectionState = .disconnected
        logger.info("Connection cleaned up")
    }

    private func saveLastPeripheral(_ identifier: UUID) {
        UserDefaults.standard.set(identifier.uuidString, forKey: Self.lastPeripheralUUIDKey)
    }

    private func clearLastPeripheral() {
        UserDefaults.standard.removeObject(forKey: Self.lastPeripheralUUIDKey)
    }
}

// MARK: - CBCentralManagerDelegate

extension BLEManager: CBCentralManagerDelegate {

    nonisolated func centralManagerDidUpdateState(_ central: CBCentralManager) {
        let state = central.state
        logger.info("Central manager state: \(state.rawValue)")
        Task { @MainActor [weak self] in
            guard let self else { return }
            if state == .poweredOn {
                // If state restoration already produced a connection, skip
                // the auto-reconnect path (which would issue a fresh
                // connect on a peripheral that's already connected).
                if self.deviceConnection == nil {
                    self.attemptAutoReconnect()
                } else {
                    logger.info("Skipping auto-reconnect: state restoration produced an active connection")
                }
            } else {
                self.isScanning = false
            }
        }
    }

    /// Called by iOS when the system relaunches the app to deliver a
    /// BLE event after termination. iOS hands us back the peripherals
    /// it was tracking on our behalf.
    ///
    /// IMPORTANT: even when iOS reports `peripheral.state == .connected`,
    /// the *encrypted/bonded* GATT link is not always re-established
    /// after restoration. Writing to a characteristic that requires
    /// encryption in that window fails with "Authentication is
    /// insufficient" (ATT error 0x05) and the device drops the link.
    ///
    /// To keep things reliable we **always tear down the restored link**
    /// and let the normal auto-reconnect path bring up a fresh,
    /// properly-encrypted connection. iOS reuses the cached bonding
    /// info from its keychain, so the reconnect is silent (no pairing
    /// prompt) and only adds ~1–2s of latency.
    nonisolated func centralManager(
        _ central: CBCentralManager,
        willRestoreState dict: [String: Any]
    ) {
        let peripherals = (dict[CBCentralManagerRestoredStatePeripheralsKey] as? [CBPeripheral]) ?? []
        logger.info("State restoration: \(peripherals.count) peripheral(s)")

        guard let peripheral = peripherals.first else { return }
        let peripheralId = peripheral.identifier
        let stateAtRestore = peripheral.state

        // Drop any stale OS-level link synchronously on the delegate
        // queue so it's torn down before centralManagerDidUpdateState
        // fires its auto-reconnect.
        if stateAtRestore == .connected || stateAtRestore == .connecting {
            central.cancelPeripheralConnection(peripheral)
        }

        Task { @MainActor [weak self] in
            guard let self else { return }
            logger.info("State restoration: peripheral=\(peripheralId) restoredState=\(stateAtRestore.rawValue) — deferring to auto-reconnect for clean encryption")

            // Persist the UUID so attemptAutoReconnect can find this
            // peripheral again. (Already saved on the original connect,
            // but we re-save defensively in case state restoration ran
            // before any connect ever completed in this install.)
            self.saveLastPeripheral(peripheralId)

            // Leave deviceConnection == nil. centralManagerDidUpdateState
            // will fire next with .poweredOn and hand off to
            // attemptAutoReconnect, which uses the saved UUID to bring
            // up a fresh encrypted connection.
        }
    }

    nonisolated func centralManager(
        _ central: CBCentralManager,
        didDiscover peripheral: CBPeripheral,
        advertisementData: [String: Any],
        rssi RSSI: NSNumber
    ) {
        let deviceName = peripheral.name
            ?? (advertisementData[CBAdvertisementDataLocalNameKey] as? String)
            ?? "Unknown"
        let rssiValue = RSSI.intValue
        let peripheralId = peripheral.identifier

        Task { @MainActor [weak self] in
            guard let self else { return }

            if let index = self.discoveredDevices.firstIndex(where: { $0.id == peripheralId }) {
                self.discoveredDevices[index].rssi = rssiValue
            } else {
                let device = DiscoveredDevice(
                    id: peripheralId,
                    name: deviceName,
                    rssi: rssiValue,
                    peripheral: peripheral
                )
                self.discoveredDevices.append(device)
                logger.info("Discovered: \(deviceName) RSSI=\(rssiValue)")
            }
        }
    }

    nonisolated func centralManager(
        _ central: CBCentralManager,
        didConnect peripheral: CBPeripheral
    ) {
        let peripheralId = peripheral.identifier
        let peripheralName = peripheral.name ?? "Link-Power"
        logger.info("Connected to \(peripheralName)")

        Task { @MainActor [weak self] in
            guard let self else { return }
            self.connectionState = .connected
            self.connectingPeripheral = nil
            self.retryCount = 0
            self.lastAttemptedDevice = nil
            self.connectionError = nil
            self.saveLastPeripheral(peripheralId)

            let connection = BLEDeviceConnection(peripheral: peripheral)
            self.deviceConnection = connection
            connection.start()
        }
    }

    nonisolated func centralManager(
        _ central: CBCentralManager,
        didFailToConnect peripheral: CBPeripheral,
        error: (any Error)?
    ) {
        let errorMessage = error?.localizedDescription ?? "Unknown error"
        logger.error("Failed to connect: \(errorMessage)")

        Task { @MainActor [weak self] in
            guard let self else { return }

            if self.retryCount < Self.maxRetries, let device = self.lastAttemptedDevice {
                self.retryCount += 1
                let attempt = self.retryCount
                logger.info("Auto-retrying connection (attempt \(attempt + 1)/\(Self.maxRetries + 1))...")
                self.connectionError = "Connection failed, retrying (\(attempt + 1)/\(Self.maxRetries + 1))..."

                try? await Task.sleep(for: .seconds(Self.retryDelaySeconds))

                guard self.connectionState == .connecting else { return }
                self.centralManager.connect(device.peripheral, options: nil)
            } else {
                self.connectionError = errorMessage
                self.lastAttemptedDevice = nil
                self.retryCount = 0
                self.cleanupConnection()
            }
        }
    }

    nonisolated func centralManager(
        _ central: CBCentralManager,
        didDisconnectPeripheral peripheral: CBPeripheral,
        error: (any Error)?
    ) {
        let errorMessage = error?.localizedDescription
        if let errorMessage {
            logger.warning("Disconnected with error: \(errorMessage)")
        } else {
            logger.info("Disconnected cleanly")
        }

        Task { @MainActor [weak self] in
            guard let self else { return }
            if let errorMessage {
                self.connectionError = errorMessage
            }
            self.deviceConnection?.deviceState.reset()
            self.cleanupConnection()
        }
    }
}
