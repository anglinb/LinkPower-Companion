import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

/* =========================================================================
   LinkPower Companion — Terms of Service
   Static legal page. Server component (no "use client") so the metadata
   export is honored and the page is prerendered for `output: "export"`.
   ========================================================================= */

const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  ink: "#0F172A",
  inkSoft: "#334155",
  body: "#1F2937",
  muted: "#64748B",
  subtle: "#94A3B8",
  hairline: "#E5EAF1",
  mist: "#F2F5F8",
} as const;

const LAST_UPDATED = "May 5, 2026";

export const metadata: Metadata = {
  title: "Terms of Service — LinkPower Companion",
  description:
    "Terms of Service for LinkPower Companion, the unofficial iOS and Android companion app for the PeakDo Link-Power family of portable power stations.",
  alternates: { canonical: "/terms/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    url: "https://linkpower.app/terms/",
    title: "Terms of Service — LinkPower Companion",
    description:
      "Terms of Service for LinkPower Companion, the unofficial iOS and Android companion app for the PeakDo Link-Power family of portable power stations.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinkPower Companion terms of service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — LinkPower Companion",
    description:
      "Terms of Service for LinkPower Companion, the unofficial iOS and Android companion app for the PeakDo Link-Power family of portable power stations.",
    images: ["/og.png"],
  },
};

export default function TermsPage() {
  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <TopNav />
      <article
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "56px 24px 24px",
        }}
      >
        <p style={eyebrowStyle}>Legal</p>
        <h1 style={h1Style}>LinkPower Companion Terms of Service</h1>
        <p style={updatedStyle}>Effective {LAST_UPDATED}</p>

        <Section title="the service">
          <p style={pStyle}>
            LinkPower Companion lets you connect to PeakDo Link-Power portable
            power stations over Bluetooth to view live battery telemetry,
            toggle DC ports, set USB-C charging limits, and configure on/off
            schedules. The App relies on platform Bluetooth APIs, iOS,
            Android, and optional platform sync. The Service is not affiliated with,
            endorsed by, or sponsored by PeakDo Tech, Inc.; product names and
            brands are used for identification only.
          </p>
        </Section>

        <Section title="your data">
          <p style={pStyle}>
            The Service doesn&rsquo;t require account creation. Your devices,
            saved settings, and pairing data remain on your phone and sync
            only if you enable platform sync. You bear responsibility for
            device and account security.
          </p>
        </Section>

        <Section title="acceptable use">
          <p style={pStyle}>You must not:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Reverse engineer, scrape, or abuse the Service</li>
            <li style={liStyle}>
              Circumvent rate limits or attempt to access another user&rsquo;s
              data or hardware
            </li>
            <li style={liStyle}>
              Use the Service illegally or to violate others&rsquo; rights
            </li>
            <li style={liStyle}>
              Build competing products atop the Service
            </li>
          </ul>
        </Section>

        <Section title="telemetry is not life-safety">
          <p style={pStyle}>
            LinkPower Companion is a consumer companion app and is not suited
            for medical, mission-critical, or off-grid life-safety use. We
            don&rsquo;t guarantee Bluetooth connectivity, telemetry accuracy,
            schedule execution, or port-control behavior in the face of
            firmware updates, battery issues, hardware faults, range
            limitations, platform background restrictions, or permission changes.
            You remain responsible for the safe operation of your power
            station and any devices connected to it.
          </p>
        </Section>

        <Section title="third parties">
          <p style={pStyle}>
            The Service depends on Apple&rsquo;s App Store, Google Play,
            platform Bluetooth APIs, iOS, Android, optional platform sync,
            and Cloudflare hosting, each governed by their own terms.
            PeakDo Link-Power hardware is governed by its
            manufacturer&rsquo;s warranty and instructions.
          </p>
        </Section>

        <Section title="changes & availability">
          <p style={pStyle}>
            Features may be added, modified, or removed. Service access may
            be suspended for policy violations or user harm.
          </p>
        </Section>

        <Section title="fees">
          <p style={pStyle}>
            Currently free, though paid features may be introduced with clear
            disclosure beforehand. Any future purchases are processed by
            Apple under their standard terms.
          </p>
        </Section>

        <Section title="disclaimers">
          <p style={pStyle}>
            Services provided &ldquo;as is&rdquo; without warranties
            regarding merchantability or fitness for a particular purpose.
          </p>
        </Section>

        <Section title="limitation of liability">
          <p style={pStyle}>
            Liability capped at USD 100 or amounts paid in the preceding
            twelve months, whichever is greater.
          </p>
        </Section>

        <Section title="termination">
          <p style={pStyle}>
            Users may delete data or uninstall anytime. The company may
            terminate access for policy breaches.
          </p>
        </Section>

        <Section title="governing law">
          <p style={pStyle}>
            California state law applies; disputes resolved in San Francisco
            County courts.
          </p>
        </Section>

        <Section title="changes to these terms">
          <p style={pStyle}>
            Material updates reflected in the effective date above; continued
            use signals acceptance.
          </p>
        </Section>

        <Section title="contact">
          <p style={pStyle}>
            Direct inquiries via the{" "}
            <a href="/support/" style={linkStyle}>
              support page
            </a>
            , which routes to our inbox. We avoid an inline{" "}
            <code>mailto:</code> here because Cloudflare&rsquo;s email
            obfuscation rewrites it into a{" "}
            <code>/cdn-cgi/l/email-protection</code> URL that crawlers
            then flag as broken.
          </p>
        </Section>

        <LegalFooter current="terms" />
      </article>
    </main>
  );
}

