import Foundation

/// Translates the app's `BatteryInfo` model into the Codable snapshot the
/// widget extension reads from the shared App Group container, and into
/// the ContentState used by the charging/discharging Live Activity.
///
/// Widget reloads are throttled by `BatteryWidgetReloadCoordinator`;
/// Live Activity updates are throttled inside `BatteryLiveActivityManager`.
@MainActor
enum BatteryWidgetBridge {

    /// Publish the current battery state. Pass `battery == nil` to record
    /// a "no data" snapshot (e.g. before the first BLE notification).
    static func publish(
        battery: BatteryInfo?,
        isConnected: Bool,
        deviceName: String
    ) {
        // 1. Widget snapshot
        guard let battery, battery.enabled else {
            // Battery disabled or absent — surface a connected-but-empty
            // snapshot so the widget can show the right placeholder.
            let snapshot = BatteryWidgetSnapshot(
                deviceName: deviceName,
                isConnected: isConnected,
                status: .idle,
                level: 0,
                capacity: 0,
                maxCapacity: 0,
                voltage: 0,
                current: 0,
                power: 0,
                remainMinutes: 0
            )
            BatteryWidgetSharedStore.saveAndReload(snapshot)
            BatteryLiveActivityManager.sync(
                battery: nil,
                isConnected: isConnected,
                deviceName: deviceName
            )
            return
        }

        let snapshot = BatteryWidgetSnapshot(
            deviceName: deviceName,
            isConnected: isConnected,
            status: BatteryWidgetSnapshot.Status(battery.status),
            level: battery.level,
            capacity: battery.capacity,
            maxCapacity: battery.maxCapacity,
            voltage: battery.voltage,
            current: battery.current,
            power: battery.power,
            remainMinutes: battery.remainMinutes
        )
        BatteryWidgetSharedStore.saveAndReload(snapshot)

        // 2. Live Activity (charging / discharging only — manager handles
        //    start/update/end based on status).
        BatteryLiveActivityManager.sync(
            battery: battery,
            isConnected: isConnected,
            deviceName: deviceName
        )
    }

    /// Persist an explicit "disconnected" snapshot so the widget reflects
    /// the current state instead of stale data from the previous session,
    /// and tear down any active Live Activity.
    static func publishDisconnected() {
        // Reset the throttle so the disconnect transition reaches the
        // widget immediately rather than being coalesced.
        BatteryWidgetReloadCoordinator.shared.reset()
        BatteryWidgetSharedStore.saveAndReload(.disconnected)
        BatteryLiveActivityManager.endAll()
    }
}

private extension BatteryWidgetSnapshot.Status {
    init(_ status: BatteryStatus) {
        switch status {
        case .idle: self = .idle
        case .charging: self = .charging
        case .discharging: self = .discharging
        }
    }
}
