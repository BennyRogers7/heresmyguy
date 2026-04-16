import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/mascot.png"
                alt="Here's My Guy mascot"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h3 className="text-xl font-bold tracking-tight">
                Here&apos;s My <span className="text-[#d4a853]">Guy</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The contractor your neighbor swears by. Find trusted local pros across the country.
            </p>
          </div>

          {/* Browse by State */}
          <div>
            <h4 className="font-bold mb-4 text-[#d4a853]">Top States</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/ohio" className="hover:text-[#d4a853] transition-colors">
                  Ohio
                </Link>
              </li>
              <li>
                <Link href="/wisconsin" className="hover:text-[#d4a853] transition-colors">
                  Wisconsin
                </Link>
              </li>
              <li>
                <Link href="/indiana" className="hover:text-[#d4a853] transition-colors">
                  Indiana
                </Link>
              </li>
              <li>
                <Link href="/illinois" className="hover:text-[#d4a853] transition-colors">
                  Illinois
                </Link>
              </li>
            </ul>
          </div>

          {/* Verticals */}
          <div>
            <h4 className="font-bold mb-4 text-[#d4a853]">Find Contractors</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/landscapers" className="hover:text-[#d4a853] transition-colors">
                  Landscapers
                </Link>
              </li>
              <li>
                <Link href="/roofers" className="hover:text-[#d4a853] transition-colors">
                  Roofers
                </Link>
              </li>
              <li>
                <Link href="/electricians" className="hover:text-[#d4a853] transition-colors">
                  Electricians
                </Link>
              </li>
              <li>
                <Link href="/plumbers" className="hover:text-[#d4a853] transition-colors">
                  Plumbers
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h4 className="font-bold mb-4 text-[#d4a853]">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/claim-listing" className="hover:text-[#d4a853] transition-colors">
                  Claim Your Listing
                </Link>
              </li>
              <li>
                <Link href="/how-to-claim" className="hover:text-[#d4a853] transition-colors">
                  How to Claim
                </Link>
              </li>
              <li>
                <Link href="/founding-members" className="hover:text-[#d4a853] transition-colors">
                  Founding Members
                </Link>
              </li>
            </ul>

            {/* Company Links */}
            <h4 className="font-bold mb-4 mt-6 text-[#d4a853]">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-[#d4a853] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#d4a853] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
            <div className="mt-5 p-4 bg-[#2d2d44] rounded-xl">
              <p className="text-sm text-[#d4a853] font-semibold mb-1">Need a website?</p>
              <p className="text-xs text-gray-400 mb-3">
                We build contractor websites in 24 hours
              </p>
              <a
                href="https://websimpleai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#d4a853] text-[#1a1a2e] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#e5b863] transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Here&apos;s My Guy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
