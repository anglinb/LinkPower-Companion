import Foundation

// MARK: - Power Limit Types

enum PowerLimitType: UInt8, Sendable, CaseIterable {
    case global = 1
    case input = 2
    case output = 3
    case runtime = 4

    var displayName: String {
        switch self {
        case .global: return "Global"
        case .input: return "Input / Charging"
        case .output: return "Output / Discharging"
        case .runtime: return "Runtime"
        }
    }
}

// MARK: - Power Level

enum PowerLevel: Int, Sendable, CaseIterable {
    case w30 = 0
    case w45 = 1
    case w60 = 2
    case w65 = 3
    case w100 = 4

    var wattage: String {
        switch self {
        case .w30: return "30W"
        case .w45: return "45W"
        case .w60: return "60W"
        case .w65: return "65W"
        case .w100: return "100W"
        }
    }

    /// Whether this level requires a warning (high power)
    var isHighPower: Bool { self == .w100 }

    static let notSetValue: Int = -1
}
