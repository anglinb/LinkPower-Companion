import ActivityKit
import Foundation
import os

private let logger = Logger(subsystem: "com.peakdoo.app", category: "BatteryLiveActivity")

/// Owns the lifecycle of the Live Activity that mirrors the device's
/// charging / discharging session on the Lock Screen and Dynamic Island.
///
/// Policy:
///   - **Start** when the device first reports a non-idle status.
///   - **Update** on every meaningful battery change (we throttle the
///     same way the widget reload does — ActivityKit also has a
///     per-update budget; flooding it gets us silently rate-limited).
///   - **End** when the device returns to idle, disconnects, or reaches
///     100% on a charging session.
@MainActor
enum BatteryLiveActivityManager {

    private static var current: Activity<BatteryActivityAttributes>?
    private static var lastUpdate: Date = .distantPast
    private static var lastLevel: Int = -1
    private static var lastMode: BatteryActivityAttributes.ContentState.Mode?

    /// Floor between updates pushed to ActivityKit when nothing material
    /// changed. Apple recommends ≤ ~1/min for non-push updates; tighten
    /// or loosen as needed.
    private static let minUpdateInterval: TimeInterval = 30

    /// Drive the activity from a fresh battery snapshot.
    /// `deviceName` is captured at start and intentionally never updated
    /// — `ActivityAttributes` are immutable for the activity's lifetime.
    static func sync(
        battery: BatteryInfo?,
        isConnected: Bool,
        deviceName: String
    ) {
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            // User has disabled Live Activities for the app, or the OS
            // doesn't support them. Bail quietly — we'll still drive
            // the home-screen widget.
            return
        }

        guard isConnected, let battery, battery.enabled else {
            endIfNeeded(reason: "device disconnected or battery disabled")
            return
        }

        // Map BatteryStatus → activity mode. .idle ends the activity.
        guard let mode = mode(for: battery.status) else {
            endIfNeeded(reason: "battery returned to idle")
            return
        }

        let state = BatteryActivityAttributes.ContentState(
            mode: mode,
            level: battery.level,
            power: battery.power,
            voltage: battery.voltage,
            current: battery.current,
            capacity: battery.capacity,
            maxCapacity: battery.maxCapacity,
            remainMinutes: battery.remainMinutes
        )

        if let activity = current {
            push(state: state, on: activity, attributes: activity.attributes)
        } else {
            start(state: state, deviceName: deviceName)
        }

        // Auto-end charging sessions at 100% so the activity doesn't
        // linger after the device tops off.
        if mode == .charging, battery.level >= 100 {
            // Defer slightly so the user sees the "100%" frame before
            // the activity drops.
            Task { @MainActor in
                try? await Task.sleep(for: .seconds(2))
                endIfNeeded(reason: "charge complete")
            }
        }
    }

    /// End the active session unconditionally. Useful on disconnect.
    static func endAll() {
        endIfNeeded(reason: "explicit endAll")
    }

    // MARK: - Internals

    private static func mode(
        for status: BatteryStatus
    ) -> BatteryActivityAttributes.ContentState.Mode? {
        switch status {
        case .charging: return .charging
        case .discharging: return .discharging
        case .idle: return nil
        }
    }

    private static func start(
        state: BatteryActivityAttributes.ContentState,
        deviceName: String
    ) {
        let attributes = BatteryActivityAttributes(deviceName: deviceName)
        let content = ActivityContent(state: state, staleDate: staleDate(from: state))

        do {
            let activity = try Activity<BatteryActivityAttributes>.request(
                attributes: attributes,
                content: content,
                pushType: nil
            )
            current = activity
            lastUpdate = Date()
            lastLevel = state.level
            lastMode = state.mode
            logger.info("Started Live Activity (mode=\(state.mode.rawValue), level=\(state.level))")
        } catch {
            logger.warning("Failed to start Live Activity: \(error.localizedDescription)")
        }
    }

    private static func push(
        state: BatteryActivityAttributes.ContentState,
        on activity: Activity<BatteryActivityAttributes>,
        attributes: BatteryActivityAttributes
    ) {
        let now = Date()
        let elapsed = now.timeIntervalSince(lastUpdate)
        let levelChanged = state.level != lastLevel
        let modeChanged = state.mode != lastMode
        let shouldPush = levelChanged || modeChanged || elapsed >= minUpdateInterval

        guard shouldPush else { return }

        Task {
            await activity.update(
                ActivityContent(state: state, staleDate: staleDate(from: state))
            )
            lastUpdate = now
            lastLevel = state.level
            lastMode = state.mode
        }
    }

    private static func endIfNeeded(reason: String) {
        guard let activity = current else { return }
        current = nil
        lastUpdate = .distantPast
        lastLevel = -1
        lastMode = nil
        logger.info("Ending Live Activity: \(reason)")
        Task {
            await activity.end(nil, dismissalPolicy: .immediate)
        }
    }

    /// Tell ActivityKit when the displayed data should be considered
    /// stale — the system uses this to dim/refresh the surface if we
    /// stop pushing updates (e.g. BLE goes out of range).
    private static func staleDate(
        from state: BatteryActivityAttributes.ContentState
    ) -> Date {
        // Twice the expected refresh cadence, with a hard 10-min ceiling.
        Date(timeIntervalSinceNow: min(600, minUpdateInterval * 2))
    }
}
