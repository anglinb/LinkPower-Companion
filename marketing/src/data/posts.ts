// Single source of truth for blog posts. The blog index, dynamic
// [slug] route, sitemap, and per-post OG images all read from here —
// adding a post means editing this file and dropping the body
// component into `src/data/posts/{slug}.tsx`.

export interface Post {
  slug: string;
  /** H1 + visible card title. */
  title: string;
  /** <title> tag — kept ≤ 65 chars per the SEO crash course. */
  titleTag: string;
  /** Meta description — kept ≤ 158 chars. Sells the click. */
  description: string;
  /** Short hook for the index card. */
  excerpt: string;
  /** ISO date — used for <time> + JSON-LD `datePublished`. */
  date: string;
  /** Optional ISO date for `dateModified` — falls back to `date`. */
  updated?: string;
  /** Primary keyword we're targeting. Useful for analytics. */
  targetKeyword: string;
  /** Eyebrow chip text on the post hero. */
  eyebrow: string;
  /** Hero screenshot from `/public/screenshots/en/`. */
  heroImage?: string;
  /** Alt text for the hero image. Required when `heroImage` is set. */
  heroImageAlt?: string;
  /** Approx read time in minutes. */
  readTime: number;
}

export const posts: Post[] = [
  {
    slug: "peakdo-ios-app",
    title: "The native PeakDo iOS app: monitor your Link-Power without Bluefy",
    titleTag: "PeakDo iOS App: Native iPhone Companion (2026)",
    description:
      "PeakDo doesn't ship a native iPhone app — they point you to a Web App and Bluefy browser. Here's the real iOS app for the Link-Power family.",
    excerpt:
      "PeakDo's official solution for iPhone is a Web App you launch through Bluefy. Here's the actual native iOS companion — and why it matters.",
    date: "2026-05-05",
    targetKeyword: "peakdo ios app",
    eyebrow: "iOS app",
    heroImage: "/screenshots/en/02-dashboard.webp",
    heroImageAlt: "LinkPower Companion live battery dashboard on iPhone",
    readTime: 6,
  },
  {
    slug: "peakdo-without-bluefy",
    title: "How to use your PeakDo Link-Power on iPhone without Bluefy",
    titleTag: "PeakDo on iPhone Without Bluefy (2026 Guide)",
    description:
      "Bluefy works but it's a browser, not an app. Here's the native iOS alternative for PeakDo Link-Power — Live Activities, schedules, and Lock Screen widgets.",
    excerpt:
      "Bluefy is a clever workaround, not a real solution. Here's how to swap it for the native iOS app — Live Activities, widgets, and all.",
    date: "2026-05-05",
    targetKeyword: "peakdo bluefy alternative",
    eyebrow: "Bluefy alternative",
    heroImage: "/screenshots/en/live-charging.webp",
    heroImageAlt:
      "LinkPower Companion Live Activity showing charging state on the Lock Screen",
    readTime: 7,
  },
  {
    slug: "starlink-mini-battery-monitor-iphone",
    title: "The best Starlink Mini battery monitor for iPhone",
    titleTag: "Best Starlink Mini Battery Monitor for iPhone (2026)",
    description:
      "Running Starlink Mini off a PeakDo Link-Power? Here's the iOS app that gives you live battery telemetry, runtime, and remote DC control.",
    excerpt:
      "Starlink Mini draws ~30W. Your PeakDo battery knows exactly how long it'll last. Your iPhone should too.",
    date: "2026-05-05",
    targetKeyword: "starlink mini battery monitor iphone",
    eyebrow: "Starlink Mini",
    heroImage: "/screenshots/en/widget.webp",
    heroImageAlt:
      "LinkPower Companion Home Screen widget showing Link-Power battery state",
    readTime: 7,
  },
  {
    slug: "schedule-peakdo-dc-port",
    title: "How to schedule your PeakDo DC port from iPhone",
    titleTag: "How to Schedule Your PeakDo DC Port (iPhone)",
    description:
      "Step-by-step: schedule the PeakDo Link-Power DC port from iPhone — one-shot, daily, weekly, or monthly. Up to 6 timers, all over Bluetooth.",
    excerpt:
      "Power lights at sunset. Kill the heater overnight. Cycle a router every Sunday. Here's how to schedule the DC port from your phone.",
    date: "2026-05-05",
    targetKeyword: "schedule peakdo dc port",
    eyebrow: "How-to",
    heroImage: "/screenshots/en/05-timer.webp",
    heroImageAlt: "LinkPower Companion timer editor on iPhone",
    readTime: 6,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelated(slug: string, limit = 3): Post[] {
  return posts.filter((p) => p.slug !== slug).slice(0, limit);
}
