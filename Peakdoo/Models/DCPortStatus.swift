import Foundation

enum PortStatus: String, Sendable {
    case idle
    case charging
    case discharging
    case disabled

    var label: String {
        switch self {
        case .idle: return "Idle"
        case .charging: return "Charging"
        case .discharging: return "Discharging"
        case .disabled: return "Disabled"
        }
    }
}

struct DCPortStatus: Equatable, Sendable {
    let enabled: Bool
    let status: PortStatus
    let voltage: Double      // V
    let current: Double      // A
    let power: Double        // W
    let isBypassOn: Bool

    var powerString: String {
        guard (enabled && status != .idle) || isBypassOn else { return "--" }
        return String(format: "%.1f", power)
    }

    var voltageString: String {
        guard enabled || isBypassOn else { return "--" }
        return String(format: "%.1f", voltage)
    }

    var currentString: String {
        guard (enabled && status != .idle) || isBypassOn else { return "--" }
        return String(format: "%.2f", current)
    }

    var statusLabel: String {
        if isBypassOn { return "Bypass Power" }
        return status == .idle ? "Idle" : "Discharging Power"
    }
}
