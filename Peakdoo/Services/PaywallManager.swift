import Foundation
import SuperwallKit

/// Manages paywall presentation and subscription state via Superwall.
@MainActor
enum PaywallManager {

    // MARK: - Kill Switch

    /// Temporary kill-switch. When `true`, Superwall is bypassed entirely:
    /// `gate(...)` runs the feature closure immediately and `isProUser`
    /// returns `true`, so nothing in the app is locked behind a paywall.
    /// Flip back to `false` to re-enable Superwall.
    private static let isPaywallDisabled = false

    // MARK: - Environment

    /// Shared app settings, used to bypass paywalls while demo mode is active.
    /// Set once at app launch via `configure(appSettings:)`.
    private static weak var appSettings: AppSettings?

    /// Wire PaywallManager to the app's `AppSettings` so it can bypass
    /// paywalls while the user is in demo mode (demo should always be free
    /// and unlimited). Call once from the app entry point.
    static func configure(appSettings: AppSettings) {
        self.appSettings = appSettings
    }

    /// Whether the app is currently in demo mode. When true, `gate` runs the
    /// feature closure immediately and never presents a paywall.
    private static var isDemoMode: Bool {
        appSettings?.isDemoMode ?? false
    }

    // MARK: - Placement Names

    /// Shown when the user tries to enable Expert Mode (timers, power limits, dev tools).
    static let expertModePlacement = "expert_mode"

    /// Shown when the user tries to access timer / scheduler features.
    static let timerPlacement = "timers"

    /// Shown when the user tries to access power limit controls.
    static let powerLimitPlacement = "power_limit"

    /// Shown when the user starts scanning/searching for a new device.
    static let deviceSearchPlacement = "device_search"

    /// Shown when the user tries to connect to an existing/discovered device.
    static let deviceConnectionPlacement = "device_connection"

    /// Shown when the user tries to reconnect to their last-connected device.
    static let deviceReconnectPlacement = "device_reconnect"

    // MARK: - Subscription Helpers

    /// Whether the user currently has an active subscription or lifetime purchase.
    static var isProUser: Bool {
        if isPaywallDisabled { return true }
        switch Superwall.shared.subscriptionStatus {
        case .active:
            return true
        case .inactive, .unknown:
            return false
        }
    }

    // MARK: - Feature Gating

    /// Present a paywall for a given placement. If the user is already subscribed, the
    /// `feature` closure runs immediately. Otherwise Superwall decides whether to show a
    /// paywall — and the closure only runs if the user converts.
    ///
    /// Demo mode always bypasses the paywall: the feature closure runs immediately
    /// and no placement is registered with Superwall. This keeps demo unlimited
    /// while the real-device flow stays hard-paywalled.
    static func gate(placement: String, feature: @escaping () -> Void) {
        if isPaywallDisabled {
            feature()
            return
        }
        if isDemoMode {
            feature()
            return
        }
        Superwall.shared.register(placement: placement) {
            feature()
        }
    }

    // MARK: - User Management

    /// Call when you have a stable user identifier (e.g. after sign-in or account creation).
    static func identify(userId: String) {
        Superwall.shared.identify(userId: userId)
    }

    /// Call on sign-out to reset the Superwall user back to anonymous.
    static func reset() {
        Superwall.shared.reset()
    }

    // MARK: - User Attributes

    /// Set custom attributes for audience targeting and paywall personalization.
    static func setUserAttributes(_ attributes: [String: Any]) {
        Superwall.shared.setUserAttributes(attributes)
    }
}
