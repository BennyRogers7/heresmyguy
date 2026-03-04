import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPlumbers, getAllCities } from "@/lib/data";
import { SERVICES } from "@/lib/types";
import PlumberCard from "@/components/PlumberCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import WebsimpleCTA from "@/components/WebsimpleCTA";

interface ServicePageProps {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  return SERVICES.map((service) => ({
    service: service.slug,
  }));
}

function getServiceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name} in Minnesota - Find Local Plumbers`,
    description: `Find Minnesota plumbers specializing in ${service.name.toLowerCase()}. ${service.description}. Compare ratings and get quotes from licensed professionals.`,
    openGraph: {
      title: `${service.name} in Minnesota`,
      description: `Find Minnesota plumbers specializing in ${service.name.toLowerCase()}.`,
    },
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceSlug } = await params;
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    notFound();
  }

  const allPlumbers = getAllPlumbers();
  const cities = getAllCities();

  // For service pages, show all plumbers sorted by rating
  const plumbers = allPlumbers.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });

  // Service-specific FAQs
  const faqs = [
    {
      question: `What does ${service.name.toLowerCase()} cost in Minnesota?`,
      answer: `The average cost for ${service.name.toLowerCase()} in Minnesota ranges from $150–$500 depending on complexity. Emergency services may cost more. Get quotes from multiple plumbers for the best rate.`,
    },
    {
      question: `How do I find a plumber for ${service.name.toLowerCase()}?`,
      answer: `Browse our directory of ${plumbers.length} licensed Minnesota plumbers. Filter by city, check Google ratings, and compare services. Featured plumbers are verified and highly rated.`,
    },
    {
      question: `Do Minnesota plumbers offer emergency ${service.name.toLowerCase()}?`,
      answer: `Many Minnesota plumbers offer 24/7 emergency services for ${service.name.toLowerCase()}. Look for plumbers advertising emergency availability or call during off-hours.`,
    },
    {
      question: `Is ${service.name.toLowerCase()} covered by warranty?`,
      answer: `Most licensed Minnesota plumbers offer warranties on ${service.name.toLowerCase()} work, typically 1-2 years on labor and manufacturer warranties on parts. Always ask about warranty terms before hiring.`,
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
              { label: "Services", href: "/#services" },
              { label: service.name },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            <span className="text-[#d4a853]">{service.name}</span> in Minnesota
          </h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            {service.description}. Browse {plumbers.length} Minnesota plumbers who can help with your {service.name.toLowerCase()} needs.
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
                {service.name} Plumbers
              </h2>
              <span className="text-gray-500 text-sm">
                {plumbers.length} results
              </span>
            </div>
            <div className="space-y-4">
              {plumbers.slice(0, 20).map((plumber) => (
                <PlumberCard key={plumber.id} plumber={plumber} />
              ))}
            </div>
            {plumbers.length > 20 && (
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Showing 20 of {plumbers.length} plumbers.{" "}
                  <Link href="/#cities" className="text-[#d4a853] hover:underline">
                    Browse by city
                  </Link>{" "}
                  to see all plumbers in your area.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <WebsimpleCTA />

            {/* Browse by City */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Browse by City
              </h3>
              <div className="flex flex-wrap gap-2">
                {cities.slice(0, 15).map((city) => (
                  <Link
                    key={city.slug}
                    href={`/${city.slug}`}
                    className="text-sm bg-gray-100 hover:bg-[#d4a853] hover:text-[#1a1a2e] px-3 py-1 rounded-full transition-colors"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/#cities"
                className="block mt-4 text-sm text-[#d4a853] hover:underline"
              >
                View all {cities.length} cities &rarr;
              </Link>
            </div>

            {/* Other Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Other Services
              </h3>
              <ul className="space-y-2">
                {SERVICES.filter((s) => s.slug !== service.slug)
                  .slice(0, 5)
                  .map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
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
                name: "Services",
                item: "https://mnplumb.com/#services",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: service.name,
                item: `https://mnplumb.com/services/${service.slug}`,
              },
            ],
          }),
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.name,
            description: service.description,
            areaServed: {
              "@type": "State",
              name: "Minnesota",
              addressCountry: "US",
            },
            provider: {
              "@type": "Organization",
              name: "MN Plumbers Directory",
              url: "https://mnplumb.com",
            },
          }),
        }}
      />

      {/* ItemList Schema - For Google Carousel Features */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${service.name} Plumbers in Minnesota`,
            description: `Top-rated Minnesota plumbers specializing in ${service.name.toLowerCase()}.`,
            numberOfItems: Math.min(plumbers.length, 20),
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
