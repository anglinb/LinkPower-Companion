import type { Metadata } from "next";

const SITE_URL = "https://linkpower.app";
const PATH = "/linkpower-1-quick-start/";

export const metadata: Metadata = {
  title: "LinkPower 1 Quick Start: Setup, Specs & Help",
  description:
    "Quick-start guide for the PeakDo LinkPower 1 (99Wh, 65W USB-C PD): setup, LCD status, DC port control, Web App pairing, and troubleshooting.",
  keywords: [
    "LinkPower 1",
    "LinkPower 1 quick start",
    "LinkPower 1 manual",
    "LinkPower 1 setup",
    "LinkPower 1 user guide",
    "PeakDo LinkPower",
    "LinkPower Starlink Mini",
    "Starlink Mini power bank",
    "LinkPower Web App",
    "LinkPower troubleshooting",
    "LinkPower specifications",
    "LinkPower 99Wh",
  ],
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    type: "article",
    siteName: "LinkPower App",
    url: `${SITE_URL}${PATH}`,
    title: "LinkPower 1 Quick Start: Setup, Specs & Help",
    description:
      "Quick-start guide for the PeakDo LinkPower 1 (99Wh, 65W USB-C PD): setup, LCD status, DC port control, Web App pairing, and troubleshooting.",
    locale: "en_US",
    images: [
      {
        url: "/mockup.png",
        width: 1200,
        height: 630,
        alt: "LinkPower 1 quick start guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkPower 1 Quick Start Guide",
    description:
      "Setup, Web App, troubleshooting, and full specs for the PeakDo LinkPower 1 Starlink Mini power bank.",
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
