"use client";

import { useState } from "react";

interface LaunchNotifyFormProps {
  state: string;
  stateName: string;
}

export default function LaunchNotifyForm({
  state,
  stateName,
}: LaunchNotifyFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    try {
      const response = await fetch("/api/launch-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, state }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(`We'll notify you when we launch in ${stateName}!`);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
        <svg
          className="w-12 h-12 text-green-400 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-white font-semibold">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-[#d4a853] text-[#1a1a2e] px-6 py-3 rounded-lg font-semibold hover:bg-[#e5b863] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? "Submitting..." : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm">{message}</p>
      )}
      <p className="text-gray-400 text-xs">
        We&apos;ll only email you once when we launch. No spam.
      </p>
    </form>
  );
}
