"use client";

import { useState, useEffect } from "react";

interface PlumberMinimal {
  slug: string;
  name: string;
  city: string;
  rating: number | null;
}

const ADMIN_PASSWORD = "mnplumbers2024";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [plumbers, setPlumbers] = useState<PlumberMinimal[]>([]);
  const [featuredSlugs, setFeaturedSlugs] = useState<Set<string>>(new Set());
  const [verifiedSlugs, setVerifiedSlugs] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedFeatured, setCopiedFeatured] = useState(false);
  const [copiedVerified, setCopiedVerified] = useState(false);
  const [hasFeaturedChanges, setHasFeaturedChanges] = useState(false);
  const [hasVerifiedChanges, setHasVerifiedChanges] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_auth");
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load plumber list
      const res = await fetch("/admin-plumbers.json");
      const data: PlumberMinimal[] = await res.json();
      setPlumbers(data);

      // Load current featured list from JSON
      const featuredRes = await fetch("/featured.json");
      const featuredData: string[] = await featuredRes.json();
      setFeaturedSlugs(new Set(featuredData));

      // Load current verified list from JSON
      const verifiedRes = await fetch("/verified.json");
      const verifiedData: string[] = await verifiedRes.json();
      setVerifiedSlugs(new Set(verifiedData));
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setLoading(false);
  };

  const toggleFeatured = (slug: string) => {
    const isFeatured = featuredSlugs.has(slug);

    setFeaturedSlugs((prev) => {
      const next = new Set(prev);
      if (isFeatured) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    setHasFeaturedChanges(true);
    setCopiedFeatured(false);
  };

  const toggleVerified = (slug: string) => {
    const isVerified = verifiedSlugs.has(slug);

    setVerifiedSlugs((prev) => {
      const next = new Set(prev);
      if (isVerified) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
    setHasVerifiedChanges(true);
    setCopiedVerified(false);
  };

  const copyFeaturedJson = () => {
    const json = JSON.stringify([...featuredSlugs].sort(), null, 2);
    navigator.clipboard.writeText(json);
    setCopiedFeatured(true);
    setTimeout(() => setCopiedFeatured(false), 2000);
  };

  const copyVerifiedJson = () => {
    const json = JSON.stringify([...verifiedSlugs].sort(), null, 2);
    navigator.clipboard.writeText(json);
    setCopiedVerified(true);
    setTimeout(() => setCopiedVerified(false), 2000);
  };

  const filteredPlumbers = plumbers.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.slug.toLowerCase().includes(term)
    );
  });

  const featuredPlumbers = filteredPlumbers.filter((p) => featuredSlugs.has(p.slug));
  const regularPlumbers = filteredPlumbers.filter((p) => !featuredSlugs.has(p.slug));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2 text-center">
            Admin
          </h1>
          <p className="text-gray-500 text-center mb-6">Enter password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full px-4 py-3 border-2 rounded-lg mb-4 focus:outline-none focus:border-[#e5a527] ${
                passwordError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#1a1a2e] text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <span className="text-[#e5a527]">MN</span> Plumbers Admin
          </h1>
          <div className="text-sm text-gray-300 flex gap-4">
            <span>{featuredSlugs.size} featured</span>
            <span>{verifiedSlugs.size} verified</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or slug..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#e5a527] text-lg"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            {/* Featured Section */}
            {featuredPlumbers.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white text-xs px-2 py-1 rounded-full">
                    FEATURED
                  </span>
                  {featuredPlumbers.length} plumbers
                </h2>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {featuredPlumbers.map((p) => (
                    <PlumberRow
                      key={p.slug}
                      plumber={p}
                      isFeatured={true}
                      isVerified={verifiedSlugs.has(p.slug)}
                      onToggleFeatured={() => toggleFeatured(p.slug)}
                      onToggleVerified={() => toggleVerified(p.slug)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Section */}
            <div>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-3">
                All Plumbers ({regularPlumbers.length})
              </h2>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {regularPlumbers.slice(0, 100).map((p) => (
                  <PlumberRow
                    key={p.slug}
                    plumber={p}
                    isFeatured={false}
                    isVerified={verifiedSlugs.has(p.slug)}
                    onToggleFeatured={() => toggleFeatured(p.slug)}
                    onToggleVerified={() => toggleVerified(p.slug)}
                  />
                ))}
                {regularPlumbers.length > 100 && (
                  <div className="px-4 py-3 text-center text-gray-500 text-sm border-t">
                    Showing 100 of {regularPlumbers.length}. Use search to find more.
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Copy JSON Buttons */}
        {(hasFeaturedChanges || hasVerifiedChanges) && (
          <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[450px]">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-[#e85d04] p-4">
              <p className="text-sm text-gray-600 mb-3">
                You have unsaved changes. Copy the JSON and paste into the respective files.
              </p>
              <div className="flex gap-2">
                {hasFeaturedChanges && (
                  <button
                    onClick={copyFeaturedJson}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      copiedFeatured
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white hover:shadow-lg"
                    }`}
                  >
                    {copiedFeatured ? "Copied!" : "Copy Featured"}
                  </button>
                )}
                {hasVerifiedChanges && (
                  <button
                    onClick={copyVerifiedJson}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                      copiedVerified
                        ? "bg-green-500 text-white"
                        : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                    }`}
                  >
                    {copiedVerified ? "Copied!" : "Copy Verified"}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Featured → <code className="bg-gray-100 px-1 rounded">src/data/featured.json</code><br />
                Verified → <code className="bg-gray-100 px-1 rounded">src/data/verified.json</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlumberRow({
  plumber,
  isFeatured,
  isVerified,
  onToggleFeatured,
  onToggleVerified,
}: {
  plumber: PlumberMinimal;
  isFeatured: boolean;
  isVerified: boolean;
  onToggleFeatured: () => void;
  onToggleVerified: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1a1a2e] truncate">{plumber.name}</span>
          {isVerified && (
            <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-700 text-xs font-medium px-1.5 py-0.5 rounded-full">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {plumber.city} {plumber.rating && `· ${plumber.rating} stars`}
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={onToggleVerified}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
            isVerified
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title={isVerified ? "Remove verification" : "Mark as verified"}
        >
          {isVerified ? "Unverify" : "Verify"}
        </button>
        <button
          onClick={onToggleFeatured}
          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
            isFeatured
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white hover:shadow-md"
          }`}
        >
          {isFeatured ? "Unfeature" : "Feature"}
        </button>
      </div>
    </div>
  );
}
