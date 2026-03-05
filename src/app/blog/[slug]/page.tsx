import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
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
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

// Simple markdown-like rendering
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactElement[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      const isChecklist = listItems[0].startsWith("[ ]") || listItems[0].startsWith("[x]");
      elements.push(
        <ul key={`list-${elements.length}`} className={`mb-4 ${isChecklist ? 'space-y-2' : 'list-disc list-inside space-y-1'}`}>
          {listItems.map((item, i) => {
            if (isChecklist) {
              const checked = item.startsWith("[x]");
              const text = item.replace(/^\[[ x]\]\s*/, "");
              return (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-1 w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}>
                    {checked && "✓"}
                  </span>
                  <span>{text}</span>
                </li>
              );
            }
            return <li key={i} className="text-gray-700">{item.replace(/^[-*]\s*/, "")}</li>;
          })}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const [header, ...body] = tableRows;
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {header.map((cell, i) => (
                  <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                    {cell.replace(/\*\*/g, "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.filter(row => !row[0].includes("---")).map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 text-sm text-gray-700 border-b">
                      {cell.replace(/\*\*/g, "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but flush lists/tables
    if (!trimmed) {
      flushList();
      flushTable();
      continue;
    }

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // List detection
    if (trimmed.match(/^[-*]\s/) || trimmed.match(/^\[[ x]\]/)) {
      flushTable();
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

    // Bold text processing
    let processedLine = trimmed;
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

    // Link processing
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

    // Paragraph
    elements.push(
      <p key={`p-${i}`} className="text-gray-700 mb-4 leading-relaxed">
        {finalParts.length > 0 ? finalParts : parts}
      </p>
    );
  }

  // Flush any remaining lists or tables
  flushList();
  flushTable();

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

  const categoryLabels: Record<string, string> = {
    guides: "How-To Guides",
    costs: "Cost Guides",
    emergency: "Emergency Tips",
    seasonal: "Seasonal Maintenance",
    local: "Local Insights",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs font-medium px-2 py-1 rounded bg-[#d4a853] text-[#1a1a2e]">
              {categoryLabels[post.category]}
            </span>
            <span className="text-gray-400 text-sm">
              {post.readingTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">{post.title}</h1>
          <p className="text-gray-300 mt-4">{post.description}</p>
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-400">
            <span>By {post.author}</span>
            <span>•</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <>
                <span>•</span>
                <span>
                  Updated{" "}
                  {new Date(post.updatedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
          {renderContent(post.content)}
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
                  {relatedPost.readingTime} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Plumber?</h2>
          <p className="text-gray-300 mb-6">
            Find licensed Minnesota plumbers ready to help with your project.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
          >
            Find a Plumber Near You
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
            url: `https://mnplumb.com/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt || post.publishedAt,
            author: {
              "@type": "Organization",
              name: post.author,
              url: "https://mnplumb.com",
            },
            publisher: {
              "@type": "Organization",
              name: "MN Plumbers Directory",
              url: "https://mnplumb.com",
              logo: {
                "@type": "ImageObject",
                url: "https://mnplumb.com/images/og-image.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://mnplumb.com/blog/${post.slug}`,
            },
            keywords: post.tags.join(", "),
            articleSection: categoryLabels[post.category],
            wordCount: post.content.split(/\s+/).length,
          }),
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://mnplumb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://mnplumb.com/blog",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://mnplumb.com/blog/${post.slug}`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
