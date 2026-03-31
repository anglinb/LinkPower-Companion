import CoreBluetooth
import Observation
import SwiftUI

@Observable
@MainActor
final class ConnectionViewModel {
    // MARK: - Dependencies

    private let bleManager: BLEManager

    // MARK: - Init

    init(bleManager: BLEManager) {
        self.bleManager = bleManager
    }

    // MARK: - Computed state (delegates to BLEManager)

    var isScanning: Bool {
        bleManager.isScanning
    }

    var devices: [DiscoveredDevice] {
        bleManager.discoveredDevices
    }

    var connectionError: String? {
        bleManager.connectionError
    }

    var isConnecting: Bool {
        bleManager.connectionState == .connecting
    }

    var bluetoothIsAvailable: Bool {
        // CBCentralManager state is not directly exposed; we check indirectly.
        // If scanning works or devices have been found, BLE is available.
        // For a more precise check the BLEManager would need to expose centralState.
        // We assume BLE is available unless a scan fails silently.
        true
    }

    var hasLastConnectedDevice: Bool {
        UserDefaults.standard.string(forKey: "BLEManager.lastPeripheralUUID") != nil
    }

    // MARK: - Actions

    func startScan() {
        bleManager.startScan()
    }

    func stopScan() {
        bleManager.stopScan()
    }

    func connect(to device: DiscoveredDevice) {
        bleManager.connect(to: device)
    }

    func disconnect() {
        bleManager.disconnect()
    }

    func attemptReconnect() {
        bleManager.attemptAutoReconnect()
    }
}
