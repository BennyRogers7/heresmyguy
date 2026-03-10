import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Breadcrumbs from "@/components/Breadcrumbs";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ vertical: string; state: string }>;
}

// Generate on demand (ISR)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vertical: verticalSlug, state: stateSlug } = await params;

  const [vertical, state] = await Promise.all([
    prisma.vertical.findUnique({ where: { slug: verticalSlug } }),
    prisma.state.findUnique({ where: { slug: stateSlug } }),
  ]);

  if (!vertical || !state) {
    return { title: "Not Found" };
  }

  const title = `${vertical.name} in ${state.name} | Here's My Guy`;
  const description = `Find trusted ${vertical.name.toLowerCase()} in ${state.name}. Browse local pros with reviews and ratings.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://heresmyguy.com/trade/${verticalSlug}/${stateSlug}`,
    },
  };
}

export default async function VerticalStatePage({ params }: PageProps) {
  const { vertical: verticalSlug, state: stateSlug } = await params;

  const [vertical, state] = await Promise.all([
    prisma.vertical.findUnique({ where: { slug: verticalSlug } }),
    prisma.state.findUnique({ where: { slug: stateSlug } }),
  ]);

  if (!vertical || !state) {
    notFound();
  }

  // Get cities in this state that have this vertical
  const citiesWithVertical = await prisma.business.groupBy({
    by: ["city"],
    where: {
      verticalSlug,
      state: state.abbreviation,
    },
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
  });

  // Get city slugs from City table
  const cityNames = citiesWithVertical.map((c) => c.city);
  const cities = await prisma.city.findMany({
    where: {
      stateId: state.id,
      name: { in: cityNames },
    },
  });

  const citySlugMap = new Map(cities.map((c) => [c.name.toLowerCase(), c.slug]));

  const citiesData = citiesWithVertical.map((c) => ({
    name: c.city,
    slug: citySlugMap.get(c.city.toLowerCase()) || c.city.toLowerCase().replace(/\s+/g, "-"),
    count: c._count.city,
  }));

  const totalBusinesses = citiesData.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: vertical.name, href: `/trade/${verticalSlug}` },
              { label: state.name },
            ]}
          />

          <div className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{vertical.icon}</span>
              <h1 className="text-3xl md:text-4xl font-bold">
                {vertical.name} in {state.name}
              </h1>
            </div>
            <p className="text-gray-300 max-w-2xl">
              Find trusted {vertical.name.toLowerCase()} in {state.name}.{" "}
              {totalBusinesses.toLocaleString()} local pros across {citiesData.length} cities.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{totalBusinesses.toLocaleString()}</span>
              <span className="text-gray-300 text-sm ml-1.5">{vertical.name.toLowerCase()}</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{citiesData.length}</span>
              <span className="text-gray-300 text-sm ml-1.5">cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
            Browse {vertical.name} by City
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {citiesData.map((city) => (
              <Link
                key={city.slug}
                href={`/${stateSlug}/${city.slug}/${verticalSlug}`}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#d4a853] hover:shadow-sm transition-all flex justify-between items-center group"
              >
                <span className="font-medium text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors truncate">
                  {city.name}
                </span>
                <span className="text-sm text-gray-400 ml-2 shrink-0">
                  {city.count}
                </span>
              </Link>
            ))}
          </div>

          {citiesData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No {vertical.name.toLowerCase()} found in {state.name} yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Are you a {vertical.nameSingular.toLowerCase()} in {state.name}?
          </h2>
          <p className="text-gray-300 mb-6">
            Claim your free listing and get found by local customers.
          </p>
          <Link
            href="/claim-listing"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
          >
            Claim Your Free Listing
          </Link>
        </div>
      </section>
    </div>
  );
}
