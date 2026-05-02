import SwiftUI
import AVKit
import AVFoundation

/// Walks the user through adding the LinkPower Home Screen widget.
///
/// Pattern: explainer + Picture-in-Picture demo. The annotated screen
/// recording plays inline while the user reads the steps; tapping
/// "Watch while you go" pops the video into a floating PiP window so
/// the user can swipe up to their Home Screen and follow along in real
/// time without losing the demo.
struct AddWidgetTutorialSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var player: AVPlayer?
    @State private var pipController: AVPictureInPictureController?
    @State private var pipUnavailableReason: String?

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    headerSection
                    videoSection
                    stepsSection
                    pipCallToAction
                }
                .padding(.horizontal, PeakdooTheme.horizontalPadding)
                .padding(.top, 8)
                .padding(.bottom, 32)
            }
            .background(PeakdooTheme.screenBackground)
            .navigationTitle("Add the Widget")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .onAppear {
            configureAudioSession()
            if player == nil { player = makePlayer() }
        }
        .onDisappear {
            player?.pause()
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("See your battery at a glance")
                .font(.title2.weight(.bold))
            Text("The LinkPower widget shows your battery percentage, charging power, and time-to-full right on your Home Screen or Lock Screen — no need to open the app.")
                .font(.body)
                .foregroundStyle(.secondary)
        }
    }

    private var videoSection: some View {
        Group {
            if let player {
                TutorialVideoView(player: player, pipController: $pipController)
                    .aspectRatio(9.0 / 19.5, contentMode: .fit)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 24, style: .continuous)
                            .strokeBorder(Color.black.opacity(0.06), lineWidth: 1)
                    )
                    .shadow(
                        color: PeakdooTheme.cardShadowColor,
                        radius: PeakdooTheme.cardShadowRadius,
                        y: PeakdooTheme.cardShadowY
                    )
            } else {
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color(.secondarySystemBackground))
                    .aspectRatio(9.0 / 19.5, contentMode: .fit)
                    .overlay(
                        Image(systemName: "play.rectangle.fill")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                    )
            }
        }
    }

    private var stepsSection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("How to add it")
                .font(PeakdooTheme.cardTitle)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)

            stepRow(
                number: 1,
                title: "Enter Edit Mode",
                detail: "Touch and hold an empty area of your Home Screen, then tap **Edit** in the top-left corner."
            )
            stepRow(
                number: 2,
                title: "Choose Add Widget",
                detail: "Tap **Add Widget** from the menu that appears."
            )
            stepRow(
                number: 3,
                title: "Pick LinkPower",
                detail: "Search for or scroll to **LinkPower**, then tap the blue **+ Add Widget** button."
            )
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: PeakdooTheme.cardCornerRadius, style: .continuous)
                .fill(PeakdooTheme.cardBackground)
        )
        .shadow(
            color: PeakdooTheme.cardShadowColor,
            radius: PeakdooTheme.cardShadowRadius,
            y: PeakdooTheme.cardShadowY
        )
    }

    private func stepRow(number: Int, title: String, detail: String) -> some View {
        HStack(alignment: .top, spacing: 14) {
            ZStack {
                Circle().fill(Color.accentColor.opacity(0.15))
                Text("\(number)")
                    .font(.callout.weight(.bold))
                    .foregroundStyle(Color.accentColor)
            }
            .frame(width: 28, height: 28)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.body.weight(.semibold))
                Text(LocalizedStringKey(detail))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var pipCallToAction: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button {
                startPictureInPicture()
            } label: {
                HStack(spacing: 12) {
                    Image(systemName: "pip.enter")
                        .font(.title3.weight(.semibold))
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Watch while you go")
                            .font(.callout.weight(.semibold))
                        Text("Float the demo over your Home Screen so you can follow along.")
                            .font(.caption)
                            .opacity(0.9)
                    }
                    Spacer(minLength: 8)
                    Image(systemName: "chevron.right")
                        .font(.footnote.weight(.semibold))
                        .opacity(0.7)
                }
                .foregroundStyle(.white)
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color.accentColor)
                )
            }
            .buttonStyle(.plain)
            .disabled(pipController == nil)
            .opacity(pipController == nil ? 0.5 : 1.0)

            if let pipUnavailableReason {
                Text(pipUnavailableReason)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }

    // MARK: - Actions

    private func makePlayer() -> AVPlayer? {
        guard let url = Bundle.main.url(forResource: "AddWidgetTutorial", withExtension: "mp4") else {
            assertionFailure("AddWidgetTutorial.mp4 missing from app bundle")
            return nil
        }
        let player = AVPlayer(url: url)
        player.isMuted = true
        player.actionAtItemEnd = .none

        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: player.currentItem,
            queue: .main
        ) { [weak player] _ in
            player?.seek(to: .zero)
            player?.play()
        }

        player.play()
        return player
    }

    private func configureAudioSession() {
        // Required for PiP to keep playing while the app is backgrounded —
        // even for a muted video. `.mixWithOthers` makes sure we don't
        // interrupt the user's music.
        do {
            try AVAudioSession.sharedInstance().setCategory(
                .playback,
                mode: .moviePlayback,
                options: [.mixWithOthers]
            )
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            // Non-fatal: inline playback still works; PiP may not auto-start.
        }
    }

    private func startPictureInPicture() {
        guard AVPictureInPictureController.isPictureInPictureSupported() else {
            pipUnavailableReason = "Picture-in-Picture isn't supported on this device."
            return
        }
        guard let pipController else {
            pipUnavailableReason = "Demo video is still loading — try again in a moment."
            return
        }
        guard !pipController.isPictureInPictureActive else { return }
        pipController.startPictureInPicture()
    }
}

// MARK: - PiP-capable Player View

/// A `UIViewRepresentable` wrapping an `AVPlayerLayer` + `AVPictureInPictureController`
/// so we get programmatic control over PiP (which `AVPlayerViewController` doesn't expose).
private struct TutorialVideoView: UIViewRepresentable {
    let player: AVPlayer
    @Binding var pipController: AVPictureInPictureController?

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> PlayerLayerView {
        let view = PlayerLayerView()
        view.playerLayer.player = player
        view.playerLayer.videoGravity = .resizeAspect

        if AVPictureInPictureController.isPictureInPictureSupported() {
            let controller = AVPictureInPictureController(playerLayer: view.playerLayer)
            controller?.delegate = context.coordinator
            if #available(iOS 14.2, *) {
                controller?.canStartPictureInPictureAutomaticallyFromInline = true
            }
            context.coordinator.pipController = controller
            DispatchQueue.main.async {
                self.pipController = controller
            }
        }
        return view
    }

    func updateUIView(_ uiView: PlayerLayerView, context: Context) {}

    final class Coordinator: NSObject, AVPictureInPictureControllerDelegate {
        var pipController: AVPictureInPictureController?
    }
}

/// UIView whose backing layer is an `AVPlayerLayer`.
private final class PlayerLayerView: UIView {
    override static var layerClass: AnyClass { AVPlayerLayer.self }
    var playerLayer: AVPlayerLayer { layer as! AVPlayerLayer }
}

#Preview {
    Color.gray
        .ignoresSafeArea()
        .sheet(isPresented: .constant(true)) {
            AddWidgetTutorialSheet()
        }
}
