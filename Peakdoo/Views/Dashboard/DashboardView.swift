import SwiftUI
import SuperwallKit

struct DashboardView: View {
    @Bindable var viewModel: DashboardViewModel
    var isDemoMode: Bool = false
    @State private var appeared = false
    @State private var showSettingsMenu = false
    @State private var showSettingsSheet = false

    /// True once we have the minimum data required to render the dashboard.
    ///
    /// We intentionally do *not* wait on `deviceState.isConnected`: that flag
    /// only flips at the very end of the BLE setup sequence (after datetime
    /// sync, feature query and timer loading), which can run for a couple of
    /// seconds after the first battery reading has already arrived. Keying off
    /// the real data instead means the loading spinner stays visible until we
    /// actually have a percentage to show — no flash of "--" or "0%" first.
    private var isReady: Bool {
        let state = viewModel.deviceState
        // Need the model before we can decide what capabilities to render.
        guard state.model != .unknown else { return false }
        // For devices with a battery, wait for the first reading.
        if state.supportsBatteryCapacity {
            return state.battery != nil
        }
        // Otherwise wait for at least the DC port reading so the dashboard
        // isn't rendered empty.
        return state.dcPort != nil
    }

    private var appSettings: AppSettings {
        viewModel.appSettings
    }

    var body: some View {
        ZStack {
            PeakdooTheme.screenBackground.ignoresSafeArea()

            if isReady {
                dashboardContent
                    .transition(.opacity.combined(with: .offset(y: 12)))
            } else {
                loadingView
                    .transition(.opacity)
            }
        }
        .animation(.spring(duration: 0.5), value: isReady)
        .navigationTitle(viewModel.modelName)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                HStack(spacing: 4) {
                    // Settings menu
                    Menu {
                        Button {
                            if appSettings.expertMode {
                                // Turning off is always free
                                appSettings.expertMode = false
                            } else {
                                // Gate turning on behind Superwall paywall
                                PaywallManager.gate(placement: PaywallManager.expertModePlacement) {
                                    appSettings.expertMode = true
                                }
                            }
                        } label: {
                            Label(
                                appSettings.expertMode ? "Disable Expert Mode" : "Expert Mode",
                                systemImage: appSettings.expertMode ? "gearshape.2.fill" : "gearshape.2"
                            )
                        }

                        if appSettings.expertMode {
                            Toggle(isOn: Bindable(appSettings).devMode) {
                                Label("Dev Mode", systemImage: "hammer")
                            }
                        }

                        Divider()

                        Button {
                            showSettingsSheet = true
                        } label: {
                            Label("Settings & Restore Purchases", systemImage: "gearshape.fill")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle.fill")
                            .symbolRenderingMode(.hierarchical)
                            .font(.title3)
                    }
                    .foregroundStyle(.secondary)

                    // Disconnect button
                    Button {
                        viewModel.disconnect()
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .symbolRenderingMode(.hierarchical)
                            .font(.title3)
                    }
                    .foregroundStyle(.secondary)
                }
            }
        }
        .sheet(isPresented: $viewModel.showTimerEditor) {
            TimerEditorSheet(
                existingTimer: viewModel.editingTimer
            ) { timer in
                viewModel.saveTimer(timer)
            }
        }
        .sheet(isPresented: $showSettingsSheet) {
            SettingsSheet()
        }
        .onAppear {
            if isReady && !appeared {
                withAnimation(.spring(duration: 0.8, bounce: 0.2)) {
                    appeared = true
                }
            }
        }
        .onChange(of: isReady) { _, ready in
            if ready && !appeared {
                withAnimation(.spring(duration: 0.8, bounce: 0.2)) {
                    appeared = true
                }
            }
        }
    }

    // MARK: - Loading View

    @ViewBuilder
    private var loadingView: some View {
        VStack(spacing: 20) {
            Spacer()

            ProgressView()
                .controlSize(.large)
                .tint(.secondary)

            VStack(spacing: 6) {
                Text("Connecting to device...")
                    .font(.headline)
                    .foregroundStyle(.primary)

                Text("Reading device information")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Dashboard Content

    @ViewBuilder
    private var dashboardContent: some View {
        ScrollView {
            VStack(spacing: PeakdooTheme.sectionSpacing) {
                // MARK: - Demo Mode Banner
                if isDemoMode {
                    HStack(spacing: 6) {
                        Image(systemName: "play.circle.fill")
                            .font(.caption)
                        Text("Demo Mode")
                            .font(.caption.weight(.semibold))
                        Text("-- simulated device data")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .foregroundStyle(.orange)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(.orange.opacity(0.1), in: Capsule())
                }

                // MARK: - Battery gauge
                if viewModel.deviceState.supportsBatteryCapacity {
                    if let battery = viewModel.batteryInfo {
                        BatteryGaugeView(
                            level: viewModel.batteryLevel,
                            status: viewModel.batteryStatus,
                            isEnabled: battery.enabled
                        )
                        .padding(.top, 8)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 30)

                        BatteryDetailCard(battery: battery)
                            .opacity(appeared ? 1 : 0)
                            .offset(y: appeared ? 0 : 30)
                    }
                }

                // MARK: - DC Port
                if let dcPort = viewModel.dcPort {
                    DCPortCard(
                        dcPort: dcPort,
                        supportsBypass: viewModel.deviceState.supportsDCBypass,
                        supportsBypassControl: viewModel.deviceState.supportsDCBypassControl,
                        onTogglePort: { enabled in
                            viewModel.toggleDCPort(enabled)
                        },
                        onToggleBypass: { enabled in
                            viewModel.toggleDCBypass(enabled)
                        }
                    )
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 30)
                }

                // MARK: - Type-C Port
                if viewModel.deviceState.supportsUSBPort, let typeCPort = viewModel.typeCPort {
                    VStack(spacing: 0) {
                        TypeCPortCard(
                            typeCPort: typeCPort,
                            supportsOutputControl: viewModel.deviceState.supportsUSBOutputControl,
                            onToggleOutput: { enabled in
                                viewModel.toggleTypeCOutput(enabled)
                            }
                        )

                        // Power Limit (Expert mode only)
                        if appSettings.expertMode && viewModel.deviceState.supportsUSBPowerLimit {
                            PowerLimitSection(
                                onGetPowerLimit: { type in
                                    await viewModel.onGetPowerLimit?(type)
                                },
                                onSetPowerLimit: { type, level in
                                    await viewModel.onSetPowerLimit?(type, level) ?? false
                                }
                            )
                            .padding(.horizontal, PeakdooTheme.cardPadding)
                            .padding(.bottom, PeakdooTheme.cardPadding)
                            .background(PeakdooTheme.cardBackground)
                            .clipShape(
                                .rect(
                                    bottomLeadingRadius: PeakdooTheme.cardCornerRadius,
                                    bottomTrailingRadius: PeakdooTheme.cardCornerRadius
                                )
                            )
                            .shadow(
                                color: PeakdooTheme.cardShadowColor,
                                radius: PeakdooTheme.cardShadowRadius,
                                y: PeakdooTheme.cardShadowY
                            )
                            .offset(y: -PeakdooTheme.cardShadowY)
                        }
                    }
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 30)
                }

                // MARK: - Timer / Scheduler (Expert Mode)
                if appSettings.expertMode && viewModel.deviceState.supportsScheduledControl {
                    TimerListCard(viewModel: viewModel)
                        .opacity(appeared ? 1 : 0)
                        .offset(y: appeared ? 0 : 30)
                        .onAppear {
                            if viewModel.deviceState.timers == nil {
                                viewModel.loadTimers()
                            }
                        }
                }

                // MARK: - Date & Time Sync (Expert Mode)
                if appSettings.expertMode {
                    DateTimeSyncCard(
                        lastSyncTime: viewModel.deviceState.lastSyncTime,
                        onSync: { viewModel.syncDateTime() }
                    )
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 30)
                }

                // MARK: - System Info
                SystemInfoCard(
                    modelName: viewModel.modelName,
                    firmwareVersion: viewModel.firmwareVersion,
                    variant: viewModel.variant,
                    expertMode: appSettings.expertMode,
                    devMode: appSettings.devMode,
                    supportsShutdown: viewModel.deviceState.supportsShutdown,
                    supportsFactoryMode: viewModel.deviceState.supportsFactoryMode,
                    onRestart: { viewModel.executeRestart() },
                    onSyncTime: { viewModel.syncDateTime() },
                    onShutdown: { viewModel.shutdown() },
                    onFactoryMode: { viewModel.factoryMode() },
                    onSetBLEPin: { pin in viewModel.setBLEPin(pin) }
                )
                .opacity(appeared ? 1 : 0)
                .offset(y: appeared ? 0 : 30)
            }
            .padding(.horizontal, PeakdooTheme.horizontalPadding)
            .padding(.bottom, 32)
        }
    }
}

