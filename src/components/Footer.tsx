import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">
              <span className="text-[#e5a527]">MN</span> Plumbers
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The most comprehensive directory of licensed plumbers in Minnesota. Find trusted professionals in your city.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#e5a527]">Popular Cities</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/minneapolis" className="hover:text-[#e5a527] transition-colors">Minneapolis</Link></li>
              <li><Link href="/saint-paul" className="hover:text-[#e5a527] transition-colors">Saint Paul</Link></li>
              <li><Link href="/rochester" className="hover:text-[#e5a527] transition-colors">Rochester</Link></li>
              <li><Link href="/duluth" className="hover:text-[#e5a527] transition-colors">Duluth</Link></li>
              <li><Link href="/bloomington" className="hover:text-[#e5a527] transition-colors">Bloomington</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#e5a527]">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services/emergency-plumbing" className="hover:text-[#e5a527] transition-colors">Emergency Plumbing</Link></li>
              <li><Link href="/services/drain-cleaning" className="hover:text-[#e5a527] transition-colors">Drain Cleaning</Link></li>
              <li><Link href="/services/water-heater" className="hover:text-[#e5a527] transition-colors">Water Heater</Link></li>
              <li><Link href="/services/sewer-line-repair" className="hover:text-[#e5a527] transition-colors">Sewer Line Repair</Link></li>
              <li><Link href="/services/leak-detection" className="hover:text-[#e5a527] transition-colors">Leak Detection</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#e5a527]">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/claim-listing" className="hover:text-[#e5a527] transition-colors">Claim Your Listing</Link></li>
              <li><Link href="/featured" className="hover:text-[#e5a527] transition-colors">Get Featured</Link></li>
            </ul>
            <div className="mt-6 p-5 bg-gradient-to-br from-[#2d2d44] to-[#3a3a5c] rounded-xl border border-[#e85d04]/20">
              <p className="text-base text-[#e5a527] font-bold mb-1">Need a website?</p>
              <p className="text-sm text-gray-300 mb-3">We build plumber websites in 24 hours</p>
              <a
                href="https://websimpleai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white text-sm font-bold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                Get Started &rarr;
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} MN Plumbers Directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