/* ========================== Shared building blocks ===================== */

function TopNav() {
  return (
    <nav
      style={{
        borderBottom: `1px solid ${THEME.hairline}`,
        background: "#fff",
        padding: "14px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: THEME.ink,
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              overflow: "hidden",
              display: "inline-block",
              background: "#fff",
            }}
          >
            <img
              src="/app-icon-fg.png"
              alt=""
              width={24}
              height={24}
              style={{ display: "block" }}
            />
          </span>
          LinkPower Companion
        </a>
        <a
          href="/"
          style={{
            color: THEME.blue,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Back to home
        </a>
      </div>
    </nav>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: 36 }}>
      <h2 style={h2Style}>{title}</h2>
      {children}
    </section>
  );
}

function LegalFooter({ current }: { current: "terms" | "privacy" }) {
  return (
    <footer
      style={{
        marginTop: 64,
        paddingTop: 24,
        borderTop: `1px solid ${THEME.hairline}`,
        display: "flex",
        gap: 20,
        flexWrap: "wrap",
        fontSize: 13,
        color: THEME.muted,
      }}
    >
      <a href="/" style={footerLinkStyle}>
        ← Home
      </a>
      {current === "terms" ? (
        <a href="/privacy/" style={footerLinkStyle}>
          Privacy Policy
        </a>
      ) : (
        <a href="/terms/" style={footerLinkStyle}>
          Terms of Service
        </a>
      )}
      <a href="/support/" style={footerLinkStyle}>
        Support
      </a>
      <a href="/manual/" style={footerLinkStyle}>
        User Manual
      </a>
      <a href="/blog/" style={footerLinkStyle}>
        Blog
      </a>
      <a href="/linkpower-1-quick-start/" style={footerLinkStyle}>
        LinkPower 1
      </a>
      <a href="/linkpower-2-quick-start/" style={footerLinkStyle}>
        LinkPower 2
      </a>
      <span style={{ color: THEME.subtle, marginLeft: "auto" }}>
        © {new Date().getFullYear()} LinkPower
      </span>
    </footer>
  );
}

/* ============================== Style tokens =========================== */

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  color: THEME.blue,
  margin: 0,
};

const h1Style: CSSProperties = {
  fontSize: 40,
  lineHeight: 1.15,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  margin: "8px 0 12px",
  color: THEME.ink,
};

const h2Style: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.3,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  margin: "0 0 12px",
  color: THEME.ink,
};

const updatedStyle: CSSProperties = {
  fontSize: 13,
  color: THEME.muted,
  margin: 0,
};

const pStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: THEME.body,
  margin: "0 0 14px",
};

const ulStyle: CSSProperties = {
  margin: "0 0 14px",
  paddingLeft: 22,
};

const liStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: THEME.body,
  marginBottom: 6,
};

const linkStyle: CSSProperties = {
  color: THEME.blue,
  textDecoration: "underline",
};

const footerLinkStyle: CSSProperties = {
  color: THEME.inkSoft,
  textDecoration: "none",
  fontWeight: 600,
};
