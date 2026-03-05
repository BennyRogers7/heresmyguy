import { Metadata } from "next";
import Link from "next/link";
import { getAllPlumbers } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BadgeGenerator from "./BadgeGenerator";

export const metadata: Metadata = {
  title: "MN Plumb Verified Badge - Free for Listed Plumbers",
  description:
    "Get your free MN Plumb Verified badge to display on your website. Show customers you're a trusted, licensed Minnesota plumber.",
  openGraph: {
    title: "MN Plumb Verified Badge",
    description: "Get your free verified badge for your plumbing website.",
  },
  alternates: {
    canonical: "/badge",
  },
};

export default function BadgePage() {
  const plumbers = getAllPlumbers();
  const verifiedPlumbers = plumbers.filter((p) => p.isVerified || p.isFeatured);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Verified Badge" }]}
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            MN Plumb <span className="text-[#d4a853]">Verified Badge</span>
          </h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            Display your trusted status on your website. Free for all listed
            Minnesota plumbers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Badge Generator */}
          <div className="lg:col-span-2">
            <BadgeGenerator plumbers={plumbers} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Why Display the Badge?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a853] mt-0.5">✓</span>
                  <span>Build trust with potential customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a853] mt-0.5">✓</span>
                  <span>Show you&apos;re a verified Minnesota plumber</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a853] mt-0.5">✓</span>
                  <span>Link to your profile with ratings & reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4a853] mt-0.5">✓</span>
                  <span>Completely free to use</span>
                </li>
              </ul>
            </div>

            {/* Not Listed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
                Not Listed Yet?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Claim your free listing to get access to the verified badge and
                connect with more customers.
              </p>
              <Link
                href="/claim-listing"
                className="block w-full bg-[#d4a853] text-[#1a1a2e] text-center py-2 px-4 rounded-lg font-semibold hover:bg-[#e8c57b] transition-colors"
              >
                Claim Your Listing
              </Link>
            </div>

            {/* Badge Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
                Badge Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Plumbers:</span>
                  <span className="font-medium">{plumbers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified/Featured:</span>
                  <span className="font-medium">{verifiedPlumbers.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
