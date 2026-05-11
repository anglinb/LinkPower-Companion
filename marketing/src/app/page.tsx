import type { CSSProperties, ReactNode } from "react";
import { posts } from "../data/posts";

/* =========================================================================
   Link-Power Companion — Marketing landing page
   Clean, technical Apple Health–inspired direction.
   Palette derived from PeakDo accent (sRGB 0.082, 0.451, 0.698 ≈ #1573B2).
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
  near: "#0A1320",
} as const;

/* Simple iPhone frame — clean black bezel, todo-alarm.com style */
function Phone({
  src,
  alt,
  style,
  rotate = 0,
  scale = 1,
}: {
  src: string;
  alt: string;
  style?: CSSProperties;
  rotate?: number;
  scale?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1206 / 2622",
        borderRadius: "13% / 6%",
        overflow: "hidden",
        background: "#0E1116",
        padding: "2.4%",
        boxShadow:
          "0 30px 60px -20px rgba(14,82,133,0.35), 0 12px 24px -10px rgba(15,23,42,0.25)",
        transform: `rotate(${rotate}deg) scale(${scale})`,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10% / 4.6%",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
      </div>
    </div>
  );
}

/* Tiny inline icons (so we don't need an icon lib) */
function Icon({ name, size = 22, color = THEME.blue }: { name: string; size?: number; color?: string }) {
  const stroke = { stroke: color, strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const sw = size;
  switch (name) {
    case "bolt":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
        </svg>
      );
    case "battery":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <rect x="2" y="7" width="17" height="10" rx="2.5" />
          <path d="M22 10v4" />
          <path d="M5 10v4M8 10v4M11 10v4" />
        </svg>
      );
    case "plug":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M9 4v5M15 4v5" />
          <rect x="6" y="9" width="12" height="6" rx="2" />
          <path d="M12 15v3a3 3 0 0 0 3 3h0" />
        </svg>
      );
    case "gauge":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M3 14a9 9 0 1 1 18 0" />
          <path d="M12 14l4-4" />
          <circle cx="12" cy="14" r="1.4" fill={color} />
        </svg>
      );
    case "clock":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "ble":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M8 7l8 10-4 4V3l4 4-8 10" />
        </svg>
      );
    case "shield":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3Z" />
        </svg>
      );
    case "radio":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <circle cx="12" cy="12" r="2" fill={color} />
          <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      );
    case "sliders":
      return (
        <svg width={sw} height={sw} viewBox="0 0 24 24" {...stroke}>
          <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h14M20 17h0" />
          <circle cx="16" cy="7" r="2" fill={THEME.cloud} />
          <circle cx="8" cy="12" r="2" fill={THEME.cloud} />
          <circle cx="18" cy="17" r="2" fill={THEME.cloud} />
        </svg>
      );
    default:
      return null;
  }
}

/* =====================================================================
   Sections
   ===================================================================== */

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
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
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
            <img src="/app-icon-fg.png" alt="" width={32} height={32} style={{ display: "block" }} />
          </span>
          <span className="lp-brand-text" style={{ fontWeight: 800, color: THEME.ink, fontSize: 16, letterSpacing: "-0.01em" }}>
            Link-Power Companion
          </span>
        </a>
        <nav className="lp-nav-links" style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, fontWeight: 500 }}>
          <a className="lp-nav-link" href="#features" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Features</a>
          <a className="lp-nav-link" href="#devices" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Devices</a>
          <a className="lp-nav-link" href="/blog/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Blog</a>
          <a className="lp-nav-link" href="#faq" style={{ color: THEME.inkSoft, textDecoration: "none" }}>FAQ</a>
          <a
            className="lp-nav-cta"
            href="https://github.com/anglinb/LinkPower-Companion"
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

