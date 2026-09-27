import type { ReactNode } from "react";
import Script from "next/script";
import { StoreLinks } from "../../components/StoreLinks";

/* =========================================================================
   LinkPower 1 Quick Start — Help / Guide page
   Distilled from PeakDo's official LinkPower-1 Quick Start v1.7 PDF.
   Same Apple-Health-inspired palette as the home page.
   ========================================================================= */

const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  blueDarker: "#093A60",
  blueSoft: "#B8D4E8",
  blueWash: "#E6F0F8",
  mist: "#F2F5F8",
  cloud: "#FFFFFF",
  ink: "#0F172A",
  inkSoft: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  hairline: "#E5EAF1",
  charging: "#34C759",
  discharging: "#FF9500",
  amber: "#FFB020",
  warning: "#DC2626",
  near: "#0A1320",
} as const;

const SITE_URL = "https://linkpower.app";
const PDF_URL =
  "https://images.51microshop.com/15666/user_guide/LinkPower-1_quick_start_v1.7.pdf";

/* Reusable nav copied from the home page so the help page feels native. */
function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        background: "rgba(255,255,255,0.72)",
        borderBottom: `1px solid ${THEME.hairline}`,
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              overflow: "hidden",
              display: "inline-block",
              boxShadow: "0 1px 2px rgba(15,23,42,0.15)",
              background: "#fff",
            }}
          >
            <img
              src="/app-icon-fg.png"
              alt=""
              width={32}
              height={32}
              style={{ display: "block" }}
            />
          </span>
          <span
            className="lp-brand-text"
            style={{
              fontWeight: 800,
              color: THEME.ink,
              fontSize: 16,
              letterSpacing: "-0.01em",
            }}
          >
            Link-Power Companion
          </span>
        </a>
        <nav
          className="lp-nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <a
            className="lp-nav-link"
            href="/#features"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Features
          </a>
          <a
            className="lp-nav-link"
            href="/#devices"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Devices
          </a>
          <a
            className="lp-nav-link"
            href="/#faq"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            FAQ
          </a>
          <StoreLinks variant="nav" linkClassName="lp-nav-cta" />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(165deg, ${THEME.cloud} 0%, ${THEME.blueWash} 70%, ${THEME.blueSoft} 100%)`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${THEME.blueDeep} 1px, transparent 1px), linear-gradient(90deg, ${THEME.blueDeep} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.05,
          maskImage:
            "radial-gradient(ellipse at top, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 40%, transparent 80%)",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 880,
          margin: "0 auto",
          padding: "72px 24px 56px",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: THEME.blueDeep,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Help · LinkPower 1 · v1.7
        </div>
        <h1
          className="lp-help-hero-headline"
          style={{
            fontSize: "clamp(36px, 5.5vw, 60px)",
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            color: THEME.ink,
            margin: "0 0 16px",
          }}
        >
          LinkPower 1 Quick Start Guide
        </h1>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.55,
            color: THEME.inkSoft,
            margin: "0 0 24px",
            fontWeight: 500,
            maxWidth: 720,
          }}
        >
          Everything you need to activate, set up, and operate the PeakDo{" "}
          <strong style={{ color: "inherit" }}>LinkPower 1</strong> — the 99Wh
          power bank purpose-built for the{" "}
          <strong style={{ color: "inherit" }}>Starlink<sup>®</sup> Mini</strong>.
          Distilled from the official Quick Start manual (v1.7).
        </p>

        <div
          className="lp-help-hero-actions"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          <StoreLinks
            variant="hero"
            appleLabel="Get the iOS app"
            androidLabel="Get the Android app"
          />
          <a
            href={PDF_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.7)",
              color: THEME.ink,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              border: `1px solid ${THEME.hairline}`,
            }}
          >
            Original PDF (PeakDo)
          </a>
          <a
            href="/linkpower-2-quick-start/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.7)",
              color: THEME.ink,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              border: `1px solid ${THEME.hairline}`,
            }}
          >
            LinkPower 2 guide →
          </a>
        </div>
      </div>
    </section>
  );
}

function Toc() {
  const items: { id: string; label: string }[] = [
    { id: "introduction", label: "Introduction" },
    { id: "in-the-box", label: "What's in the Box" },
    { id: "device-overview", label: "Device Overview" },
    { id: "setup", label: "Setup & Activation" },
    { id: "charging", label: "Charging" },
    { id: "power-bank", label: "Use as a Power Bank" },
    { id: "lcd", label: "Status Screen (LCD)" },
    { id: "dc-port", label: "Manually Controlling the DC Port" },
    { id: "shutdown", label: "Shutting Down" },
    { id: "web-app", label: "Web App" },
    { id: "ios-app", label: "Native App" },
    { id: "troubleshooting", label: "Troubleshooting" },
    { id: "specs", label: "Specifications" },
    { id: "faq", label: "FAQ" },
  ];
  return (
    <nav
      aria-label="On this page"
      style={{
        background: "#fff",
        border: `1px solid ${THEME.hairline}`,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: THEME.blue,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        On this page
      </div>
      <ol
        className="lp-help-toc"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "8px 20px",
          counterReset: "toc",
        }}
      >
        {items.map((it) => (
          <li
            key={it.id}
            style={{
              fontSize: 14,
              color: THEME.inkSoft,
              counterIncrement: "toc",
            }}
          >
            <a
              href={`#${it.id}`}
              style={{
                color: THEME.inkSoft,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: "clamp(26px, 3vw, 34px)",
        fontWeight: 900,
        color: THEME.ink,
        letterSpacing: "-0.025em",
        lineHeight: 1.15,
        margin: "56px 0 16px",
        scrollMarginTop: 80,
      }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 20,
        fontWeight: 800,
        color: THEME.ink,
        letterSpacing: "-0.015em",
        margin: "28px 0 10px",
      }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontSize: 16,
        lineHeight: 1.65,
        color: THEME.inkSoft,
        margin: "0 0 14px",
      }}
    >
      {children}
    </p>
  );
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul
      style={{
        margin: "0 0 18px",
        padding: "0 0 0 22px",
        color: THEME.inkSoft,
        fontSize: 16,
        lineHeight: 1.65,
      }}
    >
      {children}
    </ul>
  );
}

