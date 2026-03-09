import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCities,
  getCityBySlug,
  getPlumbersByCityAndService,
} from "@/lib/data";
import { SERVICES } from "@/lib/types";
import PlumberCard from "@/components/PlumberCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import WebsimpleCTA from "@/components/WebsimpleCTA";

interface CityServicePageProps {
  params: Promise<{ city: string; service: string }>;
}

// Generate all city + service combinations
export async function generateStaticParams() {
  const cities = getAllCities();
  const params: { city: string; service: string }[] = [];

  // Only generate for top 50 cities by plumber count
  const topCities = cities.slice(0, 50);

  for (const city of topCities) {
    for (const service of SERVICES) {
      params.push({
        city: city.slug,
        service: service.slug,
      });
    }
  }

  return params;
}

function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

// City-specific permit and cost data
function getCityData(cityName: string) {
  const cityLower = cityName.toLowerCase();

  // Metro area cities
  if (
    cityLower.includes("minneapolis") ||
    cityLower.includes("st. paul") ||
    cityLower.includes("saint paul")
  ) {
    return {
      permitRequired: true,
      permitCost: "$50–$150",
      avgHourlyRate: "$95–$150",
      permitNote:
        "Most plumbing work in the Twin Cities metro requires a permit from the city inspections department.",
      emergencyAvailability: "24/7 emergency services widely available",
    };
  }

  // Duluth area
  if (cityLower.includes("duluth")) {
    return {
      permitRequired: true,
      permitCost: "$40–$100",
      avgHourlyRate: "$85–$130",
      permitNote:
        "Duluth requires permits for most plumbing work. Contact City of Duluth Community Development.",
      emergencyAvailability: "Emergency services available, may have longer response times",
    };
  }

  // Rochester
  if (cityLower.includes("rochester")) {
    return {
      permitRequired: true,
      permitCost: "$45–$120",
      avgHourlyRate: "$90–$140",
      permitNote:
        "Rochester Building Safety Division requires permits for plumbing modifications.",
      emergencyAvailability: "24/7 emergency services available",
    };
  }

  // Default for other cities
  return {
    permitRequired: true,
    permitCost: "$35–$100",
    avgHourlyRate: "$80–$130",
    permitNote:
      "Most Minnesota cities require permits for plumbing work. Check with your local building department.",
    emergencyAvailability: "Emergency services vary by provider",
  };
}

// Service-specific cost estimates
function getServiceCosts(serviceSlug: string) {
  const costs: Record<string, { low: number; high: number; unit: string }> = {
    "emergency-plumbing": { low: 150, high: 500, unit: "per visit" },
    "drain-cleaning": { low: 100, high: 300, unit: "per drain" },
    "water-heater": { low: 800, high: 2500, unit: "installed" },
    "sewer-line-repair": { low: 1500, high: 8000, unit: "per repair" },
    "pipe-repair": { low: 150, high: 800, unit: "per repair" },
    "bathroom-plumbing": { low: 200, high: 3000, unit: "per project" },
    "kitchen-plumbing": { low: 150, high: 2000, unit: "per project" },
    "water-softener": { low: 500, high: 2500, unit: "installed" },
    "leak-detection": { low: 100, high: 400, unit: "per inspection" },
    "toilet-repair": { low: 100, high: 400, unit: "per toilet" },
  };

  return costs[serviceSlug] || { low: 100, high: 500, unit: "per service" };
}

export async function generateMetadata({
  params,
}: CityServicePageProps): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);

  if (!city || !service) {
    return { title: "Not Found" };
  }

  const costs = getServiceCosts(serviceSlug);

  return {
    title: `${service.name} in ${city.name}, MN - Licensed Plumbers`,
    description: `Find licensed plumbers for ${service.name.toLowerCase()} in ${city.name}, Minnesota. Average cost: $${costs.low}–$${costs.high} ${costs.unit}. Compare ratings and get quotes.`,
    openGraph: {
      title: `${service.name} in ${city.name}, MN`,
      description: `Licensed plumbers for ${service.name.toLowerCase()} in ${city.name}. Get quotes today.`,
    },
    alternates: {
      canonical: `/${citySlug}/${serviceSlug}`,
    },
  };
}

