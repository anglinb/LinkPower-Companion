import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

/* =========================================================================
   LinkPower Companion — Privacy Policy
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

const LAST_UPDATED = "September 26, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy — LinkPower Companion",
  description:
    "How LinkPower Companion handles Bluetooth data, optional PeakDo cloud accounts, purchases, and support diagnostics.",
  alternates: { canonical: "/privacy/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    url: "https://linkpower.app/privacy/",
    title: "Privacy Policy — LinkPower Companion",
    description:
      "How LinkPower Companion handles Bluetooth data, optional PeakDo cloud accounts, purchases, and support diagnostics.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinkPower Companion privacy policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — LinkPower Companion",
    description:
      "How LinkPower Companion handles Bluetooth data, optional PeakDo cloud accounts, purchases, and support diagnostics.",
    images: ["/og.png"],
  },
};

export default function PrivacyPage() {
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
        <h1 style={h1Style}>LinkPower Companion Privacy Policy</h1>
        <p style={updatedStyle}>Effective {LAST_UPDATED}</p>

        <Section title="Overview">
          <p style={pStyle}>
            This policy describes information used by LinkPower Companion and
            linkpower.app. Bluetooth monitoring works without a PeakDo account.
            Optional cloud features, purchases, and support requests use the
            services described below. Feature availability varies by platform.
          </p>
        </Section>

        <Section title="Device Data and Permissions">
          <p style={pStyle}>
            The app stores saved battery identifiers and names, preferences,
            recent readings, and connection diagnostics on your device. Bluetooth
            exchanges battery, port, temperature, network, and schedule data with
            your power station. iOS widgets and Live Activities use a shared local
            cache. We do not currently offer CloudKit device-list synchronization.
          </p>
          <p style={pStyle}>
            Wi-Fi credentials you enter are sent to the battery over Bluetooth;
            saved credentials are stored in the iOS Keychain. Camera access is
            used when you choose to scan a battery binding code. Battery alerts
            use local notifications when you allow them. Optional Starlink access
            reads dish telemetry; sharing dish location with PeakDo requires the
            separate location-sharing control.
          </p>
        </Section>

        <Section title="Optional PeakDo Cloud Account">
          <p style={pStyle}>
            Remote monitoring requires a PeakDo account. Authentication uses
            PeakDo&rsquo;s Amazon Web Services infrastructure. PeakDo processes
            account details, linked battery identifiers, remote commands, and
            device telemetry. If you choose Google or Amazon sign-in, that
            provider also handles authentication. Signing out clears the app&rsquo;s
            cloud monitoring cache; it does not delete your vendor-held account
            or remove battery ownership at PeakDo.
          </p>
        </Section>

        <Section title="Account Deletion Requests">
          <p style={pStyle}>
            Signed-in users can initiate a deletion request from Settings &rarr;
            Delete account when the service is available. The app displays the
            manual processing timeframe before confirmation and a receipt after
            the request is saved. We email you when deletion is complete.
            Requesting deletion does not itself remove the account or cancel
            an App Store subscription.
          </p>
          <p style={pStyle}>
            We verify your PeakDo sign-in and store your account identifier,
            username, email and its verification status, linked sign-in provider
            names, app user identifier, request date, deadline, and processing
            status in Cloudflare D1. We notify authorized support staff by email
            so they can process the request. We do not store your authentication
            token or upload a diagnostic bundle through this form. Deletion
            request records are retained until manually removed when no longer
            needed to process or document the request.
          </p>
        </Section>

        <Section title="Purchases and App Usage">
          <p style={pStyle}>
            Apple App Store or Google Play handles payment. Superwall provides
            purchase offers and entitlement handling and processes an app user
            identifier, purchase status, device/app information, and paywall and
            feature usage events. We do not receive your full payment-card
            details. These services are separate from PeakDo cloud sign-in.
          </p>
        </Section>

        <Section title="Diagnostics and Support">
          <p style={pStyle}>
            Recent diagnostic logs are retained locally to investigate connection
            and command failures. They can contain device identifiers, network
            names, telemetry, and account-related metadata. Credentials are
            redacted, but these logs are not anonymous.
          </p>
          <p style={pStyle}>
            When you submit an in-app support request, you send your contact email,
            message, Superwall user ID, app/OS details, and the diagnostic bundle
            described in the form. The bundle can include saved devices, account
            claims, recent Bluetooth/cloud logs, battery and Starlink readings,
            schedules, and widget caches. It excludes saved Wi-Fi passwords and
            authentication tokens. Opening the support form does not submit it.
          </p>
          <p style={pStyle}>
            Support requests are stored in Cloudflare D1 and private R2 storage
            and made available to authorized support staff through email
            notifications and private download links. Request metadata is also
            used to limit abuse. We use submitted information to respond to your
            request and diagnose problems.
          </p>
        </Section>

        <Section title="Website and Service Providers">
          <p style={pStyle}>
            Cloudflare hosts the website and support endpoint and processes
            request metadata. Google Analytics and Ahrefs Analytics measure
            website traffic. Website analytics are separate from the app&rsquo;s
            Superwall integration. Apple, Google, Amazon, PeakDo, Superwall, and
            Cloudflare process information under their own applicable policies.
            We do not sell your data.
          </p>
        </Section>

        <Section title="Your Choices and Retention">
          <p style={pStyle}>
            You can use Bluetooth without cloud sign-in, remove saved devices,
            sign out of your PeakDo account, disable cloud monitoring, and manage
            Bluetooth, camera, and notification permissions in system settings.
            Unlinking a cloud battery removes its account association; it does
            not delete the account. Manage or cancel App Store subscriptions in
            Apple&rsquo;s subscription settings; uninstalling does not cancel them.
          </p>
          <p style={pStyle}>
            Local logs rotate as new events are recorded. Submitted support
            requests and bundles are retained until manually deleted; there is
            currently no automatic 30-day deletion policy. Private support-link
            expiry does not delete the stored request. Contact support to request
            access to or deletion of information we hold. Use Settings &rarr;
            Delete account to initiate a PeakDo account deletion request; these
            requests require manual processing with the account provider.
            Removing the app does not
            delete information already sent to these services, and Keychain
            credentials can persist after uninstalling.
          </p>
        </Section>

        <Section title="Children">
          <p style={pStyle}>
            LinkPower Companion is not directed to children under 13 and we
            do not knowingly collect personal information from them.
          </p>
        </Section>

        <Section title="Changes">
          <p style={pStyle}>
            We may update this policy as the product evolves. Material
            changes will be reflected by updating the effective date above
            and, where appropriate, surfacing an in-app notice on next
            launch.
          </p>
        </Section>

        <Section title="Contact">
          <p style={pStyle}>
            Questions about this policy can be sent via the{" "}
            <a href="/support/" style={linkStyle}>
              support page
            </a>
            . Include your support receipt ID if your request concerns a
            previously submitted diagnostic bundle.
          </p>
        </Section>

        <LegalFooter current="privacy" />
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
      {current === "privacy" ? (
        <a href="/terms/" style={footerLinkStyle}>
          Terms of Service
        </a>
      ) : (
        <a href="/privacy/" style={footerLinkStyle}>
          Privacy Policy
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

const h3Style: CSSProperties = {
  fontSize: 16,
  lineHeight: 1.35,
  fontWeight: 700,
  margin: "18px 0 8px",
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
