"use client";

import { useState } from "react";
import { City, SERVICES } from "@/lib/types";

interface ClaimFormProps {
  cities: City[];
}

export default function ClaimForm({ cities }: ClaimFormProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    website: "",
    services: [] as string[],
    otherServices: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

      setStatus("success");
      setFormData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        website: "",
        services: [],
        otherServices: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Claim Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for submitting your claim. We'll review your information and get back to you within 1-2 business days.
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all"
            placeholder="Your Plumbing Company"
          />
        </div>

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

        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
            City *
          </label>
          <select
            id="city"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#e5a527] focus:border-transparent transition-all bg-white"
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city.slug} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

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
            placeholder="123 Main St, Minneapolis, MN 55401"
          />
        </div>

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

        <div>
          <label className="block text-sm font-semibold text-[#1a1a2e] mb-3">
            Services Offered
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((service) => (
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
              placeholder="Gas line repair, Sump pump installation, etc."
            />
          </div>
        </div>

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

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Submitting..." : "Submit Claim"}
        </button>
      </form>
    </div>
  );
}
