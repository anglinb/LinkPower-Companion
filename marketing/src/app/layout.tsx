import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { APP_STORE_URL, GOOGLE_PLAY_URL, SITE_URL } from "../components/theme";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-8H8C8PMX2W";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "LinkPower App — Companion for PeakDo Link-Power Stations",
    template: "%s · LinkPower App",
  },
  description:
    "Native iOS and Android companion for the PeakDo Link-Power family. Live battery telemetry, DC port control, USB-C limits, and scheduling over Bluetooth.",
  keywords: [
    "LinkPower app",
    "Linkpower app",
    "Link-Power app",
    "Link-Power Companion",
    "PeakDo Link-Power",
    "PeakDo battery app",
    "portable power station iOS app",
    "portable power station Android app",
    "Bluetooth battery monitor",
    "DC port control",
    "USB-C charging limit",
  ],
  applicationName: "LinkPower Companion",
  authors: [{ name: "LinkPower" }],
  creator: "LinkPower",
  publisher: "LinkPower",
  category: "utilities",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    url: SITE_URL,
    title:
      "LinkPower App — Companion for PeakDo Link-Power Stations",
    description:
      "Live battery telemetry, DC port control, USB-C limits, and scheduling — over Bluetooth. Free to download with in-app purchases on the App Store and Google Play.",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinkPower app on iPhone showing live battery telemetry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "LinkPower App — Companion for PeakDo Link-Power Stations",
    description:
      "Live battery telemetry, DC port control, USB-C limits, and scheduling over Bluetooth. Free to download with in-app purchases on the App Store and Google Play.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appLinks: {
    ios: {
      url: APP_STORE_URL,
      app_store_id: "6762404390",
      app_name: "LinkPower Companion",
    },
    android: {
      package: "app.linkpower.companion",
      url: GOOGLE_PLAY_URL,
      app_name: "LinkPower Companion",
    },
  },
  other: {
    "apple-itunes-app": "app-id=6762404390",
  },
};

export const viewport: Viewport = {
  themeColor: "#1573B2",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MobileApplication",
      "@id": `${SITE_URL}#app`,
      name: "LinkPower Companion",
      alternateName: ["LinkPower app", "Link-Power Companion"],
      description:
        "Native companion app for the PeakDo Link-Power family of portable power stations on iOS and Android. Live battery telemetry, DC port control, USB-C charging limits, and on/off scheduling over Bluetooth.",
      url: SITE_URL,
      operatingSystem: ["iOS", "Android"],
      applicationCategory: "UtilitiesApplication",
      installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
      downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Live battery telemetry over Bluetooth",
        "DC port control",
        "USB-C charging limits",
        "On/off scheduling",
        "Native iOS app",
        "Native Android app",
      ],
      image: `${SITE_URL}/og.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: "LinkPower App",
      description:
        "The LinkPower app is the native iOS and Android companion for the PeakDo Link-Power family.",
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#org`,
      name: "LinkPower",
      url: SITE_URL,
      logo: `${SITE_URL}/app-icon-fg.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily:
            'var(--font-inter), -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        }}
      >
        {children}
        {/* JSON-LD structured data */}
        <Script
          id="ld-json"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="X3kxqvBCh5RF17efAUXWOw"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
