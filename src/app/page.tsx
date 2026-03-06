import Link from "next/link";
import Image from "next/image";
import { getAllStates, getAllVerticals, prisma } from "@/lib/db";

export default async function HomePage() {
  const [states, verticals, totalBusinesses, totalCities] = await Promise.all([
    getAllStates(),
    getAllVerticals(),
    prisma.business.count(),
    prisma.city.count({ where: { businessCount: { gt: 0 } } }),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#232340] to-[#2d2d44] text-white py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Left Column - Copy */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Find the contractor your
                <br />
                <span className="text-[#d4a853]">neighbor swears by</span>
              </h1>

              <p className="text-lg text-gray-300 max-w-xl mb-8">
                Browse {totalBusinesses.toLocaleString()}+ local contractors across{" "}
                {totalCities} cities. Read reviews, compare ratings, and hire with confidence.
              </p>

              {/* Search / Browse CTAs */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-8">
                <Link
                  href="#browse-states"
                  className="bg-[#d4a853] text-[#1a1a2e] px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors"
                >
                  Browse by State
                </Link>
                <Link
                  href="#browse-trades"
                  className="border-2 border-white/30 text-white px-8 py-3.5 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Browse by Trade
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>{totalBusinesses.toLocaleString()}+ Contractors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>{totalCities} Cities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon />
                  <span>Free to Use</span>
                </div>
              </div>
            </div>

            {/* Right Column - Mascot */}
            <div className="flex-shrink-0">
              <Image
                src="/mascot.png"
                alt="Here's My Guy mascot"
                width={380}
                height={380}
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Trade */}
      <section id="browse-trades" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              What do you need help with?
            </h2>
            <p className="text-gray-600">
              Browse contractors by trade type
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {verticals.map((vertical) => (
              <Link
                key={vertical.slug}
                href={`/trade/${vertical.slug}`}
                className="bg-[#f8f7f4] border border-gray-200 rounded-xl p-6 hover:border-[#d4a853] hover:shadow-md transition-all group text-center"
              >
                <span className="text-3xl mb-3 block">{vertical.icon}</span>
                <h3 className="text-lg font-bold text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors">
                  {vertical.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {vertical.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="browse-states" className="py-16 bg-[#f8f7f4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              Browse by State
            </h2>
            <p className="text-gray-600">
              Find contractors in your area
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/${state.slug}`}
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-[#d4a853] hover:shadow-sm transition-all flex justify-between items-center group"
              >
                <span className="font-medium text-[#1a1a2e] group-hover:text-[#d4a853] transition-colors">
                  {state.name}
                </span>
                <span className="text-sm text-gray-400">
                  {state.businessCount}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Are you a contractor?
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Claim your free listing and get found by customers in your area.
            Upgrade to featured for top placement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/claim-listing"
              className="bg-[#d4a853] text-[#1a1a2e] px-8 py-3.5 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
            >
              Claim Your Free Listing
            </Link>
            <Link
              href="/featured"
              className="border-2 border-[#d4a853] text-[#d4a853] px-8 py-3.5 rounded-lg font-bold hover:bg-[#d4a853] hover:text-[#1a1a2e] transition-colors"
            >
              Get Featured
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#d4a853]">1</span>
              </div>
              <h3 className="font-bold text-[#1a1a2e] mb-2">Browse</h3>
              <p className="text-gray-600 text-sm">
                Search by state, city, and trade to find contractors in your area
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#d4a853]">2</span>
              </div>
              <h3 className="font-bold text-[#1a1a2e] mb-2">Compare</h3>
              <p className="text-gray-600 text-sm">
                Read reviews, check ratings, and compare local contractors
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#d4a853]">3</span>
              </div>
              <h3 className="font-bold text-[#1a1a2e] mb-2">Hire</h3>
              <p className="text-gray-600 text-sm">
                Contact contractors directly — no middleman, no fees
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[#d4a853]" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
