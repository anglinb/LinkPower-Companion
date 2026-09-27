import type { CSSProperties } from "react";
import { APP_STORE_URL, GOOGLE_PLAY_URL, THEME } from "./theme";

type StoreLinksVariant = "nav" | "hero" | "light" | "prose";

interface StoreLinksProps {
  variant?: StoreLinksVariant;
  appleLabel?: string;
  androidLabel?: string;
  dataCta?: string;
  className?: string;
  linkClassName?: string;
  style?: CSSProperties;
}

function AppleIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M16.7 13.3c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2.1-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.5-3-.1-.1-2.8-1.1-2.8-4.3-.1-2.6 1.7-3.7 1.8-3.7-1-1.5-2.5-1.6-3-1.6Z" />
      <path d="M14.4 5c.8-.9 1.3-2.2 1.2-3.5-1.1.1-2.4.8-3.2 1.6-.7.8-1.4 2-1.2 3.3 1.2.1 2.4-.5 3.2-1.4Z" />
    </svg>
  );
}

function GooglePlayIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M4.5 3.6c-.4.3-.7.8-.7 1.5v13.8c0 .7.3 1.2.7 1.5l8.2-8.2L4.5 3.6Z" />
      <path d="m14 10.9 2.3-2.3L6.6 3.1c-.4-.2-.8-.2-1.1-.1L14 10.9Z" />
      <path d="m14 13.1-8.5 7.9c.3.1.7.1 1.1-.1l9.7-5.5-2.3-2.3Z" />
      <path d="m19.5 10.3-2.5-1.4-2.5 2.5 2.5 2.5 2.5-1.4c1-.6 1-1.6 0-2.2Z" />
    </svg>
  );
}

function labelsFor(variant: StoreLinksVariant) {
  if (variant === "nav") {
    return { apple: "iOS", android: "Android" };
  }
  if (variant === "hero") {
    return {
      apple: "Download on the App Store",
      android: "Get it on Google Play",
    };
  }
  return { apple: "App Store", android: "Google Play" };
}

function stylesFor(variant: StoreLinksVariant) {
  const wrapper: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: variant === "nav" ? 8 : 12,
    flexWrap: "wrap",
  };
  const baseLink: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: variant === "nav" ? 6 : 10,
    borderRadius: variant === "nav" ? 999 : 12,
    textDecoration: "none",
    fontWeight: variant === "nav" ? 700 : 800,
    whiteSpace: "nowrap",
  };

  if (variant === "nav") {
    return {
      wrapper,
      apple: {
        ...baseLink,
        padding: "8px 14px",
        background: THEME.blue,
        color: "#fff",
        fontSize: 13,
      },
      android: {
        ...baseLink,
        padding: "8px 14px",
        background: "rgba(21,115,178,0.1)",
        color: THEME.blueDeep,
        border: "1px solid rgba(21,115,178,0.22)",
        fontSize: 13,
      },
      appleIcon: "#fff",
      androidIcon: THEME.blueDeep,
    };
  }

  if (variant === "light") {
    return {
      wrapper,
      apple: {
        ...baseLink,
        padding: "12px 18px",
        background: "#fff",
        color: THEME.ink,
        fontSize: 14,
      },
      android: {
        ...baseLink,
        padding: "12px 18px",
        background: "rgba(255,255,255,0.12)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.28)",
        fontSize: 14,
      },
      appleIcon: THEME.ink,
      androidIcon: "#fff",
    };
  }

  if (variant === "prose") {
    return {
      wrapper: {
        ...wrapper,
        margin: "18px 0 22px",
      },
      apple: {
        ...baseLink,
        padding: "11px 15px",
        background: THEME.ink,
        color: "#fff",
        border: `1px solid ${THEME.ink}`,
        fontSize: 14,
        textDecoration: "none",
      },
      android: {
        ...baseLink,
        padding: "11px 15px",
        background: "#fff",
        color: THEME.blueDeep,
        border: `1px solid ${THEME.hairline}`,
        fontSize: 14,
        textDecoration: "none",
      },
      appleIcon: "#fff",
      androidIcon: THEME.blueDeep,
    };
  }

  return {
    wrapper,
    apple: {
      ...baseLink,
      padding: "14px 22px",
      background: THEME.ink,
      color: "#fff",
      fontSize: 15,
      boxShadow: "0 8px 20px -8px rgba(15,23,42,0.5)",
    },
    android: {
      ...baseLink,
      padding: "14px 22px",
      background: "#fff",
      color: THEME.blueDeep,
      border: `1px solid ${THEME.hairline}`,
      fontSize: 15,
      boxShadow: "0 8px 20px -10px rgba(15,23,42,0.25)",
    },
    appleIcon: "#fff",
    androidIcon: THEME.blueDeep,
  };
}

export function StoreLinks({
  variant = "hero",
  appleLabel,
  androidLabel,
  dataCta,
  className,
  linkClassName,
  style,
}: StoreLinksProps) {
  const styles = stylesFor(variant);
  const labels = labelsFor(variant);
  const wrapperClassName = ["lp-store-links", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName} style={{ ...styles.wrapper, ...style }}>
      <a
        className={["lp-pressable", linkClassName].filter(Boolean).join(" ")}
        href={APP_STORE_URL}
        data-cta={dataCta}
        data-store="ios"
        aria-label="Download Link-Power Companion on the App Store"
        style={styles.apple}
      >
        <AppleIcon color={styles.appleIcon} size={variant === "nav" ? 15 : 18} />
        {appleLabel ?? labels.apple}
      </a>
      <a
        className={["lp-pressable", linkClassName].filter(Boolean).join(" ")}
        href={GOOGLE_PLAY_URL}
        data-cta={dataCta}
        data-store="android"
        aria-label="Get Link-Power Companion on Google Play"
        style={styles.android}
      >
        <GooglePlayIcon color={styles.androidIcon} size={variant === "nav" ? 15 : 18} />
        {androidLabel ?? labels.android}
      </a>
    </div>
  );
}
