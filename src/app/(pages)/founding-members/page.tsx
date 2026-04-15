import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Founding Members | Here's My Guy",
  description:
    "Become a Founding Member of Here's My Guy. Get a gold badge, priority placement, and lock in $25/month for life. Limited spots available.",
  alternates: {
    canonical: "https://heresmyguy.com/founding-members",
  },
};

export const revalidate = 3600; // Revalidate every hour

async function getFoundingMembers() {
  return prisma.business.findMany({
    where: {
      membershipTier: "founding_member",
      showOnRoster: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      verticalSlug: true,
      logo: true,
      membershipStartedAt: true,
    },
    orderBy: {
      membershipStartedAt: "asc",
    },
    take: 100,
  });
}

export default async function FoundingMembersPage() {
  const foundingMembers = await getFoundingMembers();

  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-24 relative overflow-hidden">
        {/* Decorative stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[10%] text-[#d4a853]/20 text-6xl">
            ★
          </div>
          <div className="absolute top-1/4 right-[15%] text-[#d4a853]/15 text-4xl">
            ★
          </div>
          <div className="absolute bottom-1/4 left-[20%] text-[#d4a853]/10 text-5xl">
            ★
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] font-bold px-4 py-2 rounded-full mb-6">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Limited Time Offer
          </div>

          <h1 className="text-3xl md:text-5xl font-bold">
            Become a <span className="text-[#d4a853]">Founding Member</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Lock in $25/month for life. Get priority placement and a gold badge
            that shows customers you&apos;re among the first.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/claim-listing"
              className="bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all"
            >
              Claim & Upgrade
            </Link>
            <a
              href="#benefits"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Price */}
          <div className="mt-10 inline-block bg-white/10 rounded-2xl px-8 py-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl md:text-5xl font-bold text-[#d4a853]">
                $25
              </span>
              <span className="text-xl text-gray-300">/month</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Locked in forever • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
          Founding Member Benefits
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">
              Gold Founding Member Badge
            </h3>
            <p className="text-gray-600 text-sm">
              A prestigious gold badge that shows customers you&apos;re among
              the original supporters of Here&apos;s My Guy.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">Priority Placement</h3>
            <p className="text-gray-600 text-sm">
              Appear at the top of search results in your area, above claimed
              and unclaimed listings.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">
              $25/Month Locked Forever
            </h3>
            <p className="text-gray-600 text-sm">
              When we raise prices for new members, you keep your founding
              rate. Forever.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">
              Featured on Founders Page
            </h3>
            <p className="text-gray-600 text-sm">
              Your business displayed on our Founding Members page, linked from
              every listing.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">
              Early Access to Features
            </h3>
            <p className="text-gray-600 text-sm">
              Be the first to try new features as we build them. Your feedback
              shapes what we build next.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#1a1a2e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-[#1a1a2e] mb-2">Direct Support</h3>
            <p className="text-gray-600 text-sm">
              Priority support from our team. Questions? Suggestions?
              We&apos;re here for you.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
            Compare Listing Types
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-500">
                    Feature
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-500">
                    Unclaimed
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-green-600">
                    Claimed (Free)
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-[#d4a853]">
                    Founding Member
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">Basic listing</td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">Verified badge</td>
                  <td className="text-center py-4 px-4">
                    <XIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Green
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] text-xs font-bold px-2 py-0.5 rounded-full">
                      Gold
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">Search priority</td>
                  <td className="text-center py-4 px-4 text-gray-400">Lowest</td>
                  <td className="text-center py-4 px-4 text-green-600">
                    Medium
                  </td>
                  <td className="text-center py-4 px-4 text-[#d4a853] font-semibold">
                    Highest
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">Enhanced card design</td>
                  <td className="text-center py-4 px-4">
                    <XIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon gold />
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 px-4">Featured on Founders page</td>
                  <td className="text-center py-4 px-4">
                    <XIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <XIcon />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckIcon gold />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Price</td>
                  <td className="text-center py-4 px-4 text-gray-500">Free</td>
                  <td className="text-center py-4 px-4 text-green-600 font-semibold">
                    Free
                  </td>
                  <td className="text-center py-4 px-4 text-[#d4a853] font-bold">
                    $25/mo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Founding Members Roster */}
      {foundingMembers.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-4">
            Our Founding Members
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These are the businesses who believed in Here&apos;s My Guy from the
            start. They&apos;re the first to be featured, and they&apos;ll
            always have founding status.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {foundingMembers.map((member) => (
              <Link
                key={member.id}
                href={`/profile/${member.slug}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#d4a853] hover:shadow-lg hover:shadow-[#d4a853]/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {member.logo ? (
                    <img
                      src={member.logo}
                      alt={member.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d4a853] to-[#e5b863] flex items-center justify-center">
                      <span className="text-[#1a1a2e] font-bold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-[#1a1a2e] truncate group-hover:text-[#d4a853] transition-colors text-sm">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.city}, {member.state}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#d4a853] to-[#e5b863] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
            Join the Founding Members
          </h2>
          <p className="text-[#1a1a2e]/80 mb-8 text-lg">
            First, claim your free listing. Then upgrade to lock in your
            founding rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/claim-listing"
              className="bg-[#1a1a2e] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#2d2d44] transition-colors"
            >
              Claim My Listing
            </Link>
          </div>
          <p className="text-[#1a1a2e]/60 text-sm mt-6">
            Already claimed?{" "}
            <Link href="/claim-listing" className="underline hover:text-[#1a1a2e]">
              Log in to upgrade
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function CheckIcon({ gold }: { gold?: boolean }) {
  return (
    <svg
      className={`w-5 h-5 mx-auto ${gold ? "text-[#d4a853]" : "text-green-500"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-5 h-5 mx-auto text-gray-300"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  );
}
