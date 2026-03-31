import SwiftUI

@main
struct PeakdooApp: App {
    @State private var appSettings = AppSettings()

    var body: some Scene {
        WindowGroup {
            ContentView(appSettings: appSettings)
        }
    }
}
