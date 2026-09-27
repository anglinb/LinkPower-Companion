import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "./Footer";
import styles from "./LP3Guide.module.css";

export const LP3_PRODUCT = "https://www.peakdo.com/products/linkpower3-battery";
export const LP3_MANUAL = "https://images.51microshop.com/15666/user_guide/linkpower_3/LinkPower-3_quick_start_v3.0.pdf";
export const LP3_WEB_APP = "https://pwa-dev.peakdo.ca/lp3/";
export const LP3_WIFI = "https://www.peakdo.com/blogs/news/why-we-upgraded-linkpower-3s-wi-fi-capabilities";

export function lp3Metadata(title: string, description: string, path: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, type: "article", url: `https://linkpower.app${path}`, siteName: "LinkPower Companion" },
    twitter: { card: "summary", title, description },
  };
}

export function LP3Guide({ title, description, topics, children }: {
  title: string; description: string; topics: { id: string; title: string }[]; children: ReactNode;
}) {
  return <div className={styles.page}>
    <header className={styles.header}>
      <a href="/">LinkPower Companion</a>
      <nav aria-label="Guides"><a href="/manual/">App manual</a><a href="/troubleshooting/">Troubleshooting</a></nav>
    </header>
    <main>
      <div className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>PeakDo LinkPower 3 · Field guide</p>
          <h1>{title}</h1>
          <p className={styles.lede}>{description}</p>
          <div className={styles.actions}><a href={LP3_MANUAL}>Official manual (PDF) ↗</a><a href={LP3_PRODUCT}>PeakDo product page ↗</a></div>
        </div>
      </div>
      <div className={styles.body}>
        <nav className={styles.contents} aria-label="On this page"><strong>On this page</strong>{topics.map(t => <a href={`#${t.id}`} key={t.id}>{t.title}</a>)}</nav>
        <article className={styles.prose}>{children}
          <section id="sources"><h2>Sources &amp; related guides</h2>
            <p>Based on <a href={LP3_PRODUCT}>PeakDo’s LP3 product information</a>, the <a href={LP3_MANUAL}>official v3.0 manual</a>, and <a href={LP3_WIFI}>PeakDo’s Wi-Fi explanation</a>. Checked September 26, 2026. Manufacturer features and controls can vary with firmware.</p>
            <p><a href="/linkpower-1-quick-start/">LP1 quick start</a> · <a href="/linkpower-2-quick-start/">LP2 quick start</a> · <a href="/linkpower-3-quick-start/">LP3 quick start</a> · <a href="/linkpower-3-connection-guide/">LP3 connection guide</a></p>
            <p>LinkPower Companion is an independent app and is not affiliated with PeakDo. The official web app linked here is operated by PeakDo.</p>
          </section>
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}
