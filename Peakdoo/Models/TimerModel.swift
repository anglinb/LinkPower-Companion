import Foundation

// MARK: - Timer Status

enum TimerStatus: Int8, Sendable, Equatable {
    case empty = 0
    case enabled = 1
    case disabled = -1
    case validationDisabled = -2
    case expired = -3

    var label: String {
        switch self {
        case .empty: return "Empty"
        case .enabled: return "Enabled"
        case .disabled: return "Disabled"
        case .validationDisabled: return "Validation Disabled"
        case .expired: return "Expired"
        }
    }

    var isActive: Bool { self == .enabled }
}

// MARK: - Timer Type

enum TimerType: UInt8, Sendable, CaseIterable, Equatable {
    case oneShot = 0
    case daily = 1
    case weekly = 2
    case monthly = 3

    var label: String {
        switch self {
        case .oneShot: return "One-Shot"
        case .daily: return "Daily"
        case .weekly: return "Weekly"
        case .monthly: return "Monthly"
        }
    }
}

// MARK: - Timer Action

enum TimerAction: UInt8, Sendable, Equatable {
    case off = 0
    case on = 1

    var label: String {
        switch self {
        case .off: return "Turn Off"
        case .on: return "Turn On"
        }
    }

    var iconName: String {
        switch self {
        case .off: return "power"
        case .on: return "bolt.fill"
        }
    }
}

// MARK: - Device Timer

struct DeviceTimer: Identifiable, Equatable, Sendable {
    var id: Int              // 0-based index, 0xFF for new
    var status: TimerStatus
    var type: TimerType
    var hour: Int            // 0-23
    var minute: Int          // 0-59
    var date: Date?          // one-shot only
    var weekDays: UInt8      // bit1=Mon...bit7=Sun
    var monthDays: UInt32    // bit1=day1...bit31=day31
    var action: TimerAction

    // MARK: - Display Helpers

    var timeString: String {
        String(format: "%02d:%02d", hour, minute)
    }

    var repeatDescription: String {
        switch type {
        case .oneShot:
            if let date {
                let formatter = DateFormatter()
                formatter.dateStyle = .medium
                formatter.timeStyle = .none
                return formatter.string(from: date)
            }
            return "One-time"
        case .daily:
            return "Every day"
        case .weekly:
            let days = DeviceTimer.weekDayNames(from: weekDays)
            return days.isEmpty ? "No days" : days.joined(separator: ", ")
        case .monthly:
            let days = DeviceTimer.monthDayNumbers(from: monthDays)
            if days.isEmpty { return "No days" }
            return days.map { String($0) }.joined(separator: ", ")
        }
    }

    // MARK: - Default for new timer

    static func makeNew() -> DeviceTimer {
        let calendar = Calendar.current
        let now = Date()
        let components = calendar.dateComponents([.hour, .minute], from: now)
        return DeviceTimer(
            id: 0xFF,
            status: .enabled,
            type: .oneShot,
            hour: components.hour ?? 12,
            minute: components.minute ?? 0,
            date: calendar.date(byAdding: .day, value: 1, to: now),
            weekDays: 0,
            monthDays: 0,
            action: .on
        )
    }

    // MARK: - BLE Parsing

