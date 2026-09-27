"use client";

import { useEffect, useRef, useState, type CSSProperties, type JSX } from "react";
import { toPng } from "html-to-image";

/* =========================================================================
   Link-Power Companion — Google Play Screenshot Generator
   - Android phone (Google Play)
   - 6 slides, clean technical blue direction
   ========================================================================= */

/* ───────────────────────── Canvas + export sizes ───────────────────────── */

const W = 1080;
const H = 1920;

const PLAY_PHONE_SIZES = [
  { label: "Google Play phone", w: 1080, h: 1920 },
] as const;

/* ───────────────────────── Android phone mockup metrics ────────────────── */

const MK_W = 1080;
const MK_H = 2160;
const MK_RATIO = MK_W / MK_H;

/* ──────────────────────────── Width formula ────────────────────────────── */

function phoneW(cW: number, cH: number, clamp = 0.84) {
  return Math.min(clamp, 0.72 * (cH / cW) * MK_RATIO);
}

/* ─────────────────────────── Locales / theme ───────────────────────────── */

const LOCALES = ["en"] as const;
type Locale = (typeof LOCALES)[number];
const SCREENSHOT_BASE = "/screenshots/android/en";

// Clean, technical palette — derived from PeakDo accent (sRGB 0.082, 0.451, 0.698 ≈ #1573B2).
// Apple Health-inspired light surfaces; bright power-state accents (green / orange).
const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  blueDarker: "#093A60",
  blueSoft: "#B8D4E8",
  blueWash: "#E6F0F8",
  mist: "#F2F5F8",
  cloud: "#FFFFFF",
  steel: "#1B2735",
  ink: "#0F172A",
  inkSoft: "#334155",
  muted: "#64748B",
  white: "#FFFFFF",
  black: "#000000",
  near: "#0A1320",
  // Power state accents (mirroring the in-app theme)
  charging: "#34C759",
  discharging: "#FF9500",
  amber: "#FFB020",
} as const;

/* ─────────────────────── Image preload (data URI) ──────────────────────── */

const IMAGE_PATHS = [
  "/app-icon-fg.png",
  `${SCREENSHOT_BASE}/01-connect.png`,
  `${SCREENSHOT_BASE}/02-dashboard.png`,
  `${SCREENSHOT_BASE}/03-dcport.png`,
  `${SCREENSHOT_BASE}/04-limits.png`,
  `${SCREENSHOT_BASE}/05-timer.png`,
  `${SCREENSHOT_BASE}/06-settings.png`,
];

const imageCache: Record<string, string> = {};

async function preloadAllImages() {
  await Promise.all(
    IMAGE_PATHS.map(async (path) => {
      try {
        const resp = await fetch(path);
        const blob = await resp.blob();
        const dataUrl: string = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        imageCache[path] = dataUrl;
      } catch {
        /* fall back to raw path */
      }
    })
  );
}

function img(path: string): string {
  return imageCache[path] || path;
}

/* ─────────────────────────── App Icon (rendered) ───────────────────────── */

