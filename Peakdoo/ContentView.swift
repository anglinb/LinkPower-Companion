import SwiftUI

struct ContentView: View {
    @State private var bleManager = BLEManager()
    let appSettings: AppSettings

    private var isConnected: Bool {
        bleManager.deviceConnection != nil
    }

    var body: some View {
        NavigationStack {
            Group {
                if let connection = bleManager.deviceConnection {
                    DashboardView(viewModel: makeDashboardViewModel(connection: connection))
                } else {
                    ConnectionView(viewModel: ConnectionViewModel(bleManager: bleManager))
                }
            }
            .animation(.spring(duration: 0.5, bounce: 0.2), value: isConnected)
        }
    }

    @MainActor
    private func makeDashboardViewModel(connection: BLEDeviceConnection) -> DashboardViewModel {
        let vm = DashboardViewModel(deviceState: connection.deviceState, appSettings: appSettings)

        vm.onToggleDCPort = { enabled in
            connection.setDCPort(enabled: enabled)
        }
        vm.onToggleTypeCOutput = { enabled in
            connection.setTypeCOutput(enabled: enabled)
        }
        vm.onToggleDCBypass = { enabled in
            connection.setDCBypass(enabled: enabled)
        }
        vm.onRestart = {
            connection.restart()
        }
        vm.onSyncDateTime = {
            connection.syncDateTime()
        }
        let manager = bleManager
        vm.onDisconnect = {
            manager.disconnect()
        }

        // Timer commands
        vm.onLoadTimers = {
            await connection.loadTimers()
        }
        vm.onSaveTimer = { timer in
            await connection.saveTimer(timer)
        }
        vm.onDeleteTimer = { id in
            await connection.deleteTimer(id: id)
        }

        // Shutdown / Factory Mode / BLE PIN
        vm.onShutdown = {
            connection.shutdown()
        }
        vm.onFactoryMode = {
            connection.switchToFactoryMode()
        }
        vm.onSetBLEPin = { pin in
            connection.setBLEPin(pin)
        }

        // Power Limit
        vm.onGetPowerLimit = { type in
            await connection.getPowerLimit(type: type)
        }
        vm.onSetPowerLimit = { type, level in
            await connection.setPowerLimit(type: type, level: level)
        }

        return vm
    }
}

#Preview {
    ContentView(appSettings: AppSettings())
}
