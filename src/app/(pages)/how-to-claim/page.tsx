import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Claim Your Listing | Here's My Guy",
  description:
    "Claim your free business listing on Here's My Guy in 3 simple steps. Get verified, stand out from competitors, and attract more customers.",
  alternates: {
    canonical: "https://heresmyguy.com/how-to-claim",
  },
};

export default function HowToClaimPage() {
  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            Claim Your <span className="text-[#d4a853]">Free Listing</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Stand out from the competition in just a few minutes. It&apos;s
            100% free for contractors.
          </p>
          <Link
            href="/claim-listing"
            className="inline-block mt-8 bg-[#d4a853] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors"
          >
            Start Claiming Now
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
          3 Simple Steps
        </h2>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-2xl flex items-center justify-center text-[#1a1a2e] text-2xl font-bold shadow-lg">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">
                Find Your Business
              </h3>
              <p className="text-gray-600 mb-4">
                Search for your business on Here&apos;s My Guy. If we already
                have your listing in our directory, you&apos;ll see it appear in
                search results.
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-2">Can&apos;t find your business?</p>
                <p className="text-gray-700">
                  No problem! You can add a new listing during the claim process.
                  We&apos;ll create your profile from scratch.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-2xl flex items-center justify-center text-[#1a1a2e] text-2xl font-bold shadow-lg">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">
                Verify Ownership
              </h3>
              <p className="text-gray-600 mb-4">
                We verify that you&apos;re the real owner of the business. This
                protects you and gives customers confidence.
              </p>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-2">How verification works:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
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
                    <span>
                      <strong>Email match:</strong> If your email matches our records, get verified instantly
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
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
                    <span>
                      <strong>Manual review:</strong> If not, our team reviews within 24-48 hours
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4a853] to-[#e5b863] rounded-2xl flex items-center justify-center text-[#1a1a2e] text-2xl font-bold shadow-lg">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">
                Enjoy Your Benefits
              </h3>
              <p className="text-gray-600 mb-4">
                Once verified, your listing gets a badge and stands out. You
                appear higher in search results and customers see you&apos;re
                legit.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
                <p className="text-sm font-semibold text-green-700 mb-3">
                  What you get:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong>Verified Owner</strong> badge
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Higher placement in search results
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Green highlighted listing
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Stand out from unclaimed competitors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                Is claiming my listing really free?
              </h3>
              <p className="text-gray-600">
                Yes, 100% free. Claiming and verification costs nothing. We
                offer optional paid upgrades for businesses that want extra
                visibility, but the basic listing is always free.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                How long does verification take?
              </h3>
              <p className="text-gray-600">
                If your email matches our records, you&apos;re verified
                instantly. Otherwise, our team reviews claims within 24-48
                hours.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                What if my business isn&apos;t listed yet?
              </h3>
              <p className="text-gray-600">
                You can add a new listing during the claim process. Just fill
                out your business details and we&apos;ll create your profile.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                Can I update my listing after claiming?
              </h3>
              <p className="text-gray-600">
                Yes! After verification, you can update your business
                information anytime. Contact us if you need to make changes.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                What&apos;s the difference between claimed and Founding Member?
              </h3>
              <p className="text-gray-600">
                Claimed listings get a green &ldquo;Verified Owner&rdquo; badge.{" "}
                <Link href="/founding-members" className="text-[#d4a853] hover:underline">
                  Founding Members
                </Link>{" "}
                get a gold badge, featured placement, and additional benefits
                for $25/month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#d4a853] to-[#e5b863] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#1a1a2e]/80 mb-8 text-lg">
            Claim your listing in under 2 minutes. It&apos;s free!
          </p>
          <Link
            href="/claim-listing"
            className="inline-block bg-[#1a1a2e] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#2d2d44] transition-colors"
          >
            Claim My Listing
          </Link>
        </div>
      </section>
    </div>
  );
}
