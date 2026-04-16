import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBusinessBySlug, getVerticalBySlug, getClaimedCountByState, prisma } from "@/lib/db";
import StarRating from "@/components/StarRating";
import Breadcrumbs from "@/components/Breadcrumbs";

// ISR: Revalidate every hour, generate pages on-demand
export const revalidate = 3600;

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

// Return empty array - all pages generated on first request (ISR)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: "Not Found" };
  }

  const vertical = await getVerticalBySlug(business.verticalSlug);
  const verticalName = vertical?.nameSingular || "Contractor";

  const title = `${business.name} - ${verticalName} in ${business.city}, ${business.state}`;
  const description = `${business.name} is a ${verticalName.toLowerCase()} in ${business.city}, ${business.state}. ${business.rating ? `Rated ${business.rating}/5 stars.` : ""} ${business.phone ? `Call ${business.phone}.` : ""}`;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: {
      canonical: `https://heresmyguy.com/profile/${business.slug}`,
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const [vertical, stateInfo, claimedCount] = await Promise.all([
    getVerticalBySlug(business.verticalSlug),
    prisma.state.findFirst({ where: { abbreviation: business.state } }),
    getClaimedCountByState(business.state),
  ]);

  const verticalName = vertical?.nameSingular || "Contractor";
  const stateSlug = stateInfo?.slug || business.state.toLowerCase();
  const citySlug = business.city.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            variant="light"
            items={[
              { label: "Home", href: "/" },
              { label: stateInfo?.name || business.state, href: `/${stateSlug}` },
              { label: business.city, href: `/${stateSlug}/${citySlug}` },
              { label: business.name },
            ]}
          />

          <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex gap-4">
              {/* Logo/Initial */}
              {business.logo ? (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white overflow-hidden shrink-0">
                  <img
                    src={business.logo}
                    alt={`${business.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#d4a853] flex items-center justify-center shrink-0">
                  <span className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
                    {business.name.charAt(0)}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{business.name}</h1>
                  {business.membershipTier === "founding_member" && (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Founding Member
                    </span>
                  )}
                </div>

                {/* Location + Badge Line */}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <p className="text-gray-300 capitalize">
                    {verticalName} · {business.city}, {business.state}
                  </p>
                  {business.membershipTier === "founding_member" ? (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] text-sm font-semibold px-3 py-1 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified Owner
                    </span>
                  ) : business.isClaimed ? (
                    <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified Owner
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-gray-600 text-gray-300">
                      Unclaimed
                    </span>
                  )}
                  {!business.hasWebsite && (
                    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-600 text-gray-300">
                      No website
                    </span>
                  )}
                </div>

                {business.rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <StarRating rating={business.rating} />
                    {business.reviewCount > 0 && (
                      <span className="text-sm text-gray-400">
                        ({business.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions - Desktop */}
            <div className="hidden md:flex gap-3">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="bg-[#d4a853] text-[#1a1a2e] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors"
                >
                  Call Now
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/30 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced Claim CTA Banner for Unclaimed */}
        {!business.isClaimed && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1a1a2e]">
                  Is this your business?
                </h3>
                <p className="text-gray-600 text-sm">
                  Claim your free listing to get verified, appear higher in search results, and stand out from competitors.
                </p>
              </div>
              <Link
                href={`/claim-listing?id=${business.id}`}
                className="bg-amber-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors whitespace-nowrap text-center"
              >
                Claim Now - Free
              </Link>
            </div>
          </div>
        )}

        {/* Upgrade CTA Banner for Claimed Non-Founding Members */}
        {business.isClaimed && business.membershipTier !== "founding_member" && (
          <div className="bg-gradient-to-r from-[#fffdf7] to-[#fff9e6] border-l-4 border-[#d4a853] p-6 mb-8 rounded-r-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-[#d4a853]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <h3 className="text-lg font-bold text-[#1a1a2e]">
                    Become a Founding Member
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Get a gold badge, priority placement, and lock in $25/month for life. Limited spots available.
                </p>
              </div>
              <Link
                href="/founding-members"
                className="bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all whitespace-nowrap text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {business.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-[#1a1a2e] mb-3">About</h2>
                <p className="text-gray-700">{business.description}</p>
              </div>
            )}

            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {business.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0">
                      <PhoneIcon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a
                        href={`tel:${business.phone}`}
                        className="text-[#1a1a2e] font-medium hover:text-[#d4a853]"
                      >
                        {formatPhone(business.phone)}
                      </a>
                    </div>
                  </div>
                )}

                {business.address && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0">
                      <LocationIcon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-gray-900">{business.address}</p>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0">
                      <GlobeIcon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#d4a853] hover:underline"
                      >
                        {business.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex gap-3 mt-6 md:hidden">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex-1 bg-[#d4a853] text-[#1a1a2e] text-center py-3 rounded-lg font-semibold"
                  >
                    Call Now
                  </a>
                )}
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#1a1a2e] text-white text-center py-3 rounded-lg font-semibold"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-3">Photos</h2>
              {business.isClaimed ? (
                <p className="text-gray-500 text-sm">No photos uploaded yet.</p>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">
                    No photos yet — <Link href={`/claim-listing?id=${business.id}`} className="text-[#d4a853] hover:underline">claim this listing</Link> to add photos
                  </p>
                </div>
              )}
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-3">Services</h2>
              {business.isClaimed ? (
                <p className="text-gray-500 text-sm">No services listed yet.</p>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">
                    <Link href={`/claim-listing?id=${business.id}`} className="text-[#d4a853] hover:underline">Claim this listing</Link> to list your services
                  </p>
                </div>
              )}
            </div>

            {/* About This Listing */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                About This Listing
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-[#1a1a2e] capitalize">{verticalName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium text-[#1a1a2e]">{business.city}, {business.state}</p>
                </div>
                <div>
                  <p className="text-gray-500">Rating</p>
                  <p className="font-medium text-[#1a1a2e]">
                    {business.rating ? `${business.rating.toFixed(1)} / 5` : "No rating yet"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Reviews</p>
                  <p className="font-medium text-[#1a1a2e]">
                    {business.reviewCount > 0 ? `${business.reviewCount} reviews` : "No reviews yet"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">
                    {business.isClaimed ? (
                      <span className="text-[#d4a853]">Verified Owner</span>
                    ) : (
                      <span className="text-gray-600">Unclaimed listing</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Claim CTA */}
            {!business.isClaimed && (
              <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-5 text-white">
                <div className="flex justify-center mb-4">
                  <img
                    src="/VerifiedBadge.png"
                    alt="Verified Owner Badge"
                    className="h-24 w-auto"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-center">Is this your business?</h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  Claiming is free and takes 2 minutes.
                </p>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon />
                    Add photos of your work
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon />
                    Display your website
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon />
                    Respond to reviews
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon />
                    Get a Verified Owner badge
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckIcon />
                    Stand out from competitors
                  </li>
                </ul>
                <Link
                  href={`/claim-listing?id=${business.id}`}
                  className="block bg-[#d4a853] text-[#1a1a2e] text-center py-2.5 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors text-sm"
                >
                  Claim This Listing
                </Link>
                {claimedCount > 0 && (
                  <p className="text-sm text-gray-400 mt-3 text-center">
                    Join {claimedCount.toLocaleString()} claimed contractors in {stateInfo?.name || business.state}
                  </p>
                )}
              </div>
            )}

            {/* More in City */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-[#1a1a2e] mb-3">
                More {vertical?.name || "Contractors"} in {business.city}
              </h3>
              <Link
                href={`/${stateSlug}/${citySlug}/${business.verticalSlug}`}
                className="text-sm text-[#d4a853] hover:underline"
              >
                View all {vertical?.name?.toLowerCase() || "contractors"} →
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
              { "@type": "ListItem", position: 1, name: "Home", item: "https://heresmyguy.com" },
              { "@type": "ListItem", position: 2, name: stateInfo?.name || business.state, item: `https://heresmyguy.com/${stateSlug}` },
              { "@type": "ListItem", position: 3, name: business.city, item: `https://heresmyguy.com/${stateSlug}/${citySlug}` },
              { "@type": "ListItem", position: 4, name: business.name, item: `https://heresmyguy.com/profile/${business.slug}` },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://heresmyguy.com/profile/${business.slug}`,
            name: business.name,
            telephone: business.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: business.address,
              addressLocality: business.city,
              addressRegion: business.state,
              postalCode: business.zip,
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
            ...(business.website && { url: business.website }),
          }),
        }}
      />
    </div>
  );
}

// Helper functions
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

// Icons
function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}
