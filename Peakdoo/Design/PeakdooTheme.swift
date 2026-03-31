import SwiftUI

enum PeakdooTheme {
    // MARK: - Semantic Colors
    static let charging = Color.green
    static let discharging = Color.orange
    static let bypass = Color.pink
    static let idle = Color(.systemGray3)
    static let disabled = Color(.systemGray5)

    // MARK: - Backgrounds
    static let cardBackground = Color(.systemBackground)
    static let screenBackground = Color(.systemGroupedBackground)

    // MARK: - Typography
    static let heroNumber = Font.system(size: 48, weight: .bold, design: .rounded)
    static let readingValue = Font.system(size: 32, weight: .semibold, design: .rounded)
    static let readingUnit = Font.system(size: 18, weight: .medium, design: .rounded)
    static let cardTitle = Font.subheadline.weight(.semibold)
    static let label = Font.caption

    // MARK: - Spacing
    static let cardPadding: CGFloat = 16
    static let cardCornerRadius: CGFloat = 16
    static let sectionSpacing: CGFloat = 20
    static let horizontalPadding: CGFloat = 16

    // MARK: - Shadows
    static let cardShadowColor = Color.black.opacity(0.04)
    static let cardShadowRadius: CGFloat = 8
    static let cardShadowY: CGFloat = 2

    // MARK: - Battery color from level
    static func batteryColor(for level: Int) -> Color {
        if level > 30 { return .green }
        if level > 15 { return .orange }
        return .red
    }

    // MARK: - Temperature color (35-50 C range, green to red)
    static func temperatureColor(for temp: Double) -> Color {
        let normalized = max(0, min(1, (temp - 35.0) / 15.0))
        if normalized < 0.33 { return .green }
        if normalized < 0.66 { return .orange }
        return .red
    }

    // MARK: - Port status color
    static func portStatusColor(for status: PortStatus) -> Color {
        switch status {
        case .charging: return charging
        case .discharging: return discharging
        case .idle: return idle
        case .disabled: return disabled
        }
    }
}
