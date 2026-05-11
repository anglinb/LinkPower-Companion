// Body content for the "Starlink Mini battery monitor for iPhone" post.
import { APP_STORE_URL } from "../../components/theme";
import type { FAQ } from "../../components/BlogShell";

export const faqs: FAQ[] = [
  {
    q: "How long does a PeakDo Link-Power 1 last with Starlink Mini?",
    a: "Roughly 3 hours of runtime. The LP1 is 99Wh and Starlink Mini draws ~30W at idle, more under load. Companion shows live runtime estimates that update as draw changes.",
  },
  {
    q: "How long does the Link-Power 2 last with Starlink Mini?",
    a: "Roughly 5–6 hours. The LP2 is 153Wh, again at typical Starlink Mini draw. Faster recharge than LP1 too.",
  },
  {
    q: "Does the app work while Starlink is using the battery?",
    a: "Yes. The app reads telemetry over Bluetooth, which doesn't conflict with the USB-C / DC output powering Starlink. You can monitor and adjust power limits live while Starlink is online.",
  },
  {
    q: "Does this work for Starlink Standard or only Mini?",
    a: "It's specifically for the PeakDo Link-Power family, which PeakDo markets for Starlink Mini (the smaller dish). Starlink Standard draws ~50–75W and would need a much larger power station.",
  },
];

