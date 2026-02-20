'use client';

import Link from 'next/link';
import { Plumber } from '@/lib/types';
import StarRating from './StarRating';

interface ChatResultsProps {
  plumbers: Plumber[];
  city: string;
  matchedService: string | null;
  onStartOver: () => void;
}

function CompactPlumberCard({ plumber }: { plumber: Plumber }) {
  return (
    <div
      className={`bg-white rounded-xl border-2 p-4 transition-all duration-200 ${
        plumber.isFeatured
          ? 'border-[#e85d04] shadow-[0_4px_20px_rgba(232,93,4,0.15)]'
          : 'border-gray-100 shadow-sm hover:shadow-md hover:border-[#e5a527]'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {plumber.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {plumber.isVerified && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-[#1a1a2e] truncate">{plumber.name}</h3>
          <p className="text-gray-600 text-sm truncate">{plumber.address}</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <StarRating rating={plumber.rating} />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <a
          href={`tel:${plumber.phone}`}
          className="flex-1 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white text-center py-2.5 px-3 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200"
        >
          <span className="flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call Now
          </span>
        </a>
        <Link
          href={`/profile/${plumber.slug}`}
          className="flex-1 border-2 border-[#1a1a2e] text-[#1a1a2e] text-center py-2.5 px-3 rounded-lg font-semibold text-sm hover:bg-[#1a1a2e] hover:text-white transition-all duration-200"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default function ChatResults({
  plumbers,
  city,
  matchedService,
  onStartOver,
}: ChatResultsProps) {
  if (plumbers.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No plumbers found in {city}</h3>
          <p className="text-gray-600 mb-4">
            We don't have any plumbers listed in this area yet. Try a nearby city or browse all
            plumbers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStartOver}
              className="px-6 py-2.5 bg-[#1a1a2e] text-white rounded-lg font-semibold hover:bg-[#2d2d44] transition-colors"
            >
              Try Different City
            </button>
            <Link
              href="/#cities"
              className="px-6 py-2.5 border-2 border-[#e5a527] text-[#1a1a2e] rounded-lg font-semibold hover:bg-[#e5a527] hover:text-white transition-colors text-center"
            >
              Browse All Cities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5a527] to-[#e85d04] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-[15px] text-gray-800">
            {matchedService
              ? `Here are the top plumbers for ${matchedService} in ${city}:`
              : `Here are the top plumbers in ${city}:`}
          </p>
        </div>
      </div>

      <div className="space-y-3 ml-11">
        {plumbers.map((plumber) => (
          <CompactPlumberCard key={plumber.id} plumber={plumber} />
        ))}
      </div>

      <div className="mt-4 ml-11 flex flex-wrap gap-3">
        <button
          onClick={onStartOver}
          className="px-5 py-2.5 bg-[#fafaf8] border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#e5a527] hover:bg-white transition-all"
        >
          Start New Search
        </button>
        <Link
          href={`/${plumbers[0]?.city ? plumbers[0].city.toLowerCase().replace(/\s+/g, '-') : ''}`}
          className="px-5 py-2.5 bg-[#fafaf8] border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-[#e5a527] hover:bg-white transition-all"
        >
          View All in {city}
        </Link>
      </div>
    </div>
  );
}
