import { Metadata } from "next";
import FeaturedLeadForm from "./FeaturedLeadForm";

export const metadata: Metadata = {
  title: "Get Featured | Here's My Guy",
  description: "Become a featured contractor on Here's My Guy. Get top placement, a verified badge, priority SEO, and direct calls from homeowners.",
};

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-[#d4a853] text-[#1a1a2e] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            FOUNDING MEMBER PRICING
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Get Featured on Here's My Guy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stand out from the competition. Featured contractors get 5x more visibility and direct customer calls.
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
            What You Get as a Featured Contractor
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Top Placement</h3>
              <p className="text-gray-600">
                Your listing appears at the very top of search results for your city and trade. Be the first contractor homeowners see.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Verified Badge</h3>
              <p className="text-gray-600">
                A prominent "Featured" badge on your listing builds instant trust with potential customers looking for reliable contractors.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Priority SEO</h3>
              <p className="text-gray-600">
                Your profile gets enhanced SEO optimization, helping you rank higher in Google when homeowners search for contractors in your area.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Direct Calls</h3>
              <p className="text-gray-600">
                Homeowners call you directly from your listing. No shared leads, no middlemen - just real customers ready to hire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="featured-form" className="py-16 bg-white scroll-mt-8">
        <div className="max-w-xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
              Get Founding Member Pricing
            </h2>
            <p className="text-gray-600">
              Join now and lock in special pricing for life. Limited spots available in each market.
            </p>
          </div>

          <FeaturedLeadForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1a1a2e] mb-2">How does featured placement work?</h3>
              <p className="text-gray-600">
                Featured contractors appear at the top of search results for their city and trade category. When a homeowner searches for a plumber in Columbus, OH, featured plumbers in Columbus appear first.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1a1a2e] mb-2">What is founding member pricing?</h3>
              <p className="text-gray-600">
                Early adopters who sign up now get special introductory pricing that's locked in for as long as they remain a featured member. This rate will never increase.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1a1a2e] mb-2">Do I need to claim my listing first?</h3>
              <p className="text-gray-600">
                Yes, you'll need to claim and verify your business listing before becoming a featured member. Claiming is free and takes just 2 minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#1a1a2e] mb-2">How do homeowners find my listing?</h3>
              <p className="text-gray-600">
                Homeowners discover contractors through Google searches, direct visits to Here's My Guy, and our city/trade directory pages. Featured contractors get priority visibility across all channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-gray-300 mb-8">
            Fill out the form above to get started. We'll reach out with pricing details and next steps.
          </p>
          <a
            href="#featured-form"
            className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors"
          >
            Get Featured Now
          </a>
        </div>
      </section>
    </div>
  );
}