// MARK: - Previews

#Preview("Full Dashboard") {
    NavigationStack {
        DashboardView(viewModel: {
            let state = DeviceState()
            state.isConnected = true
            state.model = .lp2
            state.firmwareVersion = "1.2.3"
            state.variant = "LP2-PRO"
            state.features = [.batteryCapacity, .usbPort, .dcBypass, .dcBypassControl, .usbOutputControl, .dcOutScheduler]
            state.lastSyncTime = Date().addingTimeInterval(-120)

            state.battery = BatteryInfo(
                enabled: true,
                status: .discharging,
                isFull: false,
                maxCapacity: 99.0,
                capacity: 62.4,
                level: 63,
                voltage: 12.2,
                current: 3.1,
                power: 37.8,
                remainMinutes: 105
            )

            state.dcPort = DCPortStatus(
                enabled: true,
                status: .discharging,
                voltage: 12.4,
                current: 3.05,
                power: 37.8,
                isBypassOn: false
            )

            state.typeCPort = TypeCPortStatus(
                enabled: true,
                status: .idle,
                voltage: 0,
                current: 0,
                power: 0,
                temperature: 32.5,
                mode: 3,
                isDCInput: false
            )

            state.timers = [
                DeviceTimer(
                    id: 0, status: .enabled, type: .daily,
                    hour: 8, minute: 0, date: nil,
                    weekDays: 0, monthDays: 0, action: .on
                ),
                DeviceTimer(
                    id: 1, status: .enabled, type: .weekly,
                    hour: 22, minute: 30, date: nil,
                    weekDays: 0b01111100, monthDays: 0, action: .off
                ),
            ]

            let settings = AppSettings()
            settings.expertMode = true
            return DashboardViewModel(deviceState: state, appSettings: settings)
        }())
    }
}

