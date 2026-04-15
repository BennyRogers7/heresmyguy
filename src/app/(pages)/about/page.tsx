import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Here's My Guy",
  description:
    "Here's My Guy was born from a simple question: 'Know a good plumber?' We're building the contractor directory we wished existed.",
  alternates: {
    canonical: "https://heresmyguy.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#f8f7f4] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">
            The contractor your neighbor{" "}
            <span className="text-[#d4a853]">swears by</span>
          </h1>
          <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Here&apos;s My Guy was born from a simple question every homeowner
            asks: &ldquo;Know a good plumber?&rdquo;
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            The Problem
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Finding a good contractor shouldn&apos;t feel like a gamble. But
            today, your options are either asking around (slow and random) or
            trusting faceless review sites (paid placements, fake reviews, and
            contractors who game the system).
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The best contractors? They&apos;re too busy doing great work to pay
            for ads. They grow through word-of-mouth. The neighbor who fixed
            your friend&apos;s deck. The roofer your coworker swears by.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            We realized that&apos;s actually how great businesses spread:{" "}
            <strong>&ldquo;Here&apos;s my guy.&rdquo;</strong>
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
                <Image
                  src="/mascot.png"
                  alt="Here's My Guy mascot"
                  width={60}
                  height={60}
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </div>
              <div>
                <p className="text-[#1a1a2e] font-medium italic text-lg">
                  &ldquo;Every great contractor has customers who would recommend
                  them in a heartbeat. We&apos;re just making it easier to find
                  those recommendations.&rdquo;
                </p>
                <p className="text-gray-500 mt-2">— The Here&apos;s My Guy Team</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            Our Mission
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            We&apos;re building the contractor directory we wished existed. One
            where verified, trusted professionals stand out. Where the
            neighborhood favorite isn&apos;t buried under paid ads. Where
            homeowners can find contractors their neighbors actually recommend.
          </p>

          <div className="grid md:grid-cols-3 gap-6 my-10">
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#d4a853]"
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
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                Verified Owners
              </h3>
              <p className="text-sm text-gray-600">
                We verify business ownership so you know who you&apos;re hiring.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#d4a853]"
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
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Free to List</h3>
              <p className="text-sm text-gray-600">
                Every contractor gets a free listing. No pay-to-play required.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-[#d4a853]"
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
              <h3 className="font-semibold text-[#1a1a2e] mb-2">
                Community First
              </h3>
              <p className="text-sm text-gray-600">
                Real ratings and reviews from real customers in your area.
              </p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
            Where We&apos;re At
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            We&apos;re just getting started. Right now, we&apos;re focused on
            Ohio, Illinois, and Minnesota — building relationships with local
            contractors and homeowners. Our goal is to expand across the entire
            United States.
          </p>

          <p className="text-gray-700 leading-relaxed">
            If you&apos;re a contractor, we&apos;d love to have you.{" "}
            <Link href="/claim-listing" className="text-[#d4a853] hover:underline">
              Claim your free listing
            </Link>{" "}
            and become one of the first verified businesses in your area.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to find your guy?
          </h2>
          <p className="text-gray-300 mb-8">
            Browse local contractors or claim your business listing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
            >
              Find Contractors
            </Link>
            <Link
              href="/claim-listing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Claim Your Listing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
