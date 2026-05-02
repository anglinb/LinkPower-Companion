import SwiftUI

struct BatteryGaugeView: View {
    let level: Int
    let status: BatteryStatus
    let isEnabled: Bool

    @State private var animatedLevel: CGFloat = 0

    private var gaugeColor: Color {
        guard isEnabled else { return PeakdooTheme.disabled }
        return PeakdooTheme.batteryColor(for: level)
    }

    private var targetLevel: CGFloat {
        guard isEnabled else { return 0 }
        return CGFloat(level) / 100.0
    }

    var body: some View {
        ZStack {
            // Background ring
            Circle()
                .stroke(Color(.systemGray5), lineWidth: 14)

            // Foreground arc
            Circle()
                .trim(from: 0, to: animatedLevel)
                .stroke(
                    gaugeColor,
                    style: StrokeStyle(lineWidth: 14, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.spring(duration: 0.6), value: animatedLevel)

            // Center content
            VStack(spacing: 2) {
                // Status icon
                statusIcon

                // Percentage
                HStack(alignment: .firstTextBaseline, spacing: 0) {
                    Text(isEnabled ? "\(level)" : "--")
                        .font(PeakdooTheme.heroNumber)
                        .contentTransition(.numericText())
                        .animation(.spring(duration: 0.4), value: level)

                    Text("%")
                        .font(.system(size: 22, weight: .medium, design: .rounded))
                        .foregroundStyle(.secondary)
                }
            }
        }
        .frame(width: 200, height: 200)
        .onAppear {
            // Start the arc at the real value — the view is only mounted once
            // we have a real reading, so we shouldn't animate up from 0.
            animatedLevel = targetLevel
        }
        .onChange(of: targetLevel) { _, newValue in
            withAnimation(.spring(duration: 0.6)) {
                animatedLevel = newValue
            }
        }
    }

    @ViewBuilder
    private var statusIcon: some View {
        switch status {
        case .charging:
            Image(systemName: "bolt.fill")
                .font(.title3)
                .foregroundStyle(PeakdooTheme.charging)
                .symbolEffect(.bounce, options: .repeating.speed(0.5))

        case .discharging:
            Image(systemName: "chevron.down")
                .font(.title3.weight(.semibold))
                .foregroundStyle(PeakdooTheme.discharging)

        case .idle:
            Image(systemName: "minus")
                .font(.title3.weight(.semibold))
                .foregroundStyle(PeakdooTheme.idle)
        }
    }
}

// MARK: - Previews

#Preview("Charging 75%") {
    BatteryGaugeView(level: 75, status: .charging, isEnabled: true)
        .padding()
}

#Preview("Discharging 25%") {
    BatteryGaugeView(level: 25, status: .discharging, isEnabled: true)
        .padding()
}

#Preview("Low 10%") {
    BatteryGaugeView(level: 10, status: .discharging, isEnabled: true)
        .padding()
}

#Preview("Idle 100%") {
    BatteryGaugeView(level: 100, status: .idle, isEnabled: true)
        .padding()
}
