// Per-post Open Graph images, baked at build time. Next.js 16 picks
// this up via the `opengraph-image.tsx` file convention — one PNG is
// emitted per slug returned by `generateStaticParams`.
//
// Design contract: 1200×630, brand engineering-blue background, big
// eyebrow + headline, Link-Power wordmark in the footer. Mirrors the
// homepage hero so social share cards feel consistent.
import { ImageResponse } from "next/og";
import { posts, getPost } from "../../../data/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";
export const dynamicParams = false;

const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  near: "#0A1320",
  ink: "#0F172A",
  charging: "#34C759",
};

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function OG(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new ImageResponse(<div>missing post</div>, size);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          padding: "72px 80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#fff",
          background: `linear-gradient(165deg, ${THEME.near} 0%, #0E2236 55%, ${THEME.blueDeep} 100%)`,
          position: "relative",
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        }}
      >
        {/* Engineering grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Color glow */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "9999px",
            background: THEME.blue,
            filter: "blur(140px)",
            opacity: 0.45,
            top: "-200px",
            right: "-200px",
            display: "flex",
          }}
        />

        {/* Top: eyebrow chip */}
        <div style={{ display: "flex", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px 10px 14px",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: THEME.charging,
                display: "flex",
              }}
            />
            {post.eyebrow}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 60 ? 56 : 68,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
            zIndex: 1,
          }}
        >
          {post.title}
        </div>

        {/* Bottom: wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              {/* Lightning bolt — matches the homepage Icon "bolt" */}
              <path
                d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
                stroke={THEME.blue}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={THEME.blue}
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.01em" }}>
              Link-Power Companion
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, opacity: 0.6, marginTop: 2 }}>
              linkpower.app
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
