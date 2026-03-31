import Foundation
import Observation

@Observable
@MainActor
final class AppSettings {
    var expertMode: Bool {
        didSet {
            UserDefaults.standard.set(expertMode, forKey: "expertMode")
            if !expertMode {
                devMode = false
            }
        }
    }

    var devMode: Bool {
        didSet { UserDefaults.standard.set(devMode, forKey: "devMode") }
    }

    init() {
        let savedExpertMode = UserDefaults.standard.bool(forKey: "expertMode")
        let savedDevMode = UserDefaults.standard.bool(forKey: "devMode")
        self.expertMode = savedExpertMode
        // devMode only valid when expertMode is on
        self.devMode = savedExpertMode ? savedDevMode : false
    }
}
