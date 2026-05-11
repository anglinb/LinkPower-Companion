// Body content for the "Schedule PeakDo DC port" how-to post.
import { APP_STORE_URL } from "../../components/theme";
import type { FAQ } from "../../components/BlogShell";

export const faqs: FAQ[] = [
  {
    q: "How many timers can I schedule?",
    a: "Up to 6 active timers per device. Each can be one-shot, daily, weekly, or monthly. The 6-timer limit is set by the Link-Power firmware, not the app.",
  },
  {
    q: "Do schedules run when my phone is away?",
    a: "Yes. Schedules execute on the Link-Power device itself, not on your phone. Once you've sent a schedule via Bluetooth, your phone can be miles away — the timer still fires.",
  },
  {
    q: "What does scheduling actually control?",
    a: "The DC port output. When the schedule fires 'on', DC port output is enabled. When it fires 'off', the DC port shuts down. The USB-C port is always-on by default and isn't affected by these schedules.",
  },
  {
    q: "Can I schedule USB-C output?",
    a: "Not directly — the USB-C port doesn't support scheduling at the firmware level. You can set USB-C power limits and runtime caps, which provide some scheduled-like behavior. For automated USB-C control, run anything power-sensitive off the DC port instead.",
  },
  {
    q: "Will scheduled changes wake my Link-Power from standby?",
    a: "Yes. The Link-Power firmware keeps a low-power timer running even when in standby. Scheduled events wake the relevant subsystems just for the duration of the change.",
  },
];

export const howToSteps = [
  {
    name: "Open the app and connect",
    text: "Launch Link-Power Companion. Pair your device if it isn't already connected.",
  },
  {
    name: "Open the timer editor",
    text: "Tap the DC Port card on the dashboard, then tap Schedules. The timer editor lists existing schedules and lets you add new ones.",
  },
  {
    name: "Choose a schedule type",
    text: "Pick one-shot (fires once at a specific datetime), daily (every day at a time), weekly (specific days of the week), or monthly (specific days of the month).",
  },
  {
    name: "Set time and action",
    text: "Set the time, then choose whether the action is DC port On or DC port Off. Save.",
  },
  {
    name: "Verify the schedule",
    text: "The timer appears in the schedules list with the next fire time. The schedule lives on the device — your phone can be away when it fires.",
  },
];

