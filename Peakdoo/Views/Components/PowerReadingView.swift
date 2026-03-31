import SwiftUI

struct PowerReadingView: View {
    let value: String?
    let unit: String
    let label: String
    let icon: String
    var accentColor: Color = .primary

    private var displayValue: String {
        guard let value, !value.isEmpty, value != "0" && value != "0.0" else {
            return "--"
        }
        return value
    }

    private var isActive: Bool {
        displayValue != "--"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(displayValue)
                    .font(PeakdooTheme.readingValue)
                    .foregroundStyle(isActive ? accentColor : Color(.systemGray3))
                    .contentTransition(.numericText())
                    .animation(.spring(duration: 0.4), value: displayValue)

                Text(unit)
                    .font(PeakdooTheme.readingUnit)
                    .foregroundStyle(isActive ? .secondary : Color(.systemGray4))
            }

            Label(label, systemImage: icon)
                .font(PeakdooTheme.label)
                .foregroundStyle(.secondary)
        }
    }
}

// MARK: - Previews

#Preview("Active reading") {
    PowerReadingView(
        value: "45.2",
        unit: "W",
        label: "Power",
        icon: "bolt.fill",
        accentColor: PeakdooTheme.discharging
    )
    .padding()
}

#Preview("Inactive reading") {
    PowerReadingView(
        value: nil,
        unit: "W",
        label: "Power",
        icon: "bolt.fill"
    )
    .padding()
}

#Preview("Multiple readings") {
    HStack(spacing: 24) {
        PowerReadingView(
            value: "12.6",
            unit: "V",
            label: "Voltage",
            icon: "arrow.up.arrow.down"
        )
        PowerReadingView(
            value: "3.58",
            unit: "A",
            label: "Current",
            icon: "waveform.path"
        )
    }
    .padding()
}
