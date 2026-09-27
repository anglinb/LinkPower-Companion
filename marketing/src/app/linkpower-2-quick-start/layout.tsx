import type { Metadata } from "next";

const SITE_URL = "https://linkpower.app";
const PATH = "/linkpower-2-quick-start/";

export const metadata: Metadata = {
  title: "LinkPower 2 Quick Start: Smart Bypass & Specs",
  description:
    "Quick-start guide for the PeakDo LinkPower 2 (99Wh, 100W USB-C, IP65): setup, Smart Bypass Mode, magnetic DC charging, Web App pairing, and full specs.",
  keywords: [
    "LinkPower 2",
    "LinkPower 2 quick start",
    "LinkPower 2 manual",
    "LinkPower 2 setup",
    "LinkPower 2 user guide",
    "LinkPower 2 vs LinkPower 1",
    "PeakDo LinkPower 2",
    "LinkPower 2 Starlink Mini",
    "Starlink Mini power bank",
    "LinkPower 2 bypass mode",
    "LinkPower 2 magnetic DC",
    "LinkPower 2 100W",
    "LinkPower 2 specifications",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    type: "article",
    siteName: "LinkPower App",
    url: `${SITE_URL}${PATH}`,
    title: "LinkPower 2 Quick Start: Smart Bypass & Specs",
    description:
      "Quick-start guide for the PeakDo LinkPower 2 (99Wh, 100W USB-C, IP65): setup, Smart Bypass Mode, magnetic DC charging, Web App pairing, and full specs.",
    locale: "en_US",
    images: [
      {
        url: "/mockup.png",
        width: 1200,
        height: 630,
        alt: "LinkPower 2 quick start guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkPower 2 Quick Start Guide",
    description:
      "Setup, Smart Bypass Mode, Web App, and full specs for the PeakDo LinkPower 2 Starlink Mini power bank.",
    images: ["/mockup.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
