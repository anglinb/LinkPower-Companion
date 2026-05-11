// Body content for the "PeakDo iOS app" post. Rendered inside the
// shared <BlogShell>, which provides the hero, breadcrumbs, FAQ, CTA
// and related-posts grid. We intentionally keep the body component
// pure JSX (no MDX) to match the existing inline-style aesthetic.
import { APP_STORE_URL } from "../../components/theme";

import type { FAQ } from "../../components/BlogShell";

export const faqs: FAQ[] = [
  {
    q: "Does PeakDo make a native iPhone app?",
    a: "No. PeakDo ships a Web App at pwa.peakdo.ca that you launch from a special browser called Bluefy (since Safari doesn't support Web Bluetooth). Link-Power Companion is the unofficial native iOS app — built by the community and free on the App Store.",
  },
  {
    q: "Is Link-Power Companion safe to use?",
    a: "Yes. The app talks to your battery directly over Bluetooth — there are no servers, no analytics, and no accounts. The full source is MIT-licensed on GitHub if you want to audit it.",
  },
  {
    q: "Which devices are supported?",
    a: "Link-Power 1 (LP1, model BP4SL3V1), Link-Power 2 (LP2, BP4SL3V2), and Link-Power+ (LP+, BP4SL3). Different models expose different feature sets — the app shows what's available based on what's connected.",
  },
  {
    q: "Do I need to be near my power station to use it?",
    a: "Yes — it's Bluetooth, not internet. You need to be in BLE range (roughly 10 meters) to read telemetry or change settings. Scheduled timers run on the device itself, so they execute even when your phone is away.",
  },
  {
    q: "Can I try it without a Link-Power device?",
    a: "Yes. Demo Mode simulates a connected battery so you can explore every screen — telemetry, DC controls, scheduling, power limits — without any hardware.",
  },
];

