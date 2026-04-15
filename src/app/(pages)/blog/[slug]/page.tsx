import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug, formatDate } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Here's My Guy Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://heresmyguy.com/blog/${post.slug}`,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  guides: "Guides",
  news: "News",
  tips: "Tips",
};

// Simple markdown-like rendering
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactElement[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-gray-700">
          {listItems.map((item, i) => (
            <li key={i}>{item.replace(/^[-*]\s*/, "")}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but flush lists
    if (!trimmed) {
      flushList();
      continue;
    }

    // Skip main heading (# ...)
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      continue;
    }

    // List detection
    if (trimmed.match(/^[-*]\s/)) {
      inList = true;
      listItems.push(trimmed);
      continue;
    } else if (inList) {
      flushList();
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">
          {trimmed.replace("## ", "")}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-semibold text-[#1a1a2e] mt-6 mb-3">
          {trimmed.replace("### ", "")}
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-8 border-gray-200" />);
      continue;
    }

    // Process bold and links
    const processedLine = trimmed;
    const parts: (string | React.ReactElement)[] = [];
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(processedLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processedLine.slice(lastIndex, match.index));
      }
      parts.push(<strong key={`bold-${i}-${match.index}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < processedLine.length) {
      parts.push(processedLine.slice(lastIndex));
    }

    // Process links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const finalParts: (string | React.ReactElement)[] = [];

    for (const part of parts) {
      if (typeof part === "string") {
        let linkLastIndex = 0;
        let linkMatch;
        const partStr = part;

        while ((linkMatch = linkRegex.exec(partStr)) !== null) {
          if (linkMatch.index > linkLastIndex) {
            finalParts.push(partStr.slice(linkLastIndex, linkMatch.index));
          }
          finalParts.push(
            <Link
              key={`link-${i}-${linkMatch.index}`}
              href={linkMatch[2]}
              className="text-[#d4a853] hover:underline"
            >
              {linkMatch[1]}
            </Link>
          );
          linkLastIndex = linkMatch.index + linkMatch[0].length;
        }
        if (linkLastIndex < partStr.length) {
          finalParts.push(partStr.slice(linkLastIndex));
        }
      } else {
        finalParts.push(part);
      }
    }

    // Handle italics for signature (*—...*)
    if (trimmed.startsWith("*") && trimmed.endsWith("*") && !trimmed.startsWith("**")) {
      elements.push(
        <p key={`em-${i}`} className="text-gray-600 italic mb-4">
          {trimmed.slice(1, -1)}
        </p>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-gray-700 mb-4 leading-relaxed">
        {finalParts.length > 0 ? finalParts : parts}
      </p>
    );
  }

  // Flush any remaining list
  flushList();

  return elements;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const allPosts = getAllBlogPosts();

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#d4a853] text-[#1a1a2e]">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <span className="text-gray-400 text-sm">
              {formatDate(post.date)}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">{post.title}</h1>
          <p className="text-gray-300 mt-4">{post.description}</p>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          {renderContent(post.content)}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-[#1a1a2e] line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(relatedPost.date)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Find Your Contractor</h2>
          <p className="text-gray-300 mb-6">
            Browse trusted local contractors across the country.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors"
          >
            Find Contractors
          </Link>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            url: `https://heresmyguy.com/blog/${post.slug}`,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: post.author,
              url: "https://heresmyguy.com",
            },
            publisher: {
              "@type": "Organization",
              name: "Here's My Guy",
              url: "https://heresmyguy.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://heresmyguy.com/blog/${post.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
