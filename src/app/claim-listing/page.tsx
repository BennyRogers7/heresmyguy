import { Metadata } from "next";
import { getBusinessById, getVerticalBySlug, getAllVerticals, getAllStates } from "@/lib/db";
import ClaimForm from "./ClaimForm";

interface ClaimListingPageProps {
  searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ searchParams }: ClaimListingPageProps): Promise<Metadata> {
  const { id } = await searchParams;

  if (id) {
    const business = await getBusinessById(id);
    if (business) {
      const vertical = await getVerticalBySlug(business.verticalSlug);
      return {
        title: `Claim ${business.name} | Here's My Guy`,
        description: `Claim and verify your ${vertical?.nameSingular?.toLowerCase() || "contractor"} listing for ${business.name} in ${business.city}, ${business.state}. Get priority placement and a verified badge.`,
      };
    }
  }

  return {
    title: "Claim & Verify Your Listing | Here's My Guy",
    description: "Claim and verify your contractor listing on Here's My Guy. Get priority placement, a verified badge, and connect with more customers.",
  };
}

export default async function ClaimListingPage({ searchParams }: ClaimListingPageProps) {
  const { id } = await searchParams;

  let business = null;
  let vertical = null;
  let allVerticals = null;
  let allStates = null;

  if (id) {
    // Claiming an existing business
    business = await getBusinessById(id);
    if (business) {
      vertical = await getVerticalBySlug(business.verticalSlug);
    }
  }

  // For generic form or fallback, fetch all verticals and states
  if (!business) {
    [allVerticals, allStates] = await Promise.all([
      getAllVerticals(),
      getAllStates(),
    ]);
  }

  const verticalName = vertical?.nameSingular || "contractor";
  const verticalNamePlural = vertical?.name || "Contractors";
  const stateName = business?.state || "";

  // Dynamic subtitle
  const subtitle = business
    ? `Claim and verify your listing for ${business.name} in ${business.city}, ${business.state}.`
    : "Submit this form to claim your listing or add your business to the directory.";

  return (
    <div className="min-h-screen bg-[#fafaf8] py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            {business ? `Claim Your ${verticalName} Listing` : "Claim & Verify Your Listing"}
          </h1>
          <p className="text-gray-600 text-lg">
            {subtitle} It's completely free.
          </p>
          {!business && (
            <p className="text-gray-600 mt-3">
              Don't see your business listed? No problem - fill out the form below and we'll add you to the directory.
            </p>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-2xl p-6 mb-10 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Why Claim & Verify?</h2>
            <span className="bg-[#e5a527] text-[#1a1a2e] text-sm font-bold px-3 py-1 rounded-full">100% Free</span>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Priority Placement</strong> - Verified listings appear at the top of search results</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Verified Badge</strong> - Build trust with customers who see you are a legitimate business</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Accurate Information</strong> - Ensure your contact details, services, and hours are correct</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>More Customers</strong> - Get connected directly with homeowners looking for {verticalNamePlural.toLowerCase()}</span>
            </li>
          </ul>
        </div>

        <ClaimForm
          business={business}
          vertical={vertical}
          allVerticals={allVerticals}
          allStates={allStates}
        />

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>By submitting this form, you confirm that you are the owner or authorized representative of this business.</p>
        </div>
      </div>
    </div>
  );
}
