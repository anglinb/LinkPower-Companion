import Foundation
import Observation

@Observable
@MainActor
final class DeviceState {
    var isConnected: Bool = false
    var model: DeviceModel = .unknown
    var variant: String?
    var firmwareVersion: String?
    var otaVersion: String?
    var cid: UInt16?
    var features: FeatureFlags = []
    var otaInfo: OTAInfo?

    var battery: BatteryInfo?
    var dcPort: DCPortStatus?
    var typeCPort: TypeCPortStatus?

    // Timer / Scheduler
    var timers: [DeviceTimer]?
    var lastSyncTime: Date?

    // Computed capabilities (combine feature flags with model defaults)
    var supportsBatteryCapacity: Bool {
        features.contains(.batteryCapacity) || model.supportsBatteryCapacity
    }

    var supportsShutdown: Bool {
        features.contains(.shutdown) || model.supportsShutdown
    }

    var supportsScheduledControl: Bool {
        features.contains(.dcOutScheduler) || model.supportsScheduledControl
    }

    var supportsUSBPort: Bool {
        features.contains(.usbPort) || model.supportsUSBPort
    }

    var supportsUSBPowerLimit: Bool {
        features.contains(.usbPowerLimit) || model.supportsUSBPowerLimit
    }

    var supportsUSBOutputControl: Bool {
        features.contains(.usbOutputControl)
    }

    var supportsDCBypass: Bool {
        features.contains(.dcBypass) || model.supportsDCBypass
    }

    var supportsDCBypassControl: Bool {
        features.contains(.dcBypassControl)
    }

    var supportsFactoryMode: Bool {
        features.contains(.factoryMode)
    }

    // Timer computed properties
    var hasActiveOnTimer: Bool {
        timers?.contains { $0.action == .on && $0.status == .enabled } ?? false
    }

    var hasActiveOffTimer: Bool {
        timers?.contains { $0.action == .off && $0.status == .enabled } ?? false
    }

    func reset() {
        isConnected = false
        model = .unknown
        variant = nil
        firmwareVersion = nil
        otaVersion = nil
        cid = nil
        features = []
        otaInfo = nil
        battery = nil
        dcPort = nil
        typeCPort = nil
        timers = nil
        lastSyncTime = nil
    }
}