export default function Body() {
  return (
    <>
      <p>
        Search &quot;PeakDo iOS app&quot; and you land on a Web App. Open
        the QR code on the back of your Link-Power and you get the same
        Web App, plus a recommendation to install a third-party browser
        called <strong>Bluefy</strong> because Safari can&apos;t talk to
        Bluetooth devices. It works, in the sense that you can read your
        battery state. It&apos;s also a janky experience for a $300+
        portable power station you bought to be reliable.
      </p>

      <p>
        This is the post for the search you just made.{" "}
        <a href="/" data-cta="hero">Link-Power Companion</a>{" "}
        is the native iOS app for the entire PeakDo Link-Power family —
        LP1, LP2, and LP+. It&apos;s a real app: live battery telemetry
        on a Lock Screen widget, Live Activity that updates while
        you&apos;re using the device, a real timer editor, real DC and
        USB-C controls. It&apos;s open source, it&apos;s free, and
        it&apos;s on the App Store.
      </p>

      <h2>Why PeakDo doesn&apos;t ship a native iOS app</h2>

      <p>
        PeakDo&apos;s engineers chose a Web App that uses{" "}
        <strong>Web Bluetooth</strong>, a browser API that lets a webpage
        talk directly to BLE devices. It&apos;s a clever way to ship one
        codebase across Android, desktop, and iOS without maintaining a
        native app per platform. There&apos;s a real engineering
        rationale.
      </p>

      <p>
        The catch: Safari doesn&apos;t implement Web Bluetooth, and Apple
        has no announced plans to. So on iPhone, PeakDo&apos;s solution
        falls back to <strong>Bluefy</strong> — a browser that does
        implement Web Bluetooth. You install Bluefy, paste the PWA URL,
        bookmark it, and there you go.
      </p>

      <p>What you trade away by going that route:</p>

      <ul>
        <li>
          <strong>Live Activities and Lock Screen widgets.</strong> These
          are iOS native features. A web page can&apos;t put a live
          battery readout on your Lock Screen. A native app can.
        </li>
        <li>
          <strong>Reliable BLE reconnection.</strong> Bluefy reconnects
          on a best-effort basis. A native app uses CoreBluetooth&apos;s
          background reconnection APIs and is more durable.
        </li>
        <li>
          <strong>Native UI conventions.</strong> The Web App is
          functional but it doesn&apos;t feel like an iPhone app — wrong
          fonts, wrong navigation, wrong gestures.
        </li>
        <li>
          <strong>App Store distribution.</strong> Updates ship through
          the App Store; you&apos;re not pasting URLs into Bluefy every
          time you set up a new device.
        </li>
      </ul>

      <h2>What Link-Power Companion is</h2>

      <p>
        It&apos;s a SwiftUI iPhone app written directly against
        Apple&apos;s CoreBluetooth framework. Zero third-party
        dependencies, zero analytics, zero accounts. Source is on
        GitHub.
      </p>

      <p>The features that matter day-to-day:</p>

      <ul>
        <li>
          <strong>One-tap BLE pairing.</strong> Scan, connect,
          auto-reconnect. Demo Mode if you want to poke around without
          hardware.
        </li>
        <li>
          <strong>Live battery dashboard.</strong> Capacity, level,
          voltage, current, runtime — streamed live from BLE
          notifications, not polled.
        </li>
        <li>
          <strong>DC port control.</strong> Toggle output, monitor
          power, flip on bypass mode for direct passthrough.
        </li>
        <li>
          <strong>USB-C insight.</strong> Charging vs. discharging
          state, port temperature, live wattage.
        </li>
        <li>
          <strong>Power limits.</strong> Configure global, input,
          output, and runtime caps from 30W to 100W.
        </li>
        <li>
          <strong>Smart scheduling.</strong> Up to 6 timers — one-shot,
          daily, weekly, monthly. Schedules execute on the device, so
          they fire even when your phone&apos;s in another room.
        </li>
        <li>
          <strong>Live Activities + Lock Screen widgets.</strong>{" "}
          Color-coded charging / discharging state, runtime estimate,
          live wattage. Glance, don&apos;t unlock.
        </li>
        <li>
          <strong>Date / time sync.</strong> Push your phone&apos;s
          clock to the device in one tap.
        </li>
        <li>
          <strong>Expert &amp; Dev modes.</strong> Restart, shutdown,
          factory mode, BLE PIN — for the people who want to actually
          dig in.
        </li>
      </ul>

      <p>
        <a href={APP_STORE_URL} data-cta="mid">
          <strong>Get Link-Power Companion on the App Store →</strong>
        </a>
      </p>

      <h2>What about the Web App? When is it the right choice?</h2>

      <p>
        I&apos;m not going to pretend the Web App is useless. It has
        real strengths:
      </p>

      <ul>
        <li>
          <strong>Cross-platform.</strong> Works on Android, Windows,
          macOS, ChromeOS — same codebase.
        </li>
        <li>
          <strong>No install for desktop users.</strong> Open Chrome,
          paste a URL, you&apos;re in.
        </li>
        <li>
          <strong>Official channel.</strong> If you only trust
          first-party software, the Web App is the only PeakDo-blessed
          option.
        </li>
      </ul>

      <p>
        Use the Web App if you primarily live on Android or you&apos;re
        configuring a device from a laptop. Use Link-Power Companion if
        you&apos;re on iPhone and you want the Lock Screen widget, the
        Live Activity, and a UI that doesn&apos;t require a third-party
        browser.
      </p>

      <h2>Privacy &amp; the &quot;unofficial&quot; question</h2>

      <p>
        Two things people ask in the App Store reviews and on GitHub:
      </p>

      <p>
        <strong>&quot;Is this PeakDo&apos;s app?&quot;</strong> No. It
        is not affiliated with, endorsed by, or supported by PeakDo
        Tech, Inc. We&apos;re an independent project that reverse-
        engineered the BLE protocol from PeakDo&apos;s public Web App
        sources. PeakDo and Link-Power are trademarks of their
        respective owners.
      </p>

      <p>
        <strong>&quot;What data leaves my phone?&quot;</strong> None.
        The app speaks the BLE protocol directly to your battery — no
        HTTP requests, no analytics SDK, no crash reporter calling home,
        no account system. Tasks, schedules, power limits — all stored
        locally. The full source is MIT-licensed on{" "}
        <a href="https://github.com/anglinb/LinkPower-Companion">GitHub</a>{" "}
        if you want to audit.
      </p>

      <h2>Quick start</h2>

      <ol>
        <li>
          Install <strong>Link-Power Companion</strong> from the App
          Store on iOS 17 or later.
        </li>
        <li>
          Power your Link-Power on. Confirm the BLE icon is showing on
          its screen (turn on Bluetooth from the device&apos;s menu if
          not).
        </li>
        <li>
          Open the app. Tap <strong>Scan</strong>. Tap your device when
          it appears.
        </li>
        <li>
          That&apos;s it. The dashboard streams live data, the Lock
          Screen widget appears after one minute of foreground use.
        </li>
      </ol>

      <p>
        We have a more thorough walkthrough on the{" "}
        <a href="/linkpower-1-quick-start/">LinkPower 1 Quick Start</a>{" "}
        and{" "}
        <a href="/linkpower-2-quick-start/">LinkPower 2 Quick Start</a>{" "}
        pages. If you&apos;re currently using the Web App via Bluefy and
        want to migrate, see{" "}
        <a
          href="/blog/peakdo-without-bluefy/"
          data-internal-to="peakdo-without-bluefy"
        >
          our guide to using PeakDo Link-Power on iPhone without Bluefy
        </a>
        .
      </p>

      <h2>The bottom line</h2>

      <p>
        PeakDo built capable hardware. Their Web-App-via-Bluefy approach
        is technically reasonable but feels rough on iPhone — and it
        leaves Live Activities, Lock Screen widgets, and CoreBluetooth
        reliability on the table. If you&apos;re on iOS,{" "}
        <a href="/" data-cta="closing">Link-Power Companion</a>{" "}
        is the answer.
      </p>

      <p>
        <a href={APP_STORE_URL} data-cta="body-end">
          <strong>Download Link-Power Companion free →</strong>
        </a>
      </p>
    </>
  );
}
