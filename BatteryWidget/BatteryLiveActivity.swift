import ActivityKit
import SwiftUI
import WidgetKit

/// Live Activity surface for active charging / discharging sessions.
/// Visible on the Lock Screen and (on iPhones with Dynamic Island) in
/// the leading/trailing/bottom regions of the island.
struct BatteryLiveActivity: Widget {

    var body: some WidgetConfiguration {
        ActivityConfiguration(for: BatteryActivityAttributes.self) { context in
            // MARK: Lock Screen / Banner presentation

            BatteryLockScreenLiveActivityView(
                deviceName: context.attributes.deviceName,
                state: context.state
            )
            .activityBackgroundTint(.black.opacity(0.15))
            .activitySystemActionForegroundColor(.primary)

        } dynamicIsland: { context in
            // MARK: Dynamic Island

            DynamicIsland {
                // Expanded — visible on long-press / when active
                DynamicIslandExpandedRegion(.leading) {
                    Label {
                        Text(context.attributes.deviceName)
                            .font(.caption)
                            .lineLimit(1)
                    } icon: {
                        Image(systemName: liveActivityIcon(for: context.state.mode))
                            .foregroundStyle(liveActivityColor(for: context.state.mode))
                    }
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.levelString)
                        .font(.system(size: 22, weight: .semibold, design: .rounded))
                        .foregroundStyle(liveActivityColor(for: context.state.mode))
                        .monospacedDigit()
                }

                DynamicIslandExpandedRegion(.center) {
                    if let endDate = context.state.endDate {
                        Text(timerInterval: Date()...endDate, countsDown: true)
                            .font(.caption2.weight(.medium))
                            .foregroundStyle(.secondary)
                            .multilineTextAlignment(.center)
                    } else {
                        Text(context.state.mode == .charging ? "Charging" : "On battery")
                            .font(.caption2.weight(.medium))
                            .foregroundStyle(.secondary)
                    }
                }

                DynamicIslandExpandedRegion(.bottom) {
                    HStack(spacing: 12) {
                        BatteryProgressBar(
                            level: context.state.level,
                            color: liveActivityColor(for: context.state.mode)
                        )
                        .frame(height: 6)

                        Text(context.state.powerString)
                            .font(.caption.weight(.medium))
                            .foregroundStyle(.secondary)
                            .monospacedDigit()
                    }
                    .padding(.horizontal, 4)
                }

            } compactLeading: {
                Image(systemName: liveActivityIcon(for: context.state.mode))
                    .foregroundStyle(liveActivityColor(for: context.state.mode))

            } compactTrailing: {
                Text(context.state.levelString)
                    .monospacedDigit()
                    .foregroundStyle(liveActivityColor(for: context.state.mode))

            } minimal: {
                ZStack {
                    Image(systemName: liveActivityIcon(for: context.state.mode))
                        .foregroundStyle(liveActivityColor(for: context.state.mode))
                }
            }
            .keylineTint(liveActivityColor(for: context.state.mode))
        }
    }
}

// MARK: - Lock Screen view

private struct BatteryLockScreenLiveActivityView: View {
    let deviceName: String
    let state: BatteryActivityAttributes.ContentState

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label {
                    Text(deviceName)
                        .font(.subheadline.weight(.medium))
                } icon: {
                    Image(systemName: liveActivityIcon(for: state.mode))
                        .foregroundStyle(liveActivityColor(for: state.mode))
                }

                Spacer()

                Text(state.mode == .charging ? "Charging" : "Discharging")
                    .font(.caption2.weight(.medium))
                    .foregroundStyle(.secondary)
            }

            HStack(alignment: .firstTextBaseline) {
                Text(state.levelString)
                    .font(.system(size: 36, weight: .semibold, design: .rounded))
                    .foregroundStyle(liveActivityColor(for: state.mode))
                    .monospacedDigit()

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text(state.remainTimeLabel)
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    if let endDate = state.endDate {
                        Text(timerInterval: Date()...endDate, countsDown: true)
                            .font(.caption.weight(.medium))
                            .monospacedDigit()
                            .multilineTextAlignment(.trailing)
                    } else {
                        Text("—")
                            .font(.caption.weight(.medium))
                    }
                }
            }

            BatteryProgressBar(
                level: state.level,
                color: liveActivityColor(for: state.mode)
            )
            .frame(height: 6)

            HStack(spacing: 12) {
                LabeledStat(label: "Power", value: state.powerString)
                Divider().frame(height: 14)
                LabeledStat(label: "Voltage", value: state.voltageString)
                Divider().frame(height: 14)
                LabeledStat(label: "Current", value: state.currentString)
                Spacer()
            }
            .font(.caption2)
        }
        .padding(14)
    }
}

private struct LabeledStat: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text(label)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.caption.weight(.medium))
                .monospacedDigit()
        }
    }
}

// MARK: - Shared bar

private struct BatteryProgressBar: View {
    let level: Int
    let color: Color

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(.quaternary)
                Capsule()
                    .fill(color)
                    .frame(width: max(0, geo.size.width * CGFloat(max(0, min(100, level))) / 100.0))
            }
        }
    }
}

// MARK: - Style helpers

private func liveActivityIcon(for mode: BatteryActivityAttributes.ContentState.Mode) -> String {
    switch mode {
    case .charging: return "bolt.fill"
    case .discharging: return "battery.50"
    }
}

private func liveActivityColor(for mode: BatteryActivityAttributes.ContentState.Mode) -> Color {
    switch mode {
    case .charging: return .green
    case .discharging: return .orange
    }
}

// MARK: - Preview

#Preview("Lock Screen — Charging", as: .content, using: BatteryActivityAttributes(deviceName: "Link-Power 2")) {
    BatteryLiveActivity()
} contentStates: {
    BatteryActivityAttributes.ContentState(
        mode: .charging,
        level: 64,
        power: 42.0,
        voltage: 13.4,
        current: 3.13,
        capacity: 192.0,
        maxCapacity: 300.0,
        remainMinutes: 78
    )
}

#Preview("Dynamic Island — Discharging", as: .dynamicIsland(.expanded), using: BatteryActivityAttributes(deviceName: "Link-Power 2")) {
    BatteryLiveActivity()
} contentStates: {
    BatteryActivityAttributes.ContentState(
        mode: .discharging,
        level: 41,
        power: 18.7,
        voltage: 12.6,
        current: 1.48,
        capacity: 123.0,
        maxCapacity: 300.0,
        remainMinutes: 134
    )
}
