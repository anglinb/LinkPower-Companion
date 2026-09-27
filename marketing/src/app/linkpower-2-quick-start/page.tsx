import type { ReactNode } from "react";
import Script from "next/script";
import { StoreLinks } from "../../components/StoreLinks";

/* =========================================================================
   LinkPower 2 Quick Start — Help / Guide page
   Distilled from PeakDo's official LinkPower-2 Quick Start v2.1 PDF.
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
  "https://images.51microshop.com/15666/user_guide/linkpower%202/LinkPower-2_quick_start_v2.1.pdf";

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
          Help · LinkPower 2 · v2.1
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
          LinkPower 2 Quick Start Guide
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
          <strong style={{ color: "inherit" }}>LinkPower 2</strong> — the
          second-generation 99Wh power bank for the{" "}
          <strong style={{ color: "inherit" }}>
            Starlink<sup>®</sup> Mini
          </strong>
          . Now with <strong>100W USB-C input</strong>, magnetic DC charging,
          and <strong>Smart Bypass Mode</strong>. Distilled from the official
          Quick Start manual (v2.1).
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
            href="/linkpower-1-quick-start/"
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
            ← LinkPower 1 guide
          </a>
        </div>
      </div>
    </section>
  );
}

function Toc() {
  const items: { id: string; label: string }[] = [
    { id: "introduction", label: "Introduction" },
    { id: "whats-new", label: "What's new vs LP1" },
    { id: "in-the-box", label: "What's in the Box" },
    { id: "device-overview", label: "Device Overview" },
    { id: "setup", label: "Setup & Activation" },
    { id: "charging", label: "Charging (3 methods)" },
    { id: "power-bank", label: "Use as a Power Bank" },
    { id: "power-button", label: "Power Button Functions" },
    { id: "lcd", label: "Status Screen (LCD)" },
    { id: "bypass", label: "Smart Bypass Mode" },
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
        }}
      >
        {items.map((it) => (
          <li
            key={it.id}
            style={{ fontSize: 14, color: THEME.inkSoft }}
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

function CompareCard({
  title,
  lp1,
  lp2,
  highlight,
}: {
  title: string;
  lp1: string;
  lp2: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? THEME.blueWash : "#fff",
        border: `1px solid ${highlight ? THEME.blueSoft : THEME.hairline}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: highlight ? THEME.blueDeep : THEME.muted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: THEME.muted, marginBottom: 4 }}>
        <strong style={{ color: THEME.inkSoft, fontWeight: 700 }}>LP1:</strong>{" "}
        {lp1}
      </div>
      <div style={{ fontSize: 14, color: THEME.ink, fontWeight: 600 }}>
        <strong style={{ color: THEME.blueDeep, fontWeight: 800 }}>
          LP2:
        </strong>{" "}
        {lp2}
      </div>
    </div>
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
        Meet the <strong>LinkPower 2</strong> — a compact, high-efficiency
        power bank designed exclusively for the Starlink<sup>®</sup> Mini.
        With a 99Wh battery, LinkPower 2 provides{" "}
        <strong>over 5 hours</strong> of continuous runtime to keep your
        internet connection alive even in remote locations.
      </P>
      <P>
        LinkPower 2 supports USB-C bidirectional power delivery. With a{" "}
        <strong>100W USB-C input</strong>, it charges from <strong>20% to
        80% in just 45 minutes</strong>. The USB-C port also delivers up to
        65W output for phones, laptops, and other USB-C gear.
      </P>
      <P>
        LinkPower 2 also adds dedicated <strong>DC and magnetic DC input
        ports</strong>:
      </P>
      <UL>
        <li>
          With the original Starlink Mini charger, the maximum input power is
          up to <strong>60W</strong>.
        </li>
        <li>
          With a 12V car charger, the maximum input power is up to{" "}
          <strong>65W</strong>.
        </li>
      </UL>
      <P>
        Best of all, LinkPower 2 can power the Starlink Mini while charging
        itself — ensuring uninterrupted operation. Press and hold the power
        button for 2 seconds, then release when the breathing light starts
        flashing, to turn DC output on or off.
      </P>
      <Callout tone="note" title="Note">
        Before first use, you must <strong>activate</strong> the LinkPower 2.
        Either plug in a USB-C PD power supply, <em>or</em> hold the power
        button for 10 seconds. Activation is complete once the screen turns on.
      </Callout>

      <H2 id="whats-new">What&rsquo;s new vs LinkPower 1</H2>
      <P>
        LinkPower 2 is a meaningful upgrade over the original LP1 — faster
        input, more charging methods, and the new Smart Bypass system.
      </P>
      <div
        className="lp-help-compare"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          margin: "16px 0 24px",
        }}
      >
        <CompareCard
          title="Runtime"
          lp1="~4 hours"
          lp2="~5 hours"
          highlight
        />
        <CompareCard
          title="USB-C input"
          lp1="65W default"
          lp2="100W (20→80% in 45 min)"
          highlight
        />
        <CompareCard
          title="Charging methods"
          lp1="USB-C only"
          lp2="USB-C, DC input, magnetic DC"
          highlight
        />
        <CompareCard
          title="Bypass mode"
          lp1="Manual"
          lp2="Smart (auto low / auto full)"
          highlight
        />
        <CompareCard
          title="Waterproofing"
          lp1="IPX4"
          lp2="IP65"
          highlight
        />
        <CompareCard
          title="Power-button tricks"
          lp1="On/off + DC toggle"
          lp2="Adds breathing light & PIN-mode toggle"
        />
        <CompareCard
          title="Weight"
          lp1="~645 g"
          lp2="~667 g"
        />
        <CompareCard
          title="Battery / capacity"
          lp1="99Wh, 21700"
          lp2="99Wh, 21700 (same)"
        />
      </div>

      <H2 id="in-the-box">What&rsquo;s in the Box</H2>
      <UL>
        <li>LinkPower 2 power bank</li>
        <li>DC-to-DC cable (LinkPower 2 ↔ Starlink Mini)</li>
        <li>DC-to-magnetic-DC cable (for charging via DC adapters)</li>
      </UL>

      <H2 id="device-overview">Device Overview</H2>
      <P>The LinkPower 2 has the following ports and controls:</P>
      <UL>
        <li>
          <strong>DC output port</strong> — output to the Starlink Mini.{" "}
          <em>Output only.</em>
        </li>
        <li>
          <strong>DC input port</strong> — for charging via DC adapters
          (12–30V).
        </li>
        <li>
          <strong>DC magnetic input port</strong> — quick-attach charging via
          the included magnetic cable.
        </li>
        <li>
          <strong>Type-C PD output / input port</strong> — bidirectional, up
          to 100W input and 65W output.
        </li>
        <li>
          <strong>1.47&Prime; LCD</strong> — battery level, runtime, and live
          power readouts.
        </li>
        <li>
          <strong>Breathing LED indicator</strong> — pulses when the DC port
          is enabled.
        </li>
        <li>
          <strong>Power button</strong> — multiple short/long press functions.
        </li>
        <li>
          <strong>1/4&Prime; screw hole</strong> — standard tripod / mount
          thread.
        </li>
      </UL>
      <Callout tone="warning" title="Warning">
        The DC <em>output</em> port is for output only. Do not connect any DC
        power adapters to it — doing so may damage the device. Use the DC{" "}
        <em>input</em> port or magnetic DC input port for charging.
      </Callout>

      <H2 id="setup">Setup &amp; Activation</H2>
      <OL>
        <li>
          Place the Starlink Mini face down on a flat surface (be careful not
          to scratch the face). Remove the kickstand if used.
        </li>
        <li>
          Unpack the LinkPower 2 and plug the included DC-to-DC cable into
          the <strong>DC output port</strong> on the LinkPower 2.
        </li>
        <li>
          Plug the other end of the DC cable into the DC port on the Starlink
          Mini. Ensure the plug face is flush with the port surface for a
          secure connection.
        </li>
        <li>
          <strong>Activate</strong> the LinkPower 2 in either of two ways:
          <UL>
            <li>Plug in an external USB-C PD power supply, <em>or</em></li>
            <li>
              Press and hold the power button for{" "}
              <strong>10 seconds</strong> until the screen turns on.
            </li>
          </UL>
          The LED on the power button lights up; the Starlink Mini powers on
          automatically and its LED begins flashing.
        </li>
        <li>
          Gently slide the LinkPower 2 toward the Starlink Mini until you hear
          a <em>click</em> — this confirms a secure mechanical attachment.
        </li>
        <li>
          Setup is complete. You can now use your Starlink Mini as normal,
          powered by the attached LinkPower 2.
        </li>
      </OL>
      <Callout tone="info" title="After activation">
        Once activated, you can remove the external PD power supply.
      </Callout>

      <H2 id="charging">Charging — Three Methods</H2>
      <P>
        LinkPower 2 supports three charging methods, all of which can run
        simultaneously with powering the Starlink Mini.
      </P>

      <H3>1. USB-C PD charging (up to 100W)</H3>
      <P>
        Charge via the Type-C PD port. Compatible with{" "}
        <strong>PD 3.1, PPS, QC5, QC 3.0 / 2.0, FCP, AFC, SCP</strong>, and{" "}
        <strong>Apple 2.4A</strong>. Configurable up to 100W in the Web App.
      </P>

      <H3>2. DC input charging</H3>
      <P>
        Charge through the DC input port. Compatible with the original
        Starlink Mini power adapter, enabling charging and Starlink operation
        at the same time.
      </P>

      <H3>3. Magnetic DC charging</H3>
      <P>
        Use the included DC-to-magnetic-DC cable. The magnetic connector
        snaps to the side of the LinkPower 2 — great for quick attach/detach
        in field setups.
      </P>

      <H2 id="power-bank">Use as a Standalone Power Bank</H2>
      <P>
        LinkPower 2 also works as a regular USB-C PD power bank — plug your
        phone, laptop, or other USB-C device into the Type-C port for up to
        65W output.
      </P>
      <Callout tone="warning" title="Reserved for Starlink">
        The power bank reserves approximately <strong>10%–15%</strong> of its
        capacity for the Starlink Mini. When the remaining battery falls
        below this range, the Type-C output automatically turns off — this
        prevents USB outputs from draining the battery and accidentally
        powering down your Starlink Mini.
      </Callout>

      <H2 id="power-button">Power Button Functions</H2>
      <P>
        The single power button on LinkPower 2 controls four different things
        depending on press pattern:
      </P>
      <OL>
        <li>
          <strong>Power off:</strong> Press and hold for{" "}
          <strong>10 seconds</strong> to power off the LinkPower 2 completely.
        </li>
        <li>
          <strong>DC output on / off:</strong> Press and hold for{" "}
          <strong>2 seconds</strong>. Release when the breathing light starts
          flashing — this toggles the DC output.
        </li>
        <li>
          <strong>Breathing light on / off:</strong> When the DC output port
          is on, <em>quickly press the power button twice</em> to toggle the
          breathing light.
        </li>
        <li>
          <strong>PIN mode switching:</strong> <em>Quickly press the power
          button three times</em> to switch between Fixed PIN (
          <code>020555</code>) and random PIN. The LED flashes to confirm.
          <UL>
            <li>
              During pairing: if no verification code is shown on the LCD, a
              fixed PIN is used.
            </li>
            <li>
              If a verification code is displayed on the LCD, a random PIN is
              used.
            </li>
          </UL>
        </li>
      </OL>

      <H2 id="lcd">Status Screen (LCD)</H2>
      <P>
        Press the power button once to turn on the 1.47&Prime; LCD. The full
        UI shows battery level, estimated runtime, and live power readings:
      </P>
      <UL>
        <li>
          <strong>Battery Level</strong> — current percentage and capacity
          bar.
        </li>
        <li>
          <strong>Battery Time</strong> — estimated time until fully charged
          (when charging) or fully discharged (when discharging).
        </li>
        <li>
          <strong>Status icons</strong> — schedule on / off / Bluetooth
          connection state.
        </li>
        <li>
          <strong>DC output port</strong> — power, current, voltage, and
          discharge indicator.
        </li>
        <li>
          <strong>DC input port</strong> — power, current, voltage; an arrow
          indicates charging is in progress.
        </li>
        <li>
          <strong>Type-C port</strong> — power, current, voltage; arrows
          indicate charging vs discharging, plus charging-only mode.
        </li>
        <li>
          <strong>Bypass state indicator</strong> — between the DC and Type-C
          displays. <span style={{ color: THEME.amber, fontWeight: 700 }}>
            Yellow
          </span>{" "}
          = manual activation;{" "}
          <span style={{ color: THEME.charging, fontWeight: 700 }}>
            green
          </span>{" "}
          = automatic activation.
        </li>
      </UL>
      <P>
        In the Web App, scroll down to the Type-C port section and tap the
        button on the right to switch the Type-C port between{" "}
        <strong>Charge Only</strong> and <strong>Charging / Discharging</strong>.
      </P>

      <H2 id="bypass">Smart Bypass Mode — Always-On Power</H2>
      <P>
        Smart Bypass directly powers your Starlink Mini from an external
        source — no interruption, smarter battery protection. There are
        three ways it engages:
      </P>
      <H3>Manual activation</H3>
      <P>
        Enable Bypass at any time via the Web App for direct power supply.
      </P>
      <H3>Auto at low battery</H3>
      <P>
        When the battery drops below <strong>3%</strong>, external power
        automatically takes over — keeping the Starlink Mini running without
        interruption.
      </P>
      <H3>Auto at full charge</H3>
      <P>
        When the battery reaches <strong>100%</strong>, Bypass activates
        automatically — preventing overcharging and protecting battery
        lifespan.
      </P>
      <Callout tone="note" title="Ensure sufficient input power">
        External Power must be ≥ Starlink Mini Power Consumption. When the
        battery is extremely low, the external source must provide enough
        output to run the Starlink Mini directly. If input power is
        insufficient, the device may not operate properly.
      </Callout>

      <H2 id="dc-port">Manually Controlling the DC Port</H2>
      <P>
        You can manually enable or disable the DC output, which in turn
        powers your Starlink Mini on or off.
      </P>
      <OL>
        <li>
          <strong>Press and hold</strong> the power button for at least{" "}
          <strong>2 seconds</strong>. Release when the breathing light
          starts flashing.
        </li>
        <li>The LED quickly flashes twice to confirm the action.</li>
        <li>
          When the DC port is enabled the LED gently pulses; when disabled
          the LED turns off.
        </li>
      </OL>

      <H2 id="shutdown">Shutting Down LinkPower 2</H2>
      <P>
        If you don&rsquo;t plan to use LinkPower 2 for an extended period,
        you can shut it down completely to preserve battery life and health.
      </P>
      <UL>
        <li>
          Press and hold the power button for at least{" "}
          <strong>10 seconds</strong>. The Power Button becomes unresponsive
          once shutdown is complete.
        </li>
        <li>
          To restart from a complete shutdown: plug in an external USB-C PD
          power supply, <em>or</em> hold the power button for 10 seconds.
          Activation is complete when the screen turns on.
        </li>
      </UL>

      <H2 id="web-app">Using the Web App</H2>
      <P>
        PeakDo provides a browser-based Web App for fine-grained control of
        LinkPower 2 over Bluetooth — power limits, scheduling, bypass mode,
        and expert settings.
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
          </a>
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
        LinkPower 2. The Web App can also function offline after your
        initial visit.
      </P>

      <H3>(Optional) Install the Web App</H3>
      <P>
        For a more integrated experience, install the Web App as a
        Progressive Web App (PWA) — it gets a launch icon on your desktop or
        Home Screen.
      </P>
      <UL>
        <li>
          On first visit, your browser may prompt with an{" "}
          <em>Install Link-Power</em> banner.
        </li>
        <li>
          If not, look for <strong>&ldquo;Add to Home screen&rdquo;</strong>{" "}
          or <strong>&ldquo;Install app&rdquo;</strong> in your browser&rsquo;s
          menu.
        </li>
        <li>
          You may need to grant <em>&ldquo;Home screen shortcuts&rdquo;</em>{" "}
          permission.
        </li>
      </UL>

      <H3>Connect via Bluetooth</H3>
      <OL>
        <li>
          Tap <strong>&ldquo;Connect to a device&rdquo;</strong> in the Web
          App.
        </li>
        <li>
          Your browser scans for nearby LinkPower 2 devices. Select{" "}
          <code>Link-Power-2</code> to pair.
        </li>
        <li>
          If the browser lacks Bluetooth permission, tap{" "}
          <strong>Update permissions</strong> and choose{" "}
          <em>Allow all the time</em>.
        </li>
      </OL>
      <Callout tone="note" title="Pairing PIN">
        A random six-digit PIN appears on the LCD during pairing — enter it
        in your OS pairing prompt. If no PIN is shown, use the default PIN{" "}
        <strong>020555</strong>. You only need to pair once unless you
        remove the LinkPower 2 bond from your OS settings. You can switch
        between fixed and random PIN modes by quickly pressing the power
        button three times.
      </Callout>
      <P>
        Some advanced actions are hidden by default. To reveal them, open
        the three-dot menu and check <strong>&ldquo;Expert Mode&rdquo;</strong>.
      </P>

      <H2 id="ios-app">Native App — LinkPower Companion</H2>
      <P>
        On iPhone or Android, the simplest way to monitor and control your
        LinkPower 2 is the free{" "}
        <a
          href="/"
          style={{ color: THEME.blue, fontWeight: 700 }}
        >
          LinkPower Companion
        </a>{" "}
        app. It speaks the same Bluetooth protocol as the Web App, but with
        a native phone UI.
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
      <H3>The Web App can&rsquo;t find my LinkPower 2</H3>
      <OL>
        <li>
          Make sure LinkPower 2 is <strong>activated</strong>. The Bluetooth
          icon at the top of the LCD should be highlighted white — not green
          or dim grey.
        </li>
        <li>
          Confirm Bluetooth is on for your computer or phone:
          <UL>
            <li>
              <strong>Windows:</strong> Settings → <em>Bluetooth &amp;
              devices</em> → make sure Bluetooth is on. Click{" "}
              <em>Add device</em> → <em>Bluetooth</em> and wait for{" "}
              <code>Link-Power-2</code> to appear.
            </li>
            <li>
              <strong>Android:</strong> Toggle Bluetooth on and look for{" "}
              <code>Link-Power-2</code> in <em>Available devices</em>.
            </li>
          </UL>
        </li>
        <li>
          Use a supported browser (Chrome / Edge / Opera on desktop or
          Android, Bluefy on iOS).
        </li>
      </OL>

      <H3>A previously paired device doesn&rsquo;t show up</H3>
      <P>
        Sometimes a previously paired or bonded device may not show up in the
        list. <strong>Unpair</strong> or <strong>remove the bond</strong>{" "}
        from your operating system&rsquo;s Bluetooth settings, then try again.
      </P>

      <H3>The pairing PIN doesn&rsquo;t work</H3>
      <P>
        If the LCD displays a six-digit PIN, use that. If no PIN appears,
        use the factory default: <strong>020555</strong>. You can also
        toggle between random and fixed PIN modes by quickly pressing the
        power button three times.
      </P>

      <H3>Type-C output suddenly turned off</H3>
      <P>
        This is by design. LinkPower 2 reserves 10–15% of its battery for
        the Starlink Mini. When remaining battery falls below this range,
        the Type-C output automatically turns off so your Starlink Mini
        doesn&rsquo;t lose power unexpectedly. Recharge the LinkPower 2 to
        restore Type-C output.
      </P>

      <H3>The Starlink Mini won&rsquo;t turn on</H3>
      <UL>
        <li>
          Confirm the DC-to-DC cable is fully inserted at both ends — the
          plug face should be flush with the DC port surface.
        </li>
        <li>
          Confirm the DC port is enabled: long-press the power button for 2
          seconds and release when the breathing light flashes — the LED
          should pulse gently.
        </li>
        <li>
          Confirm the LinkPower 2 is activated and has battery (check the
          LCD level readout).
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
            <SpecRow k="Product Name" v="LinkPower 2" />
            <SpecRow k="Battery Capacity" v="99Wh, 27500mAh (3.6V)" />
            <SpecRow
              k="Battery Runtime"
              v="~5 hours powering Starlink® Mini"
            />
            <SpecRow k="Battery Type" v="21700 Lithium" />
            <SpecRow k="Ports" v="USB-C PD; DC 5.5 × 2.1; magnetic DC" />
            <SpecRow k="DC Input" v="DC 12–30V (65W max)" />
            <SpecRow k="DC Output" v="DC 15–21V (65W max)" />
            <SpecRow
              k="USB-C PD Input"
              v="5V/3A · 9V/3A · 12V/3A · 15V/3A · 20V/3.25A — default 65W max (configurable up to 100W in the Web App)"
            />
            <SpecRow
              k="USB-C PD Output"
              v="5V/3A · 9V/3A · 12V/3A · 15V/3A · 20V/3.25A — default 65W max"
            />
            <SpecRow
              k="USB-C Protocol Support"
              v="PD 3.1, PPS, QC5, QC 3.0 / 2.0, FCP, AFC, SCP, Apple 2.4A"
            />
            <SpecRow k="Screen" v={<>1.47&Prime; LCD</>} />
            <SpecRow k="Control" v="Power button + Bluetooth Low Energy" />
            <SpecRow
              k="Mounting"
              v={<>One standard 1/4&Prime; screw hole (tripod thread)</>}
            />
            <SpecRow k="Other" v="Breathing LED indicator" />
            <SpecRow k="Dimensions" v="243 × 115 × 27 mm" />
            <SpecRow k="Weight" v="~667 g" />
            <SpecRow k="Working Temperature" v="−20°C to 60°C" />
            <SpecRow k="Waterproof Rating" v="IP65" />
          </tbody>
        </table>
      </div>
      <Callout tone="warning" title="High-power warning">
        Charging or discharging the battery at high power levels may
        significantly reduce its lifespan. For optimal battery health, avoid
        excessive power usage unless necessary.
      </Callout>

      <H2 id="faq">FAQ</H2>

      <H3>What is the LinkPower 2?</H3>
      <P>
        The LinkPower 2 is a 99Wh portable power bank from PeakDo, designed
        specifically as a battery backup for the Starlink<sup>®</sup> Mini.
        It mounts directly to the back of the dish via a 1/4&Prime; screw
        thread and provides ~5 hours of continuous Starlink runtime.
      </P>

      <H3>How is LinkPower 2 different from LinkPower 1?</H3>
      <P>
        Compared with LinkPower 1, the LinkPower 2 adds: 100W USB-C input
        (vs 65W), dedicated DC and magnetic DC input ports (vs USB-C only),
        Smart Bypass Mode with auto-low and auto-full triggers, IP65
        waterproofing (vs IPX4), about an hour more runtime (~5 h vs ~4 h),
        and additional power-button shortcuts for the breathing light and
        PIN-mode toggle.
      </P>

      <H3>How fast does the LinkPower 2 charge?</H3>
      <P>
        With a 100W USB-C PD adapter, the LinkPower 2 charges from{" "}
        <strong>20% to 80% in just 45 minutes</strong>.
      </P>

      <H3>Do I need to activate the LinkPower 2 before first use?</H3>
      <P>
        Yes. On first use either plug in a USB-C PD adapter, <em>or</em>{" "}
        press and hold the power button for 10 seconds until the screen
        turns on.
      </P>

      <H3>How long does the LinkPower 2 power the Starlink Mini?</H3>
      <P>
        Approximately <strong>5 hours</strong> of continuous Starlink Mini
        runtime on a full charge.
      </P>

      <H3>Can the LinkPower 2 charge while powering Starlink?</H3>
      <P>
        Yes — pass-through charging is supported via all three input
        methods (USB-C PD, DC input, magnetic DC). The Smart Bypass system
        will route external power directly to the Starlink Mini whenever
        practical, protecting the battery from unnecessary cycling.
      </P>

      <H3>What is Smart Bypass Mode?</H3>
      <P>
        Smart Bypass routes external power directly to the Starlink Mini
        instead of through the battery. It engages automatically when the
        battery is below 3% (to keep Starlink running) or at 100% (to
        prevent overcharging), or it can be activated manually via the Web
        App.
      </P>

      <H3>Why did the Type-C output turn off when my battery got low?</H3>
      <P>
        The LinkPower 2 reserves 10–15% of its capacity for the Starlink
        Mini. When the remaining battery falls below this range, the
        Type-C output automatically turns off so USB devices don&rsquo;t
        drain the battery and accidentally power down your Starlink Mini.
      </P>

      <H3>What is the default Bluetooth pairing PIN?</H3>
      <P>
        A random 6-digit PIN appears on the LCD during pairing. If no PIN
        appears, use the default: <strong>020555</strong>. You can switch
        between random and fixed PIN modes by quickly pressing the power
        button three times.
      </P>

      <H3>How do I turn the Starlink Mini on or off via LinkPower 2?</H3>
      <P>
        Press and hold the power button for 2 seconds, then release when
        the breathing light starts flashing. The LED flashes twice to
        confirm. When the DC port is enabled the LED gently pulses; when
        disabled the LED is off.
      </P>

      <H3>Is the LinkPower 2 waterproof?</H3>
      <P>
        It is rated <strong>IP65</strong> — dust-tight and protected
        against low-pressure water jets from any direction. Don&rsquo;t
        submerge it.
      </P>

      <H3>Is there a native app?</H3>
      <P>
        Yes. The community-built{" "}
        <a href="/" style={{ color: THEME.blue, fontWeight: 700 }}>
          LinkPower Companion
        </a>{" "}
        on the App Store and Google Play gives you native phone interfaces,
        widgets, scheduling, power limits, and Demo Mode.
      </P>

      <H3>Is this guide official?</H3>
      <P>
        This page is a community-written distillation of PeakDo&rsquo;s
        official{" "}
        <a href={PDF_URL} style={{ color: THEME.blue }}>
          LinkPower 2 Quick Start v2.1
        </a>
        . LinkPower and PeakDo are trademarks of their respective owners.
        The LinkPower Companion app is unofficial and not affiliated
        with, endorsed by, or supported by PeakDo Tech, Inc.
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
            PeakDo Tech, Inc. Link-Power, LinkPower and PeakDo are
            trademarks of their respective owners. Starlink is a trademark
            of Space Exploration Technologies Corp. Use at your own risk.
            <br />
            <span style={{ color: THEME.subtle }}>
              iOS 17+ · Android 10+
            </span>
          </p>
        </div>
        <div
          className="lp-footer-links"
          style={{
            display: "flex",
            gap: 28,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <a
            href="/"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Home
          </a>
          <a
            href="/linkpower-1-quick-start/"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            LP1 Guide
          </a>
          <a
            href="/#features"
            style={{ color: THEME.inkSoft, textDecoration: "none" }}
          >
            Features
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
          name: "LinkPower 2 Quick Start",
          item: `${SITE_URL}/linkpower-2-quick-start/`,
        },
      ],
    },
    {
      "@type": "TechArticle",
      headline: "LinkPower 2 Quick Start Guide",
      description:
        "Setup, activation, Smart Bypass Mode, Web App pairing, troubleshooting, and full specifications for the PeakDo LinkPower 2 power bank for Starlink Mini.",
      mainEntityOfPage: `${SITE_URL}/linkpower-2-quick-start/`,
      about: {
        "@type": "Product",
        name: "LinkPower 2",
        brand: { "@type": "Brand", name: "PeakDo" },
        category: "Portable Power Station",
      },
    },
    {
      "@type": "HowTo",
      name: "How to set up the LinkPower 2 with Starlink Mini",
      description:
        "Step-by-step setup of the PeakDo LinkPower 2 power bank with the Starlink Mini.",
      totalTime: "PT5M",
      tool: [
        { "@type": "HowToTool", name: "USB-C PD power adapter (100W recommended)" },
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
          name: "Plug DC cable into LinkPower 2",
          text: "Plug the included DC-to-DC cable into the DC output port on the LinkPower 2.",
        },
        {
          "@type": "HowToStep",
          name: "Plug DC cable into Starlink Mini",
          text: "Plug the other end of the DC cable into the Starlink Mini's DC port. Ensure the plug face is flush with the port surface.",
        },
        {
          "@type": "HowToStep",
          name: "Activate the LinkPower 2",
          text: "Plug an external USB-C PD power supply into the LinkPower 2, or press and hold the power button for 10 seconds until the screen turns on.",
        },
        {
          "@type": "HowToStep",
          name: "Attach LinkPower 2 to Starlink Mini",
          text: "Slide the LinkPower 2 toward the Starlink Mini until you hear a click confirming a secure attachment.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the LinkPower 2?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The LinkPower 2 is a 99Wh portable power bank from PeakDo, designed specifically as a battery backup for the Starlink Mini. It mounts directly to the back of the dish and provides about 5 hours of continuous runtime.",
          },
        },
        {
          "@type": "Question",
          name: "How is LinkPower 2 different from LinkPower 1?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "LinkPower 2 adds 100W USB-C input (vs 65W), dedicated DC and magnetic DC input ports, Smart Bypass Mode with auto-low and auto-full triggers, IP65 waterproofing (vs IPX4), about an hour more runtime, and additional power-button shortcuts.",
          },
        },
        {
          "@type": "Question",
          name: "How fast does the LinkPower 2 charge?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "With a 100W USB-C PD adapter, the LinkPower 2 charges from 20% to 80% in just 45 minutes.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the LinkPower 2 power the Starlink Mini?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Approximately 5 hours of continuous Starlink Mini runtime on a full charge.",
          },
        },
        {
          "@type": "Question",
          name: "What is Smart Bypass Mode on the LinkPower 2?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Smart Bypass routes external power directly to the Starlink Mini instead of through the battery. It engages automatically when the battery is below 3%, at 100%, or manually via the Web App.",
          },
        },
        {
          "@type": "Question",
          name: "What is the default LinkPower 2 Bluetooth pairing PIN?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A random six-digit PIN is shown on the LCD during pairing. If no PIN is shown, use the default 020555. You can toggle between random and fixed PIN modes by quickly pressing the power button three times.",
          },
        },
        {
          "@type": "Question",
          name: "Is the LinkPower 2 waterproof?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The LinkPower 2 is rated IP65 — dust-tight and protected against low-pressure water jets from any direction. It should not be submerged.",
          },
        },
      ],
    },
  ],
};

export default function LinkPower2QuickStartPage() {
  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <Nav />
      <Hero />
      <Body />
      <Footer />
      <Script
        id="ld-json-howto-lp2"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
    </main>
  );
}
