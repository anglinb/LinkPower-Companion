// Comprehensive user manual for the Link-Power Companion app.
// Designed to render well on both the web (at /manual/) and as a PDF
// (rendered via headless Chrome — see scripts/generate-manual-pdf.mjs).
//
// Print-vs-screen design notes:
//   - On screen, this looks like a tall scrollable document with the
//     site Nav / Footer wrapped around it.
//   - For print, @media print rules hide Nav / Footer / CTAs, force
//     page breaks at chapters, and switch to A4 page size with
//     conservative margins.
//   - Cover page is always rendered as a single full page.
//   - Section numbering uses CSS counters so the TOC and section
//     headers stay in sync without hand-editing.
import type { Metadata } from "next";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { StoreLinks } from "../../components/StoreLinks";
import { THEME, SITE_URL } from "../../components/theme";

const PDF_URL = "/linkpower-companion-manual.pdf";

export const metadata: Metadata = {
  title: "User Manual — Link-Power Companion (PDF)",
  description:
    "Complete user manual for Link-Power Companion, the unofficial native iOS and Android app for the PeakDo Link-Power family of portable power stations. Free PDF download.",
  alternates: { canonical: "/manual/" },
  openGraph: {
    type: "article",
    siteName: "LinkPower App",
    title: "User Manual — Link-Power Companion (PDF)",
    description:
      "Complete user manual for Link-Power Companion (LP1, LP2, LP3, LP+). Connecting, dashboard, DC scheduling, power limits, troubleshooting.",
    url: `${SITE_URL}/manual/`,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Link-Power Companion user manual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User Manual — Link-Power Companion (PDF)",
    description:
      "Complete user manual for Link-Power Companion (LP1, LP2, LP3, LP+). Connecting, dashboard, DC scheduling, power limits, troubleshooting.",
    images: ["/og.png"],
  },
};

/* ------------------------------------------------------------------ */
/*  Section helpers                                                    */
/* ------------------------------------------------------------------ */