export default async function CityServicePage({ params }: CityServicePageProps) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);

  if (!city || !service) {
    notFound();
  }

  const plumbers = getPlumbersByCityAndService(citySlug, service.name);
  const cityData = getCityData(city.name);
  const costs = getServiceCosts(serviceSlug);

  // FAQs specific to city + service
  const faqs = [
    {
      question: `How much does ${service.name.toLowerCase()} cost in ${city.name}?`,
      answer: `The average cost for ${service.name.toLowerCase()} in ${city.name}, MN ranges from $${costs.low} to $${costs.high} ${costs.unit}. Prices vary based on complexity, time of service, and specific requirements. Get quotes from multiple plumbers for the best rate.`,
    },
    {
      question: `Do I need a permit for ${service.name.toLowerCase()} in ${city.name}?`,
      answer: cityData.permitNote + ` Permit costs typically range from ${cityData.permitCost}. Your plumber can often pull the permit for you.`,
    },
    {
      question: `How do I find a reliable plumber for ${service.name.toLowerCase()} in ${city.name}?`,
      answer: `Check Google ratings and reviews, verify they're licensed in Minnesota, get at least 2-3 quotes, and ask about warranties. Our directory lists ${plumbers.length} plumbers serving ${city.name} who can help with ${service.name.toLowerCase()}.`,
    },
    {
      question: `Is emergency ${service.name.toLowerCase()} available in ${city.name}?`,
      answer: `${cityData.emergencyAvailability}. Many plumbers in ${city.name} offer 24/7 emergency services, though after-hours rates are typically 1.5x to 2x standard rates.`,
    },
    {
      question: `What's the average hourly rate for plumbers in ${city.name}?`,
      answer: `Plumbers in ${city.name}, MN typically charge ${cityData.avgHourlyRate} per hour. Complex jobs like ${service.name.toLowerCase()} may be quoted as flat-rate projects instead of hourly.`,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: city.name, href: `/${citySlug}` },
              { label: service.name },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            <span className="text-[#d4a853]">{service.name}</span> in {city.name}, MN
          </h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            {service.description}. Compare {plumbers.length} licensed plumbers in {city.name} ready to help.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">${costs.low}–${costs.high}</span>
              <span className="text-gray-300 text-sm ml-2">{costs.unit}</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{cityData.avgHourlyRate}</span>
              <span className="text-gray-300 text-sm ml-2">per hour</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-[#d4a853] font-semibold">{plumbers.length}</span>
              <span className="text-gray-300 text-sm ml-2">plumbers available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">
                {service.name} Plumbers in {city.name}
              </h2>
              <span className="text-gray-500 text-sm">{plumbers.length} results</span>
            </div>
            <div className="space-y-4">
              {plumbers.slice(0, 15).map((plumber) => (
                <PlumberCard key={plumber.id} plumber={plumber} />
              ))}
            </div>
            {plumbers.length > 15 && (
              <div className="mt-6 text-center">
                <Link
                  href={`/${citySlug}`}
                  className="text-[#d4a853] hover:underline"
                >
                  View all {plumbers.length} plumbers in {city.name} →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cost & Permit Guide */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                {city.name} Permit Guide
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Permit Required:</span>
                  <span className="font-medium">{cityData.permitRequired ? "Yes" : "Varies"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Permit Cost:</span>
                  <span className="font-medium">{cityData.permitCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Hourly Rate:</span>
                  <span className="font-medium">{cityData.avgHourlyRate}</span>
                </div>
                <p className="text-gray-500 text-xs mt-3 pt-3 border-t">
                  {cityData.permitNote}
                </p>
              </div>
            </div>

            <WebsimpleCTA />

            {/* Other Services in City */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Other Services in {city.name}
              </h3>
              <ul className="space-y-2">
                {SERVICES.filter((s) => s.slug !== serviceSlug)
                  .slice(0, 5)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/${citySlug}/${s.slug}`}
                        className="text-sm text-gray-600 hover:text-[#d4a853]"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="cursor-pointer text-sm font-medium text-gray-900 hover:text-[#d4a853]">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
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
                item: "https://mnplumb.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: city.name,
                item: `https://mnplumb.com/${citySlug}`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: `https://mnplumb.com/${citySlug}/${serviceSlug}`,
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
            name: `${service.name} Plumbers in ${city.name}, Minnesota`,
            description: `Top-rated plumbers for ${service.name.toLowerCase()} in ${city.name}, MN. Average cost: $${costs.low}–$${costs.high}.`,
            numberOfItems: plumbers.length,
            itemListElement: plumbers.slice(0, 10).map((plumber, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Plumber",
                "@id": `https://mnplumb.com/profile/${plumber.slug}`,
                name: plumber.name,
                url: `https://mnplumb.com/profile/${plumber.slug}`,
                telephone: plumber.phone,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: plumber.city,
                  addressRegion: "MN",
                  addressCountry: "US",
                },
                ...(plumber.rating && {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: plumber.rating,
                    bestRating: 5,
                    worstRating: 1,
                    ratingCount: Math.max(1, Math.floor(plumber.rating * 3)),
                  },
                }),
                priceRange: "$$",
              },
            })),
          }),
        }}
      />

      {/* Service Schema with pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${service.name} in ${city.name}`,
            description: service.description,
            areaServed: {
              "@type": "City",
              name: city.name,
              addressRegion: "MN",
              addressCountry: "US",
            },
            provider: {
              "@type": "Organization",
              name: "MN Plumbers Directory",
              url: "https://mnplumb.com",
            },
            offers: {
              "@type": "AggregateOffer",
              lowPrice: costs.low,
              highPrice: costs.high,
              priceCurrency: "USD",
              offerCount: plumbers.length,
            },
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
