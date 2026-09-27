import type { Metadata } from "next";

const SITE_URL = "https://linkpower.app";

export const metadata: Metadata = {
  title: "Screenshot Generator",
  description: "Internal tool for generating App Store screenshots.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: { canonical: "/screenshots/" },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    url: `${SITE_URL}/screenshots/`,
    title: "Screenshot Generator — LinkPower Companion",
    description: "Internal tool for generating App Store screenshots.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinkPower Companion screenshot generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot Generator — LinkPower Companion",
    description: "Internal tool for generating App Store screenshots.",
    images: ["/og.png"],
  },
};

export default function ScreenshotsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
