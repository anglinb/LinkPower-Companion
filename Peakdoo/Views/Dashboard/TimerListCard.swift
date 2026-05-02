import SwiftUI

struct TimerListCard: View {
    @Bindable var viewModel: DashboardViewModel

    var body: some View {
        CardContainerView(title: "DC Schedule", icon: "alarm") {
            HStack(spacing: 12) {
                // Refresh button
                Button {
                    viewModel.loadTimers()
                } label: {
                    Image(systemName: "arrow.clockwise")
                        .font(.subheadline.weight(.medium))
                }
                .disabled(viewModel.isLoadingTimers)

                // Add button
                if viewModel.canAddTimer {
                    Button {
                        PaywallManager.gate(placement: PaywallManager.timerPlacement) {
                            viewModel.beginAddTimer()
                        }
                    } label: {
                        Image(systemName: "plus")
                            .font(.subheadline.weight(.medium))
                    }
                }
            }
        } content: {
            if viewModel.isLoadingTimers {
                HStack {
                    Spacer()
                    ProgressView()
                        .controlSize(.small)
                    Text("Loading timers...")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Spacer()
                }
                .padding(.vertical, 8)
            } else if viewModel.timers.isEmpty {
                emptyState
            } else {
                timerList
            }
        }
    }

    // MARK: - Empty State

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 8) {
            Image(systemName: "alarm")
                .font(.title2)
                .foregroundStyle(.tertiary)

            Text("No timers")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Text("Add a timer to schedule DC port control.")
                .font(.caption)
                .foregroundStyle(.tertiary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }

    // MARK: - Timer List

    @ViewBuilder
    private var timerList: some View {
        VStack(spacing: 0) {
            ForEach(viewModel.timers) { timer in
                if timer.id != viewModel.timers.first?.id {
                    Divider()
                        .padding(.vertical, 4)
                }

                timerRow(timer)
            }
        }
    }

    @ViewBuilder
    private func timerRow(_ timer: DeviceTimer) -> some View {
        HStack(spacing: 10) {
            // Action icon
            Image(systemName: timer.action == .on ? "bolt.fill" : "power")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(timer.action == .on ? Color.green : Color.orange)
                .frame(width: 24)

            // Timer info
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(timer.timeString)
                        .font(.system(.body, design: .rounded, weight: .semibold))

                    Text(timer.action.label)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                HStack(spacing: 4) {
                    Text(timer.type.label)
                        .font(.caption2.weight(.medium))
                        .foregroundStyle(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(timerTypeBadgeColor(timer.type), in: Capsule())

                    Text(timer.repeatDescription)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer()

            // Status indicator
            if timer.status != .enabled {
                Text(timer.status.label)
                    .font(.caption2)
                    .foregroundStyle(.orange)
            }

            // Edit button
            Button {
                PaywallManager.gate(placement: PaywallManager.timerPlacement) {
                    viewModel.beginEditTimer(timer)
                }
            } label: {
                Image(systemName: "pencil.circle")
                    .font(.title3)
                    .foregroundStyle(.secondary)
            }

            // Delete button
            Button(role: .destructive) {
                withAnimation(.spring(duration: 0.3)) {
                    viewModel.deleteTimer(id: timer.id)
                }
            } label: {
                Image(systemName: "trash.circle")
                    .font(.title3)
                    .foregroundStyle(.red.opacity(0.7))
            }
        }
        .padding(.vertical, 4)
    }

    private func timerTypeBadgeColor(_ type: TimerType) -> Color {
        switch type {
        case .oneShot: return .blue
        case .daily: return .green
        case .weekly: return .purple
        case .monthly: return .orange
        }
    }
}

// MARK: - Previews

#Preview("With Timers") {
    let state = DeviceState()
    state.isConnected = true
    state.model = .lp2
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
        DeviceTimer(
            id: 2, status: .disabled, type: .oneShot,
            hour: 6, minute: 0, date: Date(),
            weekDays: 0, monthDays: 0, action: .on
        ),
    ]

    let vm = DashboardViewModel(deviceState: state, appSettings: AppSettings())
    return TimerListCard(viewModel: vm)
        .padding()
        .background(PeakdooTheme.screenBackground)
}

#Preview("Empty") {
    let state = DeviceState()
    state.isConnected = true
    state.timers = []

    let vm = DashboardViewModel(deviceState: state, appSettings: AppSettings())
    return TimerListCard(viewModel: vm)
        .padding()
        .background(PeakdooTheme.screenBackground)
}

#Preview("Loading") {
    let state = DeviceState()
    state.isConnected = true

    let vm = DashboardViewModel(deviceState: state, appSettings: AppSettings())
    vm.isLoadingTimers = true
    return TimerListCard(viewModel: vm)
        .padding()
        .background(PeakdooTheme.screenBackground)
}
