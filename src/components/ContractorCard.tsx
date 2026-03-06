import Link from "next/link";
import { Business } from "@/lib/db";
import StarRating from "./StarRating";

interface ContractorCardProps {
  business: Business;
  vertical?: string;
}

export default function ContractorCard({ business, vertical }: ContractorCardProps) {
  const verticalDisplay = vertical || business.verticalSlug.replace(/-/g, " ");

  if (business.isFeatured) {
    return <FeaturedCard business={business} verticalDisplay={verticalDisplay} />;
  }

  return <FreeCard business={business} verticalDisplay={verticalDisplay} />;
}

function FreeCard({
  business,
  verticalDisplay,
}: {
  business: Business;
  verticalDisplay: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#d4a853] hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-2">
        <Link href={`/profile/${business.slug}`} className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-[#1a1a2e] hover:text-[#d4a853] transition-colors truncate">
            {business.name}
          </h3>
        </Link>
        {business.rating && (
          <div className="flex items-center gap-1 shrink-0">
            <StarRating rating={business.rating} showNumber={false} />
            <span className="text-sm font-medium text-gray-700">
              {business.rating.toFixed(1)}
            </span>
            {business.reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({business.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Location + Badge */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <p className="text-sm text-gray-600 capitalize">
          {verticalDisplay} · {business.city}, {business.state}
        </p>
        {business.isClaimed ? (
          <img
            src="/VerifiedBadge.png"
            alt="Verified Owner"
            className="h-8 w-auto"
          />
        ) : (
          <img
            src="/UnclaimedBadge.png"
            alt="Unclaimed"
            className="h-8 w-auto"
          />
        )}
        {!business.hasWebsite && (
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
            No website
          </span>
        )}
      </div>

      {/* Phone */}
      {business.phone && (
        <a
          href={`tel:${business.phone}`}
          className="flex items-center gap-2 text-[#1a1a2e] font-semibold mb-4 hover:text-[#d4a853] transition-colors"
        >
          <PhoneIcon />
          <span>{formatPhone(business.phone)}</span>
        </a>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 bg-[#1a1a2e] text-white text-center py-2.5 px-4 rounded-lg font-semibold hover:bg-[#2d2d44] transition-colors text-sm"
          >
            Call Now
          </a>
        )}
        <Link
          href={`/profile/${business.slug}`}
          className="flex-1 border border-[#d4a853] text-[#1a1a2e] text-center py-2.5 px-4 rounded-lg font-semibold hover:bg-[#d4a853] hover:text-white transition-colors text-sm"
        >
          View Profile
        </Link>
      </div>

      {/* Claim CTA */}
      {!business.isClaimed && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            href={`/claim-listing?id=${business.id}`}
            className="text-xs text-gray-500 hover:text-[#d4a853] transition-colors"
          >
            Is this your business? Claim this listing
          </Link>
        </div>
      )}
    </div>
  );
}

function FeaturedCard({
  business,
  verticalDisplay,
}: {
  business: Business;
  verticalDisplay: string;
}) {
  return (
    <div className="bg-gradient-to-br from-[#fffdf7] to-white rounded-xl border-2 border-[#d4a853] p-5 shadow-[0_4px_20px_rgba(212,168,83,0.15)] relative overflow-hidden">
      {/* Featured Badge */}
      <div className="absolute top-0 right-0 bg-[#d4a853] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        HERE'S MY GUY
      </div>

      {/* Header with Logo */}
      <div className="flex gap-4 mb-3">
        {business.logo ? (
          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-[#1a1a2e] flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-[#d4a853]">
              {business.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${business.slug}`}>
            <h3 className="text-lg font-bold text-[#1a1a2e] hover:text-[#d4a853] transition-colors">
              {business.name}
            </h3>
          </Link>

          {/* Location + Badge */}
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-sm text-gray-600 capitalize">
              {verticalDisplay} · {business.city}, {business.state}
            </p>
            {business.isClaimed ? (
              <img
                src="/VerifiedBadge.png"
                alt="Verified Owner"
                className="h-8 w-auto"
              />
            ) : (
              <img
                src="/UnclaimedBadge.png"
                alt="Unclaimed"
                className="h-8 w-auto"
              />
            )}
          </div>

          {business.rating && (
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={business.rating} showNumber={false} />
              <span className="text-sm font-medium text-gray-700">
                {business.rating.toFixed(1)}
              </span>
              {business.reviewCount > 0 && (
                <span className="text-xs text-gray-500">
                  ({business.reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {business.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2 italic">
          "{business.description}"
        </p>
      )}

      {/* Contact Info */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex items-center gap-1.5 text-[#1a1a2e] font-semibold hover:text-[#d4a853] transition-colors"
          >
            <PhoneIcon />
            {formatPhone(business.phone)}
          </a>
        )}
        {business.website && (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#d4a853] font-medium hover:text-[#b8922e] transition-colors"
          >
            <GlobeIcon />
            Visit Website
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {business.phone && (
          <a
            href={`tel:${business.phone}`}
            className="flex-1 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-white text-center py-3 px-4 rounded-lg font-bold hover:shadow-lg hover:shadow-[#d4a853]/25 transition-all text-sm"
          >
            Call Now
          </a>
        )}
        {business.website ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#1a1a2e] text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-[#2d2d44] transition-colors text-sm"
          >
            Visit Website
          </a>
        ) : (
          <Link
            href={`/profile/${business.slug}`}
            className="flex-1 bg-[#1a1a2e] text-white text-center py-3 px-4 rounded-lg font-bold hover:bg-[#2d2d44] transition-colors text-sm"
          >
            View Profile
          </Link>
        )}
      </div>
    </div>
  );
}

// Utility functions
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

// Icons
function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  );
}

