import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Script from "next/script";

/* =========================================================================
   LinkPower Companion — Support
   Static contact page. Server component (no "use client") so the metadata
   export is honored and the page is prerendered for `output: "export"`.

   The form posts directly to formsubmit.co (no first-party server needed
   in static export). When formsubmit redirects the user back here with
   ?sent=1 the inline script swaps the form for a thank-you state.
   ========================================================================= */

const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  blueSoft: "#B8D4E8",
  blueWash: "#E6F0F8",
  ink: "#0F172A",
  inkSoft: "#334155",
  body: "#1F2937",
  muted: "#64748B",
  subtle: "#94A3B8",
  hairline: "#E5EAF1",
  mist: "#F2F5F8",
} as const;

// formsubmit.co inbox. Mirrors the TodoAlarm site pattern — a single
// human inbox, no ticketing system. Routed via formsubmit so we never
// have to expose the address as plain text in the HTML.
const SUPPORT_FORMSUBMIT_TARGET = "brianranglin@gmail.com";
const SITE_URL = "https://linkpower.app";

export const metadata: Metadata = {
  title: "Support — LinkPower Companion",
  description:
    "Get in touch about LinkPower Companion. Send a question, bug report, or feature request and we'll get back to you.",
  alternates: { canonical: "/support/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    title: "Support — LinkPower Companion",
    description:
      "Get in touch about LinkPower Companion. Send a question, bug report, or feature request and we'll get back to you.",
    url: `${SITE_URL}/support/`,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Support for LinkPower Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Support — LinkPower Companion",
    description:
      "Get in touch about LinkPower Companion. Send a question, bug report, or feature request and we'll get back to you.",
    images: ["/og.png"],
  },
};

export default function SupportPage() {
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
        <p style={eyebrowStyle}>Support</p>
        <h1 style={h1Style}>LinkPower Companion support &amp; feedback</h1>
        <p style={ledeStyle}>
          Hit a bug, missing a feature, or just want to say hi? Drop a note
          and we&rsquo;ll get back to you. Real human, no ticketing system.
        </p>

        <form
          id="support-form"
          action={`https://formsubmit.co/${SUPPORT_FORMSUBMIT_TARGET}`}
          method="POST"
          style={formStyle}
        >
          {/* formsubmit.co config */}
          <input
            type="hidden"
            name="_subject"
            value="LinkPower Companion support request"
          />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="true" />
          <input
            type="hidden"
            name="_next"
            value={`${SITE_URL}/support/?sent=1`}
          />
          {/* honeypot */}
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            style={{ display: "none" }}
          />

          <Field label="Your name" htmlFor="support-name">
            <input
              id="support-name"
              type="text"
              name="name"
              required
              autoComplete="name"
              placeholder="Pat Doe"
              style={inputStyle}
            />
          </Field>

          <Field label="Email" htmlFor="support-email">
            <input
              id="support-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              style={inputStyle}
            />
          </Field>

          <Field label="Device (optional)" htmlFor="support-device">
            <input
              id="support-device"
              type="text"
              name="device"
              autoComplete="off"
              placeholder="e.g. Link-Power 1, LP2, LP+, or N/A"
              style={inputStyle}
            />
          </Field>

          <Field label="Message" htmlFor="support-message">
            <textarea
              id="support-message"
              name="message"
              required
              rows={7}
              placeholder="Tell us what's up — bug, feature idea, question, anything."
              style={{ ...inputStyle, ...textareaStyle }}
            />
          </Field>

          <button type="submit" className="lp-pressable" style={submitStyle}>
            Send message
          </button>

          <p style={fineprintStyle}>
            By sending, you agree to be contacted at the email above
            regarding your request.
          </p>
        </form>

        <div id="support-thanks" hidden style={thanksStyle}>
          <h2 style={h2Style}>Got it — thanks!</h2>
          <p style={pStyle}>
            Your message is on its way. We&rsquo;ll reply to the email you
            provided, usually within a day or two.
          </p>
          <a href="/" style={linkStyle}>
            ← Back home
          </a>
        </div>

        <LegalFooter />
      </article>

      {/* If we redirected back here with ?sent=1, show the thank-you
          state. Inline script keeps this working on a static export
          without shipping a client component. */}
      <Script id="support-sent-toggle" strategy="afterInteractive">
        {`
          (function () {
            try {
              var params = new URLSearchParams(window.location.search);
              if (params.get("sent") === "1") {
                var form = document.getElementById("support-form");
                var thanks = document.getElementById("support-thanks");
                if (form) form.hidden = true;
                if (thanks) {
                  thanks.hidden = false;
                  thanks.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
                }
              }
            } catch (e) {}
          })();
        `}
      </Script>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} style={fieldStyle}>
      <span style={fieldLabelStyle}>{label}</span>
      {children}
    </label>
  );
}

function LegalFooter() {
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
      <a href="/privacy/" style={footerLinkStyle}>
        Privacy Policy
      </a>
      <a href="/terms/" style={footerLinkStyle}>
        Terms of Service
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
  fontSize: 24,
  lineHeight: 1.25,
  fontWeight: 800,
  letterSpacing: "-0.01em",
  margin: "0 0 10px",
  color: THEME.ink,
};

const ledeStyle: CSSProperties = {
  fontSize: 17,
  lineHeight: 1.6,
  color: THEME.inkSoft,
  margin: "0 0 32px",
};

const pStyle: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: THEME.body,
  margin: "0 0 14px",
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: 20,
  background: THEME.mist,
  border: `1px solid ${THEME.hairline}`,
  borderRadius: 16,
  padding: 24,
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: 6,
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: THEME.ink,
  letterSpacing: "-0.005em",
};

const inputStyle: CSSProperties = {
  width: "100%",
  font: "inherit",
  fontSize: 16,
  color: THEME.ink,
  background: "#fff",
  border: `1.5px solid ${THEME.hairline}`,
  borderRadius: 10,
  padding: "12px 14px",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
  boxSizing: "border-box",
};

const textareaStyle: CSSProperties = {
  resize: "vertical",
  minHeight: 160,
  lineHeight: 1.5,
  fontFamily: "inherit",
};

const submitStyle: CSSProperties = {
  justifySelf: "start",
  appearance: "none",
  border: "none",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "-0.005em",
  color: "#fff",
  background: THEME.blue,
  padding: "12px 24px",
  borderRadius: 999,
  boxShadow: "0 1px 2px rgba(15,23,42,0.15)",
};

const fineprintStyle: CSSProperties = {
  margin: 0,
  color: THEME.muted,
  fontSize: 12,
  lineHeight: 1.5,
};

const thanksStyle: CSSProperties = {
  marginTop: 8,
  background: THEME.blueWash,
  border: `1px solid ${THEME.blueSoft}`,
  borderRadius: 16,
  padding: 24,
};

const linkStyle: CSSProperties = {
  color: THEME.blue,
  textDecoration: "underline",
  fontWeight: 600,
};

const footerLinkStyle: CSSProperties = {
  color: THEME.inkSoft,
  textDecoration: "none",
  fontWeight: 600,
};
