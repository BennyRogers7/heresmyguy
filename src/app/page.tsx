import Link from "next/link";
import Image from "next/image";
import { getAllStates, getAllVerticals, prisma } from "@/lib/db";
import USHeatmap from "@/components/USHeatmap";
import { getStateLaunchStatus, formatLaunchDate } from "@/lib/state-launch-config";

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
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#232340] to-[#2d2d44] text-white py-12 md:py-20 relative overflow-hidden">
        {/* Decorative mascot - bottom right, low opacity */}
        <div className="absolute bottom-0 right-0 opacity-30 pointer-events-none hidden md:block">
          <Image
            src="/mascot.png"
            alt=""
            width={200}
            height={200}
            className="w-40 h-40 lg:w-48 lg:h-48"
            aria-hidden="true"
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-center md:text-left">
              Find a contractor you can
              <br />
              <span className="text-[#d4a853]">actually trust</span>
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mb-8 text-center md:text-left">
              Built as a better alternative to lead-gen platforms — Here&rsquo;s My Guy is launching state by state to create a more trusted way to hire and be hired.
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
                <span>No spam. No recycled leads. Just real local contractors.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Launching state by state</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Free to Use</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/mascot.png"
              alt=""
              width={32}
              height={32}
              className="w-8 h-8"
              aria-hidden="true"
            />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
              Why Here&rsquo;s My Guy is different
            </h2>
          </div>
          <div className="text-gray-600 space-y-4">
            <p>
              After 15 years working around the lead-generation industry, I saw how broken it had become.
            </p>
            <p>
              Contractors pay for weak leads. Homeowners get overwhelmed with options they don&rsquo;t trust.
            </p>
            <p>
              Here&rsquo;s My Guy is being built to fix that — starting market by market, with a focus on trust, quality, and real local presence.
            </p>
          </div>
        </div>
      </section>

      {/* Heatmap Section */}
      <section id="vote-for-state" className="py-16 bg-[#f8f7f4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              You decide where we go next.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&rsquo;re launching state by state based on demand. Vote to bring Here&rsquo;s My Guy to your state.
            </p>
          </div>

          <USHeatmap />
        </div>
      </section>

      {/* Contractor Focus */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
            Built for contractors tired of paying for leads
          </h2>
          <div className="text-gray-600 space-y-4">
            <p>
              If you&rsquo;ve used platforms like Angi or HomeAdvisor, you already know the problem.
            </p>
            <p>
              Shared leads. Low intent. High cost.
            </p>
            <p>
              Here&rsquo;s My Guy is being built to give you a stronger, more trusted presence — not just another lead marketplace.
            </p>
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
            {states.map((state) => {
              const launchInfo = getStateLaunchStatus(state.abbreviation);
              const isLive = launchInfo.status === "live";
              const isLaunching = launchInfo.status === "launching";

              return (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  className={`relative rounded-lg px-4 py-3 hover:shadow-sm transition-all flex justify-between items-center group ${
                    isLive
                      ? "bg-white border border-gray-200 hover:border-[#d4a853]"
                      : isLaunching
                      ? "bg-amber-50 border border-amber-200 hover:border-amber-400"
                      : "bg-gray-50 border border-gray-200 hover:border-gray-300 opacity-80"
                  }`}
                >
                  {/* Badge */}
                  {isLaunching && (
                    <span className="absolute -top-2 -right-2 bg-[#d4a853] text-[#1a1a2e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {formatLaunchDate(launchInfo.launchDate!)}
                    </span>
                  )}
                  {!isLive && !isLaunching && (
                    <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Soon
                    </span>
                  )}

                  <span className={`font-medium transition-colors ${
                    isLive
                      ? "text-[#1a1a2e] group-hover:text-[#d4a853]"
                      : isLaunching
                      ? "text-amber-800"
                      : "text-gray-500"
                  }`}>
                    {state.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {state.businessCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Are you a contractor?
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl">
                Claim your free listing and get found by customers in your area.
                Upgrade to featured for top placement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  href="/claim-listing"
                  className="bg-[#d4a853] text-[#1a1a2e] px-8 py-3.5 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
                >
                  Claim Your Free Listing
                </Link>
                <Link
                  href="/founders"
                  className="border-2 border-[#d4a853] text-[#d4a853] px-8 py-3.5 rounded-lg font-bold hover:bg-[#d4a853] hover:text-[#1a1a2e] transition-colors"
                >
                  Get Featured
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <Image
                src="/mascot.png"
                alt="Here's My Guy mascot"
                width={120}
                height={120}
                className="w-28 h-28 lg:w-32 lg:h-32"
              />
            </div>
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
