"use client";

import { useState } from "react";
import { Business, VerticalInfo, StateInfo } from "@/lib/db";
import { getServicesForVertical, ServiceOption } from "@/lib/vertical-services";

interface ClaimFormProps {
  business: Business | null;
  vertical: VerticalInfo | null;
  allVerticals: VerticalInfo[] | null;
  allStates: StateInfo[] | null;
}

export default function ClaimForm({
  business,
  vertical,
  allVerticals,
  allStates,
}: ClaimFormProps) {
  const isClaimingExisting = !!business;

  const [formData, setFormData] = useState({
    businessId: business?.id || "",
    businessName: business?.name || "",
    ownerName: "",
    email: "",
    phone: business?.phone || "",
    city: business?.city || "",
    state: business?.state || "",
    verticalSlug: business?.verticalSlug || "",
    address: business?.address || "",
    website: business?.website || "",
    services: [] as string[],
    otherServices: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedBusinessName, setSubmittedBusinessName] = useState("");

  // Get services for the selected vertical
  const currentVerticalSlug = formData.verticalSlug;
  const services: ServiceOption[] = currentVerticalSlug
    ? getServicesForVertical(currentVerticalSlug)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/claim-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorMsg = "Failed to submit claim";
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch {
          // Response wasn't JSON, use default error message
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      setSubmittedBusinessName(formData.businessName);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Clear services when vertical changes
      if (name === "verticalSlug") {
        newData.services = [];
      }
      return newData;
    });
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));
  };

  // Success state with personalized confirmation
  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
          Thanks{submittedBusinessName ? `, ${submittedBusinessName}` : ""}!
        </h2>
        <p className="text-gray-600 mb-2">
          Your listing is being verified.
        </p>
        <p className="text-gray-600 mb-6">
          You'll receive a confirmation email within 24 hours.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-[#1a1a2e] mb-2">What happens next?</h3>
          <ol className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#d4a853]">1.</span>
              We'll verify your business information
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#d4a853]">2.</span>
              You'll receive an email to confirm ownership
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-[#d4a853]">3.</span>
              Your listing will be marked as "Verified Owner"
            </li>
          </ol>
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
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p><strong>What's public:</strong> Business name, phone, city, address, website, and services</p>
        <p className="mt-1"><strong>What's private:</strong> Your name and email (used to contact you about your listing)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            readOnly={isClaimingExisting}
            className={`w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all ${
              isClaimingExisting ? "bg-gray-50 text-gray-700" : ""
            }`}
            placeholder="Your Business Name"
          />
          {isClaimingExisting && (
            <p className="mt-1 text-xs text-gray-500">This is pre-filled from your existing listing</p>
          )}
        </div>

        {/* Owner Name */}
        <div>
          <label htmlFor="ownerName" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            required
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
            placeholder="John Smith"
          />
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
            <p className="mt-1 text-xs text-gray-500">Not public - used to contact you about your listing</p>
          </div>

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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* State and City - for generic form or editable */}
        {!isClaimingExisting ? (
          <>
            {/* State selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select your state</option>
                  {allStates?.map((state) => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
                  placeholder="Your city"
                />
              </div>
            </div>

            {/* Vertical selector */}
            <div>
              <label htmlFor="verticalSlug" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                Trade / Category *
              </label>
              <select
                id="verticalSlug"
                name="verticalSlug"
                required
                value={formData.verticalSlug}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all bg-white"
              >
                <option value="">Select your trade</option>
                {allVerticals?.map((v) => (
                  <option key={v.slug} value={v.slug}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          /* Show pre-filled location for existing business */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1a2e] mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
              />
            </div>
          </div>
        )}

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Business Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
            placeholder="123 Main St"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Website <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
            placeholder="yourwebsite.com"
          />
        </div>

        {/* Services - only show if vertical is selected */}
        {services.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-[#1a1a2e] mb-3">
              Services Offered
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <label
                  key={service.slug}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#e5a527] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.name)}
                    onChange={() => handleServiceToggle(service.name)}
                    className="w-5 h-5 text-[#e85d04] border-gray-300 rounded focus:ring-[#e5a527]"
                  />
                  <span className="text-sm text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label htmlFor="otherServices" className="block text-sm text-gray-600 mb-2">
                Other services (separate with commas)
              </label>
              <input
                type="text"
                id="otherServices"
                name="otherServices"
                value={formData.otherServices}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
                placeholder="Additional services you offer..."
              />
            </div>
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            Additional Information
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all resize-none"
            placeholder="Tell us about your business, years in operation, etc."
          />
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Submitting..." : isClaimingExisting ? "Claim This Listing" : "Submit"}
        </button>
      </form>
    </div>
  );
}
