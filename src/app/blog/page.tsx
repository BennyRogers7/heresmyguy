import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Minnesota Plumbing Blog - Guides, Costs & Tips",
  description:
    "Expert plumbing guides for Minnesota homeowners. Learn about costs, seasonal maintenance, emergency tips, and how to find the right plumber.",
  openGraph: {
    title: "Minnesota Plumbing Blog",
    description: "Expert plumbing guides for Minnesota homeowners.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  const categoryLabels: Record<string, string> = {
    guides: "How-To Guides",
    costs: "Cost Guides",
    emergency: "Emergency Tips",
    seasonal: "Seasonal Maintenance",
    local: "Local Insights",
  };

  const categoryColors: Record<string, string> = {
    guides: "bg-blue-100 text-blue-800",
    costs: "bg-green-100 text-green-800",
    emergency: "bg-red-100 text-red-800",
    seasonal: "bg-orange-100 text-orange-800",
    local: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            Minnesota <span className="text-[#d4a853]">Plumbing Blog</span>
          </h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Expert guides on plumbing costs, seasonal maintenance, emergency
            tips, and finding the right plumber in Minnesota.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`} className="block p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[post.category]}`}
                  >
                    {categoryLabels[post.category]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.readingTime} min read
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-[#1a1a2e] mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[#d4a853] text-sm font-medium">
                    Read more →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Plumber Now?</h2>
          <p className="text-gray-300 mb-6">
            Skip the research and find a licensed Minnesota plumber today.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
          >
            Find a Plumber
          </Link>
        </div>
      </section>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Minnesota Plumbing Blog",
            description:
              "Expert plumbing guides for Minnesota homeowners covering costs, maintenance, and tips.",
            url: "https://mnplumb.com/blog",
            publisher: {
              "@type": "Organization",
              name: "MN Plumbers Directory",
              url: "https://mnplumb.com",
            },
            blogPost: posts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              url: `https://mnplumb.com/blog/${post.slug}`,
              datePublished: post.publishedAt,
              dateModified: post.updatedAt || post.publishedAt,
              author: {
                "@type": "Organization",
                name: post.author,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
