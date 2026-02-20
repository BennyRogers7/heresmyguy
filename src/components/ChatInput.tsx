'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-[#fafaf8] border border-gray-200 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#e5a527] focus:ring-2 focus:ring-[#e5a527]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="p-3 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>
  );
}
