"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThermometerProgress from "./ThermometerProgress";

const PROJECT_OPTIONS = [
  "Roofing",
  "Kitchen remodel",
  "Bathroom remodel",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Windows & doors",
  "Deck or patio",
  "Flooring",
  "Painting",
  "Landscaping",
  "Solar",
  "General handyman",
  "Other",
  "Just browsing for now",
];

const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

const PRIORITY_OPTIONS = [
  "Local reputation",
  "Online reviews",
  "Quality of work",
  "Communication",
  "Price",
  "Availability",
  "Licensed and insured",
  "Referrals from neighbors",
];

interface StatePollOverlayProps {
  stateName: string;
  stateAbbreviation: string;
  majorCities: string[];
  launchDate?: string;
  initialVoteCount?: number;
  threshold?: number;
}

interface PollStats {
  voteCount: number;
  threshold: number;
  percentToLaunch: number;
  topCity?: { name: string; percent: number };
  topProject?: { name: string; percent: number };
  topPriority?: { name: string; percent: number };
}

export default function StatePollOverlay({
  stateName,
  stateAbbreviation,
  majorCities,
  launchDate,
  initialVoteCount = 0,
  threshold = 100,
}: StatePollOverlayProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState<PollStats | null>(null);

  // Form state
  const [cityVote, setCityVote] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [projects, setProjects] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [priorities, setPriorities] = useState<string[]>([]);
  const [contractorName, setContractorName] = useState("");
  const [contractorCity, setContractorCity] = useState("");
  const [contractorWork, setContractorWork] = useState("");
  const [email, setEmail] = useState("");
  const [persistentEmail, setPersistentEmail] = useState("");

  // Load initial stats
  useEffect(() => {
    fetchStats();
  }, [stateAbbreviation]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/poll/stats/${stateAbbreviation}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const submitPoll = async (finalStep = false) => {
    setIsSubmitting(true);
    try {
      const effectiveEmail = email || persistentEmail;
      const res = await fetch("/api/poll/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: stateAbbreviation,
          cityVote: cityVote === "Other" ? otherCity : cityVote,
          projects,
          budget,
          hiringPriorities: priorities,
          recommendedContractorName: contractorName,
          recommendedContractorCity: contractorCity,
          recommendedContractorWork: contractorWork,
          email: effectiveEmail,
          completedSteps: step,
        }),
      });

      if (res.ok && finalStep) {
        setIsSubmitted(true);
        await fetchStats();
      }
    } catch (error) {
      console.error("Poll submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    await submitPoll(step === 6);
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const skipStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      submitPoll(true);
    }
  };

  const toggleProject = (project: string) => {
    if (projects.includes(project)) {
      setProjects(projects.filter((p) => p !== project));
    } else if (projects.length < 3) {
      setProjects([...projects, project]);
    }
  };

  const togglePriority = (priority: string) => {
    if (priorities.includes(priority)) {
      setPriorities(priorities.filter((p) => p !== priority));
    } else if (priorities.length < 2) {
      setPriorities([...priorities, priority]);
    }
  };

  const shareUrl = `https://heresmyguy.com/${stateAbbreviation.toLowerCase()}`;
  const shareText = `Help bring Here's My Guy to ${stateName}! Vote to launch: ${shareUrl}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const shareViaText = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText)}`, "_blank");
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`Help launch Here's My Guy in ${stateName}`)}&body=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const currentVotes = stats?.voteCount ?? initialVoteCount;
  const currentThreshold = stats?.threshold ?? threshold;

  // Results view after submission
  if (isSubmitted && stats) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1a2e]">You just moved the needle.</h2>
        </div>

        <div className="mb-6">
          <ThermometerProgress
            current={stats.voteCount}
            threshold={stats.threshold}
            animate={true}
            size="lg"
          />
        </div>

        <div className="bg-[#f8f7f4] rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-[#1a1a2e] mb-4">
            Here&apos;s what {stateName} is saying so far:
          </h3>
          <div className="space-y-3 text-sm">
            {stats.topCity && (
              <div className="flex justify-between">
                <span className="text-gray-600">Top city requested:</span>
                <span className="font-medium text-[#1a1a2e]">
                  {stats.topCity.name} ({stats.topCity.percent}%)
                </span>
              </div>
            )}
            {stats.topProject && (
              <div className="flex justify-between">
                <span className="text-gray-600">Most needed trade:</span>
                <span className="font-medium text-[#1a1a2e]">
                  {stats.topProject.name} ({stats.topProject.percent}%)
                </span>
              </div>
            )}
            {stats.topPriority && (
              <div className="flex justify-between">
                <span className="text-gray-600">Top hiring priority:</span>
                <span className="font-medium text-[#1a1a2e]">
                  {stats.topPriority.name} ({stats.topPriority.percent}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4">
            Want to launch {stateName} faster? Share this with a neighbor.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={shareViaText}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2d2d44] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Text
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium hover:bg-[#2d2d44] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Link
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/minnesota"
            className="text-[#d4a853] hover:underline text-sm font-medium"
          >
            Curious what a live state looks like? Check out Minnesota →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
          {stateName} is coming.
        </h2>
        <p className="text-gray-600 mt-2">
          You decide when. We launch states based on real demand, not guesswork.
        </p>
        {launchDate && (
          <p className="text-[#d4a853] font-semibold mt-2">
            Launching {launchDate}
          </p>
        )}
      </div>

      {/* Thermometer */}
      <div className="mb-6">
        <ThermometerProgress
          current={currentVotes}
          threshold={currentThreshold}
          size="md"
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-1.5 mb-6">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              s === step ? "bg-[#d4a853]" : s < step ? "bg-[#d4a853]/50" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">
        {step === 1 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 1 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-4">
              Which city should we launch first?
            </p>
            <select
              value={cityVote}
              onChange={(e) => setCityVote(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent text-[#1a1a2e]"
            >
              <option value="">Select a city...</option>
              {majorCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {cityVote === "Other" && (
              <input
                type="text"
                placeholder="Enter city name"
                value={otherCity}
                onChange={(e) => setOtherCity(e.target.value)}
                className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 2 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-2">
              What project is on your mind?
            </p>
            <p className="text-sm text-gray-500 mb-4">Select up to 3</p>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {PROJECT_OPTIONS.map((project) => (
                <button
                  key={project}
                  onClick={() => toggleProject(project)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                    projects.includes(project)
                      ? "bg-[#d4a853] border-[#d4a853] text-white"
                      : "border-gray-200 hover:border-[#d4a853] text-gray-700"
                  }`}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 3 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-2">
              What&apos;s your budget looking like?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              No judgment. We just want to help the right contractors find you.
            </p>
            <div className="space-y-2">
              {BUDGET_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setBudget(option)}
                  className={`w-full px-4 py-3 text-left rounded-lg border transition-colors ${
                    budget === option
                      ? "bg-[#d4a853] border-[#d4a853] text-white"
                      : "border-gray-200 hover:border-[#d4a853] text-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 4 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-2">
              What matters most when you&apos;re hiring?
            </p>
            <p className="text-sm text-gray-500 mb-4">Pick your top two.</p>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITY_OPTIONS.map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                    priorities.includes(priority)
                      ? "bg-[#d4a853] border-[#d4a853] text-white"
                      : "border-gray-200 hover:border-[#d4a853] text-gray-700"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 5 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-2">
              Got a guy worth knowing about?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              If you&apos;ve worked with a contractor you&apos;d recommend, tell us.
              We&apos;ll reach out and invite them to be a founding member in {stateName}.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Contractor or business name"
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="City"
                value={contractorCity}
                onChange={(e) => setContractorCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="What they did for you"
                value={contractorWork}
                onChange={(e) => setContractorWork(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Step 6 of 6</h3>
            <p className="text-lg text-[#1a1a2e] mb-2">
              Want to know when {stateName} launches?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drop your email and we&apos;ll tell you the minute we go live.
              No spam. No selling your info. That&apos;s the whole point.
            </p>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={skipStep}
          className="flex-1 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          Skip
        </button>
        <button
          onClick={nextStep}
          disabled={isSubmitting}
          className="flex-1 bg-[#d4a853] text-[#1a1a2e] px-6 py-3 rounded-lg font-bold hover:bg-[#e5b863] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "..." : step === 6 ? "Count me in" : "Next"}
        </button>
      </div>

      {/* Persistent email capture */}
      {step < 6 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email (to get notified)"
              value={persistentEmail}
              onChange={(e) => setPersistentEmail(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Contractor link */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <Link
          href="/founding-members"
          className="text-sm text-[#d4a853] hover:underline"
        >
          Are you a {stateName} contractor? Get founding member access →
        </Link>
      </div>
    </div>
  );
}
