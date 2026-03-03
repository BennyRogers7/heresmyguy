import { getAllCities } from "@/lib/data";
import ClaimForm from "./ClaimForm";

export const metadata = {
  title: "Claim & Verify Your Listing",
  description: "Claim and verify your plumbing business listing on MN Plumbers Directory. Get priority placement, a verified badge, and connect with more customers.",
};

export default function ClaimListingPage() {
  const cities = getAllCities();

  return (
    <div className="min-h-screen bg-[#fafaf8] py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Claim & Verify Your Listing
          </h1>
          <p className="text-gray-600 text-lg">
            Own a plumbing business in Minnesota? Claim and verify your listing to stand out from the competition and connect with more customers.
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-2xl p-6 mb-10 text-white">
          <h2 className="text-xl font-bold mb-4">Why Claim & Verify?</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Priority Placement</strong> - Verified listings appear at the top of search results, above unverified businesses</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-6 h-6 text-[#e5a527] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span><strong>Verified Badge</strong> - Build trust with customers who see you are a legitimate, verified business</span>
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
              <span><strong>More Customers</strong> - Get connected directly with homeowners looking for plumbing services</span>
            </li>
          </ul>
        </div>

        <ClaimForm cities={cities} />

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>By submitting this form, you confirm that you are the owner or authorized representative of this business.</p>
        </div>
      </div>
    </div>
  );
}