function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(165deg, ${THEME.cloud} 0%, ${THEME.blueWash} 70%, ${THEME.blueSoft} 100%)`,
      }}
    >
      {/* Engineering grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${THEME.blueDeep} 1px, transparent 1px), linear-gradient(90deg, ${THEME.blueDeep} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.05,
          maskImage: "radial-gradient(ellipse at top, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 40%, transparent 80%)",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: THEME.blue,
          filter: "blur(120px)",
          opacity: 0.18,
          top: -300,
          right: -200,
        }}
      />

      <div
        className="lp-hero-grid"
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "88px 24px 24px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(21,115,178,0.08)",
              border: `1px solid rgba(21,115,178,0.18)`,
              color: THEME.blueDeep,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: THEME.charging,
                boxShadow: `0 0 10px ${THEME.charging}`,
              }}
            />
            LinkPower app · now on the App Store
          </div>

          <h1
            className="lp-hero-headline"
            style={{
              fontSize: "clamp(40px, 6vw, 76px)",
              lineHeight: 0.96,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: THEME.ink,
              margin: "0 0 20px",
            }}
          >
            Your Link-Power,
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${THEME.blue} 0%, ${THEME.blueDeep} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              fully wired in.
            </span>
          </h1>

          <p
            style={{
              fontSize: 19,
              lineHeight: 1.5,
              color: THEME.inkSoft,
              maxWidth: 540,
              margin: "0 0 32px",
              fontWeight: 500,
            }}
          >
            The <strong style={{ fontWeight: 700, color: "inherit" }}>LinkPower app</strong> is a clean, native iOS companion for the
            PeakDo Link-Power family. Live battery telemetry, DC port control, USB-C limits,
            and on/off scheduling — all over Bluetooth.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://apps.apple.com/us/app/linkpower-companion/id6762404390"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 22px",
                borderRadius: 12,
                background: THEME.ink,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 15,
                boxShadow: "0 8px 20px -8px rgba(15,23,42,0.5)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <path d="M16.7 13.3c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2.1-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.5-3-.1-.1-2.8-1.1-2.8-4.3-.1-2.6 1.7-3.7 1.8-3.7-1-1.5-2.5-1.6-3-1.6Z" />
                <path d="M14.4 5c.8-.9 1.3-2.2 1.2-3.5-1.1.1-2.4.8-3.2 1.6-.7.8-1.4 2-1.2 3.3 1.2.1 2.4-.5 3.2-1.4Z" />
              </svg>
              Download on the App Store
            </a>
            <a
              href="#features"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 18px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.7)",
                color: THEME.ink,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 15,
                border: `1px solid ${THEME.hairline}`,
              }}
            >
              See features →
            </a>
          </div>

          <div style={{ marginTop: 36, display: "flex", gap: 28, color: THEME.muted, fontSize: 13, fontWeight: 600 }}>
            <span>iOS 17+</span>
            <span style={{ color: THEME.hairline }}>·</span>
            <span>Zero ads, zero tracking</span>
            <span style={{ color: THEME.hairline }}>·</span>
            <span>Open source</span>
          </div>
        </div>

        {/* Hero phone */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div className="lp-hero-phone-wrap" style={{ position: "relative", width: "min(420px, 100%)" }}>
            {/* Floating accent badges */}
            <div
              className="lp-hero-badge-left"
              style={{
                position: "absolute",
                top: "12%",
                left: "-18%",
                background: "#fff",
                borderRadius: 14,
                padding: "10px 14px",
                boxShadow: "0 12px 28px -10px rgba(15,23,42,0.25)",
                border: `1px solid ${THEME.hairline}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 2,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(52,199,89,0.12)",
                  display: "grid",
                  placeItems: "center",
                  color: THEME.charging,
                }}
              >
                <Icon name="bolt" size={18} color={THEME.charging} />
              </span>
              <div>
                <div style={{ fontSize: 11, color: THEME.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Charging
                </div>
                <div style={{ fontSize: 16, color: THEME.ink, fontWeight: 800 }}>72.4 W</div>
              </div>
            </div>
            <div
              className="lp-hero-badge-right"
              style={{
                position: "absolute",
                bottom: "16%",
                right: "-14%",
                background: "#fff",
                borderRadius: 14,
                padding: "10px 14px",
                boxShadow: "0 12px 28px -10px rgba(15,23,42,0.25)",
                border: `1px solid ${THEME.hairline}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                zIndex: 2,
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "rgba(21,115,178,0.12)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="battery" size={18} color={THEME.blue} />
              </span>
              <div>
                <div style={{ fontSize: 11, color: THEME.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Runtime
                </div>
                <div style={{ fontSize: 16, color: THEME.ink, fontWeight: 800 }}>3.6 h</div>
              </div>
            </div>

            <Phone src="/screenshots/en/02-dashboard.webp" alt="Live battery dashboard" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  accent = THEME.blue,
}: {
  icon: string;
  title: string;
  body: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${THEME.hairline}`,
        borderRadius: 18,
        padding: 24,
        boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 16px -8px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}1A`, // 10% alpha
          display: "grid",
          placeItems: "center",
          marginBottom: 18,
        }}
      >
        <Icon name={icon} size={22} color={accent} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: THEME.ink, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: THEME.muted, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>{body}</p>
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="lp-section" style={{ background: THEME.mist, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: THEME.blue,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            What it does
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              color: THEME.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 16px",
            }}
          >
            Everything the OEM app forgot.
          </h2>
          <p style={{ fontSize: 17, color: THEME.muted, lineHeight: 1.55, margin: 0 }}>
            Built for off-grid setups, vanlife rigs, photographers, and anyone who actually
            needs to see what their pack is doing in real time.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          <FeatureCard icon="ble" title="One-tap BLE pairing" body="Scan, connect, and auto-reconnect to LP1, LP2, and LP+ devices." />
          <FeatureCard icon="gauge" title="Live telemetry" body="Battery level, capacity, voltage, current, and remaining runtime — streamed live." accent={THEME.charging} />
          <FeatureCard icon="plug" title="DC port control" body="Toggle output, monitor power, and flip on bypass mode when you need direct passthrough." />
          <FeatureCard icon="bolt" title="USB-C insight" body="Charging vs discharging state, port temperature, live power readings." accent={THEME.discharging} />
          <FeatureCard icon="sliders" title="Power limits" body="Set global, input, output, and runtime caps from 30W to 100W." />
          <FeatureCard icon="clock" title="Smart scheduling" body="Up to 6 timers — one-shot, daily, weekly, or monthly — for hands-free DC cycling." accent={THEME.amber} />
          <FeatureCard icon="radio" title="Date & time sync" body="Push your phone's clock to the device in a single tap." />
          <FeatureCard icon="shield" title="Expert & Dev modes" body="Restart, shut down, factory mode, BLE PIN — all the controls, none of the menus." />
        </div>
      </div>
    </section>
  );
}

/* Big alternating feature blocks */
function Spotlight({
  eyebrow,
  title,
  body,
  bullets,
  image,
  alt,
  reverse = false,
  background,
  textColor = THEME.ink,
  bodyColor = THEME.muted,
  eyebrowColor = THEME.blue,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  bullets: { icon: string; label: string; color?: string }[];
  image: string;
  alt: string;
  reverse?: boolean;
  background: string;
  textColor?: string;
  bodyColor?: string;
  eyebrowColor?: string;
}) {
  return (
    <section className="lp-section" style={{ background, padding: "96px 24px", overflow: "hidden", position: "relative" }}>
      <div
        className="lp-spotlight-grid"
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
          flexDirection: reverse ? "row-reverse" : "row",
        }}
      >
        <div style={{ order: reverse ? 2 : 1 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: eyebrowColor,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {eyebrow}
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 900,
              color: textColor,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              margin: "0 0 18px",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: 17, color: bodyColor, lineHeight: 1.55, margin: "0 0 24px", maxWidth: 460 }}>{body}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
            {bullets.map((b) => (
              <li key={b.label} style={{ display: "flex", alignItems: "center", gap: 12, color: textColor === THEME.ink ? THEME.inkSoft : "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: textColor === THEME.ink ? `${b.color || eyebrowColor}1A` : "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={b.icon} size={16} color={b.color || eyebrowColor} />
                </span>
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ order: reverse ? 1 : 2, display: "flex", justifyContent: "center" }}>
          <div className="lp-spotlight-phone-wrap" style={{ width: "min(360px, 100%)" }}>
            <Phone src={image} alt={alt} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   Live Activities + Widgets — big lock-screen callout
   ===================================================================== */
function LiveActivities() {
  return (
    <section
      className="lp-section-tall"
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(165deg, #0A1320 0%, #0E2236 55%, #14385F 100%)`,
        padding: "112px 24px",
        color: "#fff",
      }}
    >
      {/* Engineering grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      {/* Color glows */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: THEME.charging,
          filter: "blur(140px)",
          opacity: 0.18,
          top: "10%",
          left: "8%",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: THEME.discharging,
          filter: "blur(140px)",
          opacity: 0.18,
          bottom: "5%",
          right: "8%",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 1120,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Live Activities · Lock screen · Widgets
        </div>

        <h2
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.98,
            margin: "0 0 18px",
          }}
        >
          Glance.
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${THEME.charging} 0%, #5DB1E0 50%, ${THEME.discharging} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Don't unlock.
          </span>
        </h2>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 640,
            margin: "0 auto 64px",
            fontWeight: 500,
          }}
        >
          Live battery telemetry right on your lock screen and Home Screen — color-coded for charging
          and discharging, refreshed in real time over Bluetooth.
        </p>

        {/* Two phones side by side */}
        <div
          className="lp-live-phones"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            maxWidth: 760,
            margin: "0 auto 56px",
            alignItems: "end",
          }}
        >
          {/* Charging */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(52,199,89,0.16)",
                border: "1px solid rgba(52,199,89,0.45)",
                color: THEME.charging,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: 999,
                zIndex: 5,
                whiteSpace: "nowrap",
                boxShadow: "0 6px 20px -8px rgba(52,199,89,0.5)",
              }}
            >
              ▲ Charging
            </div>
            <Phone src="/screenshots/en/live-charging.webp" alt="Live activity — charging" rotate={-2} />
          </div>

          {/* Discharging */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "-14px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,149,0,0.16)",
                border: "1px solid rgba(255,149,0,0.5)",
                color: THEME.discharging,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "6px 12px",
                borderRadius: 999,
                zIndex: 5,
                whiteSpace: "nowrap",
                boxShadow: "0 6px 20px -8px rgba(255,149,0,0.5)",
              }}
            >
              ▼ Discharging
            </div>
            <Phone src="/screenshots/en/live-discharging.webp" alt="Live activity — discharging" rotate={2} />
          </div>
        </div>

        {/* Three feature pills */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "20px 18px",
              textAlign: "left",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(52,199,89,0.15)",
                display: "grid",
                placeItems: "center",
                marginBottom: 12,
              }}
            >
              <Icon name="bolt" size={18} color={THEME.charging} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Color-coded state</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Green when topping up, orange when running gear. Read it from across the room.
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "20px 18px",
              textAlign: "left",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(21,115,178,0.18)",
                display: "grid",
                placeItems: "center",
                marginBottom: 12,
              }}
            >
              <Icon name="clock" size={18} color="#5DB1E0" />
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Time-to-full / time-left</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              Continuously updated runtime estimate so you know exactly how much you've got left.
            </div>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "20px 18px",
              textAlign: "left",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(255,176,32,0.18)",
                display: "grid",
                placeItems: "center",
                marginBottom: 12,
              }}
            >
              <Icon name="gauge" size={18} color={THEME.amber} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Power · Voltage · Current</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              The numbers that actually matter, all on the lock screen — no app required.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Devices() {
  const devices = [
    { name: "Link-Power 1", code: "LP1", model: "BP4SL3V1", features: ["Battery", "DC", "USB-C", "Scheduled control"] },
    { name: "Link-Power 2", code: "LP2", model: "BP4SL3V2", features: ["Battery", "DC", "USB-C", "DC bypass", "DC input"] },
    { name: "Link-Power+", code: "LP+", model: "BP4SL3", features: ["DC port control"] },
  ];
  return (
    <section id="devices" className="lp-section" style={{ background: "#fff", padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: THEME.blue,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Compatibility
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              color: THEME.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Works with the whole Link-Power family.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {devices.map((d) => (
            <div
              key={d.code}
              style={{
                background: `linear-gradient(180deg, ${THEME.blueWash} 0%, #fff 100%)`,
                border: `1px solid ${THEME.hairline}`,
                borderRadius: 18,
                padding: 24,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: THEME.blue,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    background: "rgba(21,115,178,0.1)",
                    padding: "4px 8px",
                    borderRadius: 6,
                  }}
                >
                  {d.code}
                </span>
                <span style={{ fontSize: 12, color: THEME.subtle, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                  {d.model}
                </span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: THEME.ink, letterSpacing: "-0.02em", margin: "4px 0 14px" }}>
                {d.name}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {d.features.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: THEME.inkSoft,
                      background: "#fff",
                      border: `1px solid ${THEME.hairline}`,
                      padding: "5px 10px",
                      borderRadius: 999,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FromTheBlog() {
  // Show the three most recent posts from the registry. The full list
  // lives at /blog. Pushing link equity from the homepage into each
  // post is a deliberate SEO move — the homepage is the strongest URL
  // on the site by external link count.
  const recent = posts.slice(0, 3);
  return (
    <section style={{ background: THEME.cloud, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: THEME.blue,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            From the blog
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 900,
              color: THEME.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 12px",
            }}
          >
            Guides for getting more out of your Link-Power.
          </h2>
        </div>

        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {recent.map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}/`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  background: "#fff",
                  border: `1px solid ${THEME.hairline}`,
                  borderRadius: 18,
                  padding: 24,
                  textDecoration: "none",
                  color: THEME.ink,
                  height: "100%",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 16px -8px rgba(15,23,42,0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: THEME.blueDeep,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {post.eyebrow}
                </span>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: "-0.015em",
                    lineHeight: 1.3,
                    margin: "4px 0 4px",
                    color: THEME.ink,
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: THEME.muted,
                    lineHeight: 1.55,
                    fontWeight: 500,
                  }}
                >
                  {post.excerpt}
                </p>
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 12,
                    fontSize: 13,
                    color: THEME.blueDeep,
                    fontWeight: 700,
                  }}
                >
                  {post.readTime} min read →
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a
            href="/blog/"
            style={{
              color: THEME.blueDeep,
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
              borderBottom: `2px solid ${THEME.blueDeep}`,
              paddingBottom: 2,
            }}
          >
            See all posts →
          </a>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    {
      q: "Is this the official PeakDo app?",
      a: "No. This is an unofficial, community-built companion app. It is not affiliated with, endorsed by, or supported by PeakDo Tech, Inc.",
    },
    {
      q: "Does it work without a device?",
      a: "Yes. Demo Mode lets you explore the entire app with simulated battery data — no hardware required.",
    },
    {
      q: "Does it work in the iOS Simulator?",
      a: "No. Bluetooth is not available in Simulator, so you'll need to run on a real iPhone.",
    },
    {
      q: "What data leaves my phone?",
      a: "None. The app talks directly to your battery over BLE. There are no servers, no analytics, no accounts.",
    },
    {
      q: "Is the source available?",
      a: "Yes — it's MIT licensed and fully open source.",
    },
  ];

  return (
    <section id="faq" className="lp-section" style={{ background: THEME.mist, padding: "96px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: THEME.blue, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>
            Questions
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 900, color: THEME.ink, letterSpacing: "-0.03em", margin: 0 }}>
            Things people ask.
          </h2>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((it) => (
            <details
              key={it.q}
              style={{
                background: "#fff",
                border: `1px solid ${THEME.hairline}`,
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: 700,
                  color: THEME.ink,
                  fontSize: 16,
                  listStyle: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {it.q}
                <span style={{ color: THEME.subtle, fontSize: 18, fontWeight: 400 }}>＋</span>
              </summary>
              <p style={{ marginTop: 12, marginBottom: 0, color: THEME.muted, fontSize: 15, lineHeight: 1.55 }}>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section
      className="lp-section-tall"
      style={{
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(165deg, ${THEME.near} 0%, #0E2236 60%, #163554 100%)`,
        padding: "104px 24px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: THEME.blue,
          filter: "blur(140px)",
          opacity: 0.32,
          top: "-30%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            margin: "0 0 18px",
          }}
        >
          Plug it in.
          <br />
          <span style={{ color: "#5DB1E0" }}>See everything.</span>
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, margin: "0 0 32px" }}>
          Free. Open source. No accounts. Just power.
        </p>
        <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href="https://apps.apple.com/us/app/linkpower-companion/id6762404390"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 24px",
              borderRadius: 12,
              background: "#fff",
              color: THEME.ink,
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 15,
              boxShadow: "0 12px 32px -12px rgba(0,0,0,0.5)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={THEME.ink}>
              <path d="M16.7 13.3c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2.1-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.5-3-.1-.1-2.8-1.1-2.8-4.3-.1-2.6 1.7-3.7 1.8-3.7-1-1.5-2.5-1.6-3-1.6Z" />
              <path d="M14.4 5c.8-.9 1.3-2.2 1.2-3.5-1.1.1-2.4.8-3.2 1.6-.7.8-1.4 2-1.2 3.3 1.2.1 2.4-.5 3.2-1.4Z" />
            </svg>
            Download on the App Store
          </a>
          <a
            href="https://github.com/anglinb/LinkPower-Companion"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 22px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 15,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${THEME.hairline}`, padding: "40px 24px 56px" }}>
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
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
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
              <img src="/app-icon-fg.png" alt="" width={28} height={28} style={{ display: "block" }} />
            </span>
            <span style={{ fontWeight: 800, color: THEME.ink, fontSize: 14 }}>Link-Power Companion</span>
          </div>
          <p style={{ fontSize: 12, color: THEME.muted, lineHeight: 1.6, margin: 0 }}>
            Unofficial. Not affiliated with, endorsed by, or supported by PeakDo Tech, Inc.
            Link-Power and PeakDo are trademarks of their respective owners. Use at your own risk.
            <br />
            <span style={{ color: THEME.subtle }}>MIT licensed · iOS 17+</span>
          </p>
        </div>
        <div className="lp-footer-links" style={{ display: "flex", gap: 28, fontSize: 13, fontWeight: 600 }}>
          <a href="#features" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Features</a>
          <a href="#devices" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Devices</a>
          <a href="/blog/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Blog</a>
          <a href="#faq" style={{ color: THEME.inkSoft, textDecoration: "none" }}>FAQ</a>
          <a href="/manual/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>User Manual</a>
          <a href="/linkpower-1-quick-start/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>LP1 Quick Start</a>
          <a href="/linkpower-2-quick-start/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>LP2 Quick Start</a>
          <a href="/support/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Support</a>
          <a href="https://github.com/anglinb/LinkPower-Companion" style={{ color: THEME.inkSoft, textDecoration: "none" }}>GitHub</a>
          <a href="/privacy/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Privacy</a>
          <a href="/terms/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>Terms</a>
        </div>
      </div>
    </footer>
  );
}

/* =====================================================================
   Page
   ===================================================================== */

export default function HomePage() {
  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <Nav />
      <Hero />
      <Features />

      <LiveActivities />

      <Spotlight
        eyebrow="Real-time telemetry"
        title={
          <>
            Live watts.
            <br />
            <span style={{ color: THEME.charging }}>Live amps.</span>
          </>
        }
        body="Every reading on screen comes straight from BLE notifications — no polling, no lag. Watch your battery breathe in real time."
        bullets={[
          { icon: "battery", label: "Capacity, level, voltage & current", color: THEME.charging },
          { icon: "gauge", label: "Estimated runtime, updated live", color: THEME.charging },
          { icon: "ble", label: "Notification-based, not polled", color: THEME.charging },
        ]}
        image="/screenshots/en/02-dashboard.webp"
        alt="Live battery dashboard"
        background={`radial-gradient(ellipse at 30% 20%, #14283C 0%, ${THEME.near} 55%, #04080F 100%)`}
        textColor="#fff"
        bodyColor="rgba(255,255,255,0.7)"
        eyebrowColor={THEME.charging}
      />

      <Spotlight
        eyebrow="Power limits · 30W – 100W"
        title={
          <>
            Set the ceiling.
            <br />
            <span style={{ color: THEME.blue }}>Save the gear.</span>
          </>
        }
        body="Dial in global, input, output and runtime power caps. Exactly the wattage your laptop, lights, or radio needs — nothing more."
        bullets={[
          { icon: "sliders", label: "Global / input / output limits" },
          { icon: "shield", label: "Protect sensitive electronics" },
          { icon: "bolt", label: "Persisted on the device", color: THEME.discharging },
        ]}
        image="/screenshots/en/04-limits.webp"
        alt="USB-C power limits"
        reverse
        background={`linear-gradient(180deg, #fff 0%, ${THEME.blueWash} 100%)`}
      />

      <Spotlight
        eyebrow="Scheduled on / off"
        title={
          <>
            Set it.
            <br />
            <span style={{ color: THEME.amber }}>Forget it.</span>
          </>
        }
        body="Up to 6 timers — one-shot, daily, weekly or monthly. Power lighting on at sunset, kill the heater overnight, cycle a router every Sunday."
        bullets={[
          { icon: "clock", label: "Up to 6 schedules", color: THEME.amber },
          { icon: "radio", label: "Daily, weekly, monthly", color: THEME.amber },
          { icon: "bolt", label: "Runs on-device, even when phone is away", color: THEME.amber },
        ]}
        image="/screenshots/en/05-timer.webp"
        alt="Timer scheduler"
        background={`linear-gradient(165deg, #061322 0%, #0E2236 60%, #163554 100%)`}
        textColor="#fff"
        bodyColor="rgba(255,255,255,0.7)"
        eyebrowColor={THEME.amber}
      />

      <Devices />
      <FromTheBlog />
      <Faq />
      <CTA />
      <Footer />
    </main>
  );
}
