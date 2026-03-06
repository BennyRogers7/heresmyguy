"use client";

import { useState, useEffect, useCallback } from "react";

interface Business {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  verticalSlug: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  hasWebsite: boolean;
  reviewCount: number | null;
}

interface ApiResponse {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  states: string[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [authCredentials, setAuthCredentials] = useState("");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  // Filters
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [hasWebsiteFilter, setHasWebsiteFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    if (!authCredentials) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.set("search", search);
      if (stateFilter) params.set("state", stateFilter);
      if (hasWebsiteFilter !== "all") params.set("hasWebsite", hasWebsiteFilter);
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const res = await fetch(`/api/admin/businesses?${params}`, {
        headers: {
          Authorization: `Basic ${authCredentials}`,
        },
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setAuthCredentials("");
        setPasswordError(true);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch businesses");
      }

      const data: ApiResponse = await res.json();
      setBusinesses(data.businesses);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      if (data.states) {
        setStates(data.states);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [authCredentials, page, search, stateFilter, hasWebsiteFilter, ratingFilter]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
    }
  }, [isAuthenticated, fetchBusinesses]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, stateFilter, hasWebsiteFilter, ratingFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = btoa(`:${password}`);
    setAuthCredentials(credentials);
    setIsAuthenticated(true);
    setPasswordError(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === businesses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(businesses.map((b) => b.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} businesses? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authCredentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [...selectedIds] }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete businesses");
      }

      const data = await res.json();
      alert(`Deleted ${data.deleted} businesses`);
      setSelectedIds(new Set());
      fetchBusinesses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const deleteSingle = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authCredentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete business");
      }

      fetchBusinesses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

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
              className={`w-full px-4 py-3 border-2 rounded-lg mb-4 focus:outline-none focus:border-[#d4a853] ${
                passwordError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full bg-[#1a1a2e] text-white py-3 rounded-lg font-bold hover:bg-[#2d2d44] transition-all"
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
      {/* Header */}
      <div className="bg-[#1a1a2e] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <span className="text-[#d4a853]">Here&apos;s My Guy</span> Admin
          </h1>
          <div className="text-sm text-gray-300">
            {total.toLocaleString()} businesses
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search by Name
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a853]"
              />
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a853]"
              >
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Has Website Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Has Website
              </label>
              <select
                value={hasWebsiteFilter}
                onChange={(e) => setHasWebsiteFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a853]"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4a853]"
              >
                <option value="all">All</option>
                <option value="below3">Below 3 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.size > 0 && (
          <div className="bg-[#d4a853]/10 border border-[#d4a853] rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="font-medium text-[#1a1a2e]">
              {selectedIds.size} selected
            </span>
            <button
              onClick={deleteSelected}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Selected"}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === businesses.length && businesses.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        City
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        State
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Vertical
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 min-w-[200px]">
                        Website
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Rating
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {businesses.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(b.id)}
                            onChange={() => toggleSelect(b.id)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#1a1a2e]">{b.name}</span>
                            {!b.hasWebsite && (
                              <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(`${b.name} ${b.city} ${b.state}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                                title={`Search Google for ${b.name}`}
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{b.slug}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.city}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.state}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.verticalSlug}</td>
                        <td className="px-4 py-3 text-sm">
                          {b.phone ? (
                            <a
                              href={`tel:${b.phone}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {b.phone}
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {b.website ? (
                            <a
                              href={b.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline truncate block max-w-[180px]"
                              title={b.website}
                            >
                              {b.website.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                              No website
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {b.rating ? (
                            <span className={b.rating < 3 ? "text-red-600 font-medium" : "text-gray-600"}>
                              {b.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => deleteSingle(b.id, b.name)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {businesses.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No businesses found
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} ({total.toLocaleString()} total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
