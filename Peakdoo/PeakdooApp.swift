import SwiftUI
import SuperwallKit

@main
struct PeakdooApp: App {
    @State private var appSettings = AppSettings()

    init() {
        Superwall.configure(apiKey: "pk_thfjlRcG0Hg0oQEBr0nSL")
    }

    var body: some Scene {
        WindowGroup {
            ContentView(appSettings: appSettings)
                .onOpenURL { url in
                    Superwall.shared.handleDeepLink(url)
                }
        }
    }
}
