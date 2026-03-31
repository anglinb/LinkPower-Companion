import SwiftUI

struct TypeCPortCard: View {
    let typeCPort: TypeCPortStatus
    let supportsOutputControl: Bool
    var onToggleOutput: ((Bool) -> Void)?

    @State private var outputEnabled: Bool = false

    var body: some View {
        CardContainerView(title: "Type-C Port", icon: "cable.connector.horizontal") {
            if supportsOutputControl {
                Toggle("", isOn: $outputEnabled)
                    .tint(PeakdooTheme.charging)
                    .labelsHidden()
                    .sensoryFeedback(.selection, trigger: outputEnabled)
                    .onChange(of: outputEnabled) { _, newValue in
                        onToggleOutput?(newValue)
                    }
            } else {
                EmptyView()
            }
        } content: {
            if typeCPort.enabled && typeCPort.status != .idle {
                activeContent
            } else {
                idleContent
            }
        }
        .onAppear {
            outputEnabled = typeCPort.outputEnabled
        }
        .onChange(of: typeCPort.outputEnabled) { _, newValue in
            if outputEnabled != newValue {
                outputEnabled = newValue
            }
        }
    }

    // MARK: - Active content

    @ViewBuilder
    private var activeContent: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Status badge
            HStack {
                StatusBadgeView(portStatus: typeCPort.status)
                if typeCPort.isDCInput {
                    StatusBadgeView(text: "DC Input", color: .blue)
                }
            }

            // Main power reading
            PowerReadingView(
                value: typeCPort.powerString,
                unit: "W",
                label: typeCPort.statusLabel,
                icon: "bolt.fill",
                accentColor: statusColor
            )

            // Voltage and current
            HStack(spacing: 24) {
                PowerReadingView(
                    value: typeCPort.voltageString,
                    unit: "V",
                    label: "Voltage",
                    icon: "arrow.up.arrow.down"
                )

                PowerReadingView(
                    value: typeCPort.currentString,
                    unit: "A",
                    label: "Current",
                    icon: "waveform.path"
                )
            }

            // Temperature
            Divider()

            HStack {
                Label("Temperature", systemImage: "thermometer.medium")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                Spacer()

                HStack(alignment: .firstTextBaseline, spacing: 2) {
                    Text(typeCPort.temperatureString)
                        .font(.system(size: 18, weight: .medium, design: .rounded))
                        .foregroundStyle(PeakdooTheme.temperatureColor(for: typeCPort.temperature))
                        .contentTransition(.numericText())
                        .animation(.spring(duration: 0.4), value: typeCPort.temperatureString)

                    Text("\u{00B0}C")
                        .font(.system(size: 14, weight: .medium, design: .rounded))
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    // MARK: - Idle content

    @ViewBuilder
    private var idleContent: some View {
        HStack {
            Spacer()
            VStack(spacing: 6) {
                Image(systemName: "cable.connector.horizontal")
                    .font(.title2)
                    .foregroundStyle(PeakdooTheme.idle)
                Text("Idle")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding(.vertical, 12)
            Spacer()
        }
    }

    // MARK: - Helpers

    private var statusColor: Color {
        PeakdooTheme.portStatusColor(for: typeCPort.status)
    }
}

// MARK: - Previews

#Preview("Charging") {
    TypeCPortCard(
        typeCPort: TypeCPortStatus(
            enabled: true,
            status: .charging,
            voltage: 20.0,
            current: 3.0,
            power: 60.0,
            temperature: 38.5,
            mode: 3,
            isDCInput: false
        ),
        supportsOutputControl: true
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Discharging") {
    TypeCPortCard(
        typeCPort: TypeCPortStatus(
            enabled: true,
            status: .discharging,
            voltage: 9.0,
            current: 2.2,
            power: 19.8,
            temperature: 42.1,
            mode: 2,
            isDCInput: false
        ),
        supportsOutputControl: false
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Idle") {
    TypeCPortCard(
        typeCPort: TypeCPortStatus(
            enabled: true,
            status: .idle,
            voltage: 0,
            current: 0,
            power: 0,
            temperature: 30.0,
            mode: 3,
            isDCInput: false
        ),
        supportsOutputControl: true
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}
