import Observation
import SwiftUI

@Observable
@MainActor
final class DashboardViewModel {
    let deviceState: DeviceState
    let appSettings: AppSettings

    // MARK: - Command closures (set by the parent that owns BLEDeviceConnection)

    var onToggleDCPort: ((Bool) -> Void)?
    var onToggleTypeCOutput: ((Bool) -> Void)?
    var onToggleDCBypass: ((Bool) -> Void)?
    var onRestart: (() -> Void)?
    var onSyncDateTime: (() -> Void)?
    var onDisconnect: (() -> Void)?

    // Timer command closures
    var onLoadTimers: (() async -> [DeviceTimer]?)?
    var onSaveTimer: ((DeviceTimer) async -> Bool)?
    var onDeleteTimer: ((Int) async -> Bool)?

    // Shutdown / Factory / BLE PIN closures
    var onShutdown: (() -> Void)?
    var onFactoryMode: (() -> Void)?
    var onSetBLEPin: ((UInt32) -> Void)?

    // Power limit closures
    var onGetPowerLimit: ((PowerLimitType) async -> Int?)?
    var onSetPowerLimit: ((PowerLimitType, Int) async -> Bool)?

    // MARK: - Local UI state

    var showRestartConfirmation: Bool = false
    var isLoadingTimers: Bool = false
    var showTimerEditor: Bool = false
    var editingTimer: DeviceTimer?
    // MARK: - Init

    init(deviceState: DeviceState, appSettings: AppSettings) {
        self.deviceState = deviceState
        self.appSettings = appSettings
    }

    // MARK: - Battery convenience

    var batteryLevel: Int {
        deviceState.battery?.level ?? 0
    }

    var batteryStatus: BatteryStatus {
        deviceState.battery?.status ?? .idle
    }

    var batteryInfo: BatteryInfo? {
        deviceState.battery
    }

    // MARK: - DC Port convenience

    var dcPort: DCPortStatus? {
        deviceState.dcPort
    }

    var isDCPortEnabled: Bool {
        deviceState.dcPort?.enabled ?? false
    }

    var isDCBypassOn: Bool {
        deviceState.dcPort?.isBypassOn ?? false
    }

    // MARK: - Type-C convenience

    var typeCPort: TypeCPortStatus? {
        deviceState.typeCPort
    }

    var isTypeCOutputEnabled: Bool {
        deviceState.typeCPort?.outputEnabled ?? false
    }

    // MARK: - System info

    var firmwareVersion: String {
        deviceState.firmwareVersion ?? "--"
    }

    var modelName: String {
        deviceState.model.displayName
    }

    var variant: String? {
        deviceState.variant
    }

    // MARK: - Timer convenience

    var timers: [DeviceTimer] {
        deviceState.timers ?? []
    }

    var timerCount: Int {
        timers.count
    }

    var canAddTimer: Bool {
        timerCount < 6
    }

    // MARK: - Actions

    func toggleDCPort(_ enabled: Bool) {
        onToggleDCPort?(enabled)
    }

    func toggleTypeCOutput(_ enabled: Bool) {
        onToggleTypeCOutput?(enabled)
    }

    func toggleDCBypass(_ enabled: Bool) {
        onToggleDCBypass?(enabled)
    }

    func confirmRestart() {
        showRestartConfirmation = true
    }

    func executeRestart() {
        onRestart?()
    }

    func syncDateTime() {
        onSyncDateTime?()
    }

    func disconnect() {
        onDisconnect?()
    }

    func shutdown() {
        onShutdown?()
    }

    func factoryMode() {
        onFactoryMode?()
    }

    func setBLEPin(_ pin: UInt32) {
        onSetBLEPin?(pin)
    }

    // MARK: - Timer Actions

    func loadTimers() {
        guard !isLoadingTimers else { return }
        isLoadingTimers = true

        Task { @MainActor [weak self] in
            guard let self else { return }
            if let timers = await self.onLoadTimers?() {
                self.deviceState.timers = timers
            }
            self.isLoadingTimers = false
        }
    }

    func saveTimer(_ timer: DeviceTimer) {
        Task { @MainActor [weak self] in
            guard let self else { return }
            let success = await self.onSaveTimer?(timer) ?? false
            if success {
                // Reload timers to get updated state from device
                self.loadTimers()
            }
        }
    }

    func deleteTimer(id: Int) {
        Task { @MainActor [weak self] in
            guard let self else { return }
            let success = await self.onDeleteTimer?(id) ?? false
            if success {
                // Remove locally immediately for responsiveness
                self.deviceState.timers?.removeAll { $0.id == id }
            }
        }
    }

    func beginEditTimer(_ timer: DeviceTimer) {
        editingTimer = timer
        showTimerEditor = true
    }

    func beginAddTimer() {
        editingTimer = nil
        showTimerEditor = true
    }
}
