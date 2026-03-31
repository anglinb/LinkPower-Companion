import SwiftUI
import CoreBluetooth

struct DeviceRowView: View {
    let device: DiscoveredDevice
    let onConnect: () -> Void

    private var signalIcon: String {
        switch device.rssi {
        case -50...0:
            return "wifi"
        case -65 ..< -50:
            return "wifi"
        case -80 ..< -65:
            return "wifi"
        default:
            return "wifi.exclamationmark"
        }
    }

    private var signalBars: Int {
        switch device.rssi {
        case -50...0: return 3
        case -65 ..< -50: return 2
        case -80 ..< -65: return 1
        default: return 0
        }
    }

    var body: some View {
        Button(action: onConnect) {
            HStack(spacing: 12) {
                // Device icon
                Image(systemName: "poweroutlet.strip.fill")
                    .font(.title3)
                    .foregroundStyle(.tint)
                    .frame(width: 36, height: 36)
                    .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 8))

                // Device info
                VStack(alignment: .leading, spacing: 2) {
                    Text(device.name)
                        .font(.headline)
                        .foregroundStyle(.primary)

                    HStack(spacing: 4) {
                        signalStrengthView
                        Text("\(device.rssi) dBm")
                            .font(.caption)
                            .foregroundStyle(.tertiary)
                        if device.rssi < -90 {
                            Text("Weak")
                                .font(.caption2.weight(.medium))
                                .foregroundStyle(.orange)
                                .padding(.horizontal, 5)
                                .padding(.vertical, 1)
                                .background(.orange.opacity(0.12), in: Capsule())
                        }
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, PeakdooTheme.cardPadding)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var signalStrengthView: some View {
        HStack(spacing: 1.5) {
            ForEach(1...3, id: \.self) { bar in
                RoundedRectangle(cornerRadius: 1)
                    .fill(bar <= signalBars ? Color.accentColor : Color(.systemGray4))
                    .frame(width: 3, height: CGFloat(4 + bar * 3))
            }
        }
    }
}

// MARK: - Previews

// Note: Previews for DeviceRowView require a real CBPeripheral instance
// which cannot be mocked. Use ConnectionView preview instead.
