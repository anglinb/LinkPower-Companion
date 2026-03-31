import Foundation

struct TypeCPortStatus: Equatable, Sendable {
    let enabled: Bool
    let status: PortStatus
    let voltage: Double      // V
    let current: Double      // A
    let power: Double        // W
    let temperature: Double  // Celsius
    let mode: UInt8          // 0=disabled, 1=input, 2=output, 3=all
    let isDCInput: Bool

    var outputEnabled: Bool {
        (mode & 0x02) != 0
    }

    var powerString: String {
        guard enabled, status != .idle else { return "--" }
        return String(format: "%.1f", power)
    }

    var voltageString: String {
        guard enabled, status != .idle else { return "--" }
        return String(format: "%.1f", voltage)
    }

    var currentString: String {
        guard enabled, status != .idle else { return "--" }
        return String(format: "%.2f", current)
    }

    var temperatureString: String {
        guard enabled, status != .idle else { return "--" }
        return String(format: "%.1f", temperature)
    }

    var statusLabel: String {
        switch status {
        case .charging: return "Charging Power"
        case .discharging: return "Discharging Power"
        default: return "Idle"
        }
    }
}
