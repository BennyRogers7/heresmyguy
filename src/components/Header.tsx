import Link from "next/link";
import { getAllPlumbers } from "@/lib/data";
import HeaderSearch from "./HeaderSearch";

export default function Header() {
  const plumbers = getAllPlumbers();

  return (
    <header className="bg-[#1a1a2e] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <Link href="/" className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#e5a527]">MN</span> Plumbers Directory
            </span>
            <span className="text-xs text-gray-400 font-normal">Minnesota&apos;s #1 Resource for Trusted Plumbers</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium hover:text-[#e5a527] transition-colors">
              Home
            </Link>
            <Link href="/#cities" className="font-medium hover:text-[#e5a527] transition-colors">
              Cities
            </Link>
            <Link href="/#services" className="font-medium hover:text-[#e5a527] transition-colors">
              Services
            </Link>
            <HeaderSearch plumbers={plumbers} />
            <Link
              href="/claim-listing"
              className="bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
            >
              Claim Your Listing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
