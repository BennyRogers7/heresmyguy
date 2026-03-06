import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getBusinessesByCityAndVertical,
  getStateBySlug,
  getCityBySlug,
  getVerticalBySlug,
  getAllCityVerticalPaths,
} from "@/lib/db";
import ContractorCard from "@/components/ContractorCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ state: string; city: string; vertical: string }>;
}

export async function generateStaticParams() {
  const paths = await getAllCityVerticalPaths();
  return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: stateSlug, city: citySlug, vertical: verticalSlug } = await params;

  const state = await getStateBySlug(stateSlug);
  const city = await getCityBySlug(stateSlug, citySlug);
  const vertical = await getVerticalBySlug(verticalSlug);

  if (!state || !city || !vertical) {
    return { title: "Not Found" };
  }

  const title = `${vertical.name} in ${city.name}, ${state.abbreviation} | Here's My Guy`;
  const description = `Find trusted ${vertical.name.toLowerCase()} in ${city.name}, ${state.name}. Compare ratings, read reviews, and hire local pros your neighbors recommend.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      canonical: `https://heresmyguy.com/${stateSlug}/${citySlug}/${verticalSlug}`,
    },
  };
}

export default async function CityVerticalPage({ params }: PageProps) {
  const { state: stateSlug, city: citySlug, vertical: verticalSlug } = await params;

  const [state, city, vertical, businesses] = await Promise.all([
    getStateBySlug(stateSlug),
    getCityBySlug(stateSlug, citySlug),
    getVerticalBySlug(verticalSlug),
    getBusinessesByCityAndVertical(stateSlug, citySlug, verticalSlug),
  ]);

  if (!state || !city || !vertical) {
    notFound();
  }

  const featuredBusinesses = businesses.filter((b) => b.isFeatured);
  const standardBusinesses = businesses.filter((b) => !b.isFeatured);

  // FAQs for SEO
  const faqs = [
    {
      question: `How do I find a good ${vertical.nameSingular.toLowerCase()} in ${city.name}?`,
      answer: `Check ratings and reviews from local customers, verify they're licensed and insured, and get at least 2-3 quotes. Our directory lists ${businesses.length} ${vertical.name.toLowerCase()} serving ${city.name}, ${state.abbreviation}.`,
    },
    {
      question: `How much do ${vertical.name.toLowerCase()} cost in ${city.name}, ${state.abbreviation}?`,
      answer: `Costs vary based on the scope of work and the contractor. We recommend getting multiple quotes from local ${vertical.name.toLowerCase()} to compare pricing. Contact the businesses listed here for free estimates.`,
    },
    {
      question: `Are the ${vertical.name.toLowerCase()} on Here's My Guy verified?`,
      answer: `Businesses with a verified badge have claimed and confirmed their listing. All listings include Google ratings and reviews to help you make an informed decision.`,
    },
  ];

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: state.name, href: `/${stateSlug}` },
              { label: city.name, href: `/${stateSlug}/${citySlug}` },
              { label: vertical.name },
            ]}
          />

          <h1 className="text-2xl md:text-4xl font-bold mt-4">
            {vertical.name} in{" "}
            <span className="text-[#d4a853]">
              {city.name}, {state.abbreviation}
            </span>
          </h1>

          <p className="text-gray-300 mt-2 max-w-2xl text-sm md:text-base">
            Find the {vertical.nameSingular.toLowerCase()} your neighbor swears by.{" "}
            {businesses.length} local pros ready to help.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 md:gap-4 mt-5">
            <div className="bg-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2">
              <span className="text-[#d4a853] font-semibold">{businesses.length}</span>
              <span className="text-gray-300 text-sm ml-1.5">{vertical.name.toLowerCase()}</span>
            </div>
            {featuredBusinesses.length > 0 && (
              <div className="bg-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2">
                <span className="text-[#d4a853] font-semibold">{featuredBusinesses.length}</span>
                <span className="text-gray-300 text-sm ml-1.5">featured</span>
              </div>
            )}
            <div className="bg-white/10 rounded-lg px-3 py-1.5 md:px-4 md:py-2">
              <span className="text-gray-300 text-sm">Free quotes available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            {/* Featured Listings */}
            {featuredBusinesses.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
                  <span className="text-[#d4a853]">★</span> Featured {vertical.name}
                </h2>
                <div className="space-y-4">
                  {featuredBusinesses.map((business) => (
                    <ContractorCard
                      key={business.id}
                      business={business}
                      vertical={vertical.nameSingular}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Standard Listings */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#1a1a2e]">
                  All {vertical.name} in {city.name}
                </h2>
                <span className="text-gray-500 text-sm">
                  {standardBusinesses.length} results
                </span>
              </div>
              <div className="space-y-4">
                {standardBusinesses.map((business) => (
                  <ContractorCard
                    key={business.id}
                    business={business}
                    vertical={vertical.nameSingular}
                  />
                ))}
              </div>

              {businesses.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    No {vertical.name.toLowerCase()} found in {city.name} yet.
                  </p>
                  <Link
                    href={`/${stateSlug}`}
                    className="text-[#d4a853] hover:underline"
                  >
                    Browse all cities in {state.name} →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Claim CTA */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-2">Own a business?</h3>
              <p className="text-gray-300 text-sm mb-3">
                Claim your free listing and get found by customers in {city.name}.
              </p>
              <Link
                href="/claim-listing"
                className="block bg-[#d4a853] text-[#1a1a2e] text-center py-2.5 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors text-sm"
              >
                Claim Your Listing
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-[#1a1a2e] mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-[#d4a853] list-none flex justify-between items-center">
                      {faq.question}
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Browse Other Cities */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-[#1a1a2e] mb-3">
                {vertical.name} in Other Cities
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Browse {vertical.name.toLowerCase()} in other {state.name} cities.
              </p>
              <Link
                href={`/${stateSlug}`}
                className="text-sm text-[#d4a853] hover:underline"
              >
                View all {state.name} cities →
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
              {
                "@type": "ListItem",
                position: 3,
                name: city.name,
                item: `https://heresmyguy.com/${stateSlug}/${citySlug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: vertical.name,
                item: `https://heresmyguy.com/${stateSlug}/${citySlug}/${verticalSlug}`,
              },
            ],
          }),
        }}
      />

      {/* ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${vertical.name} in ${city.name}, ${state.abbreviation}`,
            description: `Top-rated ${vertical.name.toLowerCase()} in ${city.name}, ${state.name}`,
            numberOfItems: businesses.length,
            itemListElement: businesses.slice(0, 10).map((business, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "LocalBusiness",
                "@id": `https://heresmyguy.com/profile/${business.slug}`,
                name: business.name,
                url: `https://heresmyguy.com/profile/${business.slug}`,
                telephone: business.phone,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: business.city,
                  addressRegion: state.abbreviation,
                  addressCountry: "US",
                },
                ...(business.rating && {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: business.rating,
                    bestRating: 5,
                    worstRating: 1,
                    ratingCount: business.reviewCount || 1,
                  },
                }),
              },
            })),
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
