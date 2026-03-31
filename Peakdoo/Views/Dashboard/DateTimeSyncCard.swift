import Combine
import SwiftUI

struct DateTimeSyncCard: View {
    let lastSyncTime: Date?
    var onSync: (() -> Void)?

    @State private var now = Date()
    private let refreshTimer = Timer.publish(every: 30, on: .main, in: .common).autoconnect()

    var body: some View {
        CardContainerView(title: "Date & Time", icon: "clock") {
            VStack(spacing: 10) {
                // Last sync info
                HStack {
                    Text("Last Sync")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)

                    Spacer()

                    Text(syncTimeText)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.primary)
                }

                // Sync button
                Button {
                    onSync?()
                } label: {
                    Label("Sync Now", systemImage: "clock.arrow.2.circlepath")
                        .font(.subheadline.weight(.medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 10))
                }
            }
        }
        .onReceive(refreshTimer) { _ in
            now = Date()
        }
    }

    // MARK: - Relative Time Formatting

    private var syncTimeText: String {
        guard let syncTime = lastSyncTime else {
            return "Never"
        }

        let interval = now.timeIntervalSince(syncTime)

        if interval < 5 {
            return "Just now"
        } else if interval < 60 {
            return "Seconds ago"
        } else if interval < 3600 {
            let minutes = Int(interval / 60)
            return minutes == 1 ? "1 minute ago" : "\(minutes) minutes ago"
        } else if interval < 86400 {
            let hours = Int(interval / 3600)
            return hours == 1 ? "1 hour ago" : "\(hours) hours ago"
        } else {
            let formatter = DateFormatter()
            formatter.dateStyle = .short
            formatter.timeStyle = .short
            return formatter.string(from: syncTime)
        }
    }
}

// MARK: - Previews

#Preview("Just Synced") {
    DateTimeSyncCard(lastSyncTime: Date())
        .padding()
        .background(PeakdooTheme.screenBackground)
}

#Preview("Minutes Ago") {
    DateTimeSyncCard(lastSyncTime: Date().addingTimeInterval(-300))
        .padding()
        .background(PeakdooTheme.screenBackground)
}

#Preview("Never Synced") {
    DateTimeSyncCard(lastSyncTime: nil)
        .padding()
        .background(PeakdooTheme.screenBackground)
}
