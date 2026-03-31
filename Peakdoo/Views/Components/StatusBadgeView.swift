import SwiftUI

struct StatusBadgeView: View {
    let text: String
    let color: Color

    var body: some View {
        Text(text)
            .font(.caption2.weight(.medium))
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color.opacity(0.12), in: Capsule())
    }
}

// MARK: - Convenience initializers for port status

extension StatusBadgeView {
    init(portStatus: PortStatus) {
        self.text = portStatus.label
        self.color = PeakdooTheme.portStatusColor(for: portStatus)
    }

    init(batteryStatus: BatteryStatus) {
        self.text = batteryStatus.label
        switch batteryStatus {
        case .charging:
            self.color = PeakdooTheme.charging
        case .discharging:
            self.color = PeakdooTheme.discharging
        case .idle:
            self.color = PeakdooTheme.idle
        }
    }

    init(bypass: Bool) {
        self.text = bypass ? "Bypass" : "Direct"
        self.color = bypass ? PeakdooTheme.bypass : PeakdooTheme.idle
    }
}

// MARK: - Previews

#Preview("All statuses") {
    VStack(spacing: 12) {
        StatusBadgeView(portStatus: .charging)
        StatusBadgeView(portStatus: .discharging)
        StatusBadgeView(portStatus: .idle)
        StatusBadgeView(portStatus: .disabled)
        StatusBadgeView(batteryStatus: .charging)
        StatusBadgeView(batteryStatus: .discharging)
        StatusBadgeView(bypass: true)
    }
    .padding()
}
