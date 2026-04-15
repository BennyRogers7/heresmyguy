import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Here's My Guy",
  description:
    "Tips for homeowners, guides for contractors, and news from Here's My Guy.",
  alternates: {
    canonical: "https://heresmyguy.com/blog",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  guides: "Guides",
  news: "News",
  tips: "Tips",
};

const CATEGORY_COLORS: Record<string, string> = {
  guides: "bg-blue-100 text-blue-700",
  news: "bg-purple-100 text-purple-700",
  tips: "bg-green-100 text-green-700",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts.find((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            The Here&apos;s My Guy <span className="text-[#d4a853]">Blog</span>
          </h1>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto">
            Tips for homeowners, guides for contractors, and updates from our
            team.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      CATEGORY_COLORS[featuredPost.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {CATEGORY_LABELS[featuredPost.category] || featuredPost.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(featuredPost.date)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 text-lg">{featuredPost.description}</p>
                <p className="text-sm text-gray-500 mt-4">
                  By {featuredPost.author}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
              More Articles
            </h2>
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        CATEGORY_COLORS[post.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {CATEGORY_LABELS[post.category] || post.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
