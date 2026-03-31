import SwiftUI

struct TimerEditorSheet: View {
    let existingTimer: DeviceTimer?
    let onSave: (DeviceTimer) -> Void
    @Environment(\.dismiss) private var dismiss

    // MARK: - Editor State

    @State private var status: TimerStatus = .enabled
    @State private var action: TimerAction = .on
    @State private var type: TimerType = .oneShot
    @State private var hour: Int = 12
    @State private var minute: Int = 0
    @State private var selectedDate: Date = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
    @State private var selectedWeekDays: Set<String> = []
    @State private var selectedMonthDays: Set<Int> = []

    private var isEditing: Bool { existingTimer != nil }

    var body: some View {
        NavigationStack {
            Form {
                statusSection
                actionSection
                typeSection
                timeSection
                repeatSection
            }
            .navigationTitle(isEditing ? "Edit Timer" : "New Timer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        saveTimer()
                    }
                    .fontWeight(.semibold)
                    .disabled(!isValid)
                }
            }
            .onAppear {
                loadExistingTimer()
            }
        }
        .presentationDetents([.large])
    }

    // MARK: - Status Section

    @ViewBuilder
    private var statusSection: some View {
        Section("Status") {
            Picker("Status", selection: $status) {
                Text("Enabled").tag(TimerStatus.enabled)
                Text("Disabled").tag(TimerStatus.disabled)
            }
            .pickerStyle(.segmented)
        }
    }

    // MARK: - Action Section

    @ViewBuilder
    private var actionSection: some View {
        Section("Action") {
            Picker("Action", selection: $action) {
                Label("Turn On", systemImage: "bolt.fill")
                    .tag(TimerAction.on)
                Label("Turn Off", systemImage: "power")
                    .tag(TimerAction.off)
            }
            .pickerStyle(.segmented)
        }
    }

    // MARK: - Type Section

    @ViewBuilder
    private var typeSection: some View {
        Section("Schedule Type") {
            Picker("Type", selection: $type) {
                ForEach(TimerType.allCases, id: \.self) { timerType in
                    Text(timerType.label).tag(timerType)
                }
            }
            .pickerStyle(.segmented)
        }
    }

    // MARK: - Time Section

    @ViewBuilder
    private var timeSection: some View {
        Section("Time") {
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Hour")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Stepper(value: $hour, in: 0...23) {
                        Text(String(format: "%02d", hour))
                            .font(.system(.title2, design: .rounded, weight: .semibold))
                            .monospacedDigit()
                    }
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Minute")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Stepper(value: $minute, in: 0...59) {
                        Text(String(format: "%02d", minute))
                            .font(.system(.title2, design: .rounded, weight: .semibold))
                            .monospacedDigit()
                    }
                }
            }
        }
    }

    // MARK: - Repeat Section

    @ViewBuilder
    private var repeatSection: some View {
        switch type {
        case .oneShot:
            Section("Date") {
                DatePicker(
                    "Date",
                    selection: $selectedDate,
                    in: Date()...Calendar.current.date(byAdding: .month, value: 24, to: Date())!,
                    displayedComponents: [.date]
                )
                .datePickerStyle(.graphical)
            }

        case .daily:
            // No repeat configuration needed
            EmptyView()

        case .weekly:
            Section("Days of Week") {
                weekDaySelector
            }

        case .monthly:
            Section("Days of Month") {
                monthDaySelector
            }
        }
    }

    // MARK: - Week Day Selector

    @ViewBuilder
    private var weekDaySelector: some View {
        let days = DeviceTimer.allWeekDayNames

        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
            ForEach(days, id: \.self) { day in
                let isSelected = selectedWeekDays.contains(day)
                Button {
                    withAnimation(.spring(duration: 0.2)) {
                        if isSelected {
                            selectedWeekDays.remove(day)
                        } else {
                            selectedWeekDays.insert(day)
                        }
                    }
                } label: {
                    Text(day)
                        .font(.caption.weight(.medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 10)
                        .background(
                            isSelected ? Color.accentColor : Color(.systemGray5),
                            in: RoundedRectangle(cornerRadius: 8)
                        )
                        .foregroundStyle(isSelected ? .white : .primary)
                }
                .buttonStyle(.plain)
            }
        }
    }

    // MARK: - Month Day Selector

    @ViewBuilder
    private var monthDaySelector: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 6) {
            ForEach(1...31, id: \.self) { day in
                let isSelected = selectedMonthDays.contains(day)
                Button {
                    withAnimation(.spring(duration: 0.2)) {
                        if isSelected {
                            selectedMonthDays.remove(day)
                        } else {
                            selectedMonthDays.insert(day)
                        }
                    }
                } label: {
                    Text("\(day)")
                        .font(.caption2.weight(.medium))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 8)
                        .background(
                            isSelected ? Color.accentColor : Color(.systemGray5),
                            in: RoundedRectangle(cornerRadius: 6)
                        )
                        .foregroundStyle(isSelected ? .white : .primary)
                }
                .buttonStyle(.plain)
            }
        }
    }

    // MARK: - Validation

    private var isValid: Bool {
        switch type {
        case .oneShot:
            return true // date picker always has a valid date
        case .daily:
            return true
        case .weekly:
            return !selectedWeekDays.isEmpty
        case .monthly:
            return !selectedMonthDays.isEmpty
        }
    }

    // MARK: - Load Existing

    private func loadExistingTimer() {
        guard let timer = existingTimer else { return }
        status = timer.status == .enabled ? .enabled : .disabled
        action = timer.action
        type = timer.type
        hour = timer.hour
        minute = timer.minute

        if let date = timer.date {
            selectedDate = date
        }

        selectedWeekDays = Set(DeviceTimer.weekDayNames(from: timer.weekDays))
        selectedMonthDays = Set(DeviceTimer.monthDayNumbers(from: timer.monthDays))
    }

    // MARK: - Save

    private func saveTimer() {
        var timer = DeviceTimer(
            id: existingTimer?.id ?? 0xFF,
            status: status,
            type: type,
            hour: hour,
            minute: minute,
            date: type == .oneShot ? selectedDate : nil,
            weekDays: type == .weekly ? DeviceTimer.weekDayMask(from: selectedWeekDays) : 0,
            monthDays: type == .monthly ? DeviceTimer.monthDayMask(from: selectedMonthDays) : 0,
            action: action
        )

        // Preserve the ID for existing timers
        if let existing = existingTimer {
            timer.id = existing.id
        }

        onSave(timer)
        dismiss()
    }
}

// MARK: - Previews

#Preview("New Timer") {
    TimerEditorSheet(existingTimer: nil) { timer in
        print("Save timer: \(timer)")
    }
}

#Preview("Edit Timer") {
    TimerEditorSheet(
        existingTimer: DeviceTimer(
            id: 0, status: .enabled, type: .weekly,
            hour: 8, minute: 30, date: nil,
            weekDays: 0b00111110, monthDays: 0, action: .on
        )
    ) { timer in
        print("Save timer: \(timer)")
    }
}

#Preview("Edit Monthly Timer") {
    TimerEditorSheet(
        existingTimer: DeviceTimer(
            id: 1, status: .enabled, type: .monthly,
            hour: 22, minute: 0, date: nil,
            weekDays: 0,
            monthDays: DeviceTimer.monthDayMask(from: [1, 15, 28]),
            action: .off
        )
    ) { timer in
        print("Save timer: \(timer)")
    }
}
