import SwiftUI

struct ContentView: View {
    @State private var bleManager = BLEManager()
    @State private var demoSimulator: DemoDeviceSimulator?
    @State private var demoViewModel: DashboardViewModel?
    let appSettings: AppSettings

    private var isConnected: Bool {
        bleManager.deviceConnection != nil
    }

    var body: some View {
        NavigationStack {
            Group {
                if appSettings.isDemoMode, let demoVM = demoViewModel {
                    // Demo mode — no BLE required
                    DashboardView(viewModel: demoVM, isDemoMode: true)
                } else if let connection = bleManager.deviceConnection {
                    // Real device connected
                    DashboardView(viewModel: makeDashboardViewModel(connection: connection), isDemoMode: false)
                } else {
                    // Not connected — show connection screen
                    ConnectionView(
                        viewModel: ConnectionViewModel(bleManager: bleManager),
                        onActivateDemo: activateDemo
                    )
                }
            }
            .animation(.spring(duration: 0.5, bounce: 0.2), value: isConnected)
            .animation(.spring(duration: 0.5, bounce: 0.2), value: appSettings.isDemoMode)
        }
    }

    // MARK: - Demo Mode

    private func activateDemo() {
        let simulator = DemoDeviceSimulator()
        simulator.start()
        demoSimulator = simulator

        let vm = simulator.makeDashboardViewModel(appSettings: appSettings)
        vm.onDisconnect = { [weak simulator] in
            simulator?.stop()
            demoSimulator = nil
            demoViewModel = nil
            appSettings.isDemoMode = false
        }
        demoViewModel = vm
        appSettings.isDemoMode = true
    }

    // MARK: - Real Device ViewModel

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
