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

    // MARK: - Init

    override init() {
        super.init()
        centralManager = CBCentralManager(delegate: self, queue: nil)
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
                self.attemptAutoReconnect()
            } else {
                self.isScanning = false
            }
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
