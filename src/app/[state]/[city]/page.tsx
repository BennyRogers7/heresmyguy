import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getStateBySlug,
  getCityBySlug,
  getAllVerticals,
  prisma,
} from "@/lib/db";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

export async function generateStaticParams() {
  const cities = await prisma.city.findMany({
    where: { businessCount: { gt: 0 } },
    include: { state: true },
  });

  return cities.map((city) => ({
    state: city.state.slug,
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;

  const state = await getStateBySlug(stateSlug);
  const city = await getCityBySlug(stateSlug, citySlug);

  if (!state || !city) {
    return { title: "Not Found" };
  }

  const title = `Contractors in ${city.name}, ${state.abbreviation} | Here's My Guy`;
  const description = `Find trusted contractors in ${city.name}, ${state.name}. Browse ${city.businessCount} local landscapers, roofers, electricians, and more.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://heresmyguy.com/${stateSlug}/${citySlug}`,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { state: stateSlug, city: citySlug } = await params;

  const [state, city, verticals] = await Promise.all([
    getStateBySlug(stateSlug),
    getCityBySlug(stateSlug, citySlug),
    getAllVerticals(),
  ]);

  if (!state || !city) {
    notFound();
  }

  // Get vertical counts for this city
  const verticalCounts = await prisma.business.groupBy({
    by: ["verticalSlug"],
    where: {
      state: state.abbreviation,
      city: {
        equals: city.name,
        mode: "insensitive",
      },
    },
    _count: { verticalSlug: true },
  });

  const verticalCountMap = new Map(
    verticalCounts.map((v) => [v.verticalSlug, v._count.verticalSlug])
  );

  // Filter to verticals that have businesses in this city
  const availableVerticals = verticals.filter(
    (v) => (verticalCountMap.get(v.slug) || 0) > 0
  );

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: state.name, href: `/${stateSlug}` },
              { label: city.name },
            ]}
          />

          <h1 className="text-2xl md:text-4xl font-bold mt-4">
            Contractors in{" "}
            <span className="text-[#d4a853]">
              {city.name}, {state.abbreviation}
            </span>
          </h1>

          <p className="text-gray-300 mt-2 max-w-2xl">
            Find the contractor your neighbor swears by.{" "}
            {city.businessCount} local pros ready to help.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{city.businessCount}</span>
              <span className="text-gray-300 text-sm ml-1.5">contractors</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">
                {availableVerticals.length}
              </span>
              <span className="text-gray-300 text-sm ml-1.5">trade types</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">
          What do you need help with?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableVerticals.map((vertical) => {
            const count = verticalCountMap.get(vertical.slug) || 0;
            return (
              <Link
                key={vertical.slug}
                href={`/${stateSlug}/${citySlug}/${vertical.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#d4a853] hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{vertical.icon}</span>
                  <h3 className="text-lg font-bold text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors">
                    {vertical.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">{vertical.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {count} {count === 1 ? "pro" : "pros"} available
                  </span>
                  <span className="text-[#d4a853] text-sm font-medium group-hover:underline">
                    View all →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {availableVerticals.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              No contractors found in {city.name} yet.
            </p>
            <Link href={`/${stateSlug}`} className="text-[#d4a853] hover:underline">
              Browse other cities in {state.name} →
            </Link>
          </div>
        )}

        {/* Claim CTA */}
        <div className="mt-8 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-6 text-white text-center">
          <h3 className="font-semibold text-lg mb-2">
            Own a business in {city.name}?
          </h3>
          <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">
            Claim your free listing and get found by local customers looking for contractors.
          </p>
          <Link
            href="/claim-listing"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors"
          >
            Claim Your Listing
          </Link>
        </div>
      </div>

      {/* Schema Markup */}
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
                item: "https://heresmyguy.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: state.name,
                item: `https://heresmyguy.com/${stateSlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: city.name,
                item: `https://heresmyguy.com/${stateSlug}/${citySlug}`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
