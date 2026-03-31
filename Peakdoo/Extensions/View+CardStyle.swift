import SwiftUI

struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(PeakdooTheme.cardPadding)
            .background(PeakdooTheme.cardBackground, in: RoundedRectangle(cornerRadius: PeakdooTheme.cardCornerRadius))
            .shadow(
                color: PeakdooTheme.cardShadowColor,
                radius: PeakdooTheme.cardShadowRadius,
                y: PeakdooTheme.cardShadowY
            )
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}
