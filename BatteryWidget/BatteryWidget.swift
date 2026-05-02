import SwiftUI
import WidgetKit

struct BatteryWidget: Widget {

    var body: some WidgetConfiguration {
        StaticConfiguration(
            kind: BatteryWidgetSharedStore.widgetKind,
            provider: BatteryProvider()
        ) { entry in
            BatteryWidgetEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
        .configurationDisplayName("Battery")
        .description("Monitor your Link-Power battery from the Home Screen and Lock Screen.")
        .supportedFamilies([
            .systemSmall,
            .systemMedium,
            .accessoryCircular,
            .accessoryRectangular,
            .accessoryInline,
        ])
        .contentMarginsDisabled()
    }
}

// MARK: - Entry view dispatch

struct BatteryWidgetEntryView: View {
    @Environment(\.widgetFamily) private var family

    let entry: BatteryEntry

    var body: some View {
        switch family {
        case .systemSmall:
            BatterySmallView(snapshot: entry.snapshot)
        case .systemMedium:
            BatteryMediumView(snapshot: entry.snapshot)
        case .accessoryCircular:
            BatteryCircularAccessoryView(snapshot: entry.snapshot)
        case .accessoryRectangular:
            BatteryRectangularAccessoryView(snapshot: entry.snapshot)
        case .accessoryInline:
            BatteryInlineAccessoryView(snapshot: entry.snapshot)
        default:
            BatterySmallView(snapshot: entry.snapshot)
        }
    }
}

// MARK: - Color helpers

private func levelColor(_ level: Int, status: BatteryWidgetSnapshot.Status) -> Color {
    if status == .charging { return .green }
    switch level {
    case ..<10: return .red
    case ..<25: return .orange
    default: return .green
    }
}

private func statusSymbol(_ status: BatteryWidgetSnapshot.Status) -> String {
    switch status {
    case .charging: return "bolt.fill"
    case .discharging: return "battery.50"
    case .idle: return "battery.100"
    }
}

// MARK: - Small (Home Screen)

struct BatterySmallView: View {
    let snapshot: BatteryWidgetSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                Image(systemName: statusSymbol(snapshot.status))
                    .imageScale(.small)
                    .foregroundStyle(levelColor(snapshot.level, status: snapshot.status))
                Text(snapshot.deviceName)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
                Spacer(minLength: 0)
            }

            Spacer(minLength: 0)

            Text(snapshot.levelString)
                .font(.system(size: 38, weight: .semibold, design: .rounded))
                .foregroundStyle(levelColor(snapshot.level, status: snapshot.status))
                .minimumScaleFactor(0.6)
                .lineLimit(1)

            BatteryBar(level: snapshot.level, status: snapshot.status)
                .frame(height: 6)

            Text(secondaryLine)
                .font(.caption2)
                .foregroundStyle(.secondary)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .padding(12)
    }

    private var secondaryLine: String {
        guard snapshot.isConnected else { return "Not connected" }
        switch snapshot.status {
        case .charging:
            return "Charging · \(snapshot.powerString)"
        case .discharging:
            return "\(snapshot.powerString) · \(snapshot.remainHoursString)"
        case .idle:
            return "Idle · \(snapshot.capacityString)"
        }
    }
}

// MARK: - Medium (Home Screen)

struct BatteryMediumView: View {
    let snapshot: BatteryWidgetSnapshot

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                HStack(spacing: 6) {
                    Image(systemName: statusSymbol(snapshot.status))
                        .foregroundStyle(levelColor(snapshot.level, status: snapshot.status))
                    Text(snapshot.deviceName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }

                Text(snapshot.levelString)
                    .font(.system(size: 44, weight: .semibold, design: .rounded))
                    .foregroundStyle(levelColor(snapshot.level, status: snapshot.status))
                    .minimumScaleFactor(0.6)
                    .lineLimit(1)

                BatteryBar(level: snapshot.level, status: snapshot.status)
                    .frame(height: 6)

                Text(snapshot.status.label)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            VStack(alignment: .leading, spacing: 6) {
                StatRow(label: snapshot.remainTimeLabel, value: snapshot.remainHoursString)
                StatRow(label: "Power", value: snapshot.powerString)
                StatRow(label: "Voltage", value: snapshot.voltageString)
                StatRow(label: "Current", value: snapshot.currentString)
                StatRow(label: "Capacity", value: snapshot.capacityString)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(14)
    }
}

private struct StatRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
            Spacer(minLength: 4)
            Text(value)
                .font(.caption.weight(.medium))
                .monospacedDigit()
                .lineLimit(1)
        }
    }
}

// MARK: - Battery bar

private struct BatteryBar: View {
    let level: Int
    let status: BatteryWidgetSnapshot.Status

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(.quaternary)
                Capsule()
                    .fill(levelColor(level, status: status))
                    .frame(width: max(0, geo.size.width * CGFloat(max(0, min(100, level))) / 100.0))
            }
        }
    }
}

// MARK: - Lock Screen / accessory

struct BatteryCircularAccessoryView: View {
    let snapshot: BatteryWidgetSnapshot

    var body: some View {
        ZStack {
            AccessoryWidgetBackground()
            Gauge(value: Double(max(0, min(100, snapshot.level))), in: 0...100) {
                Image(systemName: statusSymbol(snapshot.status))
            } currentValueLabel: {
                Text("\(snapshot.level)")
                    .font(.system(size: 14, weight: .semibold, design: .rounded))
            }
            .gaugeStyle(.accessoryCircularCapacity)
        }
    }
}

struct BatteryRectangularAccessoryView: View {
    let snapshot: BatteryWidgetSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(spacing: 4) {
                Image(systemName: statusSymbol(snapshot.status))
                Text(snapshot.deviceName)
                    .lineLimit(1)
            }
            .font(.caption2)
            Text(snapshot.levelString)
                .font(.system(size: 22, weight: .semibold, design: .rounded))
            Text(secondaryLine)
                .font(.caption2)
                .lineLimit(1)
        }
        .containerBackground(.clear, for: .widget)
    }

    private var secondaryLine: String {
        guard snapshot.isConnected else { return "Not connected" }
        switch snapshot.status {
        case .charging: return "Charging · \(snapshot.powerString)"
        case .discharging: return "\(snapshot.remainHoursString) left"
        case .idle: return snapshot.capacityString
        }
    }
}

struct BatteryInlineAccessoryView: View {
    let snapshot: BatteryWidgetSnapshot

    var body: some View {
        Label {
            Text("\(snapshot.deviceName) \(snapshot.levelString)")
        } icon: {
            Image(systemName: statusSymbol(snapshot.status))
        }
    }
}

// MARK: - Previews

#Preview("Small", as: .systemSmall) {
    BatteryWidget()
} timeline: {
    BatteryEntry.placeholder
    BatteryEntry.disconnected
}

#Preview("Medium", as: .systemMedium) {
    BatteryWidget()
} timeline: {
    BatteryEntry.placeholder
}

#Preview("Circular", as: .accessoryCircular) {
    BatteryWidget()
} timeline: {
    BatteryEntry.placeholder
}

#Preview("Rectangular", as: .accessoryRectangular) {
    BatteryWidget()
} timeline: {
    BatteryEntry.placeholder
}

#Preview("Inline", as: .accessoryInline) {
    BatteryWidget()
} timeline: {
    BatteryEntry.placeholder
}
