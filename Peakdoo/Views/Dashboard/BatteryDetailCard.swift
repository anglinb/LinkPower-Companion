import SwiftUI

struct BatteryDetailCard: View {
    let battery: BatteryInfo

    private var capacityAccentColor: Color {
        switch battery.status {
        case .charging: return PeakdooTheme.charging
        case .discharging: return PeakdooTheme.discharging
        case .idle: return .primary
        }
    }

    private var capacityIcon: String {
        switch battery.status {
        case .charging: return "bolt.fill"
        case .discharging: return "arrow.down.circle.fill"
        case .idle: return "battery.100percent"
        }
    }

    var body: some View {
        CardContainerView(title: "Battery", icon: "battery.75percent") {
            StatusBadgeView(batteryStatus: battery.status)
        } content: {
            VStack(spacing: 16) {
                // Hero: capacity in Wh
                PowerReadingView(
                    value: battery.capacityString,
                    unit: "Wh",
                    label: "Capacity",
                    icon: capacityIcon,
                    accentColor: capacityAccentColor
                )
                .frame(maxWidth: .infinity, alignment: .leading)

                Divider()

                // Two-column detail row
                HStack {
                    PowerReadingView(
                        value: "\(battery.level)",
                        unit: "%",
                        label: "Level",
                        icon: "percent"
                    )

                    Spacer()

                    PowerReadingView(
                        value: battery.remainHoursString,
                        unit: "H",
                        label: battery.batteryTimeLabel,
                        icon: "clock"
                    )
                }
            }
        }
    }
}

// MARK: - Previews

#Preview("Charging") {
    BatteryDetailCard(
        battery: BatteryInfo(
            enabled: true,
            status: .charging,
            isFull: false,
            maxCapacity: 99.0,
            capacity: 74.3,
            level: 75,
            voltage: 12.6,
            current: 2.5,
            power: 31.5,
            remainMinutes: 90
        )
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Discharging") {
    BatteryDetailCard(
        battery: BatteryInfo(
            enabled: true,
            status: .discharging,
            isFull: false,
            maxCapacity: 99.0,
            capacity: 24.8,
            level: 25,
            voltage: 11.8,
            current: 3.1,
            power: 36.6,
            remainMinutes: 45
        )
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}