function OL({ children }: { children: ReactNode }) {
  return (
    <ol
      style={{
        margin: "0 0 18px",
        padding: "0 0 0 22px",
        color: THEME.inkSoft,
        fontSize: 16,
        lineHeight: 1.65,
      }}
    >
      {children}
    </ol>
  );
}

function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "note";
  title: string;
  children: ReactNode;
}) {
  const palette =
    tone === "warning"
      ? { bg: "#FEF2F2", border: "#FCA5A5", color: THEME.warning }
      : tone === "note"
        ? { bg: "#FFFBEB", border: "#FDE68A", color: "#92400E" }
        : { bg: THEME.blueWash, border: THEME.blueSoft, color: THEME.blueDeep };

  return (
    <div
      role="note"
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        padding: "14px 16px",
        margin: "12px 0 20px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: palette.color,
          marginBottom: 4,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 15,
          color: THEME.inkSoft,
          lineHeight: 1.55,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: ReactNode }) {
  return (
    <tr style={{ borderBottom: `1px solid ${THEME.hairline}` }}>
      <th
        scope="row"
        style={{
          textAlign: "left",
          padding: "12px 14px",
          fontWeight: 700,
          color: THEME.ink,
          fontSize: 14,
          background: THEME.mist,
          width: "40%",
          verticalAlign: "top",
        }}
      >
        {k}
      </th>
      <td
        style={{
          padding: "12px 14px",
          fontSize: 14,
          color: THEME.inkSoft,
          lineHeight: 1.55,
          verticalAlign: "top",
        }}
      >
        {v}
      </td>
    </tr>
  );
}

