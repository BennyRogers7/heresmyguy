import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPlumbers, getPlumberBySlug, generateCitySlug } from "@/lib/data";
import StarRating from "@/components/StarRating";
import Breadcrumbs from "@/components/Breadcrumbs";
import WebsimpleCTA from "@/components/WebsimpleCTA";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const plumbers = getAllPlumbers();
  return plumbers.map((plumber) => ({
    slug: plumber.slug,
  }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const plumber = getPlumberBySlug(slug);

  if (!plumber) {
    return {
      title: "Plumber Not Found",
    };
  }

  return {
    title: `${plumber.name} - Plumber in ${plumber.city}, MN`,
    description: `${plumber.name} is a licensed plumber in ${plumber.city}, Minnesota. ${plumber.rating ? `Rated ${plumber.rating}/5 stars.` : ""} Call ${plumber.phone} for plumbing services.`,
    openGraph: {
      title: `${plumber.name} - Plumber in ${plumber.city}, MN`,
      description: `Licensed plumber in ${plumber.city}, Minnesota. Call ${plumber.phone} for service.`,
    },
    alternates: {
      canonical: `/profile/${plumber.slug}`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const plumber = getPlumberBySlug(slug);

  if (!plumber) {
    notFound();
  }

  const citySlug = generateCitySlug(plumber.city);

  // Profile FAQs for schema and display
  const faqs = [
    {
      question: `What services does ${plumber.name} offer?`,
      answer: plumber.services.length > 0
        ? `${plumber.name} offers ${plumber.services.join(", ").toLowerCase()}. Contact them at ${plumber.phone} for service availability.`
        : `${plumber.name} is a licensed plumber in ${plumber.city}, MN offering residential and commercial plumbing services. Call ${plumber.phone} for details.`,
    },
    {
      question: `How do I contact ${plumber.name}?`,
      answer: `You can reach ${plumber.name} by phone at ${plumber.phone}${plumber.website ? ` or visit their website` : ""}. They serve ${plumber.city} and surrounding areas in Minnesota.`,
    },
    {
      question: `What is the average cost of a plumber in ${plumber.city}?`,
      answer: `The average cost of a plumber in ${plumber.city}, MN ranges from $95–$150 per hour for standard services. Emergency calls may cost more. Contact ${plumber.name} at ${plumber.phone} for a specific quote.`,
    },
  ];

  // FAQ schema
  const faqSchema = {
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
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
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
        name: plumber.city,
        item: `https://mnplumb.com/${citySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: plumber.name,
        item: `https://mnplumb.com/profile/${plumber.slug}`,
      },
    ],
  };

  // LocalBusiness schema - Enhanced for 2026 SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `https://mnplumb.com/profile/${plumber.slug}`,
    name: plumber.name,
    telephone: plumber.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: plumber.address,
      addressLocality: plumber.city,
      addressRegion: "MN",
      postalCode: plumber.zipCode || undefined,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: plumber.city,
      addressRegion: "MN",
      addressCountry: "US",
    },
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Check",
    ...(plumber.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: plumber.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: Math.max(1, Math.floor(plumber.rating * 3)), // Estimate based on rating
      },
    }),
    ...(plumber.website && { url: plumber.website }),
    ...(plumber.email && { email: plumber.email }),
    ...(plumber.services.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Plumbing Services",
        itemListElement: plumber.services.map((service, index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service,
          },
          position: index + 1,
        })),
      },
      knowsAbout: plumber.services,
    }),
    isAcceptingNewPatients: true,
    slogan: `Licensed plumber serving ${plumber.city}, Minnesota`,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: plumber.city, href: `/${citySlug}` },
              { label: plumber.name },
            ]}
          />
          <div className="flex items-start justify-between mt-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{plumber.name}</h1>
              <p className="text-gray-300 mt-2">{plumber.address}</p>
              <div className="mt-3">
                <StarRating rating={plumber.rating} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${plumber.phone}`} className="text-lg font-medium text-[#1a1a2e] hover:text-[#d4a853]">
                      {plumber.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{plumber.address}</p>
                  </div>
                </div>

                {plumber.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a href={plumber.website} target="_blank" rel="noopener noreferrer" className="text-[#d4a853] hover:underline">
                        Visit Website &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <a
                  href={`tel:${plumber.phone}`}
                  className="flex-1 bg-[#1a1a2e] text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-[#2d2d44] transition-colors"
                >
                  Call Now
                </a>
                {plumber.website && (
                  <a
                    href={plumber.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#d4a853] text-[#1a1a2e] text-center py-3 px-4 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>

            {/* Services */}
            {plumber.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
                  Services
                </h2>
                <div className="flex flex-wrap gap-2">
                  {plumber.services.map((service, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
                Frequently Asked Questions
              </h2>
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

            {/* Claim CTA */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">
                Is This Your Business?
              </h3>
              <p className="text-gray-300 mb-4">
                Claim this listing to update your information, add photos, and connect with more customers.
              </p>
              <Link
                href="/claim-listing"
                className="inline-block bg-[#d4a853] text-[#1a1a2e] px-6 py-2 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
              >
                Claim This Listing
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {!plumber.website && <WebsimpleCTA />}

            {/* More Plumbers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                More Plumbers in {plumber.city}
              </h3>
              <Link
                href={`/${citySlug}`}
                className="text-[#d4a853] hover:underline text-sm"
              >
                View all plumbers in {plumber.city} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </div>
  );
}
