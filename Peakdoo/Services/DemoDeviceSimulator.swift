import Foundation
import Observation
import os

private let logger = Logger(subsystem: "com.peakdoo.app", category: "DemoSimulator")

/// Provides a fully simulated device experience for demo/review purposes.
/// No BLE connection required — all state is generated locally with live-updating values.
@Observable
@MainActor
final class DemoDeviceSimulator {

    let deviceState = DeviceState()

    private var simulationTask: Task<Void, Never>?
    private var tickCount = 0

    // MARK: - Lifecycle

    func start() {
        setupInitialState()
        startSimulation()
        logger.info("Demo simulator started")
    }

    func stop() {
        simulationTask?.cancel()
        simulationTask = nil
        logger.info("Demo simulator stopped")
    }

    // MARK: - Initial State

    private func setupInitialState() {
        deviceState.isConnected = true
        deviceState.model = .lp1
        deviceState.variant = "V6#0104"
        deviceState.firmwareVersion = "2.0.0"
        deviceState.otaVersion = "1.4.5"
        deviceState.cid = 0x0104
        deviceState.features = [
            .batteryCapacity, .shutdown, .dcOutScheduler,
            .usbPort, .usbPowerLimit, .usbOutputControl, .dcBypass,
        ]
        deviceState.lastSyncTime = Date()

        deviceState.battery = BatteryInfo(
            enabled: true,
            status: .discharging,
            isFull: false,
            maxCapacity: 99.0,
            capacity: 71.3,
            level: 72,
            voltage: 14.2,
            current: 1.5,
            power: 21.3,
            remainMinutes: 200
        )

        deviceState.dcPort = DCPortStatus(
            enabled: true,
            status: .discharging,
            voltage: 12.1,
            current: 1.76,
            power: 21.3,
            isBypassOn: false
        )

        deviceState.typeCPort = TypeCPortStatus(
            enabled: true,
            status: .idle,
            voltage: 0,
            current: 0,
            power: 0,
            temperature: 31.5,
            mode: 3,
            isDCInput: false
        )

        deviceState.timers = [
            DeviceTimer(
                id: 0,
                status: .enabled,
                type: .daily,
                hour: 6,
                minute: 0,
                date: nil,
                weekDays: 0,
                monthDays: 0,
                action: .on
            ),
            DeviceTimer(
                id: 1,
                status: .enabled,
                type: .daily,
                hour: 22,
                minute: 0,
                date: nil,
                weekDays: 0,
                monthDays: 0,
                action: .off
            ),
        ]
    }

    // MARK: - Simulation Loop

