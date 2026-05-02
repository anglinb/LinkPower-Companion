import SwiftUI
import SuperwallKit

@main
struct PeakdooApp: App {
    @State private var appSettings = AppSettings()

    /// `BLEManager` must be created at app launch — not lazily inside a
    /// view — so that CoreBluetooth's state restoration callback
    /// (`willRestoreState`) can fire on launches initiated by the system
    /// to deliver a BLE event after termination.
    @State private var bleManager = BLEManager()

    init() {
        Superwall.configure(apiKey: "pk_thfjlRcG0Hg0oQEBr0nSL")
        // Let PaywallManager see AppSettings so it can bypass paywalls in demo mode.
        PaywallManager.configure(appSettings: appSettings)
        // Register the background refresh task as early as possible —
        // BGTaskScheduler requires registration before the app finishes
        // launching.
        BackgroundRefreshScheduler.registerTasks()
    }

    var body: some Scene {
        WindowGroup {
            ContentView(appSettings: appSettings, bleManager: bleManager)
                .onOpenURL { url in
                    Superwall.handleDeepLink(url)
                }
        }
        // Background-refresh handling is registered imperatively in
        // `BackgroundRefreshScheduler.registerTasks()` from `init()`,
        // not via `.backgroundTask(.appRefresh:)`. See the comment on
        // `registerTasks()` for why.
    }
}
