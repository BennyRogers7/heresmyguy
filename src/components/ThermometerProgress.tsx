"use client";

import { useEffect, useState } from "react";

interface ThermometerProgressProps {
  current: number;
  threshold: number;
  animate?: boolean;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ThermometerProgress({
  current,
  threshold,
  animate = false,
  showLabels = true,
  size = "md",
}: ThermometerProgressProps) {
  const [displayPercent, setDisplayPercent] = useState(animate ? 0 : Math.min((current / threshold) * 100, 100));
  const percent = Math.min((current / threshold) * 100, 100);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setDisplayPercent(percent);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayPercent(percent);
    }
  }, [percent, animate]);

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Color based on progress
  const getColor = (pct: number) => {
    if (pct >= 100) return "bg-green-500";
    if (pct >= 75) return "bg-[#d4a853]";
    if (pct >= 50) return "bg-amber-400";
    if (pct >= 25) return "bg-orange-400";
    return "bg-orange-500";
  };

  return (
    <div className="w-full">
      {/* Progress bar container */}
      <div className={`w-full ${heights[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${getColor(displayPercent)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${displayPercent}%` }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className={`flex justify-between items-center mt-2 ${textSizes[size]}`}>
          <span className="text-gray-600">
            <span className="font-semibold text-[#1a1a2e]">{current.toLocaleString()}</span>
            {" / "}
            <span>{threshold.toLocaleString()}</span>
            {" votes"}
          </span>
          <span className="font-semibold text-[#d4a853]">
            {Math.round(displayPercent)}% to launch
          </span>
        </div>
      )}
    </div>
  );
}