function Chapter({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="manual-chapter">
      <h2>
        <span className="chap-num">{num}</span>
        <span className="chap-title">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <aside className="manual-note">{children}</aside>;
}

function Warn({ children }: { children: React.ReactNode }) {
  return <aside className="manual-warn">{children}</aside>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ManualPage() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <div className="screen-only">
        <Nav />
      </div>

      {/* Toolbar — visible on web, hidden in print. */}
      <div className="screen-only manual-toolbar">
        <div className="manual-toolbar-inner">
          <div>
            <strong>Link-Power Companion — User Manual</strong>
            <span className="muted">v1 · {today}</span>
          </div>
          <div className="manual-toolbar-actions">
            <a className="btn primary" href={PDF_URL} download>
              ↓ Download PDF
            </a>
            <StoreLinks variant="prose" style={{ margin: 0 }} />
          </div>
        </div>
      </div>

      <article className="manual">
        {/* ------------- COVER ------------- */}
        <section className="manual-cover">
          <div className="cover-inner">
            <div className="cover-eyebrow">User Manual</div>
            <h1 className="cover-title">
              Link-Power Companion
              <br />
              <span className="cover-accent">User Manual</span>
            </h1>
            <p className="cover-sub">
              The unofficial native app for the PeakDo
              Link-Power family of portable power stations.
            </p>
            <div className="cover-meta">
              <div>
                <div className="cover-meta-label">Version</div>
                <div className="cover-meta-value">v1</div>
              </div>
              <div>
                <div className="cover-meta-label">Released</div>
                <div className="cover-meta-value">{today}</div>
              </div>
              <div>
                <div className="cover-meta-label">Devices</div>
                <div className="cover-meta-value">LP1 · LP2 · LP3 · LP+</div>
              </div>
            </div>
            <div className="cover-disclaimer">
              Unofficial. Not affiliated with, endorsed by, or supported by
              PeakDo Tech, Inc. Link-Power and PeakDo are trademarks of their
              respective owners.
            </div>
            <div className="cover-foot">
              linkpower.app · App Store ID 6762404390 · Google Play
              app.linkpower.companion
            </div>
          </div>
        </section>

        {/* ------------- TOC ------------- */}
        <section className="manual-toc page-break">
          <h2>Contents</h2>
          <ol>
            <li><a href="#what">1. About Link-Power Companion</a></li>
            <li><a href="#compat">2. Compatibility</a></li>
            <li><a href="#quickstart">3. Quick start</a></li>
            <li><a href="#connecting">4. Connecting to your device</a></li>
            <li><a href="#dashboard">5. Reading the dashboard</a></li>
            <li><a href="#dc">6. DC port control</a></li>
            <li><a href="#usbc">7. USB-C monitoring</a></li>
            <li><a href="#limits">8. Power limits</a></li>
            <li><a href="#scheduling">9. Scheduling DC on/off</a></li>
            <li><a href="#widgets">10. Live Activities &amp; widgets</a></li>
            <li><a href="#datesync">11. Date &amp; time sync</a></li>
            <li><a href="#expert">12. Expert &amp; Dev modes</a></li>
            <li><a href="#troubleshooting">13. Troubleshooting</a></li>
            <li><a href="#faq">14. Frequently asked questions</a></li>
            <li><a href="#privacy">15. Privacy</a></li>
            <li><a href="#support">16. Support</a></li>
          </ol>
        </section>

        {/* ------------- 1. ABOUT ------------- */}
        <Chapter num="1" title="About Link-Power Companion">
          <p>
            <strong>Link-Power Companion</strong> is a native phone app
            for the PeakDo Link-Power family of portable power
            stations: <strong>LP1</strong>, <strong>LP2</strong>, <strong>LP3</strong>, and{" "}
            <strong>LP+</strong>. It connects directly to your device
            over Bluetooth Low Energy (BLE), gives you live battery
            telemetry, and lets you control DC output, USB-C power
            limits, and scheduled on/off behaviour from your phone.
          </p>
          <p>
            PeakDo&apos;s official iPhone solution is a Web App you
            launch through a third-party browser called Bluefy, because
            Safari does not implement Web Bluetooth. Link-Power
            Companion replaces that workflow with a real native app,
            and adds platform features the Web App can&apos;t — widgets,
            notifications, and reliable background reconnection.
          </p>
          <p>
            The app is free to download, with yearly and lifetime purchase options
            shown in the app. Bluetooth monitoring needs no PeakDo account;
            optional remote monitoring uses PeakDo cloud sign-in.
          </p>
          <Warn>
            <strong>Unofficial.</strong> This app is not affiliated
            with, endorsed by, or supported by PeakDo Tech, Inc. Use
            at your own risk. The protocol was reverse-engineered from
            PeakDo&apos;s publicly-distributed Web App.
          </Warn>
        </Chapter>

        {/* ------------- 2. COMPATIBILITY ------------- */}
        <Chapter num="2" title="Compatibility">
          <p>Device compatibility is shown below. LP3 requires LinkPower for iOS 2.0 or later (not yet available on Android); available controls depend on firmware capability flags.</p>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Code</th>
                <th>Model</th>
                <th>Capabilities</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Link-Power 1</td>
                <td>LP1</td>
                <td><code>BP4SL3V1</code></td>
                <td>Battery, DC, USB-C, scheduled control, shutdown</td>
              </tr>
              <tr>
                <td>Link-Power 2</td>
                <td>LP2</td>
                <td><code>BP4SL3V2</code></td>
                <td>Battery, DC, USB-C, DC bypass, DC input</td>
              </tr>
              <tr>
                <td>Link-Power 3</td>
                <td>LP3</td>
                <td><code>BP4SL3V3</code></td>
                <td>iOS app 2.0+: battery and USB-C telemetry; controls depend on firmware flags</td>
              </tr>
              <tr>
                <td>Link-Power+</td>
                <td>LP+</td>
                <td><code>BP4SL3</code></td>
                <td>DC port control</td>
              </tr>
            </tbody>
          </table>
          <p>
            Different models expose different feature sets. The app
            shows the controls available for the connected device only;
            unsupported features are hidden automatically.
          </p>
          <p>
            <strong>Requirements:</strong> iPhone running iOS 17.0 or
            later, or Android 10 or later. Bluetooth permission is required
            (the app will prompt on first use). The iOS Simulator does not
            support Bluetooth, so you must run on a real device.
          </p>
        </Chapter>

        {/* ------------- 3. QUICK START ------------- */}
        <Chapter num="3" title="Quick start">
          <ol>
            <li>
              Install <strong>Link-Power Companion</strong> from the
              App Store or Google Play (search &quot;Link-Power Companion&quot;
              or tap the link on linkpower.app).
            </li>
            <li>
              Power on your Link-Power. Confirm the BLE icon is showing
              on its screen — if it&apos;s not, enable Bluetooth from
              the device&apos;s on-screen menu.
            </li>
            <li>
              Open the app. Allow Bluetooth permission when prompted.
            </li>
            <li>
              Tap <strong>Scan</strong>. Your device should appear
              within a few seconds; tap it to connect.
            </li>
            <li>
              The dashboard now shows live battery state, DC and USB-C
              status, and remaining runtime.
            </li>
          </ol>
          <Note>
            <strong>No device on hand?</strong> Tap <strong>Demo Mode</strong>{" "}
            on the connect screen to explore the entire app with
            simulated battery data — no hardware required.
          </Note>
        </Chapter>

        {/* ------------- 4. CONNECTING ------------- */}
        <Chapter num="4" title="Connecting to your device">
          <h3>4.1 First connection</h3>
          <p>
            On first launch, the app shows the <strong>Connection</strong>{" "}
            screen. Tap <strong>Scan</strong> to look for nearby
            Link-Power devices. Devices broadcast a BLE name based on
            their model — your LP2 will appear as something like
            &quot;LP2-XXXX&quot;.
          </p>
          <p>
            Tap your device in the list. The app pairs over BLE and
            transitions to the dashboard. Connection typically takes
            2–4 seconds.
          </p>

          <h3>4.2 Auto-reconnect</h3>
          <p>
            After a successful first connection, the app remembers your
            device and reconnects automatically the next time both are
            powered on and in BLE range. CoreBluetooth&apos;s state
            restoration APIs handle reconnection in the background, so
            opening the app on a device you&apos;ve paired before is
            usually instant.
          </p>

          <h3>4.3 Switching devices</h3>
          <p>
            To pair a different Link-Power, swipe down on the dashboard
            to disconnect, then tap <strong>Scan</strong> again. You
            can also tap the connection indicator in the top-left of
            the dashboard to bring up the device picker.
          </p>

          <h3>4.4 Demo Mode</h3>
          <p>
            Tap <strong>Demo Mode</strong> on the connect screen to
            simulate a connected battery. Demo Mode populates the
            dashboard with believable values, lets you toggle every
            control, and is useful for evaluating the app before
            buying hardware or for testing the UI.
          </p>

          <Warn>
            <strong>One client at a time.</strong> The Link-Power
            firmware allows only one Bluetooth client to hold a
            connection at a time. If you previously used the PeakDo
            Web App through Bluefy, close Bluefy completely (swipe up
            to App Switcher and flick it away) before opening this
            app.
          </Warn>
        </Chapter>

        {/* ------------- 5. DASHBOARD ------------- */}
        <Chapter num="5" title="Reading the dashboard">
          <p>
            The dashboard streams live data from BLE notifications,
            updated roughly once per second. Key fields:
          </p>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Meaning</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Battery level</td><td>State of charge as a percentage</td><td>%</td></tr>
              <tr><td>Capacity</td><td>Remaining energy in the cells</td><td>Wh</td></tr>
              <tr><td>Voltage</td><td>Battery pack voltage</td><td>V</td></tr>
              <tr><td>Current</td><td>Net current — positive = charging, negative = discharging</td><td>A</td></tr>
              <tr><td>Runtime</td><td>Estimated time to empty (when discharging) or full (when charging)</td><td>h:mm</td></tr>
              <tr><td>DC power</td><td>Live wattage flowing through the DC port</td><td>W</td></tr>
              <tr><td>USB-C power</td><td>Live wattage flowing through the USB-C port</td><td>W</td></tr>
              <tr><td>Temperature</td><td>USB-C port temperature</td><td>°C</td></tr>
            </tbody>
          </table>
          <p>
            Above the data cards, a flow strip shows the dominant
            direction — green when charging, orange when discharging,
            grey when idle.
          </p>
          <Note>
            The runtime estimate uses the current draw at this moment.
            If your draw changes (e.g. Starlink Mini downloading vs.
            idle), the runtime estimate updates within a few seconds.
          </Note>
        </Chapter>

        {/* ------------- 6. DC PORT CONTROL ------------- */}
        <Chapter num="6" title="DC port control">
          <p>
            The DC card lets you toggle the DC port on or off, monitor
            live wattage, and (on LP2) enable DC bypass for direct
            input-to-output passthrough.
          </p>
          <h3>6.1 Toggling DC output</h3>
          <p>
            Tap the large power switch in the DC card. The change is
            sent to the device immediately over BLE; the live wattage
            reading reflects the new state within one second.
          </p>
          <h3>6.2 DC bypass (supported firmware)</h3>
          <p>On LP3, the app only shows bypass control when the firmware advertises that capability.</p>
          <p>
            DC bypass routes the DC input directly to the DC output
            without buffering through the battery. Useful when
            you&apos;re powered by a constant DC source (solar panel
            in direct sun, vehicle alternator) and don&apos;t want to
            cycle the battery cells unnecessarily.
          </p>
          <Warn>
            DC bypass passes the input voltage directly. Make sure
            your output device tolerates the input voltage range
            before enabling.
          </Warn>
        </Chapter>

        {/* ------------- 7. USB-C ------------- */}
        <Chapter num="7" title="USB-C monitoring">
          <p>
            The USB-C card shows the current charge/discharge state,
            live wattage, port temperature, and (on LP1/LP2) lets you
            enable or disable output.
          </p>
          <p>On LP3, USB-C temperature may be absent while voltage, current, and power remain available. See the <a href="/linkpower-3-quick-start/">LP3 quick start</a> and <a href="/linkpower-3-connection-guide/">LP3 connection guide</a>. PeakDo’s Wi-Fi cloud setup is separate from Companion’s Bluetooth connection.</p>
          <h3>7.1 Charging vs discharging</h3>
          <p>
            USB-C is bidirectional. The card displays an arrow — down
            for charging the battery, up for powering an external
            device. Wattage and temperature update live.
          </p>
          <h3>7.2 Output toggle</h3>
          <p>
            The output toggle disables USB-C output without affecting
            the battery&apos;s ability to charge from USB-C. Useful for
            preventing accidental drain when you&apos;re not actively
            using a connected device.
          </p>
        </Chapter>

        {/* ------------- 8. POWER LIMITS ------------- */}
        <Chapter num="8" title="Power limits">
          <p>
            Configure global, input, output, and runtime power caps
            from 30W to 100W. Limits are stored on the Link-Power
            device itself and persist across connection drops.
          </p>
          <table>
            <thead>
              <tr><th>Limit</th><th>Effect</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Global</strong></td>
                <td>Maximum total wattage across all ports</td>
              </tr>
              <tr>
                <td><strong>Input</strong></td>
                <td>Maximum wattage the battery will accept while charging</td>
              </tr>
              <tr>
                <td><strong>Output</strong></td>
                <td>Maximum wattage delivered to a connected device on USB-C</td>
              </tr>
              <tr>
                <td><strong>Runtime</strong></td>
                <td>Auto-cuts power after the configured runtime, in hours</td>
              </tr>
            </tbody>
          </table>
          <h3>8.1 Setting a limit</h3>
          <p>
            Tap a limit row, drag the slider to the desired value, and
            tap <strong>Save</strong>. The value is sent to the device
            over BLE within one second and is enforced immediately.
          </p>
          <Note>
            <strong>Why output limits matter.</strong> If you&apos;re
            running gear that&apos;s sensitive to over-power (some
            small devices ship with USB-C PD that nominally requests
            higher wattage than the device actually wants), capping
            the output protects the device.
          </Note>
        </Chapter>

        {/* ------------- 9. SCHEDULING ------------- */}
        <Chapter num="9" title="Scheduling DC on/off">
          <p>
            Up to <strong>6 active timers</strong> per device, each
            executing a single action (DC port On or Off) at a
            scheduled time. The 6-timer limit is enforced by the
            Link-Power firmware.
          </p>
          <h3>9.1 Schedule types</h3>
          <ul>
            <li><strong>One-shot</strong> — fires once at a specific date and time.</li>
            <li><strong>Daily</strong> — fires every day at the same time.</li>
            <li><strong>Weekly</strong> — pick days of the week.</li>
            <li><strong>Monthly</strong> — pick days of the month (1–31).</li>
          </ul>
          <h3>9.2 Creating a schedule</h3>
          <ol>
            <li>Tap the <strong>DC Port</strong> card on the dashboard.</li>
            <li>Tap <strong>Schedules</strong>.</li>
            <li>Tap <strong>Add Schedule</strong>.</li>
            <li>Pick the type, set the time, choose the action (On / Off), and save.</li>
          </ol>
          <h3>9.3 Editing or deleting</h3>
          <p>
            Tap a schedule to edit; swipe left to delete. Changes sync
            to the device immediately.
          </p>
          <Note>
            <strong>Schedules execute on the device, not your phone.</strong>{" "}
            Once written, your phone can be miles away — the
            Link-Power&apos;s own micro-timer fires the schedule
            independently.
          </Note>
          <h3>9.4 Common recipes</h3>
          <table>
            <thead>
              <tr><th>Use case</th><th>Schedule pair</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Off-grid lighting</td>
                <td>Daily 6:30pm On + Daily 12:00am Off</td>
              </tr>
              <tr>
                <td>Starlink overnight cutoff</td>
                <td>Daily 11:00pm Off + Daily 7:00am On</td>
              </tr>
              <tr>
                <td>Weekly router reboot</td>
                <td>Weekly Sun 3:00am Off + Weekly Sun 3:05am On</td>
              </tr>
              <tr>
                <td>Heater overnight (one-shot)</td>
                <td>One-shot 10pm tonight On + One-shot 6am tomorrow Off</td>
              </tr>
            </tbody>
          </table>
        </Chapter>

        {/* ------------- 10. WIDGETS / LIVE ACTIVITIES ------------- */}
        <Chapter num="10" title="Live Activities & widgets">
          <p>
            Live Activities and Lock Screen / Home Screen widgets are
            iOS-native features that the PeakDo Web App can&apos;t use.
            Both show live battery state without requiring you to open
            the app.
          </p>
          <h3>10.1 Lock Screen / Home Screen widgets</h3>
          <p>
            Long-press an empty area on your Lock Screen or Home
            Screen, tap <strong>Customize</strong> or{" "}
            <strong>+ Add Widget</strong>, search{" "}
            <strong>Link-Power</strong>, and pick a size. Widgets
            update via WidgetKit several times an hour, faster when
            the app has been recently active.
          </p>
          <h3>10.2 Live Activities</h3>
          <p>
            When enabled (Settings → Notifications → Link-Power
            Companion → Live Activities), the app pins a live battery
            card to your Lock Screen and Dynamic Island when you have
            an active session. Useful during long off-grid trips.
          </p>
          <h3>10.3 Color coding</h3>
          <ul>
            <li><strong>Green</strong> — charging</li>
            <li><strong>Orange</strong> — discharging</li>
            <li><strong>Grey</strong> — idle</li>
          </ul>
        </Chapter>

        {/* ------------- 11. DATE SYNC ------------- */}
        <Chapter num="11" title="Date & time sync">
          <p>
            The Link-Power has its own internal clock that drives
            scheduled events. The app provides a one-tap sync that
            pushes your iPhone&apos;s current time and timezone to the
            device.
          </p>
          <p>
            <strong>Settings → Sync date &amp; time</strong>
          </p>
          <p>
            Sync after a timezone change (e.g. you flew to a different
            country and your existing schedules need to fire at the
            new local time). The device does not track timezone
            independently — schedules are interpreted as local time
            relative to whatever clock you last synced.
          </p>
        </Chapter>

        {/* ------------- 12. EXPERT / DEV ------------- */}
        <Chapter num="12" title="Expert & Dev modes">
          <p>
            Expert and Dev modes expose advanced controls. They are
            hidden by default; enable them in{" "}
            <strong>Settings → Advanced</strong>.
          </p>
          <h3>12.1 Restart</h3>
          <p>
            Soft-restart the Link-Power. The device reboots its
            controller while preserving battery state.
          </p>
          <h3>12.2 Shutdown (LP1 only)</h3>
          <p>
            Fully shut the device down. Wakes via the physical power
            button.
          </p>
          <h3>12.3 Factory mode</h3>
          <p>
            Resets all firmware-stored settings (power limits,
            schedules, BLE PIN). Battery cells and firmware version are
            preserved.
          </p>
          <Warn>
            Factory reset is irreversible from the app. Take a
            screenshot of your schedule list before triggering it.
          </Warn>
          <h3>12.4 BLE PIN</h3>
          <p>
            Optionally set a 6-digit PIN that the device will require
            on every BLE pairing. Useful in shared environments. PIN
            verification happens once per connection — once paired,
            you don&apos;t re-enter it.
          </p>
        </Chapter>

        {/* ------------- 13. TROUBLESHOOTING ------------- */}
        <Chapter num="13" title="Troubleshooting">
          <h3>13.1 Device doesn&apos;t appear during scan</h3>
          <ul>
            <li>Confirm the BLE icon is visible on the device&apos;s screen.</li>
            <li>Confirm Bluetooth is on in iOS Settings.</li>
            <li>Confirm no other client (Bluefy, another phone) is currently connected — only one client at a time.</li>
            <li>Move within ~5 meters of the device while pairing for the first time.</li>
            <li>Force-quit the app (App Switcher → swipe up) and re-open.</li>
          </ul>
          <h3>13.2 Connection drops randomly</h3>
          <ul>
            <li>Range — BLE drops past ~10 meters or through walls. Move closer.</li>
            <li>Interference from other 2.4 GHz devices (microwaves, baby monitors).</li>
            <li>Device firmware needs a restart — try Expert Mode → Restart.</li>
          </ul>
          <h3>13.3 Schedules aren&apos;t firing</h3>
          <ul>
            <li>Check the device clock is correct — re-sync via{" "}
              <strong>Settings → Sync date &amp; time</strong>.
            </li>
            <li>Confirm the schedule is shown as &quot;active&quot; in the schedules list.</li>
            <li>If you&apos;ve changed time zone recently, schedules fire in the device&apos;s last-synced timezone — sync again.</li>
          </ul>
          <h3>13.4 Live Activity didn&apos;t appear</h3>
          <ul>
            <li>Settings → Notifications → Link-Power Companion → Live Activities must be ON.</li>
            <li>Live Activities can be silenced by Focus modes.</li>
            <li>iOS limits the number of simultaneous Live Activities; close others if needed.</li>
          </ul>
          <h3>13.5 Widget shows stale data</h3>
          <p>
            WidgetKit on iOS limits how often a widget can update.
            Open the app to force a refresh — the widget reads the
            latest cached state on next paint.
          </p>
        </Chapter>

        {/* ------------- 14. FAQ ------------- */}
        <Chapter num="14" title="Frequently asked questions">
          <h3>Is this the official PeakDo app?</h3>
          <p>
            No. PeakDo&apos;s official iOS solution is a Web App you
            launch through Bluefy. This app is an independent,
            community-built native app alternative.
          </p>
          <h3>What data leaves my phone?</h3>
          <p>
            Bluetooth monitoring connects directly to the battery without a PeakDo account. Optional cloud monitoring uses PeakDo services; purchases and paywall usage use Superwall. Support submissions can include diagnostic logs. See the privacy policy for details.
          </p>
          <h3>Why is the iOS Simulator unsupported?</h3>
          <p>
            iOS Simulator does not implement Bluetooth. Run on a real
            iPhone.
          </p>
          <h3>Can I run this and the PeakDo Web App at the same time?</h3>
          <p>
            No. Only one Bluetooth client can hold a connection to a
            Link-Power at a time. Close Bluefy fully before opening
            this app.
          </p>
          <h3>Will my settings transfer if I switch from Bluefy?</h3>
          <p>
            All firmware-stored settings (power limits, schedules,
            device clock, BLE PIN) live on the Link-Power itself, so
            they&apos;re visible to either client. There is nothing to
            migrate.
          </p>
        </Chapter>

        {/* ------------- 15. PRIVACY ------------- */}
        <Chapter num="15" title="Privacy">
          <p>
            Bluetooth monitoring works without a PeakDo account. Optional cloud
            monitoring uses PeakDo services. Purchases and paywall usage use
            Superwall. Support requests include the diagnostic data described
            before submission.
          </p>
          <p>
            Read the current privacy policy at <a href="/privacy/">linkpower.app/privacy</a>
            for data collection, providers, retention, and deletion requests.
          </p>
        </Chapter>

        {/* ------------- 16. SUPPORT ------------- */}
        <Chapter num="16" title="Support">
          <p>
            Bug reports, feature requests, and questions are welcome via
            our support page at <code>linkpower.app/support</code>.
          </p>
          <p>
            For PeakDo hardware questions (the device itself, not the
            app), please contact PeakDo support at{" "}
            <code>peakdo.com</code>.
          </p>
          <Warn>
            Because this app is unofficial, we cannot help with
            warranty, returns, firmware updates pushed by PeakDo, or
            any hardware issue. App-side issues — connection bugs,
            UI problems, missing features — are absolutely in scope.
          </Warn>
        </Chapter>

        {/* ------------- BACK COVER ------------- */}
        <section className="manual-backcover page-break">
          <div>
            <div className="back-mark">⚡</div>
            <p className="back-tag">linkpower.app</p>
            <p className="back-meta">
              Free to download · In-app purchases
              <br />
              iOS 17+ · Android 10+
            </p>
          </div>
        </section>
      </article>

      <div className="screen-only">
        <Footer />
      </div>

      {/* Inline styles. Big-but-bounded. Print rules at the bottom. */}
      <style>{`
        /* ---------- toolbar ---------- */
        .manual-toolbar {
          background: ${THEME.blueWash};
          border-bottom: 1px solid ${THEME.hairline};
          padding: 16px 24px;
        }
        .manual-toolbar-inner {
          max-width: 920px;
          margin: 0 auto;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
        }
        .manual-toolbar-inner .muted { color: ${THEME.muted}; margin-left: 10px; font-weight: 500; }
        .manual-toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
        }
        .btn.primary { background: ${THEME.blueDeep}; color: #fff; }
        .btn.ghost {
          background: transparent;
          color: ${THEME.blueDeep};
          border: 1.5px solid ${THEME.blueDeep};
        }

        /* ---------- manual container ---------- */
        .manual {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 32px 80px;
          font-size: 15px;
          line-height: 1.65;
          color: ${THEME.inkSoft};
          counter-reset: chapter;
        }

        /* ---------- cover ---------- */
        .manual-cover {
          background: linear-gradient(165deg, ${THEME.near} 0%, #0E2236 55%, ${THEME.blueDeep} 100%);
          color: #fff;
          border-radius: 24px;
          padding: 64px 48px 56px;
          margin-bottom: 56px;
          position: relative;
          overflow: hidden;
        }
        .manual-cover::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at top, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at top, black 40%, transparent 80%);
        }
        .cover-inner { position: relative; z-index: 1; }
        .cover-eyebrow {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${THEME.blueSoft};
          margin-bottom: 12px;
        }
        .cover-title {
          font-size: 64px;
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          margin: 0 0 18px;
        }
        .cover-accent {
          background: linear-gradient(135deg, ${THEME.charging} 0%, #5DB1E0 50%, ${THEME.discharging} 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .cover-sub {
          font-size: 18px;
          line-height: 1.5;
          color: rgba(255,255,255,0.78);
          max-width: 460px;
          margin: 0 0 36px;
          font-weight: 500;
        }
        .cover-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 32px;
          margin-bottom: 32px;
          max-width: 480px;
        }
        .cover-meta-label {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .cover-meta-value {
          font-size: 16px;
          font-weight: 700;
          margin-top: 2px;
        }
        .cover-disclaimer {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          line-height: 1.55;
          padding: 12px 14px;
          background: rgba(255,255,255,0.04);
          border-left: 3px solid ${THEME.discharging};
          border-radius: 6px;
          margin-bottom: 24px;
          max-width: 540px;
        }
        .cover-foot {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: 0.04em;
        }

        /* ---------- TOC ---------- */
        .manual-toc {
          margin-bottom: 48px;
        }
        .manual-toc h2 {
          font-size: 22px;
          font-weight: 900;
          color: ${THEME.ink};
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .manual-toc ol {
          list-style: none;
          padding: 0;
          margin: 0;
          columns: 2;
          column-gap: 32px;
        }
        .manual-toc li {
          margin: 0 0 6px;
          break-inside: avoid;
          font-size: 14px;
        }
        .manual-toc a {
          color: ${THEME.blueDeep};
          text-decoration: none;
        }
        .manual-toc a:hover { text-decoration: underline; }

        /* ---------- chapter ---------- */
        .manual-chapter { margin: 48px 0; }
        .manual-chapter h2 {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.025em;
          color: ${THEME.ink};
          margin: 0 0 16px;
          line-height: 1.15;
          border-bottom: 2px solid ${THEME.hairline};
          padding-bottom: 8px;
          display: flex;
          gap: 14px;
          align-items: baseline;
        }
        .chap-num {
          color: ${THEME.blueDeep};
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 22px;
          font-weight: 800;
        }
        .manual-chapter h3 {
          font-size: 17px;
          font-weight: 800;
          color: ${THEME.ink};
          letter-spacing: -0.01em;
          margin: 24px 0 8px;
        }
        .manual-chapter p {
          margin: 0 0 14px;
        }
        .manual-chapter ul,
        .manual-chapter ol {
          margin: 0 0 16px;
          padding-left: 22px;
        }
        .manual-chapter li {
          margin-bottom: 4px;
        }
        .manual-chapter li::marker { color: ${THEME.blue}; }
        .manual-chapter strong { color: ${THEME.ink}; }
        .manual-chapter code {
          background: ${THEME.blueWash};
          color: ${THEME.blueDeep};
          padding: 2px 6px;
          border-radius: 5px;
          border: 1px solid ${THEME.hairline};
          font-size: 13px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        /* ---------- table ---------- */
        .manual-chapter table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin: 16px 0;
          background: #fff;
          border: 1px solid ${THEME.hairline};
          border-radius: 8px;
          overflow: hidden;
        }
        .manual-chapter thead {
          background: ${THEME.blueWash};
        }
        .manual-chapter th {
          text-align: left;
          padding: 10px 12px;
          font-weight: 800;
          color: ${THEME.ink};
          border-bottom: 1px solid ${THEME.hairline};
        }
        .manual-chapter td {
          padding: 10px 12px;
          border-bottom: 1px solid ${THEME.hairline};
          vertical-align: top;
        }
        .manual-chapter tr:last-child td { border-bottom: none; }

        /* ---------- callouts ---------- */
        .manual-note,
        .manual-warn {
          margin: 16px 0;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          line-height: 1.55;
          color: ${THEME.ink};
        }
        .manual-note {
          background: ${THEME.blueWash};
          border-left: 4px solid ${THEME.blue};
        }
        .manual-warn {
          background: #FFF5EC;
          border-left: 4px solid ${THEME.discharging};
        }
        .manual-note strong,
        .manual-warn strong { color: ${THEME.ink}; }

        /* ---------- back cover ---------- */
        .manual-backcover {
          margin-top: 56px;
          background: ${THEME.near};
          color: #fff;
          border-radius: 24px;
          padding: 64px 48px;
          text-align: center;
          min-height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .back-mark { font-size: 56px; margin-bottom: 16px; }
        .back-tag { font-size: 22px; font-weight: 800; margin: 0 0 12px; }
        .back-meta { color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.6; margin: 0; }

        /* ====================================================
           PRINT STYLES — kicks in for headless Chrome PDF too
           ==================================================== */
        /* Letter, with zero physical page margins. We let .manual
           handle the visible padding instead of @page margins because
           headless Chrome viewport-to-page width math gets confused
           by @page margins, causing right-edge clipping. */
        @page {
          size: letter;
          margin: 0;
          @bottom-center {
            content: "Link-Power Companion · User Manual · Page " counter(page);
            font-family: ui-rounded, system-ui, sans-serif;
            font-size: 9pt;
            color: #94A3B8;
          }
        }
        @page :first {
          margin: 0;
          @bottom-center { content: ""; }
        }
        @page backcover {
          margin: 0;
          @bottom-center { content: ""; }
        }

        @media print {
          .screen-only { display: none !important; }
          body { background: #fff !important; }
          html, body { width: 8.5in; }
          .manual {
            /* Pin to a width that we know fits the printable area
               (Chrome will lay out content at this width, then print
               1:1 inside the 8.5in page). */
            width: 8.5in;
            max-width: 8.5in;
            margin: 0;
            /* Inner padding takes the role of @page margin. Leaves
               ~7.3in of usable content width. */
            padding: 0.6in 0.6in;
            font-size: 10.5pt;
            line-height: 1.5;
            color: #0F172A;
            box-sizing: border-box;
            word-wrap: break-word;
            overflow-wrap: anywhere;
          }
          .manual *,
          .manual *::before,
          .manual *::after { box-sizing: border-box; }
          .manual code { word-break: break-all; }

          /* Cover gets a full bleed page. Negative margin pulls past
             the .manual padding so the gradient hits the page edge. */
          .manual-cover {
            margin: -0.6in -0.6in 0;
            padding: 1.2in 0.8in;
            border-radius: 0;
            min-height: 11in;
            page-break-after: always;
            display: flex;
            align-items: center;
          }
          .cover-title { font-size: 56pt; }
          .cover-sub { font-size: 14pt; }

          .manual-toc { page-break-after: always; }

          /* Each chapter starts on a new page */
          .manual-chapter {
            page-break-before: always;
            margin: 0 0 24pt;
            padding-top: 24pt;
          }
          .manual-chapter h2 {
            font-size: 18pt;
            margin: 0 0 12pt;
          }
          .manual-chapter h3 {
            font-size: 12pt;
          }

          /* Back cover mirrors the front: full-bleed, occupies the
             entire page height, no page-number footer (we strip
             via the page selector below). */
          .manual-backcover {
            page-break-before: always;
            page: backcover;
            min-height: 11in;
            border-radius: 0;
            margin: 0 -0.6in -0.6in;
            padding: 0;
          }

          /* Avoid splitting tables across pages */
          .manual-chapter table { page-break-inside: avoid; }

          /* Drop hover-only states */
          a, a:hover { color: #0E5285 !important; text-decoration: none; }
          code { background: #F2F5F8 !important; }
        }

        /* Forced page-breaks on screen do nothing visible, but still
           segment the document semantically. */
        .page-break { break-before: page; }
      `}</style>
    </main>
  );
}
