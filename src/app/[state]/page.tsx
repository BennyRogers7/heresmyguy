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

  // If state is not launched, show coming soon page
  if (!isLaunched) {
    return (
      <div className="bg-[#f8f7f4] min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Breadcrumbs
              variant="light"
              items={[
                { label: "Home", href: "/" },
                { label: state.name },
              ]}
            />

            <div className="mt-8">
              <span className="inline-block bg-[#d4a853]/20 text-[#d4a853] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Coming Soon
              </span>

              <h1 className="text-3xl md:text-5xl font-bold">
                We&apos;re launching in{" "}
                <span className="text-[#d4a853]">{state.name}</span> soon!
              </h1>

              <p className="text-gray-300 mt-4 text-lg max-w-xl mx-auto">
                Here&apos;s My Guy is expanding to {state.name}. Sign up to be notified
                when we launch and be the first to find trusted local contractors.
              </p>
            </div>

            {/* Notification Signup */}
            <div className="mt-10 max-w-md mx-auto">
              <LaunchNotifyForm state={state.abbreviation} stateName={state.name} />
            </div>

            {/* What You'll Get */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-xl p-5">
                <div className="w-10 h-10 bg-[#d4a853] rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Find Local Pros</h3>
                <p className="text-sm text-gray-300">
                  Browse contractors recommended by your neighbors
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <div className="w-10 h-10 bg-[#d4a853] rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Verified Listings</h3>
                <p className="text-sm text-gray-300">
                  See who&apos;s verified and trusted in your area
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-5">
                <div className="w-10 h-10 bg-[#d4a853] rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-1">Real Reviews</h3>
                <p className="text-sm text-gray-300">
                  Read reviews from real customers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contractor CTA */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-gradient-to-r from-[#fffdf7] to-[#fff9e6] border-2 border-[#d4a853] rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">
              Are you a contractor in {state.name}?
            </h2>
            <p className="text-gray-600 mb-6">
              Be among the first to claim your listing when we launch. Get verified
              early and stand out from the competition.
            </p>
            <Link
              href="/claim-listing"
              className="inline-block bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all"
            >
              Pre-Register Your Business
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
