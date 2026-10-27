import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import styles from "./LP3Guide.module.css";

export const LP3_PRODUCT = "https://www.peakdo.com/products/linkpower3-battery";
export const LP3_MANUAL = "https://images.51microshop.com/15666/user_guide/linkpower_3/LinkPower-3_quick_start_v3.0.pdf";
export const LP3_WEB_APP = "https://pwa-dev.peakdo.ca/lp3/";
export const LP3_WIFI = "https://www.peakdo.com/blogs/news/why-we-upgraded-linkpower-3s-wi-fi-capabilities";

export const ULTRA_PRODUCT = "https://www.peakdo.com/products/peakdo-linkpower-ultra-battery-for-starlink-mini";
// PeakDo has not posted the Ultra quick start on peakdo.ca/docs; this is the copy filed with the FCC.
export const ULTRA_MANUAL = "https://fccid.ai/m/e66a66cd86cfe32d0a2b91d23087137cc573a0d6cb2ce538fa243ff468fc9227.pdf";
export const POD_PRODUCT = "https://www.peakdo.com/products/link-power-pod-1";
export const POD_MANUAL = "https://peakdo.ca/wp-content/uploads/2026/09/Link-Power-Pod-1_quick_start_v2.0.pdf";

/** LP3-generation batteries share PeakDo's LP3 web app and this guide layout. */
export type GuideDevice = { eyebrow: string; product: string; manual: string; manualLabel: string; sources: ReactNode };

export const LP3_DEVICE: GuideDevice = {
  eyebrow: "PeakDo LinkPower 3 · Field guide", product: LP3_PRODUCT, manual: LP3_MANUAL, manualLabel: "Official manual (PDF) ↗",
  sources: <>Based on <a href={LP3_PRODUCT}>PeakDo’s LP3 product information</a>, the <a href={LP3_MANUAL}>official v3.0 manual</a>, and <a href={LP3_WIFI}>PeakDo’s Wi-Fi explanation</a>. Checked September 26, 2026.</>,
};
export const ULTRA_DEVICE: GuideDevice = {
  eyebrow: "PeakDo LinkPower Ultra · Field guide", product: ULTRA_PRODUCT, manual: ULTRA_MANUAL, manualLabel: "Quick start, FCC filing (PDF) ↗",
  sources: <>Based on <a href={ULTRA_PRODUCT}>PeakDo’s Ultra product page</a> and the <a href={ULTRA_MANUAL}>Ultra quick start filed with the FCC</a>. PeakDo has not yet posted the Ultra manual on its documentation page. Checked October 26, 2026.</>,
};
export const POD_DEVICE: GuideDevice = {
  eyebrow: "PeakDo LinkPower Pod 1 · Field guide", product: POD_PRODUCT, manual: POD_MANUAL, manualLabel: "Official manual (PDF) ↗",
  sources: <>Based on <a href={POD_PRODUCT}>PeakDo’s Pod 1 product page</a> and the <a href={POD_MANUAL}>official Pod 1 quick start</a>. Checked October 26, 2026.</>,
};

export function lp3Metadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, type: "article", url: `https://linkpower.app${path}`, siteName: "LinkPower Companion" },
    twitter: { card: "summary", title, description },
  };
}

export function LP3Guide({ title, description, topics, device = LP3_DEVICE, children }: {
  title: string; description: string; topics: { id: string; title: string }[]; device?: GuideDevice; children: ReactNode;
}) {
  return <div className={styles.page}>
    <header className={styles.header}>
      <a href="/">LinkPower Companion</a>
      <nav aria-label="Guides"><a href="/manual/">App manual</a><a href="/troubleshooting/">Troubleshooting</a></nav>
    </header>
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{device.eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.lede}>{description}</p>
          <div className={styles.actions}><a href={device.manual}>{device.manualLabel}</a><a href={device.product}>PeakDo product page ↗</a></div>
        </div>
      </div>
      <div className={styles.body}>
        <nav className={styles.contents} aria-label="On this page"><strong>On this page</strong>{topics.map(t => <a href={`#${t.id}`} key={t.id}>{t.title}</a>)}</nav>
        <article className={styles.prose}>{children}
          <section id="sources"><h2>Sources &amp; related guides</h2>
            <p>{device.sources} Manufacturer features and controls can vary with firmware.</p>
            <p><a href="/linkpower-1-quick-start/">LP1 quick start</a> · <a href="/linkpower-2-quick-start/">LP2 quick start</a> · <a href="/linkpower-3-quick-start/">LP3 quick start</a> · <a href="/linkpower-3-connection-guide/">LP3 connection guide</a> · <a href="/linkpower-ultra-quick-start/">Ultra quick start</a> · <a href="/linkpower-ultra-connection-guide/">Ultra connection guide</a> · <a href="/linkpower-pod-quick-start/">Pod quick start</a> · <a href="/linkpower-pod-connection-guide/">Pod connection guide</a></p>
            <p>LinkPower Companion is an independent app and is not affiliated with PeakDo. The official web app linked here is operated by PeakDo.</p>
          </section>
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}
