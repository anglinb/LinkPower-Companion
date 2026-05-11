// Body content for the "PeakDo without Bluefy" post.
import { APP_STORE_URL } from "../../components/theme";
import type { FAQ } from "../../components/BlogShell";

export const faqs: FAQ[] = [
  {
    q: "Why does PeakDo recommend Bluefy on iPhone?",
    a: "Because Safari doesn't implement Web Bluetooth, and PeakDo's official client is a Web App. Bluefy is a third-party browser that does implement Web Bluetooth, so it's the only way to use the PWA on iOS. It's a workaround, not a Safari fix.",
  },
  {
    q: "Will my battery still work if I delete Bluefy?",
    a: "Yes. The Bluetooth-controllable settings are stored on the Link-Power device itself, not in Bluefy. Once you've configured the device — power limits, schedules, etc — they persist regardless of which client you use to read or change them later.",
  },
  {
    q: "Does Link-Power Companion expose every setting Bluefy does?",
    a: "Plus more. Companion exposes everything the Web App / Bluefy can configure (power limits, DC control, scheduling, expert mode) and adds Live Activities, Lock Screen widgets, and CoreBluetooth-backed reliable reconnection.",
  },
  {
    q: "Can I use both at the same time?",
    a: "Only one Bluetooth client can hold a connection to a Link-Power device at a time. Switch between them by closing one before opening the other. There's no data migration needed — settings live on the device.",
  },
];

