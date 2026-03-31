import Foundation

enum DeviceModel: String, Sendable, CaseIterable {
    case lp1 = "BP4SL3V1"
    case lp1Alt = "PK-LINK-POWER-1"
    case lp2 = "BP4SL3V2"
    case lpp = "BP4SL3"
    case unknown = ""

    static func from(modelString: String?) -> DeviceModel {
        guard let modelString else { return .unknown }
        return DeviceModel(rawValue: modelString) ?? .unknown
    }

    var displayName: String {
        switch self {
        case .lp1, .lp1Alt: return "Link-Power 1"
        case .lp2: return "Link-Power 2"
        case .lpp: return "Link-Power+"
        case .unknown: return "Link-Power"
        }
    }

    var isLP1: Bool { self == .lp1 || self == .lp1Alt }
    var isLP2: Bool { self == .lp2 }

    var supportsBatteryCapacity: Bool { isLP1 || isLP2 }
    var supportsShutdown: Bool { isLP1 }
    var supportsScheduledControl: Bool { isLP1 || isLP2 }
    var supportsUSBPort: Bool { isLP1 || isLP2 }
    var supportsUSBPowerLimit: Bool { isLP1 || isLP2 }
    var supportsUSBOutputControl: Bool { false }  // determined by feature flags at runtime
    var supportsDCBypass: Bool { isLP2 }
    var supportsDCInput: Bool { isLP2 }
}
