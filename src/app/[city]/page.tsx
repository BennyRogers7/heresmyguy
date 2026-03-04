import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCities, getPlumbersByCity, getCityBySlug } from "@/lib/data";
import PlumberCard from "@/components/PlumberCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import WebsimpleCTA from "@/components/WebsimpleCTA";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  const cities = getAllCities();
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  // For neighborhoods, include parent city in description
  const locationDesc = city.isNeighborhood && city.parentCity
    ? `${city.name} area of ${city.parentCity}`
    : city.name;

  return {
    title: `Plumbers in ${city.name}, MN - ${city.count} Local Plumbing Professionals`,
    description: `Find ${city.count} trusted plumbers in ${locationDesc}, Minnesota. Compare ratings, read reviews, and get quotes from licensed local plumbing professionals.`,
    openGraph: {
      title: `Plumbers in ${city.name}, MN`,
      description: `Find ${city.count} trusted plumbers in ${locationDesc}, Minnesota.`,
    },
    alternates: {
      canonical: `/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const plumbers = getPlumbersByCity(citySlug);

  // Build breadcrumb items based on whether this is a neighborhood
  const breadcrumbItems = city.isNeighborhood && city.parentCity
    ? [
        { label: "Home", href: "/" },
        { label: "Minnesota Plumbers", href: "/#cities" },
        { label: city.parentCity, href: "/#cities" },
        { label: city.name },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Minnesota Plumbers", href: "/#cities" },
        { label: city.name },
      ];

  const faqs = [
    {
      question: `How many plumbers are in ${city.name}, MN?`,
      answer: `There are currently ${city.count} plumbers listed in ${city.name}, Minnesota. This includes both residential and commercial plumbing professionals.`,
    },
    {
      question: `What plumbing services are available in ${city.name}?`,
      answer: `Plumbers in ${city.name} offer a wide range of services including emergency plumbing, drain cleaning, water heater installation and repair, sewer line repair, pipe repair, bathroom and kitchen plumbing, and more.`,
    },
    {
      question: `How do I choose a plumber in ${city.name}?`,
      answer: `When choosing a plumber in ${city.name}, consider their Google rating, read reviews, verify they are licensed, get multiple quotes, and check if they offer the specific service you need.`,
    },
    {
      question: `Do plumbers in ${city.name} offer emergency services?`,
      answer: `Many plumbers in ${city.name} offer 24/7 emergency plumbing services for urgent issues like burst pipes, severe leaks, or backed-up sewers. Look for plumbers who advertise emergency services.`,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            Plumbers in <span className="text-[#d4a853]">{city.name}</span>, MN
          </h1>
          <p className="text-gray-300 mt-2">
            {city.count} licensed plumbing professionals ready to help
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#1a1a2e]">
                All Plumbers in {city.name}
              </h2>
              <span className="text-gray-500 text-sm">
                {city.count} results
              </span>
            </div>
            <div className="space-y-4">
              {plumbers.map((plumber) => (
                <PlumberCard key={plumber.id} plumber={plumber} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WebsimpleCTA />

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

            {/* CTA Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
                Are You a Plumber in {city.name}?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Claim your free listing or upgrade to featured placement to get more customers.
              </p>
              <a
                href="/claim-listing"
                className="block w-full bg-[#d4a853] text-[#1a1a2e] text-center py-2 px-4 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
              >
                Claim Your Listing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Schema */}
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
            ],
          }),
        }}
      />

      {/* ItemList Schema - Critical for Google Carousel Features */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Best Plumbers in ${city.name}, Minnesota`,
            description: `Top-rated licensed plumbers serving ${city.name}, MN. Compare ratings, reviews, and services.`,
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
                  streetAddress: plumber.address,
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
