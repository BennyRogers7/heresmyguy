"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plumber } from "@/lib/types";

interface HeaderSearchProps {
  plumbers: Plumber[];
}

export default function HeaderSearch({ plumbers }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Plumber[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = plumbers
      .filter((p) => p.name.toLowerCase().includes(searchTerm))
      .slice(0, 6);

    setResults(filtered);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:text-[#e5a527] transition-colors"
        aria-label="Search plumbers"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search plumber by name..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#e5a527] text-sm"
            />
          </div>

          {results.length > 0 && (
            <div className="max-h-72 overflow-y-auto">
              {results.map((plumber) => (
                <Link
                  key={plumber.id}
                  href={`/profile/${plumber.slug}`}
                  onClick={handleClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#fafaf8] transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{plumber.name}</p>
                    <p className="text-xs text-gray-500">{plumber.city}, MN</p>
                  </div>
                  {plumber.rating && (
                    <div className="flex items-center gap-1 text-xs text-[#e5a527]">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{plumber.rating.toFixed(1)}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No plumbers found matching "{query}"
            </div>
          )}

          {query.length < 2 && (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      )}
    </div>
  );
}
