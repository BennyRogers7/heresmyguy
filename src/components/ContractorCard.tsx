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
  const isClaimed = business.isClaimed;
  const isFoundingMember = business.membershipTier === "founding_member";

  return (
    <div
      className={`bg-white rounded-xl p-5 transition-all duration-200 ${
        isFoundingMember
          ? "border-2 border-[#d4a853] hover:shadow-lg hover:shadow-[#d4a853]/20 bg-gradient-to-br from-[#fffdf7] to-white"
          : isClaimed
          ? "border-2 border-green-500 hover:shadow-lg hover:shadow-green-500/10"
          : "border border-gray-200 hover:border-gray-300 opacity-85"
      }`}
    >
      {/* Header with Avatar/Thumbnail */}
      <div className="flex gap-3 mb-3">
        {/* Avatar - show thumbnail for claimed with logo, green for claimed, gray for unclaimed */}
        {(isClaimed || isFoundingMember) && business.logo ? (
          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
              isFoundingMember
                ? "bg-gradient-to-br from-[#d4a853] to-[#b8922e]"
                : isClaimed
                ? "bg-green-600"
                : "bg-gray-400"
            }`}
          >
            <span className="text-xl font-bold text-white">
              {business.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/profile/${business.slug}`} className="flex-1 min-w-0">
              <h3
                className={`text-lg font-bold truncate transition-colors ${
                  isFoundingMember
                    ? "text-[#1a1a2e] hover:text-[#d4a853]"
                    : isClaimed
                    ? "text-[#1a1a2e] hover:text-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {business.name}
              </h3>
            </Link>
            {business.rating && (
              <div className="flex items-center gap-1 shrink-0">
                <StarRating rating={business.rating} showNumber={false} />
                <span
                  className={`text-sm font-medium ${
                    isClaimed ? "text-gray-700" : "text-gray-500"
                  }`}
                >
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
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p
              className={`text-sm capitalize ${
                isClaimed ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {verticalDisplay} · {business.city}, {business.state}
            </p>
            {isFoundingMember ? (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Founding Member
              </span>
            ) : isClaimed ? (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                Unclaimed
              </span>
            )}
            {!business.hasWebsite && (
              <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                No website
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Phone */}
      {business.phone && (
        <a
          href={`tel:${business.phone}`}
          className={`flex items-center gap-2 font-semibold mb-4 transition-colors ${
            isFoundingMember
              ? "text-[#1a1a2e] hover:text-[#d4a853]"
              : isClaimed
              ? "text-[#1a1a2e] hover:text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
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
            className={`flex-1 text-center py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${
              isFoundingMember
                ? "bg-gradient-to-r from-[#d4a853] to-[#e5b863] text-[#1a1a2e] hover:shadow-lg hover:shadow-[#d4a853]/25"
                : isClaimed
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-400 text-white hover:bg-gray-500"
            }`}
          >
            Call Now
          </a>
        )}
        <Link
          href={`/profile/${business.slug}`}
          className={`flex-1 text-center py-2.5 px-4 rounded-lg font-semibold transition-colors text-sm ${
            isFoundingMember
              ? "border-2 border-[#d4a853] text-[#d4a853] hover:bg-[#fffdf7]"
              : isClaimed
              ? "border-2 border-green-500 text-green-700 hover:bg-green-50"
              : "border border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          View Profile
        </Link>
      </div>

      {/* Claim CTA for unclaimed */}
      {!isClaimed && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            href={`/claim-listing?id=${business.id}`}
            className="text-xs text-gray-400 hover:text-[#d4a853] transition-colors"
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
  const isFoundingMember = business.membershipTier === "founding_member";

  return (
    <div className="bg-gradient-to-br from-[#fffdf7] to-white rounded-xl border-2 border-[#d4a853] p-5 shadow-[0_4px_20px_rgba(212,168,83,0.15)] relative overflow-hidden">
      {/* Featured Badge */}
      <div className="absolute top-0 right-0 bg-[#d4a853] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
        {isFoundingMember ? "FOUNDING MEMBER" : "HERE'S MY GUY"}
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

