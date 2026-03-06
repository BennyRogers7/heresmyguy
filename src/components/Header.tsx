import Link from "next/link";
import Image from "next/image";

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
            <Link
              href="/landscapers"
              className="text-sm font-medium hover:text-[#d4a853] transition-colors"
            >
              Landscapers
            </Link>
            <Link
              href="/claim-listing"
              className="bg-[#d4a853] text-[#1a1a2e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#e5b863] transition-colors"
            >
              Claim Listing
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
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
        </div>
      </div>
    </header>
  );
}