    /// Parse a timer from BLE response data at the given byte offset.
    /// Binary layout (9 bytes from offset):
    ///   offset+0: status (int8)
    ///   offset+1: type (uint8)
    ///   offset+2: hour (uint8)
    ///   offset+3: minute (uint8)
    ///   offset+4..+7: repeat union (4 bytes)
    ///     - one-shot: year(uint16LE), month(uint8), day(uint8)
    ///     - weekly: weekdays(uint8), 0, 0, 0
    ///     - monthly: monthDays(uint32LE)
    ///   offset+8: action (uint8)
    static func fromData(_ data: Data, offset: Int, id: Int) -> DeviceTimer? {
        guard data.count >= offset + 9 else { return nil }

        guard let statusRaw = data.int8(at: offset),
              let status = TimerStatus(rawValue: statusRaw) else {
            return nil
        }

        guard let typeRaw = data.uint8(at: offset + 1),
              let type = TimerType(rawValue: typeRaw) else {
            return nil
        }

        guard let hour = data.uint8(at: offset + 2),
              let minute = data.uint8(at: offset + 3),
              let actionRaw = data.uint8(at: offset + 8),
              let action = TimerAction(rawValue: actionRaw) else {
            return nil
        }

        var date: Date?
        var weekDays: UInt8 = 0
        var monthDays: UInt32 = 0

        switch type {
        case .oneShot:
            if let year = data.uint16LE(at: offset + 4),
               let month = data.uint8(at: offset + 6),
               let day = data.uint8(at: offset + 7) {
                var components = DateComponents()
                components.year = Int(year)
                components.month = Int(month)
                components.day = Int(day)
                date = Calendar.current.date(from: components)
            }
        case .daily:
            // No repeat data needed for daily
            break
        case .weekly:
            weekDays = data.uint8(at: offset + 4) ?? 0
        case .monthly:
            monthDays = data.uint32LE(at: offset + 4) ?? 0
        }

        return DeviceTimer(
            id: id,
            status: status,
            type: type,
            hour: Int(hour),
            minute: Int(minute),
            date: date,
            weekDays: weekDays,
            monthDays: monthDays,
            action: action
        )
    }

    // MARK: - BLE Serialization

    /// Serialize this timer to BLE command data: [0x06, 0x01, 0x02, id, status, type, h, m, repeat(4), action]
    func toCommandData() -> Data {
        var bytes: [UInt8] = [
            BLECommand.scheduledOnOff.rawValue,
            BLEAction.set.rawValue,
            0x02,  // sub-command for save
            UInt8(id & 0xFF),
            UInt8(bitPattern: status.rawValue),
            type.rawValue,
            UInt8(hour),
            UInt8(minute),
        ]

        // Repeat union (4 bytes)
        switch type {
        case .oneShot:
            if let date {
                let calendar = Calendar.current
                let components = calendar.dateComponents([.year, .month, .day], from: date)
                let year = UInt16(components.year ?? 2026)
                bytes.append(UInt8(year & 0xFF))
                bytes.append(UInt8((year >> 8) & 0xFF))
                bytes.append(UInt8(components.month ?? 1))
                bytes.append(UInt8(components.day ?? 1))
            } else {
                bytes.append(contentsOf: [0, 0, 0, 0])
            }
        case .daily:
            bytes.append(contentsOf: [0, 0, 0, 0])
        case .weekly:
            bytes.append(weekDays)
            bytes.append(contentsOf: [0, 0, 0])
        case .monthly:
            bytes.append(UInt8(monthDays & 0xFF))
            bytes.append(UInt8((monthDays >> 8) & 0xFF))
            bytes.append(UInt8((monthDays >> 16) & 0xFF))
            bytes.append(UInt8((monthDays >> 24) & 0xFF))
        }

        bytes.append(action.rawValue)

        return Data(bytes)
    }

    // MARK: - Week Day Helpers

    /// All week day short names in order (Mon...Sun)
    static let allWeekDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    /// Convert a bitmask (bit1=Mon...bit7=Sun) to an array of day name strings.
    static func weekDayNames(from mask: UInt8) -> [String] {
        var names: [String] = []
        for i in 0..<7 {
            if mask & (1 << (i + 1)) != 0 {
                names.append(allWeekDayNames[i])
            }
        }
        return names
    }

    /// Convert a set of day name strings to a bitmask (bit1=Mon...bit7=Sun).
    static func weekDayMask(from names: Set<String>) -> UInt8 {
        var mask: UInt8 = 0
        for (i, name) in allWeekDayNames.enumerated() {
            if names.contains(name) {
                mask |= (1 << (i + 1))
            }
        }
        return mask
    }

    // MARK: - Month Day Helpers

    /// Convert a bitmask (bit1=day1...bit31=day31) to an array of day numbers.
    static func monthDayNumbers(from mask: UInt32) -> [Int] {
        var days: [Int] = []
        for i in 1...31 {
            if mask & (1 << i) != 0 {
                days.append(i)
            }
        }
        return days
    }

    /// Convert a set of day numbers to a bitmask (bit1=day1...bit31=day31).
    static func monthDayMask(from days: Set<Int>) -> UInt32 {
        var mask: UInt32 = 0
        for day in days where day >= 1 && day <= 31 {
            mask |= (1 << day)
        }
        return mask
    }
}
