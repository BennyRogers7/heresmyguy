"use client";

import { useState } from "react";
import Link from "next/link";

interface TokenClaimFormProps {
  token: string;
  businessName: string;
  businessSlug: string;
  phone?: string | null;
}

export default function TokenClaimForm({
  token,
  businessName,
  businessSlug,
  phone,
}: TokenClaimFormProps) {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/claim-with-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ownerName: formData.ownerName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to claim listing");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
          You're Verified!
        </h2>
        <p className="text-gray-600 mb-6">
          Congratulations! <strong>{businessName}</strong> is now verified.
          We've sent you a confirmation email with more details.
        </p>
        <Link
          href={`/profile/${businessSlug}`}
          className="inline-block bg-[#d4a853] text-[#1a1a2e] px-8 py-3 rounded-lg font-bold hover:bg-[#e5b863] transition-colors"
        >
          View Your Listing
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
        Complete Your Verification
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Business Name (read-only) */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name
        </label>
        <input
          type="text"
          value={businessName}
          disabled
          className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 cursor-not-allowed"
        />
      </div>

      {/* Owner Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.ownerName}
          onChange={(e) =>
            setFormData({ ...formData, ownerName: e.target.value })
          }
          placeholder="John Smith"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a853]/50 focus:border-[#d4a853] transition-colors"
        />
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="john@example.com"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a853]/50 focus:border-[#d4a853] transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          We'll send your confirmation to this email
        </p>
      </div>

      {/* Phone (optional) */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a853]/50 focus:border-[#d4a853] transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional — Update your business phone number
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#d4a853] text-[#1a1a2e] py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Verifying...
          </span>
        ) : (
          "Claim & Verify — Free"
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By claiming, you confirm you are authorized to manage this business listing.
      </p>
    </form>
  );
}
