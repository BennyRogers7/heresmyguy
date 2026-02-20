import { getAllCities } from "@/lib/data";
import ClaimForm from "./ClaimForm";

export const metadata = {
  title: "Claim Your Listing",
  description: "Claim your free plumbing business listing on MN Plumbers Directory. Update your information and get more customers.",
};

export default function ClaimListingPage() {
  const cities = getAllCities();

  return (
    <div className="min-h-screen bg-[#fafaf8] py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">
            Claim Your Listing
          </h1>
          <p className="text-gray-600 text-lg">
            Own a plumbing business in Minnesota? Claim your free listing to update your information, add photos, and get more customers.
          </p>
        </div>

        <ClaimForm cities={cities} />

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>By submitting this form, you confirm that you are the owner or authorized representative of this business.</p>
        </div>
      </div>
    </div>
  );
}
