import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import TokenClaimForm from "./TokenClaimForm";

export const metadata: Metadata = {
  title: "Claim Your Listing | Here's My Guy",
  description: "Verify and claim your business listing on Here's My Guy.",
};

interface TokenClaimPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function TokenClaimPage({ searchParams }: TokenClaimPageProps) {
  const { token } = await searchParams;

  // No token provided - redirect to regular claim page
  if (!token) {
    redirect("/claim-listing");
  }

  // Find business by token
  const business = await prisma.business.findUnique({
    where: { claimToken: token },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      state: true,
      phone: true,
      email: true,
      verticalSlug: true,
      isClaimed: true,
    },
  });

  // Invalid token
  if (!business) {
    return (
      <div className="bg-[#f8f7f4] min-h-screen py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-600 mb-6">
              This claim link is no longer valid. It may have expired or already been used.
            </p>
            <Link
              href="/claim-listing"
              className="inline-block bg-[#d4a853] text-[#1a1a2e] px-6 py-3 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors"
            >
              Claim a Listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Already claimed
  if (business.isClaimed) {
    return (
      <div className="bg-[#f8f7f4] min-h-screen py-12">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
              Already Verified
            </h1>
            <p className="text-gray-600 mb-6">
              <strong>{business.name}</strong> has already been claimed and verified.
            </p>
            <Link
              href={`/profile/${business.slug}`}
              className="inline-block bg-[#d4a853] text-[#1a1a2e] px-6 py-3 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors"
            >
              View Your Listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show claim form
  return (
    <div className="bg-[#f8f7f4] min-h-screen py-12">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#d4a853] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-[#1a1a2e]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">
            Verify Your Listing
          </h1>
          <p className="text-gray-600">
            Complete this quick form to claim{" "}
            <strong>{business.name}</strong>
          </p>
        </div>

        {/* Business Card Preview */}
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-xl p-5 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#d4a853] rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[#1a1a2e]">
                {business.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{business.name}</h2>
              <p className="text-gray-300 capitalize">
                {business.verticalSlug.replace(/-/g, " ")} · {business.city},{" "}
                {business.state}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-green-800 mb-3">
            What you get with verification:
          </h3>
          <ul className="space-y-2">
            {[
              "Verified Owner badge on your listing",
              "Higher placement in search results",
              "Build trust with potential customers",
              "Stand out from unverified competitors",
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-green-700">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Claim Form */}
        <TokenClaimForm
          token={token}
          businessName={business.name}
          businessSlug={business.slug}
          phone={business.phone}
        />
      </div>
    </div>
  );
}
