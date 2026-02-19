import Link from "next/link";
import { Plumber } from "@/lib/types";
import StarRating from "./StarRating";

interface PlumberCardProps {
  plumber: Plumber;
}

export default function PlumberCard({ plumber }: PlumberCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border-2 p-6 transition-all duration-200 ${
        plumber.isFeatured
          ? "border-[#e85d04] shadow-[0_4px_20px_rgba(232,93,4,0.15)]"
          : "border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#e5a527]"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {plumber.isFeatured && <span className="featured-badge">Featured</span>}
          </div>
          <Link href={`/profile/${plumber.slug}`}>
            <h3 className="text-xl font-bold text-[#1a1a2e] hover:text-[#e85d04] transition-colors">
              {plumber.name}
            </h3>
          </Link>
        </div>
        <StarRating rating={plumber.rating} />
      </div>

      <p className="text-gray-600 text-sm mb-3">{plumber.address}</p>

      <div className="flex items-center gap-4 mb-4">
        <a
          href={`tel:${plumber.phone}`}
          className="flex items-center gap-2 text-[#1a1a2e] font-semibold hover:text-[#e85d04] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {plumber.phone}
        </a>
        {plumber.website && (
          <a
            href={plumber.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#e5a527] font-medium hover:text-[#f5c04a] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Website
          </a>
        )}
      </div>

      <div className="flex gap-3">
        <a
          href={`tel:${plumber.phone}`}
          className="flex-1 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white text-center py-3 px-4 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
        >
          Call Now
        </a>
        {plumber.website ? (
          <a
            href={plumber.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              plumber.isFeatured
                ? "bg-[#1a1a2e] text-white hover:bg-[#2d2d44]"
                : "border-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white"
            }`}
          >
            Visit Website
          </a>
        ) : (
          <Link
            href={`/profile/${plumber.slug}`}
            className="flex-1 border-2 border-[#e5a527] text-[#1a1a2e] text-center py-3 px-4 rounded-lg font-semibold hover:bg-[#e5a527] hover:text-white transition-all duration-200"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
