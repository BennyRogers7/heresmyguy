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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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
    setHasChanges(true);
    setCopied(false);
  };

  const copyJson = () => {
    const json = JSON.stringify([...featuredSlugs].sort(), null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
          <div className="text-sm text-gray-300">
            {featuredSlugs.size} featured plumbers
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
                      onToggle={() => toggleFeatured(p.slug)}
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
                    onToggle={() => toggleFeatured(p.slug)}
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

        {/* Copy JSON Button */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-[#e85d04] p-4">
              <p className="text-sm text-gray-600 mb-3">
                You have unsaved changes. Copy the JSON and paste into <code className="bg-gray-100 px-1 rounded">src/data/featured.json</code>
              </p>
              <button
                onClick={copyJson}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white hover:shadow-lg"
                }`}
              >
                {copied ? "Copied!" : "Copy JSON"}
              </button>
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
  onToggle,
}: {
  plumber: PlumberMinimal;
  isFeatured: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[#1a1a2e] truncate">{plumber.name}</div>
        <div className="text-sm text-gray-500">
          {plumber.city} {plumber.rating && `· ${plumber.rating} stars`}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`ml-4 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
          isFeatured
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white hover:shadow-md"
        }`}
      >
        {isFeatured ? "Remove" : "Feature"}
      </button>
    </div>
  );
}
