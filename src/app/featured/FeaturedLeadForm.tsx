"use client";

import { useState } from "react";

export default function FeaturedLeadForm() {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    state: "",
    verticalSlug: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/featured-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMsg = "Failed to submit";
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // Response wasn't JSON
        }
        throw new Error(errorMsg);
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
          Thanks for Your Interest!
        </h2>
        <p className="text-gray-600 mb-2">
          We've received your information.
        </p>
        <p className="text-gray-600 mb-6">
          A member of our team will reach out within 24 hours with pricing details and next steps.
        </p>

        <div className="bg-[#d4a853]/10 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-[#1a1a2e] mb-2">While you wait:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#d4a853] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Make sure your listing is claimed and verified
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#d4a853] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Update your contact information
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#d4a853] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Add services you offer
            </li>
          </ul>
        </div>

        <a
          href="/"
          className="inline-block bg-[#1a1a2e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d2d44] transition-all"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent transition-all"
            placeholder="Your Business Name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent transition-all"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* State - Optional */}
        <div>
          <label htmlFor="state" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            State <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent transition-all"
            placeholder="e.g., Ohio, Texas"
          />
        </div>

        {/* Trade - Optional */}
        <div>
          <label htmlFor="verticalSlug" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Trade <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <select
            id="verticalSlug"
            name="verticalSlug"
            value={formData.verticalSlug}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent transition-all bg-white"
          >
            <option value="">Select your trade</option>
            <option value="plumbers">Plumbers</option>
            <option value="electricians">Electricians</option>
            <option value="landscapers">Landscapers</option>
            <option value="roofers">Roofers</option>
            <option value="hvac">HVAC</option>
            <option value="painters">Painters</option>
            <option value="general-contractors">General Contractors</option>
            <option value="pest-control">Pest Control</option>
            <option value="pool-contractors">Pool Contractors</option>
          </select>
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#d4a853] text-[#1a1a2e] py-4 rounded-lg font-bold text-lg hover:bg-[#e5b863] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Submitting..." : "Get Founding Member Pricing"}
        </button>

        <p className="text-center text-sm text-gray-500">
          No payment required. We'll contact you with details.
        </p>
      </form>
    </div>
  );
}
