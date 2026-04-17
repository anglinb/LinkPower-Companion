import Foundation
import SuperwallKit

/// Manages paywall presentation and subscription state via Superwall.
@MainActor
enum PaywallManager {

    // MARK: - Placement Names

    /// Shown when the user tries to enable Expert Mode (timers, power limits, dev tools).
    static let expertModePlacement = "expert_mode"

    /// Shown when the user tries to access timer / scheduler features.
    static let timerPlacement = "timers"

    /// Shown when the user tries to access power limit controls.
    static let powerLimitPlacement = "power_limit"

    // MARK: - Subscription Helpers

    /// Whether the user currently has an active subscription or lifetime purchase.
    static var isProUser: Bool {
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
    static func gate(placement: String, feature: @escaping () -> Void) {
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
