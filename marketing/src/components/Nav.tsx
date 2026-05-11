// Sticky top nav, copied from `src/app/page.tsx` so blog pages feel
// native. Single source of truth — if the homepage nav changes, update
// here too.
import { APP_STORE_URL, THEME } from "./theme";

interface Props {
  /** Highlights the matching link with a stronger color + underline. */
  current?: "features" | "devices" | "faq" | "blog";
}

export function Nav({ current }: Props) {
  const linkStyle = (key: typeof current) => ({
    color: current === key ? THEME.blue : THEME.inkSoft,
    textDecoration: "none",
    fontWeight: current === key ? 700 : 500,
  });

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
          gap: 16,
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/app-icon-fg.png"
              alt=""
              width={32}
              height={32}
              style={{ display: "block" }}
            />
          </span>
          <span
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 14,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <a href="/#features" style={linkStyle("features")}>
            Features
          </a>
          <a href="/#devices" style={linkStyle("devices")}>
            Devices
          </a>
          <a href="/blog/" style={linkStyle("blog")}>
            Blog
          </a>
          <a href="/#faq" style={linkStyle("faq")}>
            FAQ
          </a>
          <a
            href={APP_STORE_URL}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: THEME.blue,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Get the app
          </a>
        </nav>
      </div>
    </header>
  );
}