export default function Body() {
  return (
    <>
      <p>
        The PeakDo Link-Power family supports up to six on-device
        schedules for the DC port. Set lights to come on at sunset, kill
        a heater overnight, cycle a router every Sunday at 3am — whatever
        rhythm your setup needs.
      </p>

      <p>
        This is the step-by-step.{" "}
        <a href="/" data-cta="hero">Link-Power Companion</a>{" "}
        is the iOS app — free on the App Store. iOS 17+ required.
      </p>

      <h2>What you can schedule</h2>

      <p>The Link-Power firmware exposes four schedule types:</p>

      <ul>
        <li>
          <strong>One-shot.</strong> Fires once at a specific date and
          time. Good for &quot;turn the heater off at 10pm tonight, then
          forget it.&quot;
        </li>
        <li>
          <strong>Daily.</strong> Fires every day at the same time.
          Lights at sunset, off at midnight.
        </li>
        <li>
          <strong>Weekly.</strong> Pick days of the week. Cycle a router
          every Sunday at 3am.
        </li>
        <li>
          <strong>Monthly.</strong> Pick days of the month. Long-interval
          maintenance reboots.
        </li>
      </ul>

      <p>
        Each schedule has an action: DC port <strong>On</strong> or{" "}
        <strong>Off</strong>. Most setups need both — one to turn
        something on, another to turn it off.
      </p>

      <h2>Setting up your first schedule</h2>

      <ol>
        <li>
          Open Link-Power Companion. Connect to your device if it
          isn&apos;t already.
        </li>
        <li>
          On the dashboard, tap the <strong>DC Port</strong> card.
        </li>
        <li>
          Tap <strong>Schedules</strong>. You&apos;ll see existing
          schedules (if any) and a button to add a new one.
        </li>
        <li>
          Tap <strong>Add Schedule</strong>. Choose your schedule type
          (one-shot, daily, weekly, monthly).
        </li>
        <li>
          Set the time. For weekly schedules, pick the days. For
          monthly, pick the day numbers (1–31).
        </li>
        <li>
          Choose the action: <strong>DC port On</strong> or{" "}
          <strong>DC port Off</strong>.
        </li>
        <li>
          Tap <strong>Save</strong>. The schedule appears in the list
          with its next fire time.
        </li>
      </ol>

      <p>
        Repeat for the off-schedule. Most use cases want a paired
        on-then-off. Daily lights, for example, are two schedules:
        on at 7pm daily, off at midnight daily.
      </p>

      <h2>Real-world recipes</h2>

      <h3>Vanlife heater on a cold night</h3>

      <ul>
        <li>One-shot, 10pm tonight, DC port On.</li>
        <li>One-shot, 6am tomorrow, DC port Off.</li>
      </ul>

      <p>
        You wake up to a battery that hasn&apos;t drained dry, and a van
        that&apos;s been heated. The schedule executes whether or not
        your phone is connected.
      </p>

      <h3>Off-grid lighting</h3>

      <ul>
        <li>Daily, sunset (e.g. 6:30pm), DC port On.</li>
        <li>Daily, midnight, DC port Off.</li>
      </ul>

      <p>
        Tip: PeakDo doesn&apos;t support sunset/sunrise as keywords —
        you have to pick a literal time. Adjust seasonally if your
        latitude has dramatic day-length swings.
      </p>

      <h3>Weekly router reboot</h3>

      <ul>
        <li>Weekly, Sunday 3am, DC port Off.</li>
        <li>Weekly, Sunday 3:05am, DC port On.</li>
      </ul>

      <p>
        Five minutes of downtime, fully off-grid, every Sunday. Good
        hygiene if your router runs hot.
      </p>

      <h3>Starlink Mini overnight cutoff</h3>

      <ul>
        <li>Daily, 11pm, DC port Off.</li>
        <li>Daily, 7am, DC port On.</li>
      </ul>

      <p>
        Saves about 8 hours × ~30W = 240Wh of battery overnight on
        Starlink Mini. Combine with{" "}
        <a
          href="/blog/starlink-mini-battery-monitor-iphone/"
          data-internal-to="starlink-mini-battery-monitor-iphone"
        >
          the Lock Screen widget
        </a>{" "}
        for at-a-glance state.
      </p>

      <h2>Editing or deleting schedules</h2>

      <p>
        From the schedules list, swipe left on a schedule to delete, or
        tap it to edit. Changes sync to the device immediately over
        Bluetooth. The 6-timer limit is enforced at save time.
      </p>

      <h2>Edge cases worth knowing</h2>

      <p>
        <strong>Schedule conflicts.</strong> If two schedules fire at
        the same exact second, the firmware processes them in
        registration order. Avoid stacking conflicting On/Off events at
        the same minute.
      </p>

      <p>
        <strong>Time zones.</strong> The Link-Power doesn&apos;t track
        timezone — it stores schedules as local time on the device, and
        the device clock is whatever you last synced from your phone.
        Open the app once after a timezone change to re-sync the device
        clock, otherwise schedules will fire at the old timezone&apos;s
        time.
      </p>

      <p>
        <strong>Standby vs. on.</strong> Schedules wake the DC subsystem
        as needed; the device doesn&apos;t need to be &quot;on&quot; in
        any user-visible sense for schedules to fire.
      </p>

      <p>
        <strong>Backup.</strong> Schedules are stored on the device. If
        you factory-reset, you lose them. Take a screenshot of your
        schedule list before any major maintenance.
      </p>

      <h2>Why schedule on the device, not on the phone</h2>

      <p>
        iOS doesn&apos;t reliably let third-party apps run in the
        background to fire scheduled BLE writes. Even if it did,
        you&apos;d lose schedules when your phone is off, lost, or out
        of range.
      </p>

      <p>
        By writing the schedule to the device once, the device&apos;s
        own micro-timer fires it independently. Your phone is the
        configuration tool, not a runtime dependency. This is one of the
        core reliability advantages over a Web App approach — schedules
        in the PWA depend on a browser tab being live, which is rarely
        the case.
      </p>

      <h2>Get the app</h2>

      <p>
        Scheduling is one of the features that genuinely changes how you
        use a portable power station. Five minutes to set up, then it
        runs forever.
      </p>

      <p>
        <a href={APP_STORE_URL} data-cta="body-end">
          <strong>Download Link-Power Companion free →</strong>
        </a>
      </p>
    </>
  );
}
