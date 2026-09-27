import type { Metadata } from "next";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { THEME } from "../../components/theme";
import { posts } from "../../data/posts";

export const metadata: Metadata = {
  title: "Blog — guides for PeakDo Link-Power on iPhone",
  description:
    "Plain-English guides for the PeakDo Link-Power family on iPhone — Bluefy alternatives, Starlink Mini battery monitoring, DC port scheduling, and more.",
  alternates: { canonical: "/blog/" },
  openGraph: {
    type: "website",
    siteName: "LinkPower App",
    title: "Blog — guides for PeakDo Link-Power on iPhone",
    description:
      "Plain-English guides for the PeakDo Link-Power family on iPhone — Bluefy alternatives, Starlink Mini battery monitoring, DC port scheduling, and more.",
    url: "https://linkpower.app/blog/",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "LinkPower blog — guides for PeakDo Link-Power on iPhone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — guides for PeakDo Link-Power on iPhone",
    description:
      "Plain-English guides for the PeakDo Link-Power family on iPhone — Bluefy alternatives, Starlink Mini battery monitoring, DC port scheduling, and more.",
    images: ["/og.png"],
  },
};

export default function BlogIndex() {
  return (
    <main style={{ background: "#fff", color: THEME.ink }}>
      <Nav current="blog" />

      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(165deg, ${THEME.cloud} 0%, ${THEME.blueWash} 70%, ${THEME.blueSoft} 100%)`,
          padding: "72px 24px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Engineering grid */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${THEME.blueDeep} 1px, transparent 1px), linear-gradient(90deg, ${THEME.blueDeep} 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            opacity: 0.05,
            maskImage: "radial-gradient(ellipse at top, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, black 40%, transparent 80%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: 820,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: THEME.blueDeep,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Blog
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 5.5vw, 52px)",
              fontWeight: 900,
              color: THEME.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: "0 0 16px",
              textWrap: "balance",
            }}
          >
            Guides for PeakDo Link-Power on iPhone.
          </h1>
          <p
            style={{
              fontSize: 19,
              color: THEME.inkSoft,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 640,
              fontWeight: 500,
            }}
          >
            Plain-English deep-dives on the PeakDo Link-Power family,
            iOS-specific tips, Starlink Mini setups, and how to get the
            most out of <a href="/" style={{ color: THEME.blueDeep, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3 }}>Link-Power Companion</a> — the unofficial native iPhone app.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section style={{ padding: "56px 24px 96px", background: THEME.mist }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {posts.map((post) => (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}/`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    background: "#fff",
                    border: `1px solid ${THEME.hairline}`,
                    borderRadius: 18,
                    padding: 24,
                    textDecoration: "none",
                    color: THEME.ink,
                    height: "100%",
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.6) inset, 0 4px 16px -8px rgba(15,23,42,0.06)",
                    transition: "transform 200ms ease, box-shadow 200ms ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      color: THEME.blueDeep,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {post.eyebrow}
                  </span>
                  <h2
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                      margin: "4px 0 4px",
                      color: THEME.ink,
                      textWrap: "balance",
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: THEME.muted,
                      lineHeight: 1.55,
                      fontWeight: 500,
                    }}
                  >
                    {post.excerpt}
                  </p>
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: 12,
                      fontSize: 13,
                      color: THEME.inkSoft,
                      fontWeight: 600,
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span aria-hidden style={{ color: THEME.subtle }}>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
