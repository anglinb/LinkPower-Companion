import SwiftUI

struct DemoModeButton: View {
    let onActivate: () -> Void

    var body: some View {
        VStack(spacing: 12) {
            HStack(spacing: 0) {
                VStack { Divider() }
                Text("  or  ")
                    .font(.caption)
                    .foregroundStyle(.quaternary)
                VStack { Divider() }
            }
            .padding(.horizontal, 8)

            Button(action: onActivate) {
                HStack(spacing: 8) {
                    Image(systemName: "play.circle.fill")
                        .font(.title3)

                    VStack(alignment: .leading, spacing: 1) {
                        Text("Try Demo Mode")
                            .font(.subheadline.weight(.semibold))

                        Text("Explore the app without a device")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, 12)
                .padding(.horizontal, 16)
                .background(
                    Color(.systemGray6),
                    in: RoundedRectangle(cornerRadius: PeakdooTheme.cardCornerRadius)
                )
            }
            .buttonStyle(.plain)
        }
    }
}

#Preview {
    DemoModeButton(onActivate: {})
        .padding()
        .background(PeakdooTheme.screenBackground)
}
