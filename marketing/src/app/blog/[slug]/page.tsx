// Dynamic route for individual blog posts. `generateStaticParams`
// returns all 4 slugs at build time, so the static export emits one
// HTML file per post.
//
// `generateMetadata` per slug — title, description, canonical, OG, and
// JSON-LD via the inline <script>. Each post body and FAQ list lives
// in `src/data/posts/{slug}.tsx`.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogShell } from "../../../components/BlogShell";
import { SITE_URL } from "../../../components/theme";
import { posts, getPost, getRelated, type Post } from "../../../data/posts";

// Lazy-loaded body components keep the dynamic route small and let
// Next code-split per post. Each export defines a default Body and an
// optional `faqs` (and `howToSteps` for the how-to post).
import IosAppBody, { faqs as iosAppFaqs } from "../../../data/posts/peakdo-ios-app";
import BluefyBody, { faqs as bluefyFaqs } from "../../../data/posts/peakdo-without-bluefy";
import StarlinkBody, { faqs as starlinkFaqs } from "../../../data/posts/starlink-mini-battery-monitor-iphone";
import ScheduleBody, {
  faqs as scheduleFaqs,
  howToSteps as scheduleHowTo,
} from "../../../data/posts/schedule-peakdo-dc-port";

// Slug → body component + FAQ list. Keeps the route single-purpose and
// tells TypeScript exactly which posts have FAQ / HowTo content.
const BODIES = {
  "peakdo-ios-app": { Body: IosAppBody, faqs: iosAppFaqs },
  "peakdo-without-bluefy": { Body: BluefyBody, faqs: bluefyFaqs },
  "starlink-mini-battery-monitor-iphone": {
    Body: StarlinkBody,
    faqs: starlinkFaqs,
  },
  "schedule-peakdo-dc-port": {
    Body: ScheduleBody,
    faqs: scheduleFaqs,
    howToSteps: scheduleHowTo,
  },
} as const;

type Slug = keyof typeof BODIES;

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${slug}/`;

  return {
    title: post.titleTag,
    description: post.description,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      type: "article",
      title: post.titleTag,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      // /blog/{slug}/opengraph-image renders the per-post OG card.
    },
    twitter: {
      card: "summary_large_image",
      title: post.titleTag,
      description: post.description,
    },
  };
}

function articleSchema(post: Post) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${url}opengraph-image`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Organization",
      name: "Link-Power Companion",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Link-Power Companion",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/app-icon-fg.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

function breadcrumbSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog/` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}/`,
      },
    ],
  };
}

function faqSchema(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

function howToSchema(
  post: Post,
  steps: ReadonlyArray<{ name: string; text: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.title,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || !(slug in BODIES)) notFound();

  const entry = BODIES[slug as Slug];
  const Body = entry.Body;
  const faqs = entry.faqs;
  const howToSteps = "howToSteps" in entry ? entry.howToSteps : undefined;
  const related = getRelated(slug);

  return (
    <>
      <BlogShell post={post!} related={related} faqs={[...faqs]}>
        <Body />
      </BlogShell>

      {/* JSON-LD: emitted as plain <script> tags so they appear in the
          static HTML directly. Using next/script renders them through
          React's RSC payload, which works for Google's JS crawler but
          not for non-JS schema validators or social previews. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(post!)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(post!)) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
        />
      )}
      {howToSteps && howToSteps.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema(post!, howToSteps)),
          }}
        />
      )}
    </>
  );
}
