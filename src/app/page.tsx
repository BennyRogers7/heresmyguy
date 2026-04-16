import Link from "next/link";
import Image from "next/image";
import { getAllStates, getAllVerticals } from "@/lib/db";
import USHeatmap from "@/components/USHeatmap";
import { getStateLaunchStatus, formatLaunchDate } from "@/lib/state-launch-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Here's My Guy | Find the Contractor Your Neighbor Swears By",
  description:
    "Sick of getting spammed by contractor directories? Same. Here's My Guy is a better way to find quality contractors. No lead-selling. No spam. Just quality work.",
  openGraph: {
    title: "Here's My Guy | Find the Contractor Your Neighbor Swears By",
    description:
      "Sick of getting spammed by contractor directories? Same. Here's My Guy is a better way to find quality contractors. No lead-selling. No spam. Just quality work.",
  },
};

export default async function HomePage() {
  const [states, verticals] = await Promise.all([
    getAllStates(),
    getAllVerticals(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Portrait Image */}
          <Image
            src="/images/hero/hero-yard-signs-portrait.png"
            alt="Here's My Guy yard signs in front of a home"
            fill
            priority
            className="object-cover object-center md:hidden"
            sizes="100vw"
          />
          {/* Desktop Landscape Image */}
          <Image
            src="/images/hero/hero-yard-signs-landscape.png"
            alt="Here's My Guy yard signs in front of a home"
            fill
            priority
            className="object-cover object-center hidden md:block"
            sizes="100vw"
          />
          {/* Dark gradient overlay - left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Find the contractor your neighbor swears by
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Sick of getting spammed every time you use other directories? Same. No lead-selling here. Just quality work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                href="#browse-states"
                className="bg-[#d4a853] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors text-center"
              >
                Browse Contractors →
              </Link>
            </div>

            <Link
              href="/founders"
              className="text-gray-300 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
            >
              Are you a contractor? Join as a founding member →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-12 text-center">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl font-bold text-[#d4a853]">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Browse</h3>
              <p className="text-gray-600">
                Search by trade, city, or state. Real contractors, real information.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl font-bold text-[#d4a853]">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Choose</h3>
              <p className="text-gray-600">
                Compare profiles, check reviews, see who your neighbors recommend.
              </p>
            </div>

            <div className="text-center md:text-left">
              <div className="w-12 h-12 bg-[#d4a853]/10 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4">
                <span className="text-xl font-bold text-[#d4a853]">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Call</h3>
              <p className="text-gray-600">
                Pick up the phone and call them directly. Tell them you found them on Here&rsquo;s My Guy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rollout Map Section */}
      <section id="vote-for-state" className="py-16 md:py-20 bg-[#f8f7f4]">
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

      {/* For Homeowners / For Contractors */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* For Homeowners */}
            <div className="bg-[#f8f7f4] rounded-2xl p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-4">
                For Homeowners
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You deserve better than filling out a form and getting ambushed by your phone. Here&rsquo;s My Guy is simple. Browse real contractors, see real information, make your own call. That&rsquo;s it.
              </p>
            </div>

            {/* For Contractors */}
            <div className="bg-[#1a1a2e] rounded-2xl p-8 md:p-10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                For Contractors
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our goal is simple. Get you on page one of Google. A rising tide raises all ships, and together we make it happen. Own your profile. Show your work. Let the quality speak.
              </p>
              <Link
                href="/founders"
                className="inline-flex items-center text-[#d4a853] font-semibold hover:text-[#e5b863] transition-colors"
              >
                Become a founding member →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-20 md:py-28 bg-[#f8f7f4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a1a2e] leading-relaxed">
            The contractor is not a commodity.
            <br />
            <span className="text-gray-500">To the homeowner: you are not a lead.</span>
          </p>
        </div>
      </section>

      {/* Browse by Trade */}
      <section id="browse-trades" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              Browse by Trade
            </h2>
            <p className="text-gray-600">
              Find contractors by specialty
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
      <section id="browse-states" className="py-16 md:py-20 bg-[#f8f7f4]">
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

      {/* Footer CTA */}
      <section className="py-16 md:py-20 bg-[#1a1a2e]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8">
            Everyone&rsquo;s got a guy. Find yours here.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              href="#browse-states"
              className="bg-[#d4a853] text-[#1a1a2e] px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors"
            >
              Browse Contractors →
            </Link>
          </div>

          <Link
            href="/founders"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Are you a contractor? →
          </Link>
        </div>
      </section>
    </div>
  );
}
