import SwiftUI
import Combine

struct PulsingDotView: View {
    @State private var activePhase: Int = 0

    private let dotSize: CGFloat = 8
    private let dotSpacing: CGFloat = 6
    private let timer = Timer.publish(every: 0.4, on: .main, in: .common).autoconnect()

    var body: some View {
        HStack(spacing: dotSpacing) {
            ForEach(0..<3, id: \.self) { index in
                Circle()
                    .fill(Color.accentColor)
                    .frame(width: dotSize, height: dotSize)
                    .scaleEffect(activePhase == index ? 1.3 : 0.7)
                    .opacity(activePhase == index ? 1.0 : 0.3)
                    .animation(
                        .spring(duration: 0.3, bounce: 0.4),
                        value: activePhase
                    )
            }
        }
        .onReceive(timer) { _ in
            activePhase = (activePhase + 1) % 3
        }
    }
}

// MARK: - Previews

#Preview {
    VStack(spacing: 16) {
        PulsingDotView()

        HStack(spacing: 8) {
            PulsingDotView()
            Text("Searching for devices...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
    .padding()
}