function Body() {
  return (
    <article
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "32px 24px 80px",
      }}
    >
      <Toc />

      <H2 id="introduction">Introduction</H2>
      <p>Using the newer model? See the <a href="/linkpower-3-quick-start/">LinkPower 3 quick-start guide</a>.</p>
      <P>
        Meet the <strong>LinkPower 1</strong> — a compact, high-efficiency
        power bank designed exclusively for the Starlink<sup>®</sup> Mini. With
        a 99Wh battery, LinkPower 1 delivers <strong>over 4 hours</strong> of
        continuous runtime so you can keep your internet connection alive even
        in remote locations.
      </P>
      <P>
        LinkPower 1 supports USB-C bidirectional power delivery. The USB-C port
        delivers up to <strong>65W</strong> of output by default, perfect for
        powering your phone, laptop, and other USB-C devices. It can also{" "}
        <strong>power the Starlink Mini while charging itself</strong> via the
        USB-C port — ensuring uninterrupted operation when you need it most.
      </P>
      <P>
        A simple long press of the power button turns the DC output on or off,
        which in turn powers the Starlink Mini on or off.
      </P>
      <Callout tone="note" title="Note">
        Before using LinkPower 1 for the first time, you must{" "}
        <strong>activate it</strong>. See the{" "}
        <a href="#setup" style={{ color: THEME.blue }}>
          Setup
        </a>{" "}
        section below.
      </Callout>

      <H2 id="in-the-box">What&rsquo;s in the Box</H2>
      <UL>
        <li>LinkPower 1 power bank</li>
        <li>DC-to-DC cable (LinkPower 1 ↔ Starlink Mini)</li>
        <li>USB Type-C to Type-C cable</li>
      </UL>

      <H2 id="device-overview">Device Overview</H2>
      <P>The LinkPower 1 has the following ports and controls:</P>
      <UL>
        <li>
          <strong>DC Port</strong> — output to the Starlink Mini.{" "}
          <em>Output only.</em>
        </li>
        <li>
          <strong>Type-C PD Port</strong> — bidirectional input and output, up
          to 65W (configurable up to 140W in the Web App).
        </li>
        <li>
          <strong>1.47&Prime; LCD</strong> — battery level, runtime, and live
          power readouts.
        </li>
        <li>
          <strong>LED indicator</strong> — pulses gently when the DC port is
          enabled.
        </li>
        <li>
          <strong>Power Button</strong> — short press, long press (2s), and
          extended press (10s) for different functions.
        </li>
        <li>
          <strong>1/4&Prime; screw holes</strong> (×3) — standard tripod /
          mount thread.
        </li>
      </UL>
      <Callout tone="warning" title="Warning">
        The DC port is for <strong>output only</strong>. Do not connect any DC
        power adapters to it — doing so may damage the device.
      </Callout>

      <H2 id="setup">Setup &amp; Activation</H2>
      <OL>
        <li>
          Place the Starlink<sup>®</sup> Mini face down on a flat surface (be
          careful not to scratch the face). Remove the kickstand if used.
        </li>
        <li>
          Unpack the LinkPower 1 and plug the included DC-to-DC cable into the{" "}
          <strong>DC port on the LinkPower 1</strong>.
        </li>
        <li>
          Plug the other end of the DC cable into the DC port on the Starlink
          Mini. Ensure the plug is fully inserted so the plug face is flush
          with the DC port surface — this guarantees a secure connection.
        </li>
        <li>
          Plug an external USB-C PD power supply into the LinkPower 1 to{" "}
          <strong>activate</strong> it. The LED on the power button lights up,
          and the Starlink Mini powers on automatically (its LED begins
          flashing).
          <Callout tone="note" title="After activation">
            Once activated, you can remove the external PD power supply.
          </Callout>
        </li>
        <li>
          Gently slide the LinkPower 1 toward the Starlink Mini until you hear
          a <em>click</em> — this confirms a secure mechanical attachment.
        </li>
        <li>
          Setup is complete. You can now use your Starlink Mini as normal,
          powered by the attached LinkPower 1.
        </li>
      </OL>

      <H2 id="charging">Charging</H2>
      <P>
        To charge LinkPower 1 — and simultaneously power the Starlink Mini —
        connect an external USB Type-C PD power supply to the LinkPower 1&rsquo;s
        Type-C port. Pass-through charging means there is no interruption to
        your Starlink connection.
      </P>

      <H2 id="power-bank">Use as a Standalone Power Bank</H2>
      <P>
        When you don&rsquo;t need it for Starlink, LinkPower 1 also works as a
        regular USB-C PD power bank. Plug your phone, laptop, camera, or any
        other USB-C device into the Type-C port — output is up to 65W by
        default.
      </P>

      <H2 id="lcd">Status Screen (LCD)</H2>
      <P>
        Press the power button once to turn on the 1.47&Prime; LCD. The full UI
        shows battery level, estimated runtime, and live power readings:
      </P>
      <UL>
        <li>
          <strong>Level</strong> — current battery percentage and capacity bar.
        </li>
        <li>
          <strong>Battery Time</strong> — estimated time until LinkPower 1 is
          fully charged (when charging) or fully discharged (when discharging).
        </li>
        <li>
          <strong>Status icons</strong> — schedule on / schedule off / Bluetooth
          connection state.
        </li>
        <li>
          <strong>DC Port</strong> — power, current, voltage and discharging
          status of the DC output.
        </li>
        <li>
          <strong>Type-C Port</strong> — power, current, voltage; an arrow
          indicates whether the port is currently <em>charging</em> or{" "}
          <em>discharging</em>.
        </li>
      </UL>
      <P>
        When the DC port is enabled, the LED indicator on the power button
        gently pulses.
      </P>

      <H2 id="dc-port">Manually Controlling the DC Port</H2>
      <P>
        You can manually enable or disable the DC port — which in turn powers
        your Starlink Mini on or off.
      </P>
      <OL>
        <li>
          <strong>Press and hold</strong> the power button for at least{" "}
          <strong>2 seconds</strong>.
        </li>
        <li>
          The LED quickly flashes twice to confirm the action.
        </li>
        <li>
          When the DC port is enabled the LED gently pulses; when disabled the
          LED turns off.
        </li>
      </OL>

      <H2 id="shutdown">Shutting Down LinkPower 1</H2>
      <P>
        If you don&rsquo;t plan to use LinkPower 1 for an extended period, you
        can shut it down completely to preserve battery life and health.
      </P>
      <UL>
        <li>
          Press and hold the power button for at least{" "}
          <strong>10 seconds</strong>.
        </li>
        <li>
          Once fully shut down, the power button will become unresponsive.
        </li>
        <li>
          To restart from a complete shutdown, simply plug in an external USB-C
          PD power supply.
        </li>
      </UL>

      <H2 id="web-app">Using the Web App</H2>
      <P>
        PeakDo provides a browser-based Web App for fine-grained control of
        LinkPower 1 over Bluetooth — power limits, scheduling, and expert
        settings.
      </P>
      <H3>Supported browsers</H3>
      <UL>
        <li>
          <strong>Windows / macOS:</strong> Chrome, Edge, Opera
        </li>
        <li>
          <strong>Android:</strong> Chrome, Edge, Opera, Samsung Internet
        </li>
        <li>
          <strong>iOS:</strong>{" "}
          <a
            href="https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055"
            style={{ color: THEME.blue }}
          >
            Bluefy
          </a>{" "}
          (the Web App has been confirmed working on iOS 18.5)
        </li>
      </UL>
      <Callout tone="info" title="Prefer a native app experience?">
        The community-built{" "}
        <a href="/" style={{ color: THEME.blue, fontWeight: 700 }}>
          LinkPower Companion app
        </a>{" "}
        on the App Store and Google Play gives you a native UI, widgets,
        and reliable BLE auto-reconnect without needing a third-party browser.
      </Callout>

      <H3>Access the Web App</H3>
      <P>
        Open{" "}
        <a
          href="https://pwa.peakdo.ca/link-power-1/"
          style={{ color: THEME.blue }}
        >
          https://pwa.peakdo.ca/link-power-1/
        </a>{" "}
        in a supported browser, or scan the QR code on the back of the
        LinkPower 1. The Web App can also function offline after your initial
        visit.
      </P>

      <H3>(Optional) Install the Web App</H3>
      <P>
        For a more integrated experience, you can install the Web App as a
        Progressive Web App (PWA), giving it a launch icon on your desktop or
        Home Screen.
      </P>
      <UL>
        <li>
          On first visit, your browser may prompt you with an{" "}
          <em>Install Link-Power</em> banner.
        </li>
        <li>
          If not, look for <strong>&ldquo;Add to Home screen&rdquo;</strong> or{" "}
          <strong>&ldquo;Install app&rdquo;</strong> in your browser&rsquo;s
          menu.
        </li>
        <li>
          You may need to grant your browser <em>&ldquo;Home screen
          shortcuts&rdquo;</em> permission.
        </li>
      </UL>

      <H3>Connect via Bluetooth</H3>
      <OL>
        <li>
          Tap the <strong>&ldquo;Connect to a device&rdquo;</strong> button in
          the Web App.
        </li>
        <li>
          Your browser scans for nearby LinkPower 1 devices and lists them.
          Select <code>Link-Power-1</code> to pair.
        </li>
        <li>
          If the browser lacks Bluetooth permission, tap{" "}
          <strong>Update permissions</strong> and choose{" "}
          <em>Allow all the time</em>.
        </li>
      </OL>
      <Callout tone="note" title="Pairing PIN">
        Some advanced or sensitive actions require pairing. A random six-digit
        PIN appears on the LCD screen — enter it in your OS pairing prompt. If
        no PIN is shown, use the default PIN <strong>020555</strong>. You only
        need to pair once unless you remove the LinkPower 1 bond from your
        OS settings.
      </Callout>
      <P>
        Some advanced actions (marked with a shield icon) are hidden by
        default. To reveal them, open the three-dot menu and check{" "}
        <strong>&ldquo;Expert Mode&rdquo;</strong>.
      </P>

      <H2 id="ios-app">Native App — LinkPower Companion</H2>
      <P>
        If you&rsquo;re on iPhone or Android, the simplest way to monitor and
        control your LinkPower 1 is the free{" "}
        <a
          href="/"
          style={{ color: THEME.blue, fontWeight: 700 }}
        >
          LinkPower Companion
        </a>{" "}
        app. It speaks the same Bluetooth protocol as the Web App but with a
        native phone UI.
      </P>
      <UL>
        <li>Live battery telemetry — capacity, level, voltage, current, runtime</li>
        <li>DC port and bypass mode toggling</li>
        <li>USB-C input / output limits (30W – 100W)</li>
        <li>Up to 6 on/off schedules — daily, weekly, monthly</li>
        <li>iOS Live Activities and widgets; Android widgets, notifications, and Quick Settings</li>
        <li>Bluetooth works without a PeakDo account; see the privacy policy for purchase and support data</li>
      </UL>
      <StoreLinks variant="prose" />

      <H2 id="troubleshooting">Troubleshooting</H2>
      <H3>The Web App can&rsquo;t find my LinkPower 1</H3>
      <OL>
        <li>
          Make sure LinkPower 1 is <strong>activated</strong> (plug in a USB-C
          PD adapter). The Bluetooth icon at the top of the LCD should be
          highlighted white — not green or dim grey.
        </li>
        <li>
          Confirm Bluetooth is on for your computer or phone:
          <UL>
            <li>
              <strong>Windows:</strong> Settings → <em>Bluetooth &amp;
              devices</em> → make sure Bluetooth is on. Click{" "}
              <em>Add device</em> → <em>Bluetooth</em> and wait for{" "}
              <code>Link-Power-1</code> to appear.
            </li>
            <li>
              <strong>Android:</strong> Toggle Bluetooth on and look for{" "}
              <code>Link-Power-1</code> in <em>Available devices</em>.
            </li>
          </UL>
        </li>
        <li>
          Use a supported browser (Chrome / Edge / Opera on desktop or Android,
          Bluefy on iOS).
        </li>
      </OL>

      <H3>A previously paired device doesn&rsquo;t show up</H3>
      <P>
        In some situations, a previously paired or bonded device may not show
        up in the device list. <strong>Unpair</strong> or <strong>remove
        the bond</strong> from your operating system&rsquo;s Bluetooth
        settings, then try again.
      </P>

      <H3>The pairing PIN doesn&rsquo;t work</H3>
      <P>
        A random six-digit PIN should appear on the LCD when pairing. If no
        PIN appears, use the factory default: <strong>020555</strong>.
      </P>

      <H3>The Starlink Mini won&rsquo;t turn on</H3>
      <UL>
        <li>
          Confirm the DC-to-DC cable is fully inserted at both ends — the plug
          face should be flush with the DC port surface.
        </li>
        <li>
          Confirm the DC port is enabled: long-press the power button for 2
          seconds — the LED should pulse gently.
        </li>
        <li>
          Confirm the LinkPower 1 is activated and has battery (check the LCD
          level readout).
        </li>
      </UL>

      <H2 id="specs">Specifications</H2>
      <div
        style={{
          border: `1px solid ${THEME.hairline}`,
          borderRadius: 14,
          overflow: "hidden",
          margin: "12px 0 20px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <tbody>
            <SpecRow k="Product Name" v="LinkPower 1" />
            <SpecRow k="Battery Capacity" v="99Wh, 27500mAh (3.6V)" />
            <SpecRow
              k="Battery Runtime"
              v="~4 hours powering Starlink® Mini"
            />
            <SpecRow k="Battery Type" v="21700 Lithium" />
            <SpecRow k="Ports" v="USB-C PD; DC 5.5 × 2.1" />
            <SpecRow k="DC Output" v="DC 15–21V, 65W max" />
            <SpecRow
              k="USB-C PD Input"
              v="5V/3A · 9V/3A · 12V/3A · 15V/5A · 20V/5A · 28V/5A — default 65W max (configurable up to 140W in the Web App)"
            />
            <SpecRow
              k="USB-C PD Output"
              v="5V/3A · 9V/3A · 12V/3A · 15V/5A · 20V/5A · 28V/5A — default 65W max (configurable up to 140W in the Web App)"
            />
            <SpecRow k="Screen" v={<>1.47&Prime; LCD</>} />
            <SpecRow k="Control" v="Power button + Bluetooth Low Energy" />
            <SpecRow
              k="Mounting"
              v={<>Three standard 1/4&Prime; screw holes (tripod thread)</>}
            />
            <SpecRow
              k="Other"
              v="LED indicator on power button"
            />
            <SpecRow k="Dimensions" v="243 × 115 × 27 mm" />
            <SpecRow k="Weight" v="~645 g" />
            <SpecRow k="Working Temperature" v="−20°C to 60°C" />
            <SpecRow k="Waterproof Rating" v="IPX4" />
          </tbody>
        </table>
      </div>
      <Callout tone="warning" title="High-power warning">
        Charging or discharging the battery at high power levels may
        significantly reduce its lifespan. For optimal battery health, avoid
        excessive power usage unless necessary.
      </Callout>

      <H2 id="faq">FAQ</H2>

      <H3>What is the LinkPower 1?</H3>
      <P>
        The LinkPower 1 is a 99Wh portable power bank from PeakDo, designed
        specifically as a battery backup for the Starlink<sup>®</sup> Mini.
        It mounts directly to the back of the dish via a 1/4&Prime; screw
        thread and provides ~4 hours of continuous Starlink runtime.
      </P>

      <H3>Do I need to activate the LinkPower 1 before first use?</H3>
      <P>
        Yes. On first use you must plug in a USB-C PD power adapter to
        activate it. Once activated you can remove the adapter; the LinkPower
        1 will run from its internal battery.
      </P>

      <H3>How long does the LinkPower 1 power the Starlink Mini?</H3>
      <P>
        Approximately 4 hours of continuous Starlink Mini runtime on a full
        charge, thanks to the 99Wh / 27,500 mAh battery.
      </P>

      <H3>Can the LinkPower 1 charge my laptop or phone?</H3>
      <P>
        Yes. The USB-C Power Delivery port is bidirectional and outputs up to
        65W by default, which is enough for most phones, tablets, and many
        USB-C laptops.
      </P>

      <H3>Can it charge while powering Starlink?</H3>
      <P>
        Yes — pass-through charging is supported. Plug a USB-C PD wall adapter
        into the LinkPower 1 and it will keep the Starlink Mini online while
        topping up its own battery.
      </P>

      <H3>How do I turn the Starlink Mini on or off?</H3>
      <P>
        Long-press the power button on the LinkPower 1 for 2 seconds. The LED
        flashes twice to confirm. When the DC port is enabled the LED gently
        pulses; when disabled the LED is off.
      </P>

      <H3>What is the default Bluetooth pairing PIN?</H3>
      <P>
        A random 6-digit PIN appears on the LCD during pairing. If no PIN
        appears, use the default: <strong>020555</strong>.
      </P>

      <H3>Is there a native app?</H3>
      <P>
        Yes. The community-built{" "}
        <a href="/" style={{ color: THEME.blue, fontWeight: 700 }}>
          LinkPower Companion
        </a>{" "}
        on the App Store and Google Play gives you native phone interfaces,
        widgets, scheduling, power limits, and Demo Mode (no device required
        to explore the UI).
      </P>

      <H3>Is the LinkPower 1 waterproof?</H3>
      <P>
        It is rated <strong>IPX4</strong> — splash-resistant from any
        direction, but not submersible.
      </P>

      <H3>Is this guide official?</H3>
      <P>
        This page is a community-written distillation of PeakDo&rsquo;s
        official{" "}
        <a href={PDF_URL} style={{ color: THEME.blue }}>
          LinkPower 1 Quick Start v1.7
        </a>
        . LinkPower and PeakDo are trademarks of their respective owners. The
        LinkPower Companion app is unofficial and not affiliated with,
        endorsed by, or supported by PeakDo Tech, Inc.
      </P>
    </article>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#fff",
        borderTop: `1px solid ${THEME.hairline}`,
        padding: "40px 24px 56px",
      }}
    >
      <div
        className="lp-footer-row"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                overflow: "hidden",
                display: "inline-block",
                background: "#fff",
              }}
            >
              <img
                src="/app-icon-fg.png"
                alt=""
                width={28}
                height={28}
                style={{ display: "block" }}
              />
            </span>
            <span
              style={{ fontWeight: 800, color: THEME.ink, fontSize: 14 }}
            >
              Link-Power Companion
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: THEME.muted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Unofficial. Not affiliated with, endorsed by, or supported by
            PeakDo Tech, Inc. Link-Power, LinkPower and PeakDo are trademarks
            of their respective owners. Starlink is a trademark of Space
            Exploration Technologies Corp. Use at your own risk.
            <br />
            <span style={{ color: THEME.subtle }}>iOS 17+ · Android 10+</span>
          </p>
        </div>
        <div className="lp-footer-links" style={{ display: "flex", gap: 28, fontSize: 13, fontWeight: 600 }}>
          <a
            href="/"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Home
          </a>
          <a
            href="/#features"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Features
          </a>
          <a
            href="/#devices"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Devices
          </a>
          <a
            href="/#faq"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
}