function AppIcon({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.225,
        background: `linear-gradient(160deg, #FFFFFF 0%, #F4F7FA 60%, #E6EDF3 100%)`,
        boxShadow: `0 ${size * 0.06}px ${size * 0.14}px rgba(14,82,133,0.30), inset 0 1px 0 rgba(255,255,255,0.9)`,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src={img("/app-icon-fg.png")}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

/* ─────────────────────────── Phone component ───────────────────────────── */

function Phone({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ position: "relative", aspectRatio: `${MK_W}/${MK_H}`, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "11% / 5.5%",
          background: "linear-gradient(180deg, #0F172A 0%, #020617 100%)",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 10,
          overflow: "hidden",
          inset: "2.15%",
          borderRadius: "9.5% / 4.75%",
          background: THEME.mist,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────── Decorations ──────────────────────────────── */

function Blob({
  color,
  size,
  top,
  left,
  right,
  bottom,
  opacity = 0.55,
  blur = 60,
}: {
  color: string;
  size: number;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

function GridDots({ color, opacity = 0.07 }: { color: string; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `radial-gradient(${color} 2px, transparent 2px)`,
        backgroundSize: "44px 44px",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

/* Animated-feeling waveform — power/voltage motif */
function WaveLine({
  color,
  opacity = 0.5,
  strokeWidth = 3,
  top,
  bottom,
  left = 0,
  right = 0,
}: {
  color: string;
  opacity?: number;
  strokeWidth?: number;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 1000 200"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        top,
        bottom,
        left,
        right,
        height: 200,
        width: "100%",
        opacity,
        pointerEvents: "none",
      }}
    >
      <path
        d="M0,100 C80,40 160,160 240,100 C320,40 400,160 480,100 C560,40 640,160 720,100 C800,40 880,160 1000,100"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* "NEW" badge for fresh features */
function NewBadge({ cW, color = "#FFFFFF", bg = "#34C759" }: { cW: number; color?: string; bg?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: `${cW * 0.008}px ${cW * 0.018}px`,
        borderRadius: 999,
        background: bg,
        color,
        fontSize: cW * 0.022,
        fontWeight: 800,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginRight: cW * 0.018,
        verticalAlign: "middle",
        boxShadow: `0 ${cW * 0.005}px ${cW * 0.012}px rgba(0,0,0,0.18)`,
      }}
    >
      New
    </span>
  );
}

/* Crisp engineering-style grid lines (perfect for a power/electronics brand) */
function GridLines({ color, opacity = 0.08 }: { color: string; opacity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}

/* ──────────────────────────── Caption block ────────────────────────────── */

function Caption({
  cW,
  label,
  headline,
  color = THEME.ink,
  labelColor = THEME.blue,
  align = "left",
  style,
}: {
  cW: number;
  label: React.ReactNode;
  headline: React.ReactNode;
  color?: string;
  labelColor?: string;
  align?: "left" | "center";
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: cW * 0.07,
        left: align === "center" ? "50%" : cW * 0.06,
        right: align === "center" ? undefined : cW * 0.06,
        transform: align === "center" ? "translateX(-50%)" : undefined,
        textAlign: align,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: cW * 0.028,
          fontWeight: 700,
          color: labelColor,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: cW * 0.022,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: cW * 0.098,
          lineHeight: 0.95,
          fontWeight: 900,
          color,
          letterSpacing: "-0.035em",
        }}
      >
        {headline}
      </div>
    </div>
  );
}

/* Body subtitle paragraph */
function Subtitle({
  cW,
  color,
  top,
  children,
}: {
  cW: number;
  color: string;
  top: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: cW * 0.06,
        right: cW * 0.06,
        color,
        fontSize: cW * 0.034,
        fontWeight: 500,
        lineHeight: 1.35,
        maxWidth: cW * 0.72,
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────── Slides ───────────────────────────────── */

type SlideProps = { cW: number; cH: number; locale: Locale };
type SlideDef = { id: string; component: (p: SlideProps) => JSX.Element };

/* SLIDE 1 — Hero: connect */
const SLIDE_1: SlideDef = {
  id: "hero",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(165deg, ${THEME.cloud} 0%, ${THEME.blueWash} 55%, ${THEME.blueSoft} 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.blue} size={cW * 1.1} top={-cW * 0.4} right={-cW * 0.4} opacity={0.32} blur={120} />
        <Blob color="#9CC2DD" size={cW * 0.9} bottom={-cW * 0.3} left={-cW * 0.3} opacity={0.5} blur={90} />
        <GridLines color={THEME.blueDeep} opacity={0.05} />

        <Caption
          cW={cW}
          label="LINK-POWER COMPANION"
          headline={
            <>
              Your battery,
              <br />
              <span style={{ color: THEME.blue }}>fully wired in.</span>
            </>
          }
        />

        <Phone
          src={img(`${SCREENSHOT_BASE}/01-connect.png`)}
          alt="Connect"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%)",
            filter: `drop-shadow(0 ${cW * 0.04}px ${cW * 0.08}px rgba(14,82,133,0.35))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 2 — Live dashboard (DARK contrast slide) */
const SLIDE_2: SlideDef = {
  id: "dashboard",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH, 0.78) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `radial-gradient(ellipse at 30% 20%, #14283C 0%, ${THEME.near} 55%, #04080F 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.blue} size={cW * 0.9} top={-cW * 0.25} left={-cW * 0.25} opacity={0.45} blur={120} />
        <Blob color={THEME.charging} size={cW * 0.45} bottom={cW * 0.2} right={-cW * 0.15} opacity={0.28} blur={100} />
        <GridLines color="#FFFFFF" opacity={0.04} />

        <Caption
          cW={cW}
          label="REAL-TIME · BLE NOTIFICATIONS"
          color={THEME.white}
          labelColor={THEME.charging}
          headline={
            <>
              Live watts.
              <br />
              <span style={{ color: THEME.charging }}>Live amps.</span>
            </>
          }
        />

        <Subtitle cW={cW} color="rgba(255,255,255,0.7)" top={cW * 0.46}>
          Battery level, capacity, voltage, current and runtime — streamed live from your Link-Power.
        </Subtitle>

        <Phone
          src={img(`${SCREENSHOT_BASE}/02-dashboard.png`)}
          alt="Live dashboard"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(11%)",
            filter: `drop-shadow(0 ${cW * 0.05}px ${cW * 0.1}px rgba(21,115,178,0.55))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE — Live Activity (two phones, lock screens — charging vs discharging) */
const SLIDE_LIVE_ACTIVITY: SlideDef = {
  id: "live-activity",
  component: ({ cW, cH }) => {
    const fwBack = phoneW(cW, cH, 0.7) * 100;
    const fwFront = phoneW(cW, cH, 0.78) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `radial-gradient(ellipse at 70% 0%, #1A3654 0%, ${THEME.near} 50%, #04080F 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.charging} size={cW * 0.6} top={cW * 0.05} right={-cW * 0.2} opacity={0.32} blur={100} />
        <Blob color={THEME.amber} size={cW * 0.5} bottom={cW * 0.3} left={-cW * 0.2} opacity={0.28} blur={90} />
        <GridLines color="#FFFFFF" opacity={0.04} />
        <WaveLine color={THEME.charging} opacity={0.35} strokeWidth={4} top={cW * 0.36} />

        <Caption
          cW={cW}
          label={
            <>
              <NewBadge cW={cW} bg={THEME.charging} />
              LIVE ACTIVITY
            </>
          }
          color={THEME.white}
          labelColor="rgba(255,255,255,0.9)"
          headline={
            <>
              Power on your
              <br />
              <span style={{ color: THEME.charging }}>Lock Screen.</span>
            </>
          }
        />

        <Subtitle cW={cW} color="rgba(255,255,255,0.72)" top={cW * 0.46}>
          Watts, voltage, current and time-to-full — glanceable the moment you pick up your phone.
        </Subtitle>

        {/* Back phone — discharging (orange) */}
        <Phone
          src={img("/screenshots/en/live-discharging.png")}
          alt="Discharging Live Activity"
          style={{
            position: "absolute",
            bottom: 0,
            left: "-6%",
            width: `${fwBack}%`,
            transform: "translateY(14%) rotate(-5deg)",
            filter: `drop-shadow(0 ${cW * 0.04}px ${cW * 0.08}px rgba(255,149,0,0.35))`,
            opacity: 0.92,
          }}
        />
        {/* Front phone — charging (green) */}
        <Phone
          src={img("/screenshots/en/live-charging.png")}
          alt="Charging Live Activity"
          style={{
            position: "absolute",
            bottom: 0,
            right: "-6%",
            width: `${fwFront}%`,
            transform: "translateY(11%) rotate(4deg)",
            filter: `drop-shadow(0 ${cW * 0.05}px ${cW * 0.1}px rgba(52,199,89,0.45))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE — Widget (home screen widget) */
const SLIDE_WIDGET: SlideDef = {
  id: "widget",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH, 0.84) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(170deg, #FFFFFF 0%, ${THEME.blueWash} 45%, #C9DCEC 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.blue} size={cW * 0.95} top={-cW * 0.3} left={-cW * 0.35} opacity={0.32} blur={120} />
        <Blob color={THEME.charging} size={cW * 0.4} top={cW * 0.25} right={-cW * 0.1} opacity={0.22} blur={80} />
        <GridDots color={THEME.blueDeep} opacity={0.08} />
        <WaveLine color={THEME.blue} opacity={0.18} strokeWidth={3} top={cW * 0.34} />

        <Caption
          cW={cW}
          label={
            <>
              <NewBadge cW={cW} bg={THEME.blue} />
              HOME SCREEN WIDGET
            </>
          }
          headline={
            <>
              Always there.
              <br />
              <span style={{ color: THEME.blue }}>Always live.</span>
            </>
          }
        />

        <Subtitle cW={cW} color={THEME.inkSoft} top={cW * 0.42}>
          Pin a widget for capacity, voltage, power and runtime — every detail, no tap required.
        </Subtitle>

        <Phone
          src={img("/screenshots/en/widget.png")}
          alt="Home screen widget"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%)",
            filter: `drop-shadow(0 ${cW * 0.05}px ${cW * 0.1}px rgba(14,82,133,0.4))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 3 — DC Port controls (vivid blue) */
const SLIDE_3: SlideDef = {
  id: "dcport",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(155deg, ${THEME.blue} 0%, #2C8FCC 50%, #5DB1E0 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color="#CFE3F1" size={cW * 0.8} top={-cW * 0.2} right={-cW * 0.2} opacity={0.5} blur={90} />
        <Blob color={THEME.blueDarker} size={cW * 0.6} bottom={cW * 0.15} left={-cW * 0.15} opacity={0.45} blur={100} />
        <GridDots color="#ffffff" opacity={0.08} />

        <Caption
          cW={cW}
          label="DC PORT · ONE TAP"
          color={THEME.white}
          labelColor="rgba(255,255,255,0.85)"
          headline={
            <>
              Power on.
              <br />
              Power off.
            </>
          }
        />

        <Subtitle cW={cW} color="rgba(255,255,255,0.9)" top={cW * 0.42}>
          Toggle DC output, watch power, voltage and current in real time, and flip on bypass mode when you need it.
        </Subtitle>

        <Phone
          src={img(`${SCREENSHOT_BASE}/03-dcport.png`)}
          alt="DC port controls"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%)",
            filter: `drop-shadow(0 ${cW * 0.05}px ${cW * 0.1}px rgba(0,0,0,0.3))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 4 — Power limits (light, technical) */
const SLIDE_4: SlideDef = {
  id: "limits",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH, 0.82) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(180deg, ${THEME.mist} 0%, #DCE6EF 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.blue} size={cW * 0.7} top={cW * 0.05} right={-cW * 0.25} opacity={0.32} blur={100} />
        <Blob color="#9CC2DD" size={cW * 0.5} bottom={cW * 0.2} left={-cW * 0.2} opacity={0.55} blur={80} />
        <GridLines color={THEME.blueDeep} opacity={0.06} />

        <Caption
          cW={cW}
          label="USB-C POWER LIMITS"
          headline={
            <>
              Set the ceiling.
              <br />
              <span style={{ color: THEME.blue }}>30W – 100W.</span>
            </>
          }
        />

        <Subtitle cW={cW} color={THEME.muted} top={cW * 0.42}>
          Dial in global, input, output and runtime caps — exactly the wattage your gear needs, nothing more.
        </Subtitle>

        <Phone
          src={img(`${SCREENSHOT_BASE}/04-limits.png`)}
          alt="Power limits"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%) rotate(-2deg)",
            filter: `drop-shadow(0 ${cW * 0.04}px ${cW * 0.09}px rgba(14,82,133,0.4))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 5 — Timers / Scheduling (DARK contrast) */
const SLIDE_5: SlideDef = {
  id: "scheduler",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(160deg, #061322 0%, #0E2236 60%, #163554 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color={THEME.amber} size={cW * 0.55} top={cW * 0.1} left={cW * 0.4} opacity={0.42} blur={80} />
        <Blob color={THEME.charging} size={cW * 0.45} top={cW * 0.4} right={-cW * 0.1} opacity={0.32} blur={70} />
        <Blob color={THEME.blue} size={cW * 0.7} bottom={-cW * 0.2} left={-cW * 0.2} opacity={0.55} blur={110} />

        <Caption
          cW={cW}
          label="SCHEDULED ON / OFF"
          color={THEME.white}
          labelColor={THEME.amber}
          headline={
            <>
              Set it.
              <br />
              <span style={{ color: THEME.amber }}>Forget it.</span>
            </>
          }
        />

        <Subtitle cW={cW} color="rgba(255,255,255,0.72)" top={cW * 0.42}>
          Up to 6 timers — one-shot, daily, weekly or monthly — automatically cycle your DC output for you.
        </Subtitle>

        <Phone
          src={img(`${SCREENSHOT_BASE}/05-timer.png`)}
          alt="Timer scheduler"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%)",
            filter: `drop-shadow(0 ${cW * 0.05}px ${cW * 0.1}px rgba(255,176,32,0.25))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 6 — System & expert controls */
const SLIDE_6: SlideDef = {
  id: "settings",
  component: ({ cW, cH }) => {
    const fw = phoneW(cW, cH, 0.82) * 100;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(170deg, #EAF2F8 0%, #C8DCEC 70%, #99BCD9 100%)`,
          overflow: "hidden",
        }}
      >
        <Blob color="#FFFFFF" size={cW * 0.7} top={-cW * 0.2} left={-cW * 0.2} opacity={0.6} blur={90} />
        <Blob color={THEME.blue} size={cW * 0.6} bottom={cW * 0.15} right={-cW * 0.2} opacity={0.4} blur={100} />

        <Caption
          cW={cW}
          label="DEEP CONTROLS"
          headline={
            <>
              Expert mode,
              <br />
              <span style={{ color: THEME.blue }}>unlocked.</span>
            </>
          }
        />

        <Subtitle cW={cW} color={THEME.inkSoft} top={cW * 0.42}>
          Sync the device clock, restart, shut down, tweak BLE PINs — every system setting in one place.
        </Subtitle>

        <Phone
          src={img(`${SCREENSHOT_BASE}/06-settings.png`)}
          alt="System settings"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            width: `${fw}%`,
            transform: "translateX(-50%) translateY(13%)",
            filter: `drop-shadow(0 ${cW * 0.04}px ${cW * 0.09}px rgba(14,82,133,0.35))`,
          }}
        />
      </div>
    );
  },
};

/* SLIDE 7 — Everything else (DARK summary) */
const SLIDE_7: SlideDef = {
  id: "everything-else",
  component: ({ cW }) => {
    const pillsCurrent = [
      "BLE auto-reconnect",
      "Live battery telemetry",
      "Live Activities",
      "Home Screen widget",
      "DC port toggle",
      "DC bypass mode",
      "USB-C monitoring",
      "Power limits 30–100W",
      "Up to 6 timers",
      "Date/time sync",
      "Demo mode",
      "Expert & Dev modes",
    ];
    const pillsSoon = ["Apple Watch app", "Charging history graphs"];

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: `linear-gradient(165deg, ${THEME.near} 0%, #0E2236 60%, #163554 100%)`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Blob color={THEME.blue} size={cW * 0.9} top={-cW * 0.3} right={-cW * 0.3} opacity={0.4} blur={120} />
        <Blob color="#1E3A5C" size={cW * 0.6} bottom={-cW * 0.2} left={-cW * 0.2} opacity={0.7} blur={100} />
        <GridLines color="#ffffff" opacity={0.04} />

        <div style={{ padding: `${cW * 0.07}px ${cW * 0.06}px ${cW * 0.04}px`, position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: cW * 0.04,
              marginBottom: cW * 0.06,
            }}
          >
            <AppIcon size={cW * 0.18} />
            <div>
              <div
                style={{
                  fontSize: cW * 0.028,
                  fontWeight: 700,
                  color: "#5DB1E0",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                EVERYTHING ELSE
              </div>
              <div
                style={{
                  fontSize: cW * 0.05,
                  fontWeight: 800,
                  color: THEME.white,
                  letterSpacing: "-0.02em",
                  marginTop: cW * 0.005,
                }}
              >
                Link-Power Companion
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: cW * 0.094,
              lineHeight: 0.95,
              fontWeight: 900,
              color: THEME.white,
              letterSpacing: "-0.035em",
            }}
          >
            Built for the way
            <br />
            <span style={{ color: "#5DB1E0" }}>you actually use it.</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: `0 ${cW * 0.06}px ${cW * 0.08}px`,
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: cW * 0.05,
          }}
        >
          <div>
            <div
              style={{
                fontSize: cW * 0.024,
                fontWeight: 700,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: cW * 0.025,
              }}
            >
              Day one features
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: cW * 0.018 }}>
              {pillsCurrent.map((p) => (
                <span
                  key={p}
                  style={{
                    padding: `${cW * 0.018}px ${cW * 0.032}px`,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: THEME.white,
                    fontSize: cW * 0.034,
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: cW * 0.024,
                fontWeight: 700,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: cW * 0.025,
              }}
            >
              Coming soon
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: cW * 0.018 }}>
              {pillsSoon.map((p) => (
                <span
                  key={p}
                  style={{
                    padding: `${cW * 0.018}px ${cW * 0.032}px`,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px dashed rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: cW * 0.034,
                    fontWeight: 600,
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: cW * 0.02,
              fontSize: cW * 0.022,
              fontWeight: 500,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.05em",
              lineHeight: 1.4,
            }}
          >
            Supports LP1 · LP2 · LP+. Unofficial — not affiliated with PeakDo Tech, Inc.
          </div>
        </div>
      </div>
    );
  },
};

const PLAY_PHONE_SLIDES: SlideDef[] = [
  SLIDE_2, // Live dashboard — hero
  SLIDE_1, // Connect
  SLIDE_3, // DC port controls
  SLIDE_4, // Power limits
  SLIDE_5, // Scheduler / timers
  SLIDE_6, // System settings
];

/* ─────────────────────── Preview (scale-to-fit) ───────────────────────── */

function ScreenshotPreview({
  index,
  slide,
  cW,
  cH,
  locale,
  onExport,
  exporting,
  setExportRef,
}: {
  index: number;
  slide: SlideDef;
  cW: number;
  cH: number;
  locale: Locale;
  onExport: (i: number) => void;
  exporting: boolean;
  setExportRef: (i: number, el: HTMLDivElement | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const s = Math.min(rect.width / cW, rect.height / cH);
      setScale(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [cW, cH]);

  return (
    <div
      style={{
        position: "relative",
        background: "white",
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          aspectRatio: `${cW}/${cH}`,
          position: "relative",
          overflow: "hidden",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: cW,
            height: cH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {slide.component({ cW, cH, locale })}
        </div>
      </div>
      <div
        style={{
          padding: "8px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          fontWeight: 600,
          color: "#475569",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <span>
          {String(index + 1).padStart(2, "0")} · {slide.id}
        </span>
        <button
          onClick={() => onExport(index)}
          disabled={exporting}
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: exporting ? "#f3f4f6" : "white",
            cursor: exporting ? "default" : "pointer",
            fontSize: 11,
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          Export
        </button>
      </div>

      {/* Offscreen export copy */}
      <div
        ref={(el) => setExportRef(index, el)}
        style={{
          position: "absolute",
          top: 0,
          left: -99999,
          width: cW,
          height: cH,
          pointerEvents: "none",
        }}
      >
        {slide.component({ cW, cH, locale })}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main page ───────────────────────────────── */

export default function ScreenshotsPage() {
  const [ready, setReady] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");
  const [sizeIdx, setSizeIdx] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);
  const [captureIndex, setCaptureIndex] = useState<number | null>(null);
  const exportRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    preloadAllImages().then(() => setReady(true));
  }, []);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("capture");
    if (raw === null) return;
    const next = Number(raw);
    if (Number.isInteger(next)) setCaptureIndex(next);
  }, []);

  const cW = W;
  const cH = H;
  const slides = PLAY_PHONE_SLIDES;
  const currentSizes = PLAY_PHONE_SIZES;

  function setExportRef(i: number, el: HTMLDivElement | null) {
    exportRefs.current[i] = el;
  }

  async function captureSlide(el: HTMLElement, w: number, h: number): Promise<string> {
    el.style.left = "0px";
    el.style.opacity = "1";
    el.style.zIndex = "-1";

    const opts = { width: w, height: h, pixelRatio: 1, cacheBust: true };
    await toPng(el, opts);
    const dataUrl = await toPng(el, opts);

    el.style.left = "-99999px";
    el.style.opacity = "";
    el.style.zIndex = "";
    return dataUrl;
  }

  async function exportOne(i: number) {
    const el = exportRefs.current[i];
    if (!el) return;
    setExporting(`1/1`);
    const size = currentSizes[sizeIdx];
    const dataUrl = await captureSlide(el, size.w, size.h);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${String(i + 1).padStart(2, "0")}-${slides[i].id}-${locale}-${size.w}x${size.h}.png`;
    a.click();
    setExporting(null);
  }

  async function exportAll() {
    const size = currentSizes[sizeIdx];
    for (let i = 0; i < slides.length; i++) {
      setExporting(`${i + 1}/${slides.length}`);
      const el = exportRefs.current[i];
      if (!el) continue;
      const dataUrl = await captureSlide(el, size.w, size.h);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${String(i + 1).padStart(2, "0")}-${slides[i].id}-${locale}-${size.w}x${size.h}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 300));
    }
    setExporting(null);
  }

  // Visually-hidden H1 used in both the loading and ready states so it
  // is always present in the static HTML (this page is a client
  // component, so anything inside the `ready` branch is hydrated only).
  const visuallyHiddenH1Style: CSSProperties = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0,0,0,0)",
    whiteSpace: "nowrap",
    border: 0,
  };

  if (!ready) {
    return (
      <div style={{ padding: 40, color: "#475569" }}>
        <h1 style={visuallyHiddenH1Style}>
          LinkPower Companion App Store screenshot generator
        </h1>
        Loading images…
      </div>
    );
  }

  if (captureIndex !== null) {
    const slide = slides[captureIndex];
    if (!slide) return null;
    return (
      <div
        style={{
          width: cW,
          height: cH,
          overflow: "hidden",
          background: THEME.mist,
        }}
      >
        {slide.component({ cW, cH, locale })}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        position: "relative",
        overflowX: "hidden",
        flex: 1,
      }}
    >
      {/* Visually-hidden H1 for SEO/accessibility on this internal tool. */}
      <h1 style={visuallyHiddenH1Style}>
        LinkPower Companion App Store screenshot generator
      </h1>
      {/* Toolbar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "white",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            overflowX: "auto",
            minWidth: 0,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", color: "#0f172a" }}>
            Link-Power Companion · Google Play
          </span>

          {LOCALES.length > 1 && (
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              style={{
                fontSize: 12,
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "5px 10px",
              }}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <div
            style={{
              display: "flex",
              gap: 4,
              background: "#f3f4f6",
              borderRadius: 8,
              padding: 4,
              flexShrink: 0,
            }}
          >
            <button
              style={{
                padding: "4px 14px",
                borderRadius: 6,
                border: "none",
                cursor: "default",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                background: "white",
                color: THEME.blue,
              }}
            >
              Android phone
            </button>
          </div>

          <select
            value={sizeIdx}
            onChange={(e) => setSizeIdx(Number(e.target.value))}
            style={{
              fontSize: 12,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: "4px 10px",
            }}
          >
            {currentSizes.map((s, i) => (
              <option key={i} value={i}>
                {s.label} — {s.w}×{s.h}
              </option>
            ))}
          </select>

          <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>
            {slides.length} slides · designed for Play at {W}×{H}
          </span>
        </div>

        <div style={{ flexShrink: 0, padding: "10px 16px", borderLeft: "1px solid #e5e7eb" }}>
          <button
            onClick={exportAll}
            disabled={!!exporting}
            style={{
              padding: "8px 22px",
              background: exporting ? "#93C5DD" : THEME.blue,
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: exporting ? "default" : "pointer",
              whiteSpace: "nowrap",
              boxShadow: exporting ? "none" : "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {exporting ? `Exporting… ${exporting}` : "Export All"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          padding: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {slides.map((s, i) => (
          <ScreenshotPreview
            key={s.id}
            index={i}
            slide={s}
            cW={cW}
            cH={cH}
            locale={locale}
            onExport={exportOne}
            exporting={!!exporting}
            setExportRef={setExportRef}
          />
        ))}
      </div>
    </div>
  );
}
