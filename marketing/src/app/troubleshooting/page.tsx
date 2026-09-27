import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Troubleshooting — LinkPower Companion",
  description: "Help with Bluetooth connections, LinkPower 3 USB-C readings, Starlink status, and purchases.",
  alternates: { canonical: "https://linkpower.app/troubleshooting/" },
};

const topics = [
  {
    id: "bluetooth",
    title: "My battery won’t connect",
    steps: [
      "Make sure the LinkPower battery is awake and your phone is nearby.",
      "Turn on Bluetooth. On iPhone, open Settings → Privacy & Security → Bluetooth and allow LinkPower Companion.",
      "Close any other app or browser connected to the battery, including the PeakDo web controller on another phone. Then scan again in LinkPower Companion.",
      "If the battery still does not appear, reopen the app and try again with the phone beside the battery.",
    ],
  },
  {
    id: "usb-c",
    title: "USB-C readings are missing or show zero",
    steps: [
      "Check that the app is connected to the battery and the main battery reading is updating.",
      "Connect a charger or device to the battery’s USB-C port. A disconnected or idle port may show no power flow.",
      "Leave the app open for a few moments while the port negotiates power and new readings arrive. If readings remain missing, reconnect to the battery.",
      "For LinkPower 3, use an app build with LP3 support. Some LP3 firmware reports voltage and current without a USB-C temperature; a missing temperature alone does not mean the port is faulty.",
    ],
  },
  {
    id: "starlink",
    title: "Starlink status is unavailable",
    intro: "For app versions that include Starlink monitoring. The battery’s Bluetooth connection and Starlink’s Wi-Fi connection are separate.",
    steps: [
      "Join the Wi-Fi network connected to your Starlink. Bluetooth alone cannot provide dish status.",
      "On iPhone, open Settings → Privacy & Security → Local Network and allow LinkPower Companion if it is listed.",
      "If you use a VPN, temporarily disconnect it and retry; it may prevent access to devices on your local network.",
      "Keep the app open and use Try Again if it appears. Check the official Starlink app as well: an unavailable status in LinkPower Companion does not by itself mean your internet is down.",
    ],
  },
  {
    id: "stale-readings",
    title: "Readings or widgets stopped updating",
    steps: [
      "Open LinkPower Companion and confirm it is still connected to the battery. Move closer if needed.",
      "Allow a fresh reading to arrive before checking the widget or Live Activity again. These surfaces can show the last reading received.",
      "If the dashboard itself stays unchanged, disconnect and reconnect in the app.",
    ],
  },
  {
    id: "purchases",
    title: "My purchase isn’t showing up",
    steps: [
      "Make sure your phone uses the Apple Account that made the purchase and has an internet connection.",
      "Open the app’s Settings and tap Restore Purchases. This does not create a new charge.",
      "If no active purchase is found, check your subscriptions or purchase history in Apple’s settings, then contact support with the result shown in the app.",
    ],
  },
];

export default function TroubleshootingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="/">LinkPower Companion</a>
        <a href="/support/">Contact support ↗</a>
      </header>
      <main className={styles.main}>
        <p className={styles.eyebrow}>Help when you need it</p>
        <h1>Troubleshooting</h1>
        <p className={styles.lede}>Let’s get you connected again. Choose what you’re seeing for a few things to try.</p>
        <nav aria-label="Troubleshooting topics" className={styles.topics}>
          {topics.map((topic) => <a key={topic.id} href={`#${topic.id}`}>{topic.title}<span aria-hidden="true">↓</span></a>)}
        </nav>
        {topics.map((topic) => (
          <section key={topic.id} id={topic.id} className={styles.card} aria-labelledby={`${topic.id}-title`}>
            <h2 id={`${topic.id}-title`}>{topic.title}</h2>
            {topic.intro && <p>{topic.intro}</p>}
            <ol>{topic.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          </section>
        ))}
        <aside className={styles.support}>
          <h2>Still stuck?</h2>
          <p>Setting up LP3? See the <a href="/linkpower-3-quick-start/">quick start</a> or <a href="/linkpower-3-connection-guide/">Bluetooth and Wi-Fi guide</a>.</p>
          <p>Send your battery model, firmware version if available, app version, phone model, and a screenshot of what you see. Tell us what you’ve already tried.</p>
          <a href="/support/">Contact support →</a>
        </aside>
        <footer className={styles.footer}>These guides are updated on the website, so the latest help is available here without an app update. An internet connection is required.</footer>
      </main>
    </div>
  );
}
