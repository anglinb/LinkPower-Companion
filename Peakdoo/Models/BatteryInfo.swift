import Foundation

enum BatteryStatus: String, Sendable {
    case idle
    case charging
    case discharging

    var label: String {
        switch self {
        case .idle: return "Idle"
        case .charging: return "Charging"
        case .discharging: return "Discharging"
        }
    }
}

struct BatteryInfo: Equatable, Sendable {
    let enabled: Bool
    let status: BatteryStatus
    let isFull: Bool
    let maxCapacity: Double   // Wh
    let capacity: Double      // Wh
    let level: Int            // 0-100
    let voltage: Double       // V
    let current: Double       // A
    let power: Double         // W
    let remainMinutes: Int    // minutes remaining

    var capacityString: String {
        guard enabled else { return "--" }
        return String(format: "%.1f", capacity)
    }

    var voltageString: String {
        guard enabled else { return "--" }
        return String(format: "%.1f", voltage)
    }

    var currentString: String {
        guard enabled, status != .idle else { return "--" }
        return String(format: "%.2f", abs(current))
    }

    var remainHoursString: String {
        guard enabled, remainMinutes > 0 else { return "--" }
        return String(format: "%.1f", Double(remainMinutes) / 60.0)
    }

    var batteryTimeLabel: String {
        switch status {
        case .idle: return "Battery Time"
        case .charging: return "Charging Time"
        case .discharging: return "Battery Life"
        }
    }
}
