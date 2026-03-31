import SwiftUI

struct CardContainerView<Content: View, Trailing: View>: View {
    let title: String
    let icon: String
    let trailing: Trailing?
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label(title, systemImage: icon)
                    .font(PeakdooTheme.cardTitle)
                    .foregroundStyle(.primary)

                Spacer()

                if let trailing {
                    trailing
                }
            }

            content
        }
        .cardStyle()
    }
}

// MARK: - Convenience init without trailing

extension CardContainerView where Trailing == EmptyView {
    init(
        title: String,
        icon: String,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.icon = icon
        self.trailing = nil
        self.content = content()
    }
}

// MARK: - Convenience init with trailing

extension CardContainerView {
    init(
        title: String,
        icon: String,
        @ViewBuilder trailing: () -> Trailing,
        @ViewBuilder content: () -> Content
    ) {
        self.title = title
        self.icon = icon
        self.trailing = trailing()
        self.content = content()
    }
}

// MARK: - Previews

#Preview("Card with content") {
    CardContainerView(title: "Battery", icon: "battery.75percent") {
        Text("Battery level: 75%")
            .font(.body)
    }
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Card with trailing toggle") {
    CardContainerView(title: "DC Port", icon: "circle.circle") {
        Toggle(isOn: .constant(true)) {}
            .tint(PeakdooTheme.charging)
    } content: {
        Text("45.2 W")
            .font(PeakdooTheme.readingValue)
    }
    .padding()
    .background(PeakdooTheme.screenBackground)
}
