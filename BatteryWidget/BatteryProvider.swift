import Foundation
import WidgetKit

struct BatteryEntry: TimelineEntry {
    let date: Date
    let snapshot: BatteryWidgetSnapshot

    /// Drives Smart Stack ranking — iOS surfaces our widget more
    /// prominently when the battery is critically low or actively
    /// charging/discharging.
    var relevance: TimelineEntryRelevance? {
        guard snapshot.isConnected else {
            return TimelineEntryRelevance(score: 0)
        }
        switch snapshot.status {
        case .charging:
            // Charging is interesting until full.
            return TimelineEntryRelevance(score: snapshot.level >= 95 ? 25 : 70)
        case .discharging:
            if snapshot.level <= 10 { return TimelineEntryRelevance(score: 100) }
            if snapshot.level <= 25 { return TimelineEntryRelevance(score: 80) }
            return TimelineEntryRelevance(score: 50)
        case .idle:
            if snapshot.level <= 15 { return TimelineEntryRelevance(score: 60) }
            return TimelineEntryRelevance(score: 20)
        }
    }

    static let placeholder = BatteryEntry(
        date: Date(),
        snapshot: .placeholder
    )

    static let disconnected = BatteryEntry(
        date: Date(),
        snapshot: .disconnected
    )
}

struct BatteryProvider: TimelineProvider {

    /// Quick, non-personalized view shown before any data is available.
    func placeholder(in context: Context) -> BatteryEntry {
        .placeholder
    }

    /// Snapshot used in the widget gallery and transient previews.
    func getSnapshot(in context: Context, completion: @escaping (BatteryEntry) -> Void) {
        if context.isPreview {
            completion(.placeholder)
            return
        }
        completion(currentEntry())
    }

    /// Single-entry timeline that refreshes ~15 minutes after the last
    /// update. The app also calls `WidgetCenter.reloadTimelines` whenever
    /// the live battery value changes, which supersedes this schedule.
    func getTimeline(in context: Context, completion: @escaping (Timeline<BatteryEntry>) -> Void) {
        let entry = currentEntry()
        let nextRefresh = Calendar.current.date(
            byAdding: .minute,
            value: 15,
            to: entry.date
        ) ?? entry.date.addingTimeInterval(900)

        let timeline = Timeline(entries: [entry], policy: .after(nextRefresh))
        completion(timeline)
    }

    private func currentEntry() -> BatteryEntry {
        if let snapshot = BatteryWidgetSharedStore.load() {
            return BatteryEntry(date: Date(), snapshot: snapshot)
        }
        return .disconnected
    }
}
