import SwiftUI
import SuperwallKit
import StoreKit

/// Bottom-sheet settings surface shown from the gear icon on the Connection
/// and Dashboard screens. Exposes two distinct actions required for App
/// Store review compliance:
///
/// 1. Rate the app (Guideline 2.5 / App Store best practice) — uses the
///    built-in `requestReview` environment action on iOS 17+.
/// 2. Restore purchases (Guideline 3.1.1) — calls Superwall's
///    `restorePurchases()`, which drives the StoreKit restore flow.
///
/// The button is reachable from the main screen before a device is
/// connected, so reviewers can access Restore without triggering a
/// paywall first.
struct SettingsSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.requestReview) private var requestReview

    @State private var isRestoring = false
    @State private var restoreResult: RestoreOutcome?

    private enum RestoreOutcome: Equatable {
        case success
        case nothingToRestore
        case failure(String)
    }

    var body: some View {
        NavigationStack {
            List {
                // MARK: - Enjoy the app?
                Section {
                    Button {
                        requestReview()
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: "star.fill")
                                .foregroundStyle(.yellow)
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Rate LinkPower Companion")
                                    .foregroundStyle(.primary)
                                Text("Enjoying the app? Leave a quick rating.")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                        }
                    }
                } header: {
                    Text("Feedback")
                }

                // MARK: - Purchases
                Section {
                    Button {
                        Task { await restorePurchases() }
                    } label: {
                        HStack(spacing: 12) {
                            Image(systemName: "arrow.clockwise.circle.fill")
                                .foregroundStyle(.tint)
                                .frame(width: 24)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Restore Purchases")
                                    .foregroundStyle(.primary)
                                Text("Already paid? Restore your subscription or lifetime purchase.")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            if isRestoring {
                                ProgressView()
                            }
                        }
                    }
                    .disabled(isRestoring)

                    if let restoreResult {
                        HStack(spacing: 8) {
                            switch restoreResult {
                            case .success:
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(.green)
                                Text("Purchases restored.")
                                    .foregroundStyle(.secondary)
                            case .nothingToRestore:
                                Image(systemName: "info.circle.fill")
                                    .foregroundStyle(.secondary)
                                Text("No active purchases found on this Apple ID.")
                                    .foregroundStyle(.secondary)
                            case .failure(let message):
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundStyle(.orange)
                                Text(message)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .font(.footnote)
                    }
                } header: {
                    Text("Purchases")
                } footer: {
                    Text("Restoring re-applies any active subscription or lifetime entitlement from your Apple ID. No new charge will be made.")
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }

    // MARK: - Restore

    @MainActor
    private func restorePurchases() async {
        isRestoring = true
        restoreResult = nil
        defer { isRestoring = false }

        let result = await Superwall.shared.restorePurchases()
        switch result {
        case .restored:
            // Superwall's `.restored` only signals that the restore call
            // completed without error — it does NOT mean the Apple ID
            // actually owns an entitlement. If the user has nothing to
            // restore, StoreKit itself shows a "No Subscriptions Found"
            // alert; avoid contradicting that by only claiming success
            // when we can verify an active subscription afterwards.
            if case .active = Superwall.shared.subscriptionStatus {
                restoreResult = .success
            } else {
                restoreResult = .nothingToRestore
            }
        case .failed(let error):
            restoreResult = .failure(error?.localizedDescription ?? "Could not restore. Please try again.")
        }
    }
}

#Preview {
    Color.gray
        .sheet(isPresented: .constant(true)) {
            SettingsSheet()
        }
}
