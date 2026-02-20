'use client';

export default function ThinkingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e5a527] to-[#e85d04] flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <div className="px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm">
          <div className="flex items-center gap-1">
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', animationDuration: '600ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', animationDuration: '600ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', animationDuration: '600ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
