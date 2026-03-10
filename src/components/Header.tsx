import Link from "next/link";
import Image from "next/image";

const VERTICALS = [
  { slug: "landscapers", name: "Landscapers", icon: "🌿" },
  { slug: "roofers", name: "Roofers", icon: "🏠" },
  { slug: "electricians", name: "Electricians", icon: "⚡" },
  { slug: "plumbers", name: "Plumbers", icon: "🔧" },
  { slug: "hvac", name: "HVAC", icon: "❄️" },
  { slug: "painters", name: "Painters", icon: "🎨" },
  { slug: "general-contractors", name: "General Contractors", icon: "🔨" },
  { slug: "pest-control", name: "Pest Control", icon: "🐜" },
  { slug: "pool-contractors", name: "Pool Contractors", icon: "🏊" },
];

export default function Header() {
  return (
    <header className="bg-[#1a1a2e] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image
              src="/mascot.png"
              alt="Here's My Guy mascot"
              width={44}
              height={44}
              className="w-10 h-10 md:w-11 md:h-11"
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight leading-tight">
                Here&apos;s My <span className="text-[#d4a853]">Guy</span>
              </span>
              <span className="text-[10px] md:text-xs text-gray-400 font-normal hidden sm:block">
                The contractor your neighbor swears by
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium hover:text-[#d4a853] transition-colors"
            >
              Home
            </Link>

            {/* Find Pros Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium hover:text-[#d4a853] transition-colors flex items-center gap-1">
                Find Pros
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]">
                  {VERTICALS.map((vertical) => (
                    <Link
                      key={vertical.slug}
                      href={`/trade/${vertical.slug}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f7f4] hover:text-[#1a1a2e] transition-colors"
                    >
                      <span>{vertical.icon}</span>
                      <span>{vertical.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/claim-listing"
              className="bg-[#d4a853] text-[#1a1a2e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e5b863] transition-colors"
            >
              Claim Listing
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              href="/claim-listing"
              className="bg-[#d4a853] text-[#1a1a2e] px-3 py-1.5 rounded-lg font-bold text-xs"
            >
              Claim
            </Link>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <div className="relative group">
      <button
        className="p-2 text-gray-300 hover:text-white"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Dropdown */}
      <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px]">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f7f4]"
          >
            Home
          </Link>
          <div className="border-t border-gray-100 my-2" />
          <p className="px-4 py-1 text-xs text-gray-400 font-medium">Find Pros</p>
          {VERTICALS.map((vertical) => (
            <Link
              key={vertical.slug}
              href={`/trade/${vertical.slug}`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#f8f7f4]"
            >
              <span>{vertical.icon}</span>
              <span>{vertical.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
