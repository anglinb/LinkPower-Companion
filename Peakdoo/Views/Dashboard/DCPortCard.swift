import SwiftUI

struct DCPortCard: View {
    let dcPort: DCPortStatus
    let supportsBypass: Bool
    let supportsBypassControl: Bool
    var onTogglePort: ((Bool) -> Void)?
    var onToggleBypass: ((Bool) -> Void)?

    @State private var portEnabled: Bool = false
    @State private var bypassEnabled: Bool = false

    var body: some View {
        CardContainerView(title: "DC Port", icon: "circle.circle") {
            Toggle("", isOn: $portEnabled)
                .tint(PeakdooTheme.charging)
                .labelsHidden()
                .sensoryFeedback(.selection, trigger: portEnabled)
                .onChange(of: portEnabled) { _, newValue in
                    onTogglePort?(newValue)
                }
        } content: {
            if portEnabled || dcPort.isBypassOn {
                activeContent
            } else {
                disabledContent
            }
        }
        .onAppear {
            portEnabled = dcPort.enabled
            bypassEnabled = dcPort.isBypassOn
        }
        .onChange(of: dcPort.enabled) { _, newValue in
            if portEnabled != newValue {
                portEnabled = newValue
            }
        }
        .onChange(of: dcPort.isBypassOn) { _, newValue in
            if bypassEnabled != newValue {
                bypassEnabled = newValue
            }
        }
    }

    // MARK: - Active content (port enabled or bypass on)

    @ViewBuilder
    private var activeContent: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Status badge
            HStack {
                StatusBadgeView(portStatus: dcPort.status)
                if dcPort.isBypassOn {
                    StatusBadgeView(bypass: true)
                }
            }

            // Main power reading
            PowerReadingView(
                value: dcPort.powerString,
                unit: "W",
                label: dcPort.statusLabel,
                icon: "bolt.fill",
                accentColor: statusColor
            )

            // Voltage and current
            HStack(spacing: 24) {
                PowerReadingView(
                    value: dcPort.voltageString,
                    unit: "V",
                    label: "Voltage",
                    icon: "arrow.up.arrow.down"
                )

                PowerReadingView(
                    value: dcPort.currentString,
                    unit: "A",
                    label: "Current",
                    icon: "waveform.path"
                )
            }

            // Bypass toggle (if supported)
            if supportsBypass {
                Divider()

                HStack {
                    Label("DC Bypass", systemImage: "arrow.right.arrow.left")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    Spacer()

                    if supportsBypassControl {
                        Toggle("", isOn: $bypassEnabled)
                            .tint(PeakdooTheme.bypass)
                            .labelsHidden()
                            .sensoryFeedback(.selection, trigger: bypassEnabled)
                            .onChange(of: bypassEnabled) { _, newValue in
                                onToggleBypass?(newValue)
                            }
                    } else {
                        StatusBadgeView(bypass: dcPort.isBypassOn)
                    }
                }
            }
        }
    }

    // MARK: - Disabled content

    @ViewBuilder
    private var disabledContent: some View {
        HStack {
            Spacer()
            VStack(spacing: 6) {
                Image(systemName: "poweroff")
                    .font(.title2)
                    .foregroundStyle(PeakdooTheme.disabled)
                Text("Port Disabled")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            .padding(.vertical, 12)
            Spacer()
        }
    }

    // MARK: - Helpers

    private var statusColor: Color {
        if dcPort.isBypassOn { return PeakdooTheme.bypass }
        return PeakdooTheme.portStatusColor(for: dcPort.status)
    }
}

// MARK: - Previews

#Preview("Discharging") {
    DCPortCard(
        dcPort: DCPortStatus(
            enabled: true,
            status: .discharging,
            voltage: 12.4,
            current: 3.65,
            power: 45.3,
            isBypassOn: false
        ),
        supportsBypass: true,
        supportsBypassControl: true
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Bypass active") {
    DCPortCard(
        dcPort: DCPortStatus(
            enabled: true,
            status: .discharging,
            voltage: 12.6,
            current: 2.1,
            power: 26.5,
            isBypassOn: true
        ),
        supportsBypass: true,
        supportsBypassControl: true
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Disabled") {
    DCPortCard(
        dcPort: DCPortStatus(
            enabled: false,
            status: .disabled,
            voltage: 0,
            current: 0,
            power: 0,
            isBypassOn: false
        ),
        supportsBypass: false,
        supportsBypassControl: false
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}
