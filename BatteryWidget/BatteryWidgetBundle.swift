import SwiftUI
import WidgetKit

@main
struct BatteryWidgetBundle: WidgetBundle {
    var body: some Widget {
        BatteryWidget()
        BatteryLiveActivity()
    }
}