export default function Body() {
  return (
    <>
      <p>
        If you own a PeakDo Link-Power and you have an iPhone, you&apos;ve
        probably ended up using <strong>Bluefy</strong> — a third-party
        browser that PeakDo recommends because Safari doesn&apos;t
        support Web Bluetooth. It works. It&apos;s also slow to launch,
        loses connection on backgrounding, and looks nothing like an
        iPhone app.
      </p>

      <p>
        Here&apos;s the swap. Install{" "}
        <a href="/" data-cta="hero">Link-Power Companion</a>, the native
        iOS app for the LP1 / LP2 / LP+ family. Five minutes to migrate.
        You don&apos;t lose anything you set up in Bluefy — all the
        configurable settings live on the device itself.
      </p>

      <h2>What Bluefy actually is, briefly</h2>

      <p>
        Bluefy is an iPhone browser app that ships <strong>Web
        Bluetooth</strong> — the JavaScript API that lets a webpage talk
        to Bluetooth Low Energy devices. Safari doesn&apos;t implement
        it. Chrome on iOS technically can&apos;t either, because Apple
        forces all third-party browsers on iOS to use the Safari engine
        (WebKit). Bluefy gets around this by being purpose-built for the
        Web Bluetooth use case.
      </p>

      <p>
        PeakDo&apos;s app is a Progressive Web App at{" "}
        <code>pwa.peakdo.ca/link-power-1/</code>. On Chrome desktop or
        Android Chrome, it Just Works. On iPhone, you need Bluefy to make
        the BLE part work, and you bookmark or &quot;Add to Home
        Screen&quot; the URL inside Bluefy to use it.
      </p>

      <h2>Why a native app changes the experience</h2>

      <p>
        Three concrete things you can&apos;t do in a browser-based
        client, no matter how clever the JavaScript:
      </p>

      <h3>1. Live Activities</h3>

      <p>
        On iOS 16.1+, native apps can render a Live Activity — a
        persistent, real-time card on your Lock Screen and in the
        Dynamic Island. Link-Power Companion uses this to show charging
        state, current wattage, and runtime estimate without unlocking
        your phone.
      </p>

      <p>
        Web Apps can&apos;t do this. The closest a PWA gets is a banner
        notification.
      </p>

      <h3>2. Lock Screen + Home Screen widgets</h3>

      <p>
        WidgetKit is a native iOS framework. Companion ships small,
        medium, and large battery widgets that show level, runtime, and
        flow state — color-coded green for charging, orange for
        discharging.
      </p>

      <h3>3. Reliable background reconnection</h3>

      <p>
        CoreBluetooth (the native iOS BLE framework) supports
        background-mode reconnection. The OS will wake your app to
        reconnect to a known device when it comes back in range. Web
        Bluetooth in Bluefy doesn&apos;t — when you background the
        browser tab or the screen sleeps, the connection drops, and
        you&apos;re scanning again next time you open it.
      </p>

      <p>
        The user-visible result: with Bluefy, you wait 3–5 seconds
        between &quot;open the app&quot; and &quot;see your battery
        state.&quot; With Companion, it&apos;s instant for the previous
        session, and reconnection happens in the background.
      </p>

      <h2>Will I lose my settings?</h2>

      <p>
        No. Here&apos;s what lives where:
      </p>

      <table>
        <thead>
          <tr><th>Setting</th><th>Stored where</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>USB-C global / input / output / runtime power limits</td>
            <td>On the Link-Power device</td>
          </tr>
          <tr>
            <td>Scheduled DC port timers</td>
            <td>On the Link-Power device</td>
          </tr>
          <tr>
            <td>Device clock</td>
            <td>On the Link-Power device</td>
          </tr>
          <tr>
            <td>BLE PIN (if enabled)</td>
            <td>On the Link-Power device</td>
          </tr>
          <tr>
            <td>Bluefy bookmarks / cached PWA</td>
            <td>In Bluefy (irrelevant after migration)</td>
          </tr>
        </tbody>
      </table>

      <p>
        Translation: switch clients freely. Whatever you set up in
        Bluefy is already on the battery and will be visible the moment
        Companion connects.
      </p>

      <h2>Migration in 5 steps</h2>

      <ol>
        <li>
          Install <strong>Link-Power Companion</strong> from the App
          Store. iOS 17 or later.
        </li>
        <li>
          Close Bluefy completely (swipe up to the App Switcher and
          flick it away). Bluetooth lets exactly one client own a
          connection at a time.
        </li>
        <li>
          Open Companion. Tap <strong>Scan</strong>. Pick your device.
          Existing settings appear immediately.
        </li>
        <li>
          Optional: long-press your Lock Screen, tap{" "}
          <strong>Customize</strong>, and add a Link-Power widget for at-
          a-glance battery state.
        </li>
        <li>
          Optional: delete Bluefy. Your battery doesn&apos;t need it.
        </li>
      </ol>

      <p>
        <a href={APP_STORE_URL} data-cta="mid">
          <strong>Get Link-Power Companion →</strong>
        </a>
      </p>

      <h2>When you might still want Bluefy</h2>

      <p>
        I&apos;m being honest here. Two scenarios where Bluefy + the Web
        App is fine:
      </p>

      <ul>
        <li>
          <strong>You exclusively use a non-Apple device.</strong> The
          Web App is the cross-platform option PeakDo officially
          supports.
        </li>
        <li>
          <strong>You only ever change settings once at setup.</strong>{" "}
          If you set your power limits the day you unboxed the Link-
          Power and never look at it again, Bluefy is overkill but it
          works.
        </li>
      </ul>

      <p>
        For everyone else — vanlife rigs, off-grid setups, photographers
        running gear off the LP2, anyone with a Starlink Mini sipping
        from a Link-Power on a daily basis — the native app is a real
        upgrade.
      </p>

      <h2>One more thing</h2>

      <p>
        Companion is open source under MIT. If you don&apos;t trust
        third-party apps in your Bluetooth security perimeter, you can
        audit the source on GitHub before installing. PeakDo&apos;s Web
        App is more or less open too (the JavaScript ships to your
        browser), so this is parity, not asymmetry.
      </p>

      <p>
        Either way:
      </p>

      <p>
        <a href={APP_STORE_URL} data-cta="body-end">
          <strong>Try Link-Power Companion free →</strong>
        </a>
      </p>
    </>
  );
}
