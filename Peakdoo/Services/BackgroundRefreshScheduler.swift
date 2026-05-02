import BackgroundTasks
import Foundation
import os

private let logger = Logger(subsystem: "com.peakdoo.app", category: "BackgroundRefresh")

/// Periodic safety-net refresh that fires on top of CoreBluetooth state
/// restoration and the BLE notify path. Its job is to:
///
///   1. Re-publish the most recent battery snapshot so the widget
///      timeline never goes more than ~30 minutes without a touch.
///   2. Schedule the next refresh.
///
/// We do **not** attempt to scan/connect/read the device here. Bluetooth
/// background work inside a `BGAppRefreshTask` is fragile (~30s budget,
/// no guarantee the device is in range) and the live BLE notify channel
/// already covers that case via `bluetooth-central` + state restoration.
enum BackgroundRefreshScheduler {

    /// Must match the entry in `BGTaskSchedulerPermittedIdentifiers` in
    /// the app's Info.plist (set via `project.yml`).
    static let refreshTaskIdentifier = "co.briananglin.Peakdoo.refresh"

    /// Earliest time the next refresh may run. iOS treats this as a
    /// hint, not a guarantee — the system can defer arbitrarily based
    /// on usage patterns and battery state.
    private static let refreshInterval: TimeInterval = 30 * 60 // 30 min

    /// Register the launch handler with `BGTaskScheduler` and submit the
    /// first refresh request. **Must** be called from `App.init()`.
    ///
    /// Why the imperative `register` instead of SwiftUI's
    /// `.backgroundTask(.appRefresh:)` modifier? The SwiftUI modifier
    /// registers the handler when the `Scene` is constructed, which
    /// happens *after* `App.init()`. If we submit a request from
    /// `init()` (which we want to, so a refresh is queued the very
    /// first time the app launches), the scheduler crashes with
    /// "No launch handler registered for task with identifier ...".
    /// Registering imperatively here closes that gap.
    static func registerTasks() {
        let registered = BGTaskScheduler.shared.register(
            forTaskWithIdentifier: refreshTaskIdentifier,
            using: nil // run handler on the main queue
        ) { task in
            guard let appRefreshTask = task as? BGAppRefreshTask else {
                task.setTaskCompleted(success: false)
                return
            }
            handle(appRefreshTask)
        }

        if !registered {
            // Returns false if the identifier isn't in
            // BGTaskSchedulerPermittedIdentifiers, or registration was
            // attempted too late.
            logger.error("Failed to register \(refreshTaskIdentifier) — check Info.plist")
            return
        }

        logger.info("Registered background task \(refreshTaskIdentifier)")
        scheduleNext()
    }

    /// Body of the refresh. Wraps the async work and signals task
    /// completion to BGTaskScheduler.
    private static func handle(_ task: BGAppRefreshTask) {
        logger.info("Background refresh fired")

        // Always queue the next refresh, even if the work below fails.
        scheduleNext()

        let work = Task {
            await performRefreshWork()
        }

        task.expirationHandler = {
            logger.warning("Background refresh expired before completing")
            work.cancel()
        }

        Task {
            _ = await work.value
            task.setTaskCompleted(success: true)
        }
    }

    /// The actual refresh work — re-emit the cached snapshot so
    /// WidgetKit gets a fresh signal. If the live BLE pipeline has been
    /// writing snapshots, this is a no-op for the data but bumps the
    /// reload coordinator.
    private static func performRefreshWork() async {
        if let snapshot = BatteryWidgetSharedStore.load() {
            await MainActor.run {
                BatteryWidgetReloadCoordinator.shared.reset()
                BatteryWidgetSharedStore.saveAndReload(snapshot)
            }
            logger.info("Re-published snapshot from background refresh")
        } else {
            logger.info("No cached snapshot to re-publish")
        }
    }

    /// Submit a new BGAppRefreshTaskRequest. Safe to call repeatedly —
    /// the system replaces any pending request with the same identifier.
    static func scheduleNext() {
        let request = BGAppRefreshTaskRequest(identifier: refreshTaskIdentifier)
        request.earliestBeginDate = Date(timeIntervalSinceNow: refreshInterval)
        do {
            try BGTaskScheduler.shared.submit(request)
            logger.info("Scheduled next refresh in ~\(Int(refreshInterval / 60)) min")
        } catch {
            // BGTaskScheduler returns errors during simulator runs and
            // when the user has disabled Background App Refresh — both
            // are non-fatal and we simply log.
            logger.warning("Failed to schedule background refresh: \(error.localizedDescription)")
        }
    }
}
