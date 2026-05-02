import SwiftUI

struct PowerLimitSection: View {
    var onGetPowerLimit: ((PowerLimitType) async -> Int?)?
    var onSetPowerLimit: ((PowerLimitType, Int) async -> Bool)?

    @State private var isExpanded: Bool = false
    @State private var globalLevel: Int = PowerLevel.notSetValue
    @State private var inputLevel: Int = PowerLevel.notSetValue
    @State private var outputLevel: Int = PowerLevel.notSetValue
    @State private var runtimeLevel: Int = PowerLevel.notSetValue

    @State private var globalSelection: Int = 0
    @State private var inputSelection: Int = 0
    @State private var outputSelection: Int = 0

    @State private var isLoadingGlobal = false
    @State private var isLoadingInput = false
    @State private var isLoadingOutput = false
    @State private var isLoadingRuntime = false

    var body: some View {
        DisclosureGroup(isExpanded: $isExpanded) {
            VStack(spacing: 12) {
                // Global
                powerLimitRow(
                    type: .global,
                    currentLevel: globalLevel,
                    selection: $globalSelection,
                    isLoading: isLoadingGlobal,
                    isReadOnly: false,
                    onGet: { await getLevel(.global) },
                    onSet: { await setLevel(.global, level: globalSelection) }
                )

                Divider()

                // Input
                powerLimitRow(
                    type: .input,
                    currentLevel: inputLevel,
                    selection: $inputSelection,
                    isLoading: isLoadingInput,
                    isReadOnly: false,
                    onGet: { await getLevel(.input) },
                    onSet: { await setLevel(.input, level: inputSelection) }
                )

                Divider()

                // Output
                powerLimitRow(
                    type: .output,
                    currentLevel: outputLevel,
                    selection: $outputSelection,
                    isLoading: isLoadingOutput,
                    isReadOnly: false,
                    onGet: { await getLevel(.output) },
                    onSet: { await setLevel(.output, level: outputSelection) }
                )

                Divider()

                // Runtime (read-only)
                powerLimitRow(
                    type: .runtime,
                    currentLevel: runtimeLevel,
                    selection: .constant(0),
                    isLoading: isLoadingRuntime,
                    isReadOnly: true,
                    onGet: { await getLevel(.runtime) },
                    onSet: nil
                )
            }
            .padding(.top, 8)
        } label: {
            Label("Power Limit", systemImage: "bolt.shield")
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.primary)
        }
    }

    // MARK: - Power Limit Row

    @ViewBuilder
    private func powerLimitRow(
        type: PowerLimitType,
        currentLevel: Int,
        selection: Binding<Int>,
        isLoading: Bool,
        isReadOnly: Bool,
        onGet: @escaping () async -> Void,
        onSet: (() async -> Void)?
    ) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(type.displayName)
                    .font(.caption.weight(.medium))
                    .foregroundStyle(.primary)

                Spacer()

                if isLoading {
                    ProgressView()
                        .controlSize(.mini)
                } else {
                    Text(levelDisplayText(currentLevel))
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(currentLevel == PowerLevel.notSetValue ? .secondary : .primary)
                }

                Button {
                    PaywallManager.gate(placement: PaywallManager.powerLimitPlacement) {
                        Task { await onGet() }
                    }
                } label: {
                    Text("Get")
                        .font(.caption2.weight(.medium))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 6))
                }
                .disabled(isLoading)
            }

            if !isReadOnly {
                HStack(spacing: 8) {
                    Picker("", selection: selection) {
                        ForEach(PowerLevel.allCases, id: \.self) { level in
                            HStack {
                                Text(level.wattage)
                                if level.isHighPower {
                                    Image(systemName: "exclamationmark.triangle.fill")
                                        .foregroundStyle(.orange)
                                }
                            }
                            .tag(level.rawValue)
                        }
                    }
                    .pickerStyle(.menu)
                    .labelsHidden()

                    Button {
                        if let onSet {
                            PaywallManager.gate(placement: PaywallManager.powerLimitPlacement) {
                                Task { await onSet() }
                            }
                        }
                    } label: {
                        Text("Set")
                            .font(.caption2.weight(.medium))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .foregroundStyle(.white)
                            .background(Color.accentColor, in: RoundedRectangle(cornerRadius: 6))
                    }
                    .disabled(isLoading)
                }
            }
        }
    }

    // MARK: - Get / Set Logic

    private func getLevel(_ type: PowerLimitType) async {
        setLoading(type, true)
        if let level = await onGetPowerLimit?(type) {
            await MainActor.run {
                setCurrentLevel(type, level)
                if level >= 0 {
                    setSelection(type, level)
                }
            }
        }
        setLoading(type, false)
    }

    private func setLevel(_ type: PowerLimitType, level: Int) async {
        setLoading(type, true)
        let success = await onSetPowerLimit?(type, level) ?? false
        if success {
            // Refresh the current value
            await getLevel(type)
        }
        setLoading(type, false)
    }

    // MARK: - State Helpers

    private func setLoading(_ type: PowerLimitType, _ loading: Bool) {
        switch type {
        case .global: isLoadingGlobal = loading
        case .input: isLoadingInput = loading
        case .output: isLoadingOutput = loading
        case .runtime: isLoadingRuntime = loading
        }
    }

    private func setCurrentLevel(_ type: PowerLimitType, _ level: Int) {
        switch type {
        case .global: globalLevel = level
        case .input: inputLevel = level
        case .output: outputLevel = level
        case .runtime: runtimeLevel = level
        }
    }

    private func setSelection(_ type: PowerLimitType, _ level: Int) {
        switch type {
        case .global: globalSelection = level
        case .input: inputSelection = level
        case .output: outputSelection = level
        case .runtime: break
        }
    }

    private func levelDisplayText(_ level: Int) -> String {
        if level == PowerLevel.notSetValue {
            return "Not set"
        }
        guard let powerLevel = PowerLevel(rawValue: level) else {
            return "Unknown (\(level))"
        }
        return powerLevel.wattage
    }
}

// MARK: - Previews

#Preview {
    ScrollView {
        VStack {
            CardContainerView(title: "Type-C Port", icon: "cable.connector.horizontal") {
                PowerLimitSection()
            }
        }
        .padding()
    }
    .background(PeakdooTheme.screenBackground)
}
