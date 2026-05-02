import Foundation
#if canImport(ActivityKit)
import ActivityKit
#endif

/// ActivityKit attributes describing a Link-Power charging or
/// discharging session. Compiled into both the app target (which
/// starts/updates the activity) and the BatteryWidget extension
/// (which renders the Lock Screen + Dynamic Island UI).
#if canImport(ActivityKit)
public struct BatteryActivityAttributes: ActivityAttributes {

    /// Frequently changing state — every update is shipped to the
    /// system via `Activity.update(...)`.
    public struct ContentState: Codable, Hashable {
        public enum Mode: String, Codable, Hashable, Sendable {
            case charging
            case discharging
        }

        public var mode: Mode
        public var level: Int            // 0–100
        public var power: Double         // W (absolute)
        public var voltage: Double
        public var current: Double       // A (absolute)
        public var capacity: Double      // Wh
        public var maxCapacity: Double   // Wh
        public var remainMinutes: Int
        public var updatedAt: Date

        public init(
            mode: Mode,
            level: Int,
            power: Double,
            voltage: Double,
            current: Double,
            capacity: Double,
            maxCapacity: Double,
            remainMinutes: Int,
            updatedAt: Date = Date()
        ) {
            self.mode = mode
            self.level = level
            self.power = power
            self.voltage = voltage
            self.current = current
            self.capacity = capacity
            self.maxCapacity = maxCapacity
            self.remainMinutes = remainMinutes
            self.updatedAt = updatedAt
        }

        // MARK: - Display helpers

        public var levelString: String { "\(max(0, min(100, level)))%" }

        public var powerString: String { String(format: "%.1f W", abs(power)) }

        public var voltageString: String { String(format: "%.1f V", voltage) }

        public var currentString: String { String(format: "%.2f A", abs(current)) }

        public var capacityString: String { String(format: "%.1f Wh", capacity) }

        public var remainHoursString: String {
            guard remainMinutes > 0 else { return "—" }
            let hours = Double(remainMinutes) / 60.0
            return String(format: "%.1f h", hours)
        }

        public var remainTimeLabel: String {
            switch mode {
            case .charging: return "Until full"
            case .discharging: return "Battery life"
            }
        }

        /// Estimated wall-clock time at which the session ends — used
        /// for `Text(timerInterval:)` countdowns in the activity UI.
        public var endDate: Date? {
            guard remainMinutes > 0 else { return nil }
            return updatedAt.addingTimeInterval(TimeInterval(remainMinutes) * 60)
        }
    }

    /// Static for the duration of the activity — the device identity.
    public var deviceName: String

    public init(deviceName: String) {
        self.deviceName = deviceName
    }
}
#endif
