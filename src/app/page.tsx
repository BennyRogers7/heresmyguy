import Link from "next/link";
import { getAllCities, getTotalPlumbersCount, getAllPlumbers } from "@/lib/data";
import { SERVICES } from "@/lib/types";
import CityGrid from "@/components/CityGrid";
import Chat from "@/components/Chat";

export default function HomePage() {
  const cities = getAllCities();
  const plumbers = getAllPlumbers();
  const totalPlumbers = getTotalPlumbersCount();
  const totalCities = cities.length;

  return (
    <div>
      {/* Hero Section with Chat */}
      <section className="bg-gradient-to-br from-[#1a1a2e] via-[#232340] to-[#2d2d44] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
              Find a Licensed Plumber in{" "}
              <span className="text-[#e5a527]">Minnesota</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Tell us about your plumbing issue and we'll match you with the best local professionals.
            </p>
          </div>

          {/* Chat Interface */}
          <Chat cities={cities} plumbers={plumbers} />

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#e5a527]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span>{totalPlumbers}+ Plumbers Listed</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#e5a527]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span>{totalCities} Cities Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-[#e5a527]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span>Verified Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 bg-[#fafaf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">
              Browse Plumbers by City
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Find licensed plumbers in your Minnesota city. Click on any city to see all available plumbing professionals in that area.
            </p>
          </div>
          <CityGrid cities={cities} />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-4">
              Plumbing Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Looking for a specific plumbing service? Browse plumbers by the type of work you need done.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="bg-[#fafaf8] border-2 border-gray-100 rounded-xl p-6 hover:border-[#e5a527] hover:shadow-lg transition-all duration-200 group"
              >
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2 group-hover:text-[#e85d04] transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] via-[#232340] to-[#2d2d44]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Are You a Plumber?
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Get more customers by claiming your free listing or upgrading to a featured spot at the top of your city page.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/claim-listing"
              className="bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200"
            >
              Claim Your Free Listing
            </Link>
            <Link
              href="/featured"
              className="border-2 border-[#e5a527] text-[#e5a527] px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#e5a527] hover:text-[#1a1a2e] transition-all duration-200"
            >
              Get Featured
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
