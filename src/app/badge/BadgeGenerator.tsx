"use client";

import { useState, useMemo } from "react";
import { Plumber } from "@/lib/types";

interface BadgeGeneratorProps {
  plumbers: Plumber[];
}

type BadgeStyle = "standard" | "compact" | "minimal";
type BadgeTheme = "dark" | "light" | "gold";

export default function BadgeGenerator({ plumbers }: BadgeGeneratorProps) {
  const [search, setSearch] = useState("");
  const [selectedPlumber, setSelectedPlumber] = useState<Plumber | null>(null);
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>("standard");
  const [badgeTheme, setBadgeTheme] = useState<BadgeTheme>("dark");
  const [copied, setCopied] = useState(false);

  const filteredPlumbers = useMemo(() => {
    if (!search.trim()) return [];
    const searchLower = search.toLowerCase();
    return plumbers
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.city.toLowerCase().includes(searchLower)
      )
      .slice(0, 8);
  }, [search, plumbers]);

  const profileUrl = selectedPlumber
    ? `https://mnplumb.com/profile/${selectedPlumber.slug}`
    : "";

  const getBadgeSvg = () => {
    const themes = {
      dark: { bg: "#1a1a2e", text: "#ffffff", accent: "#d4a853" },
      light: { bg: "#ffffff", text: "#1a1a2e", accent: "#d4a853" },
      gold: { bg: "#d4a853", text: "#1a1a2e", accent: "#1a1a2e" },
    };
    const t = themes[badgeTheme];

    if (badgeStyle === "minimal") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40">
  <rect width="120" height="40" rx="6" fill="${t.bg}"/>
  <text x="10" y="25" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="${t.accent}">MN</text>
  <text x="30" y="25" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="${t.text}">Plumb Verified</text>
</svg>`;
    }

    if (badgeStyle === "compact") {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 150 50">
  <rect width="150" height="50" rx="8" fill="${t.bg}"/>
  <circle cx="25" cy="25" r="15" fill="${t.accent}"/>
  <text x="25" y="30" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="${t.bg}" text-anchor="middle">MN</text>
  <text x="85" y="22" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="${t.text}" text-anchor="middle">PLUMB</text>
  <text x="85" y="36" font-family="system-ui, sans-serif" font-size="10" font-weight="500" fill="${t.accent}" text-anchor="middle">VERIFIED</text>
</svg>`;
    }

    // Standard badge
    return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="70" viewBox="0 0 200 70">
  <rect width="200" height="70" rx="10" fill="${t.bg}"/>
  <circle cx="35" cy="35" r="22" fill="${t.accent}"/>
  <text x="35" y="41" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="${t.bg}" text-anchor="middle">MN</text>
  <text x="120" y="30" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="${t.text}" text-anchor="middle">MN PLUMB</text>
  <text x="120" y="48" font-family="system-ui, sans-serif" font-size="12" font-weight="500" fill="${t.accent}" text-anchor="middle">✓ VERIFIED</text>
</svg>`;
  };

  const getEmbedCode = () => {
    if (!selectedPlumber) return "";
    const svg = getBadgeSvg();
    const encodedSvg = encodeURIComponent(svg);
    const dataUri = `data:image/svg+xml,${encodedSvg}`;

    return `<!-- MN Plumb Verified Badge -->
<a href="${profileUrl}" target="_blank" rel="noopener" title="${selectedPlumber.name} on MN Plumb Directory">
  <img src="${dataUri}" alt="MN Plumb Verified - ${selectedPlumber.name}" style="max-width: 100%; height: auto;" />
</a>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Find Your Business */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
          Step 1: Find Your Business
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by business name or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedPlumber(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a853] focus:border-transparent"
          />
          {filteredPlumbers.length > 0 && !selectedPlumber && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {filteredPlumbers.map((plumber) => (
                <button
                  key={plumber.id}
                  onClick={() => {
                    setSelectedPlumber(plumber);
                    setSearch(plumber.name);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-[#1a1a2e]">
                    {plumber.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plumber.city}, MN
                    {plumber.rating && ` • ${plumber.rating} stars`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedPlumber && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <div className="font-medium text-green-800">
                  {selectedPlumber.name}
                </div>
                <div className="text-sm text-green-600">
                  {selectedPlumber.city}, MN
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Customize Badge */}
      {selectedPlumber && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
            Step 2: Customize Your Badge
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Style
              </label>
              <div className="space-y-2">
                {(["standard", "compact", "minimal"] as BadgeStyle[]).map(
                  (style) => (
                    <button
                      key={style}
                      onClick={() => setBadgeStyle(style)}
                      className={`w-full px-4 py-2 text-left rounded-lg border ${
                        badgeStyle === style
                          ? "border-[#d4a853] bg-[#d4a853]/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="capitalize font-medium">{style}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {style === "standard" && "(200×70px)"}
                        {style === "compact" && "(150×50px)"}
                        {style === "minimal" && "(120×40px)"}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Theme
              </label>
              <div className="space-y-2">
                {(["dark", "light", "gold"] as BadgeTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setBadgeTheme(theme)}
                    className={`w-full px-4 py-2 text-left rounded-lg border flex items-center gap-3 ${
                      badgeTheme === theme
                        ? "border-[#d4a853] bg-[#d4a853]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded ${
                        theme === "dark"
                          ? "bg-[#1a1a2e]"
                          : theme === "light"
                          ? "bg-white border border-gray-300"
                          : "bg-[#d4a853]"
                      }`}
                    />
                    <span className="capitalize font-medium">{theme}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div
              className={`p-8 rounded-lg flex items-center justify-center ${
                badgeTheme === "dark" ? "bg-gray-100" : "bg-[#1a1a2e]"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: getBadgeSvg() }}
                className="inline-block"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Get Embed Code */}
      {selectedPlumber && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#1a1a2e] mb-4">
            Step 3: Copy Embed Code
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Add this code to your website to display your verified badge. It
            links back to your MN Plumb profile.
          </p>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{getEmbedCode()}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className={`absolute top-2 right-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Place the badge in your website footer or
              sidebar for best visibility. The badge links to your profile at{" "}
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {profileUrl}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
