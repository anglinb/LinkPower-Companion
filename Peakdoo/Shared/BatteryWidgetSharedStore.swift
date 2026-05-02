import Foundation
#if canImport(WidgetKit)
import WidgetKit
#endif

/// Identifiers shared between the main app and the BatteryWidget extension.
///
/// IMPORTANT: this file is compiled into BOTH the Peakdoo target and the
/// BatteryWidget target. It must not depend on any UIKit / SwiftUI types
/// that are unavailable in widget extensions.
public enum BatteryWidgetSharedStore {

    /// App Group identifier configured in entitlements for both targets.
    public static let appGroupIdentifier = "group.co.briananglin.Peakdoo"

    /// UserDefaults suite shared via the app group.
    public static var sharedDefaults: UserDefaults? {
        UserDefaults(suiteName: appGroupIdentifier)
    }

    /// Kind string used when registering / reloading the timeline.
    public static let widgetKind = "co.briananglin.Peakdoo.BatteryWidget"

    private static let snapshotKey = "BatteryWidget.snapshot.v1"

    /// Persist the latest snapshot. The reload of the widget timeline is
    /// debounced separately — see `saveAndReload(...)`.
    public static func save(_ snapshot: BatteryWidgetSnapshot?) {
        guard let defaults = sharedDefaults else { return }
        if let snapshot {
            if let data = try? JSONEncoder().encode(snapshot) {
                defaults.set(data, forKey: snapshotKey)
            }
        } else {
            defaults.removeObject(forKey: snapshotKey)
        }
    }

    /// Persist the snapshot and conditionally request a widget reload.
    /// Reloads are coalesced by `BatteryWidgetReloadCoordinator` so the
    /// system doesn't see a request per BLE notification (~1 Hz).
    public static func saveAndReload(_ snapshot: BatteryWidgetSnapshot?) {
        save(snapshot)
        BatteryWidgetReloadCoordinator.shared.requestReload(for: snapshot)
    }

    /// Read the most recent snapshot, if one has been written.
    public static func load() -> BatteryWidgetSnapshot? {
        guard let defaults = sharedDefaults,
              let data = defaults.data(forKey: snapshotKey)
        else { return nil }
        return try? JSONDecoder().decode(BatteryWidgetSnapshot.self, from: data)
    }

    public static func reloadTimeline() {
        #if canImport(WidgetKit)
        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
        #endif
    }
}

/// Throttles `WidgetCenter.reloadTimelines` calls so we don't burn through
/// the system's reload budget when BLE notifications fire ~1 Hz.
///
/// Policy: reload immediately if level/status/connectivity changed since
/// the last reload, OR if `minInterval` has elapsed. Otherwise the call
/// is dropped — the on-disk snapshot is still up to date for the next
/// timeline render.
final class BatteryWidgetReloadCoordinator: @unchecked Sendable {
    static let shared = BatteryWidgetReloadCoordinator()

    /// Floor between forced reloads when nothing materially changed.
    /// Ample headroom for WidgetKit; tighten/loosen as needed.
    private let minInterval: TimeInterval = 60

    private let lock = NSLock()
    private var lastReload: Date = .distantPast
    private var lastLevel: Int = -1
    private var lastStatus: BatteryWidgetSnapshot.Status?
    private var lastConnected: Bool?

    func requestReload(for snapshot: BatteryWidgetSnapshot?) {
        let shouldReload: Bool = {
            lock.lock(); defer { lock.unlock() }

            let now = Date()
            guard let snapshot else {
                lastReload = now
                lastLevel = -1
                lastStatus = nil
                lastConnected = nil
                return true
            }

            let elapsed = now.timeIntervalSince(lastReload)
            let levelChanged = snapshot.level != lastLevel
            let statusChanged = snapshot.status != lastStatus
            let connectivityChanged = snapshot.isConnected != lastConnected

            if levelChanged || statusChanged || connectivityChanged || elapsed >= minInterval {
                lastReload = now
                lastLevel = snapshot.level
                lastStatus = snapshot.status
                lastConnected = snapshot.isConnected
                return true
            }
            return false
        }()

        if shouldReload {
            BatteryWidgetSharedStore.reloadTimeline()
        }
    }

    /// Reset the coordinator's memo. Useful on app launch / device change.
    func reset() {
        lock.lock()
        lastReload = .distantPast
        lastLevel = -1
        lastStatus = nil
        lastConnected = nil
        lock.unlock()
    }
}

/// Codable, target-agnostic projection of `BatteryInfo` plus the bits of
/// device context the widget cares about. Keep it small — App Group
/// UserDefaults is not the place for large blobs.
public struct BatteryWidgetSnapshot: Codable, Equatable, Sendable {

    public enum Status: String, Codable, Sendable {
        case idle
        case charging
        case discharging

        public var label: String {
            switch self {
            case .idle: return "Idle"
            case .charging: return "Charging"
            case .discharging: return "Discharging"
            }
        }
    }

    public let deviceName: String
    public let isConnected: Bool
    public let status: Status
    public let level: Int            // 0–100
    public let capacity: Double      // Wh
    public let maxCapacity: Double   // Wh
    public let voltage: Double       // V
    public let current: Double       // A (signed)
    public let power: Double         // W
    public let remainMinutes: Int    // minutes remaining
    public let updatedAt: Date

    public init(
        deviceName: String,
        isConnected: Bool,
        status: Status,
        level: Int,
        capacity: Double,
        maxCapacity: Double,
        voltage: Double,
        current: Double,
        power: Double,
        remainMinutes: Int,
        updatedAt: Date = Date()
    ) {
        self.deviceName = deviceName
        self.isConnected = isConnected
        self.status = status
        self.level = level
        self.capacity = capacity
        self.maxCapacity = maxCapacity
        self.voltage = voltage
        self.current = current
        self.power = power
        self.remainMinutes = remainMinutes
        self.updatedAt = updatedAt
    }

    // MARK: - Display helpers

    public var levelString: String { "\(max(0, min(100, level)))%" }

    public var powerString: String {
        guard status != .idle else { return "—" }
        return String(format: "%.1f W", abs(power))
    }

    public var voltageString: String {
        String(format: "%.1f V", voltage)
    }

    public var currentString: String {
        guard status != .idle else { return "—" }
        return String(format: "%.2f A", abs(current))
    }

    public var capacityString: String {
        String(format: "%.1f Wh", capacity)
    }

    public var remainHoursString: String {
        guard remainMinutes > 0 else { return "—" }
        let hours = Double(remainMinutes) / 60.0
        return String(format: "%.1f h", hours)
    }

    public var remainTimeLabel: String {
        switch status {
        case .charging: return "Until full"
        case .discharging: return "Battery life"
        case .idle: return "Battery time"
        }
    }

    /// Sample data used for previews and the placeholder timeline entry.
    public static let placeholder = BatteryWidgetSnapshot(
        deviceName: "Link-Power",
        isConnected: true,
        status: .discharging,
        level: 78,
        capacity: 234.0,
        maxCapacity: 300.0,
        voltage: 13.2,
        current: 1.42,
        power: 18.7,
        remainMinutes: 312,
        updatedAt: Date()
    )

    /// Snapshot shown when the app has never connected or the battery is
    /// unavailable.
    public static let disconnected = BatteryWidgetSnapshot(
        deviceName: "Link-Power",
        isConnected: false,
        status: .idle,
        level: 0,
        capacity: 0,
        maxCapacity: 0,
        voltage: 0,
        current: 0,
        power: 0,
        remainMinutes: 0,
        updatedAt: Date()
    )
}