#Preview("Standard Mode") {
    NavigationStack {
        DashboardView(viewModel: {
            let state = DeviceState()
            state.isConnected = true
            state.model = .lp2
            state.firmwareVersion = "1.2.3"
            state.variant = "LP2-PRO"
            state.features = [.batteryCapacity, .usbPort, .dcBypass, .dcBypassControl, .usbOutputControl]

            state.battery = BatteryInfo(
                enabled: true,
                status: .discharging,
                isFull: false,
                maxCapacity: 99.0,
                capacity: 62.4,
                level: 63,
                voltage: 12.2,
                current: 3.1,
                power: 37.8,
                remainMinutes: 105
            )

            state.dcPort = DCPortStatus(
                enabled: true,
                status: .discharging,
                voltage: 12.4,
                current: 3.05,
                power: 37.8,
                isBypassOn: false
            )

            return DashboardViewModel(deviceState: state, appSettings: AppSettings())
        }())
    }
}

#Preview("LP1 Charging") {
    NavigationStack {
        DashboardView(viewModel: {
            let state = DeviceState()
            state.isConnected = true
            state.model = .lp1
            state.firmwareVersion = "2.0.1"

            state.battery = BatteryInfo(
                enabled: true,
                status: .charging,
                isFull: false,
                maxCapacity: 99.0,
                capacity: 45.0,
                level: 45,
                voltage: 13.1,
                current: 2.8,
                power: 36.7,
                remainMinutes: 60
            )

            state.dcPort = DCPortStatus(
                enabled: true,
                status: .idle,
                voltage: 12.6,
                current: 0,
                power: 0,
                isBypassOn: false
            )

            state.typeCPort = TypeCPortStatus(
                enabled: true,
                status: .charging,
                voltage: 20.0,
                current: 3.0,
                power: 60.0,
                temperature: 41.2,
                mode: 1,
                isDCInput: false
            )

            return DashboardViewModel(deviceState: state, appSettings: AppSettings())
        }())
    }
}
