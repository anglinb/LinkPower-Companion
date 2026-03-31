import SwiftUI

struct SystemInfoCard: View {
    let modelName: String
    let firmwareVersion: String
    let variant: String?
    let expertMode: Bool
    let devMode: Bool
    let supportsShutdown: Bool
    let supportsFactoryMode: Bool
    var onRestart: (() -> Void)?
    var onSyncTime: (() -> Void)?
    var onShutdown: (() -> Void)?
    var onFactoryMode: (() -> Void)?
    var onSetBLEPin: ((UInt32) -> Void)?

    @State private var showRestartAlert: Bool = false
    @State private var showShutdownAlert: Bool = false
    @State private var showFactoryModeAlert: Bool = false
    @State private var blePinText: String = ""

    var body: some View {
        CardContainerView(title: "System", icon: "gearshape") {
            VStack(spacing: 0) {
                // Model name
                infoRow(label: "Model", value: modelName)

                Divider()
                    .padding(.vertical, 6)

                // Firmware
                infoRow(label: "Firmware", value: firmwareVersion)

                // Variant (expert mode only)
                if expertMode, let variant {
                    Divider()
                        .padding(.vertical, 6)

                    infoRow(label: "Variant", value: variant)
                }

                Divider()
                    .padding(.vertical, 10)

                // Action buttons
                VStack(spacing: 10) {
                    // Sync time
                    Button {
                        onSyncTime?()
                    } label: {
                        Label("Sync Date & Time", systemImage: "clock.arrow.2.circlepath")
                            .font(.subheadline.weight(.medium))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 10)
                            .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 10))
                    }

                    // Restart (expert mode)
                    if expertMode {
                        Button(role: .destructive) {
                            showRestartAlert = true
                        } label: {
                            Label("Restart Device", systemImage: "arrow.clockwise")
                                .font(.subheadline.weight(.medium))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(Color.red.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
                        }
                    }

                    // Shutdown (expert mode + device supports it)
                    if expertMode && supportsShutdown {
                        Button(role: .destructive) {
                            showShutdownAlert = true
                        } label: {
                            Label("Shutdown Device", systemImage: "power")
                                .font(.subheadline.weight(.medium))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(Color.red.opacity(0.08), in: RoundedRectangle(cornerRadius: 10))
                        }
                    }

                    // Factory mode (dev mode + device supports it)
                    if devMode && supportsFactoryMode {
                        Divider()
                            .padding(.vertical, 4)

                        Button(role: .destructive) {
                            showFactoryModeAlert = true
                        } label: {
                            Label("Factory Mode", systemImage: "wrench.and.screwdriver")
                                .font(.subheadline.weight(.medium))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(Color.purple.opacity(0.1), in: RoundedRectangle(cornerRadius: 10))
                        }
                        .tint(.purple)
                    }

                    // BLE PIN (dev mode)
                    if devMode {
                        Divider()
                            .padding(.vertical, 4)

                        blePinSection
                    }
                }
            }
        }
        .alert("Restart Device?", isPresented: $showRestartAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Restart", role: .destructive) {
                onRestart?()
            }
        } message: {
            Text("The device will restart and temporarily disconnect.")
        }
        .alert("Shutdown Device?", isPresented: $showShutdownAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Shutdown", role: .destructive) {
                onShutdown?()
            }
        } message: {
            Text("The device will shut down completely. To recover, plug in USB-C power.")
        }
        .alert("Enter Factory Mode?", isPresented: $showFactoryModeAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Enter Factory Mode", role: .destructive) {
                onFactoryMode?()
            }
        } message: {
            Text("This is a developer feature. The device will enter factory test mode.")
        }
    }

    // MARK: - BLE PIN Section

    @ViewBuilder
    private var blePinSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("BLE PIN")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)

            HStack(spacing: 8) {
                TextField("000000", text: $blePinText)
                    .font(.system(.body, design: .monospaced))
                    .textFieldStyle(.roundedBorder)
                    .keyboardType(.numberPad)
                    .frame(maxWidth: 120)
                    .onChange(of: blePinText) { _, newValue in
                        // Restrict to 6 digits
                        let filtered = String(newValue.prefix(6).filter { $0.isNumber })
                        if filtered != newValue {
                            blePinText = filtered
                        }
                    }

                Button {
                    if let pin = UInt32(blePinText), pin <= 999999 {
                        onSetBLEPin?(pin)
                    }
                } label: {
                    Text("Set PIN")
                        .font(.caption.weight(.medium))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .foregroundStyle(.white)
                        .background(Color.accentColor, in: RoundedRectangle(cornerRadius: 8))
                }
                .disabled(blePinText.isEmpty || (UInt32(blePinText) ?? 1_000_000) > 999999)
            }

            Text("6-digit PIN for BLE pairing (0-999999)")
                .font(.caption2)
                .foregroundStyle(.tertiary)
        }
    }

    // MARK: - Info Row

    @ViewBuilder
    private func infoRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Spacer()

            Text(value)
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.primary)
        }
    }
}

// MARK: - Previews

#Preview("Standard Mode") {
    SystemInfoCard(
        modelName: "Link-Power 2",
        firmwareVersion: "1.2.3",
        variant: "LP2-PRO",
        expertMode: false,
        devMode: false,
        supportsShutdown: true,
        supportsFactoryMode: false
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Expert Mode") {
    SystemInfoCard(
        modelName: "Link-Power 2",
        firmwareVersion: "1.2.3",
        variant: "LP2-PRO",
        expertMode: true,
        devMode: false,
        supportsShutdown: true,
        supportsFactoryMode: false
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}

#Preview("Dev Mode") {
    SystemInfoCard(
        modelName: "Link-Power 1",
        firmwareVersion: "2.0.1",
        variant: "LP1-STD",
        expertMode: true,
        devMode: true,
        supportsShutdown: true,
        supportsFactoryMode: true
    )
    .padding()
    .background(PeakdooTheme.screenBackground)
}