    private func startSimulation() {
        simulationTask = Task { @MainActor [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(5))
                guard !Task.isCancelled else { break }
                self?.tick()
            }
        }
    }

    private func tick() {
        tickCount += 1
        guard var battery = deviceState.battery,
              var dcPort = deviceState.dcPort,
              var typeC = deviceState.typeCPort else { return }

        // Fluctuate readings ±2% to make it feel alive
        let jitter = Double.random(in: -0.02...0.02)

        if dcPort.enabled && battery.status == .discharging {
            // Drain battery every 6th tick (~30 seconds)
            let newLevel = max(5, battery.level - (tickCount % 6 == 0 ? 1 : 0))
            let newCapacity = battery.maxCapacity * Double(newLevel) / 100.0
            let basePower = 21.3
            let power = basePower * (1.0 + jitter)
            let voltage = 14.2 * (1.0 + jitter * 0.5)
            let current = power / voltage

            deviceState.battery = BatteryInfo(
                enabled: true,
                status: .discharging,
                isFull: false,
                maxCapacity: battery.maxCapacity,
                capacity: newCapacity,
                level: newLevel,
                voltage: voltage,
                current: current,
                power: power,
                remainMinutes: max(0, newLevel * 3)
            )

            let dcPower = power
            let dcVoltage = 12.1 * (1.0 + jitter * 0.5)
            let dcCurrent = dcPower / dcVoltage
            deviceState.dcPort = DCPortStatus(
                enabled: true,
                status: .discharging,
                voltage: dcVoltage,
                current: dcCurrent,
                power: dcPower,
                isBypassOn: dcPort.isBypassOn
            )
        }

        // Fluctuate Type-C temperature slightly
        let tempJitter = Double.random(in: -0.3...0.3)
        deviceState.typeCPort = TypeCPortStatus(
            enabled: typeC.enabled,
            status: typeC.status,
            voltage: typeC.voltage,
            current: typeC.current,
            power: typeC.power,
            temperature: max(25, typeC.temperature + tempJitter),
            mode: typeC.mode,
            isDCInput: typeC.isDCInput
        )
    }

    // MARK: - Create ViewModel

    func makeDashboardViewModel(appSettings: AppSettings) -> DashboardViewModel {
        let vm = DashboardViewModel(deviceState: deviceState, appSettings: appSettings)

        vm.onToggleDCPort = { [weak self] enabled in
            self?.toggleDCPort(enabled)
        }
        vm.onToggleTypeCOutput = { [weak self] enabled in
            self?.toggleTypeCOutput(enabled)
        }
        vm.onToggleDCBypass = { [weak self] enabled in
            self?.toggleDCBypass(enabled)
        }
        vm.onRestart = {
            logger.info("Demo: restart (no-op)")
        }
        vm.onSyncDateTime = { [weak self] in
            self?.deviceState.lastSyncTime = Date()
            logger.info("Demo: datetime synced")
        }
        vm.onShutdown = {
            logger.info("Demo: shutdown (no-op)")
        }
        vm.onFactoryMode = {
            logger.info("Demo: factory mode (no-op)")
        }
        vm.onSetBLEPin = { pin in
            logger.info("Demo: BLE PIN set to \(pin)")
        }

        // Timer commands
        vm.onLoadTimers = { [weak self] in
            return self?.deviceState.timers
        }
        vm.onSaveTimer = { [weak self] timer in
            guard let self else { return false }
            var timer = timer
            if timer.id == 0xFF {
                let nextId = (self.deviceState.timers?.map(\.id).max() ?? -1) + 1
                timer.id = nextId
                self.deviceState.timers?.append(timer)
            } else {
                if let idx = self.deviceState.timers?.firstIndex(where: { $0.id == timer.id }) {
                    self.deviceState.timers?[idx] = timer
                }
            }
            logger.info("Demo: timer saved (id=\(timer.id))")
            return true
        }
        vm.onDeleteTimer = { [weak self] id in
            self?.deviceState.timers?.removeAll { $0.id == id }
            logger.info("Demo: timer deleted (id=\(id))")
            return true
        }

        // Power limit commands
        vm.onGetPowerLimit = { type in
            // Return a realistic default
            switch type {
            case .global: return 3   // 65W
            case .input: return 3    // 65W
            case .output: return 2   // 60W
            case .runtime: return 3  // 65W
            }
        }
        vm.onSetPowerLimit = { type, level in
            logger.info("Demo: power limit type=\(type.rawValue) set to \(level)")
            return true
        }

        return vm
    }

    // MARK: - Mock Command Implementations

    private func toggleDCPort(_ enabled: Bool) {
        guard let dcPort = deviceState.dcPort else { return }

        if enabled {
            // Turn on → start discharging
            deviceState.dcPort = DCPortStatus(
                enabled: true,
                status: .discharging,
                voltage: 12.1,
                current: 1.76,
                power: 21.3,
                isBypassOn: dcPort.isBypassOn
            )
            // Update battery to discharging
            if var battery = deviceState.battery {
                deviceState.battery = BatteryInfo(
                    enabled: battery.enabled,
                    status: .discharging,
                    isFull: false,
                    maxCapacity: battery.maxCapacity,
                    capacity: battery.capacity,
                    level: battery.level,
                    voltage: battery.voltage,
                    current: 1.5,
                    power: 21.3,
                    remainMinutes: battery.level * 3
                )
            }
        } else {
            // Turn off → idle
            deviceState.dcPort = DCPortStatus(
                enabled: false,
                status: .idle,
                voltage: 0,
                current: 0,
                power: 0,
                isBypassOn: false
            )
            // Update battery to idle
            if var battery = deviceState.battery {
                deviceState.battery = BatteryInfo(
                    enabled: battery.enabled,
                    status: .idle,
                    isFull: false,
                    maxCapacity: battery.maxCapacity,
                    capacity: battery.capacity,
                    level: battery.level,
                    voltage: battery.voltage,
                    current: 0,
                    power: 0,
                    remainMinutes: 0
                )
            }
        }
        logger.info("Demo: DC port \(enabled ? "enabled" : "disabled")")
    }

    private func toggleTypeCOutput(_ enabled: Bool) {
        guard let typeC = deviceState.typeCPort else { return }
        deviceState.typeCPort = TypeCPortStatus(
            enabled: typeC.enabled,
            status: typeC.status,
            voltage: typeC.voltage,
            current: typeC.current,
            power: typeC.power,
            temperature: typeC.temperature,
            mode: enabled ? 3 : 1,
            isDCInput: typeC.isDCInput
        )
        logger.info("Demo: Type-C output \(enabled ? "enabled" : "disabled")")
    }

    private func toggleDCBypass(_ enabled: Bool) {
        guard let dcPort = deviceState.dcPort else { return }
        deviceState.dcPort = DCPortStatus(
            enabled: dcPort.enabled,
            status: dcPort.status,
            voltage: dcPort.voltage,
            current: dcPort.current,
            power: dcPort.power,
            isBypassOn: enabled
        )
        logger.info("Demo: DC bypass \(enabled ? "enabled" : "disabled")")
    }
}
