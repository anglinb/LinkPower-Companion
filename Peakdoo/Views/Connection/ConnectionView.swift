import SwiftUI

struct ConnectionView: View {
    @Bindable var viewModel: ConnectionViewModel
    @State private var appeared = false

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                Spacer()
                    .frame(height: 40)

                // MARK: - Hero branding
                heroSection
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 20)

                // MARK: - Scanning / Device list
                deviceSection
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 20)

                // MARK: - Error
                if let error = viewModel.connectionError {
                    errorView(error)
                        .transition(.move(edge: .top).combined(with: .opacity))
                }

                Spacer()
                    .frame(height: 20)

                // MARK: - Footer
                footerSection
                    .opacity(appeared ? 1 : 0)
            }
            .padding(.horizontal, PeakdooTheme.horizontalPadding)
        }
        .background(PeakdooTheme.screenBackground)
        .onAppear {
            withAnimation(.spring(duration: 0.8, bounce: 0.2)) {
                appeared = true
            }
        }
        .onDisappear {
            viewModel.stopScan()
        }
    }

    // MARK: - Hero Section

    @ViewBuilder
    private var heroSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "bolt.shield.fill")
                .font(.system(size: 56))
                .foregroundStyle(.tint)
                .symbolEffect(.pulse, options: .repeating, isActive: viewModel.isScanning)

            Text("Peakdoo")
                .font(.system(size: 34, weight: .bold, design: .rounded))

            Text("Link-Power Companion")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Device Section

    @ViewBuilder
    private var deviceSection: some View {
        VStack(spacing: 16) {
            if viewModel.isScanning {
                scanningIndicator
            }

            if !viewModel.devices.isEmpty {
                deviceList
            }

            actionButtons
        }
    }

    @ViewBuilder
    private var scanningIndicator: some View {
        HStack(spacing: 10) {
            PulsingDotView()
            Text("Searching for devices...")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }

    @ViewBuilder
    private var deviceList: some View {
        VStack(spacing: 0) {
            ForEach(Array(viewModel.devices.enumerated()), id: \.element.id) { index, device in
                if index > 0 {
                    Divider()
                        .padding(.leading, 60)
                }

                DeviceRowView(device: device) {
                    viewModel.connect(to: device)
                }
            }
        }
        .background(PeakdooTheme.cardBackground, in: RoundedRectangle(cornerRadius: PeakdooTheme.cardCornerRadius))
        .shadow(
            color: PeakdooTheme.cardShadowColor,
            radius: PeakdooTheme.cardShadowRadius,
            y: PeakdooTheme.cardShadowY
        )
        .transition(.opacity.combined(with: .scale(scale: 0.95)))
    }

    @ViewBuilder
    private var actionButtons: some View {
        VStack(spacing: 12) {
            // Main scan button
            Button {
                if viewModel.isScanning {
                    viewModel.stopScan()
                } else {
                    viewModel.startScan()
                }
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: viewModel.isScanning ? "stop.fill" : "antenna.radiowaves.left.and.right")
                        .font(.subheadline)

                    Text(viewModel.isScanning ? "Stop Scanning" : "Scan for Devices")
                        .font(.body.weight(.semibold))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.accentColor, in: Capsule())
                .foregroundStyle(.white)
            }
            .disabled(viewModel.isConnecting)
            .opacity(viewModel.isConnecting ? 0.6 : 1.0)

            // Reconnect button
            if viewModel.hasLastConnectedDevice && !viewModel.isScanning {
                Button {
                    viewModel.attemptReconnect()
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "arrow.triangle.2.circlepath")
                            .font(.subheadline)
                        Text("Reconnect Last Device")
                            .font(.subheadline.weight(.medium))
                    }
                    .foregroundStyle(.tint)
                }
                .disabled(viewModel.isConnecting)
            }

            // Connecting indicator
            if viewModel.isConnecting {
                HStack(spacing: 8) {
                    ProgressView()
                    Text("Connecting...")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                .padding(.top, 4)
            }
        }
    }

    // MARK: - Error View

    @ViewBuilder
    private func errorView(_ message: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.orange)

            Text(message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.leading)
        }
        .padding(PeakdooTheme.cardPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.orange.opacity(0.08), in: RoundedRectangle(cornerRadius: PeakdooTheme.cardCornerRadius))
    }

    // MARK: - Footer

    @ViewBuilder
    private var footerSection: some View {
        VStack(spacing: 4) {
            Text("PeakDo")
                .font(.caption.weight(.medium))
                .foregroundStyle(.quaternary)

            Text("v1.0")
                .font(.caption2)
                .foregroundStyle(.quaternary)
        }
        .frame(maxWidth: .infinity)
        .padding(.bottom, 16)
    }
}

// MARK: - Previews

#Preview("Connection Screen") {
    NavigationStack {
        ConnectionView(viewModel: {
            let vm = ConnectionViewModel(bleManager: BLEManager())
            return vm
        }())
    }
}