export default function Body() {
  return (
    <>
      <p>
        If you&apos;re running <strong>Starlink Mini</strong> off a{" "}
        <strong>PeakDo Link-Power</strong> portable battery, you have
        two questions running constantly in the back of your head:
        <em>how much battery is left</em>, and <em>how long until I lose
        Starlink</em>. The answer to both lives on your battery&apos;s
        BLE chip — but only if your iPhone can read it.
      </p>

      <p>
        <a href="/" data-cta="hero">Link-Power Companion</a>{" "}
        is the iOS app for that. Live battery telemetry, runtime
        estimates that update as Starlink&apos;s draw changes, Lock
        Screen widget, and the option to remotely toggle DC output if
        you need to power-cycle the dish without crawling around the
        van.
      </p>

      <h2>Why Starlink Mini owners end up here</h2>

      <p>
        Starlink Mini draws around 30W at idle and spikes higher when
        downloading or under load. The PeakDo Link-Power family is one
        of the few portable power stations that&apos;s small enough to
        bring on the road and still gives you several hours of runtime:
      </p>

      <table>
        <thead>
          <tr>
            <th>Battery</th>
            <th>Capacity</th>
            <th>Approx Starlink runtime</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Link-Power 1 (LP1)</td>
            <td>99Wh</td>
            <td>~3 hours</td>
          </tr>
          <tr>
            <td>Link-Power 2 (LP2)</td>
            <td>153Wh</td>
            <td>~5–6 hours</td>
          </tr>
        </tbody>
      </table>

      <p>
        These are estimates. Real runtime depends on your draw, the
        ambient temperature, and how new the cells are. The point of
        having an app is you don&apos;t have to estimate — the battery
        itself reports the numbers and the app does the math.
      </p>

      <h2>What you want to see (and where to see it)</h2>

      <p>
        From most-glanceable to most-detailed:
      </p>

      <h3>Lock Screen widget — for your phone face-up on the dash</h3>

      <p>
        The widget shows level + runtime estimate + flow state.
        Color-coded green when charging from solar / AC, orange when
        Starlink is draining it. You don&apos;t unlock your phone to see
        whether the battery&apos;s holding steady; you just look.
      </p>

      <h3>Live Activity — for active travel days</h3>

      <p>
        When the app schedules a Live Activity, it sits on your Lock
        Screen and in the Dynamic Island while it&apos;s active. You see
        live wattage and time-to-full or time-remaining without entering
        the app at all.
      </p>

      <h3>Dashboard — for the deep dive</h3>

      <p>
        Open the app for the full picture: capacity, level, voltage,
        current, USB-C state, DC state, port temperature, runtime
        estimate. Updates are streamed from BLE notifications, not
        polled — so the numbers move as fast as your battery&apos;s
        firmware updates them, which is roughly once per second.
      </p>

      <h2>Power limits that protect Starlink</h2>

      <p>
        Starlink Mini ships with a 12V DC barrel cable, but you can also
        run it from USB-C PD at the right voltage. If you&apos;re
        running USB-C, the Link-Power lets you cap the output power so
        you don&apos;t accidentally exceed Starlink&apos;s spec.
      </p>

      <p>
        From the app, head to <strong>Power Limits</strong> and set:
      </p>

      <ul>
        <li>
          <strong>Output limit</strong> — the maximum wattage the USB-C
          port will deliver. Set this conservatively (45W or 60W) for
          Starlink Mini.
        </li>
        <li>
          <strong>Runtime limit</strong> — optional. Auto-cuts power
          after a configured runtime so you don&apos;t accidentally drain
          the whole battery overnight.
        </li>
      </ul>

      <p>
        Limits persist on the battery itself, so they&apos;re enforced
        whether or not your phone is connected.
      </p>

      <h2>Remote DC cycling — without leaving the front seat</h2>

      <p>
        Starlink Mini sometimes needs a power cycle when service drops.
        Normally you&apos;d crawl back, unplug the barrel cable, plug it
        in again, wait. With Companion you tap{" "}
        <strong>DC Port → Off</strong>, wait 5 seconds, tap{" "}
        <strong>On</strong>. Done.
      </p>

      <p>
        This is the kind of thing that&apos;s minor on day one and feels
        essential by day thirty.
      </p>

      <h2>Scheduled on/off — for solar-powered overnight setups</h2>

      <p>
        If you&apos;re running Starlink Mini off a Link-Power that
        recharges from a solar panel during the day, you probably want
        to <em>not</em> drain the battery overnight when you&apos;re
        asleep and not using the internet.
      </p>

      <p>
        Set a <strong>daily schedule</strong>: DC port on at 7am, DC
        port off at 11pm. The schedule runs on the device — your phone
        doesn&apos;t need to be in range when the timer fires. Detailed
        walkthrough in our{" "}
        <a
          href="/blog/schedule-peakdo-dc-port/"
          data-internal-to="schedule-peakdo-dc-port"
        >
          DC port scheduling guide
        </a>
        .
      </p>

      <h2>The honest comparison</h2>

      <p>
        I&apos;m going to compare to the alternatives an iPhone Starlink
        Mini owner is realistically choosing between.
      </p>

      <h3>PeakDo Web App via Bluefy</h3>

      <p>
        The official PeakDo solution on iPhone. Read more in our{" "}
        <a href="/blog/peakdo-without-bluefy/" data-internal-to="peakdo-without-bluefy">
          guide to using PeakDo without Bluefy
        </a>
        . Tl;dr: it works, but no Live Activities, no widgets,
        slow reconnection.
      </p>

      <h3>Starlink&apos;s own app</h3>

      <p>
        Shows Starlink status — connected, signal, throughput. Says
        nothing about your battery. Different problem.
      </p>

      <h3>Multimeter / clamp meter</h3>

      <p>
        Some folks measure wattage with an inline meter. Works, but no
        runtime estimate, no Lock Screen glance, no remote control. Use
        in addition, not instead.
      </p>

      <h3>Generic Bluetooth battery monitors (Renogy, Victron, etc.)</h3>

      <p>
        Excellent if you have a Renogy or Victron BMS. The PeakDo Link-
        Power has its own proprietary BLE protocol — you need a client
        that speaks it.
      </p>

      <h2>Setup: from unboxing to widget on Lock Screen</h2>

      <ol>
        <li>
          Charge your Link-Power once before first use.
        </li>
        <li>
          Connect Starlink Mini via USB-C or DC barrel.
        </li>
        <li>
          Install <strong>Link-Power Companion</strong> from the App
          Store.
        </li>
        <li>
          Open the app and pair to your battery.
        </li>
        <li>
          Long-press your Lock Screen → <strong>Customize</strong> →{" "}
          <strong>Add Widgets</strong> → search Link-Power → pick the
          widget size.
        </li>
        <li>
          Optional: in app settings, enable Live Activities so they auto-
          start on extended sessions.
        </li>
      </ol>

      <p>
        Total time: under five minutes if your iPhone is already on iOS
        17.
      </p>

      <h2>The bottom line</h2>

      <p>
        Running Starlink Mini off a portable battery means you&apos;re
        constantly making decisions about power. The information to make
        those decisions exists — it&apos;s sitting on your battery&apos;s
        BLE chip — and getting it onto your iPhone Lock Screen takes one
        free app.
      </p>

      <p>
        <a href={APP_STORE_URL} data-cta="body-end">
          <strong>Get Link-Power Companion free on the App Store →</strong>
        </a>
      </p>
    </>
  );
}
