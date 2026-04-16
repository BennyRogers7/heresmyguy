import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getStateBySlug,
  getCitiesByState,
  getAllStates,
  getAllVerticals,
  prisma,
} from "@/lib/db";
import { isStateLaunched } from "@/lib/state-launch-config";
import Breadcrumbs from "@/components/Breadcrumbs";
import LaunchNotifyForm from "@/components/LaunchNotifyForm";

// Valid US state slugs - prevents this route from catching static pages like /featured
const VALID_STATE_SLUGS = new Set([
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
  "connecticut", "delaware", "district-of-columbia", "florida", "georgia",
  "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky",
  "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota",
  "mississippi", "missouri", "montana", "nebraska", "nevada", "new-hampshire",
  "new-jersey", "new-mexico", "new-york", "north-carolina", "north-dakota",
  "ohio", "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
  "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia",
  "washington", "west-virginia", "wisconsin", "wyoming"
]);

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ state: string }>;
}

// Pre-generate all 50 state pages (small number)
export async function generateStaticParams() {
  const states = await getAllStates();
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug } = await params;

  if (!VALID_STATE_SLUGS.has(stateSlug)) {
    return { title: "Not Found" };
  }

  const state = await getStateBySlug(stateSlug);

  if (!state) {
    return { title: "Not Found" };
  }

  const title = `Local Contractors in ${state.name} | Here's My Guy`;
  const description = `Find trusted contractors in ${state.name}. Browse ${state.businessCount}+ landscapers, roofers, electricians, and more. Read reviews and hire local pros.`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://heresmyguy.com/${stateSlug}`,
    },
  };
}

export default async function StatePage({ params }: PageProps) {
  const { state: stateSlug } = await params;

  // Early return for non-state slugs - allows static routes like /featured to work
  if (!VALID_STATE_SLUGS.has(stateSlug)) {
    notFound();
  }

  const [state, cities, verticals] = await Promise.all([
    getStateBySlug(stateSlug),
    getCitiesByState(stateSlug),
    getAllVerticals(),
  ]);

  if (!state) {
    notFound();
  }

  const isLaunched = isStateLaunched(state.abbreviation);

  // Get vertical counts for this state
  const verticalCounts = await prisma.business.groupBy({
    by: ["verticalSlug"],
    where: { state: state.abbreviation },
    _count: { verticalSlug: true },
  });

  const verticalCountMap = new Map(
    verticalCounts.map((v) => [v.verticalSlug, v._count.verticalSlug])
  );

  // Top cities (by business count)
  const topCities = cities.slice(0, 20);
  const remainingCities = cities.slice(20);

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Coming Soon Banner - shows for unlaunched states */}
      {!isLaunched && (
        <section className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] border-b-4 border-[#d4a853]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-12">
            <div className="text-center">
              <span className="inline-block bg-[#d4a853]/20 text-[#d4a853] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Coming Soon
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Coming Soon to{" "}
                <span className="text-[#d4a853]">{state.name}</span>
              </h2>

              <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
                We&apos;re building each market the right way — with verified contractors,
                real reviews, and a commitment to trust. Be the first to know when
                Here&apos;s My Guy launches in {state.name}.
              </p>

              <div className="mt-6 max-w-md mx-auto">
                <LaunchNotifyForm state={state.abbreviation} stateName={state.name} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: state.name },
            ]}
          />

          <h1 className="text-2xl md:text-4xl font-bold mt-4">
            Local Contractors in{" "}
            <span className="text-[#d4a853]">{state.name}</span>
          </h1>

          <p className="text-gray-300 mt-2 max-w-2xl">
            Find the contractor your neighbor swears by.{" "}
            {state.businessCount.toLocaleString()} local pros across {cities.length} cities.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">
                {state.businessCount.toLocaleString()}
              </span>
              <span className="text-gray-300 text-sm ml-1.5">contractors</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{cities.length}</span>
              <span className="text-gray-300 text-sm ml-1.5">cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cities Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">
              Browse by City
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${stateSlug}/${city.slug}`}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#d4a853] hover:shadow-sm transition-all flex justify-between items-center group"
                >
                  <span className="font-medium text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors truncate">
                    {city.name}
                  </span>
                  <span className="text-sm text-gray-400 ml-2 shrink-0">
                    {city.businessCount}
                  </span>
                </Link>
              ))}
            </div>

            {remainingCities.length > 0 && (
              <details className="mt-4">
                <summary className="text-sm text-[#d4a853] cursor-pointer hover:underline">
                  View {remainingCities.length} more cities
                </summary>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                  {remainingCities.map((city) => (
                    <Link
                      key={city.id}
                      href={`/${stateSlug}/${city.slug}`}
                      className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#d4a853] hover:shadow-sm transition-all flex justify-between items-center group"
                    >
                      <span className="font-medium text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors truncate">
                        {city.name}
                      </span>
                      <span className="text-sm text-gray-400 ml-2 shrink-0">
                        {city.businessCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Browse by Trade */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-[#1a1a2e] mb-4">
                Browse by Trade
              </h3>
              <div className="space-y-2">
                {verticals.map((vertical) => {
                  const count = verticalCountMap.get(vertical.slug) || 0;
                  if (count === 0) return null;
                  return (
                    <Link
                      key={vertical.slug}
                      href={`/trade/${vertical.slug}`}
                      className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-[#f8f7f4] transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <span>{vertical.icon}</span>
                        <span className="text-sm font-medium text-[#1a1a2e] group-hover:text-[#d4a853]">
                          {vertical.name}
                        </span>
                      </span>
                      <span className="text-xs text-gray-400">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Claim CTA */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-2">Own a business in {state.name}?</h3>
              <p className="text-gray-300 text-sm mb-3">
                Claim your free listing and get found by local customers.
              </p>
              <Link
                href="/claim-listing"
                className="block bg-[#d4a853] text-[#1a1a2e] text-center py-2.5 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors text-sm"
              >
                Claim Your Listing
              </Link>
            </div>
          </div>
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
            ],
          }),
        }}
      />
    </div>
  );
}