/* JSON-LD: HowTo + FAQPage + BreadcrumbList for rich results */
const howToJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "LinkPower",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "LinkPower 1 Quick Start",
          item: `${SITE_URL}/linkpower-1-quick-start/`,
        },
      ],
    },
    {
      "@type": "TechArticle",
      headline: "LinkPower 1 Quick Start Guide",
      description:
        "Setup, activation, Web App pairing, troubleshooting, and full specifications for the PeakDo LinkPower 1 power bank for Starlink Mini.",
      mainEntityOfPage: `${SITE_URL}/linkpower-1-quick-start/`,
      about: {
        "@type": "Product",
        name: "LinkPower 1",
        brand: { "@type": "Brand", name: "PeakDo" },
        category: "Portable Power Station",
      },
    },
    {
      "@type": "HowTo",
      name: "How to set up the LinkPower 1 with Starlink Mini",
      description:
        "Step-by-step setup of the PeakDo LinkPower 1 power bank with the Starlink Mini.",
      totalTime: "PT5M",
      tool: [
        { "@type": "HowToTool", name: "USB-C PD power adapter" },
        { "@type": "HowToTool", name: "Included DC-to-DC cable" },
      ],
      step: [
        {
          "@type": "HowToStep",
          name: "Place Starlink Mini face down",
          text: "Place the Starlink Mini face down on a flat surface, removing the kickstand if used.",
        },
        {
          "@type": "HowToStep",
          name: "Plug DC cable into LinkPower 1",
          text: "Plug the included DC-to-DC cable into the DC port on the LinkPower 1.",
        },
        {
          "@type": "HowToStep",
          name: "Plug DC cable into Starlink Mini",
          text: "Plug the other end of the DC cable into the Starlink Mini's DC port. Ensure the plug face is flush with the port surface.",
        },
        {
          "@type": "HowToStep",
          name: "Activate the LinkPower 1",
          text: "Plug an external USB-C PD power supply into the LinkPower 1 to activate it. The LED on the power button lights up and the Starlink Mini powers on automatically.",
        },
        {
          "@type": "HowToStep",
          name: "Attach LinkPower 1 to Starlink Mini",
          text: "Slide the LinkPower 1 toward the Starlink Mini until you hear a click confirming a secure attachment.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the LinkPower 1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The LinkPower 1 is a 99Wh portable power bank from PeakDo, designed specifically as a battery backup for the Starlink Mini. It mounts directly to the back of the dish and provides about 4 hours of continuous runtime.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to activate the LinkPower 1 before first use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. On first use you must plug in a USB-C PD power adapter to activate it. Once activated you can remove the adapter and the LinkPower 1 will run from its internal battery.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the LinkPower 1 power the Starlink Mini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Approximately 4 hours of continuous Starlink Mini runtime on a full charge, thanks to the 99Wh / 27,500 mAh battery.",
          },
        },
        {
          "@type": "Question",
          name: "Can the LinkPower 1 charge while powering Starlink?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Pass-through charging is supported. Plug a USB-C PD wall adapter into the LinkPower 1 and it will keep the Starlink Mini online while topping up its own battery.",
          },
        },
        {
          "@type": "Question",
          name: "What is the default LinkPower 1 Bluetooth pairing PIN?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A random six-digit PIN is shown on the LCD during pairing. If no PIN is shown, use the default 020555.",
          },
        },
        {
          "@type": "Question",
          name: "How do I turn the Starlink Mini on or off via LinkPower 1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Long-press the power button on the LinkPower 1 for 2 seconds. The LED flashes twice to confirm. When the DC port is enabled the LED gently pulses; when disabled the LED is off.",
          },
        },
        {
          "@type": "Question",
          name: "Is there a native app for LinkPower 1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The community-built LinkPower Companion app on the App Store and Google Play provides native phone interfaces with widgets, scheduling, power limits, and Demo Mode.",
          },
        },
      ],
    },
  ],
};

export default function LinkPower1QuickStartPage() {
  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <Nav />
      <Hero />
      <Body />
      <Footer />
      <Script
        id="ld-json-howto"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
    </main>
  );
}
