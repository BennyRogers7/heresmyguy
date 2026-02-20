'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { City, Plumber, ChatState, ChatMessage as ChatMessageType } from '@/lib/types';
import {
  createInitialState,
  processUserInput,
  addFollowupMessage,
  ProcessResult,
} from '@/lib/chatFlow';
import { matchPlumbers, MatchResult } from '@/lib/matcher';
import ChatMessage from './ChatMessage';
import ChatResults from './ChatResults';
import ThinkingIndicator from './ThinkingIndicator';

interface ChatProps {
  cities: City[];
  plumbers: Plumber[];
}

export default function Chat({ cities, plumbers }: ChatProps) {
  const [chatState, setChatState] = useState<ChatState>(() => createInitialState());
  const [matchResults, setMatchResults] = useState<MatchResult | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    // Only scroll if near the bottom already (don't jump while user is reading)
    const container = messagesEndRef.current?.parentElement;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
      if (isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    // Scroll when messages change, not during thinking
    if (!isThinking) {
      scrollToBottom();
    }
  }, [chatState.messages, matchResults, scrollToBottom, isThinking]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isThinking) return;

    setInput('');
    setHasStarted(true);

    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: Math.random().toString(36).substring(2, 11),
      type: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    // Show thinking indicator
    setIsThinking(true);

    // Simulate thinking delay (800-1500ms)
    const thinkingDelay = 800 + Math.random() * 700;
    await new Promise(resolve => setTimeout(resolve, thinkingDelay));

    // Process the input
    const result: ProcessResult = processUserInput(chatState, trimmedInput, cities);

    setIsThinking(false);

    // Update state with bot response
    setChatState(result.newState);

    // If we should show results, calculate matches
    if (result.showResults && result.newState.intent.citySlug) {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsThinking(false);

      const results = matchPlumbers(result.newState.intent, plumbers);
      setMatchResults(results);

      setTimeout(() => {
        setChatState(prev => addFollowupMessage(prev));
      }, 1500);
    }
  }, [input, isThinking, chatState, cities, plumbers]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleStartOver = useCallback(() => {
    setChatState(createInitialState());
    setMatchResults(null);
    setIsThinking(false);
    setHasStarted(false);
  }, []);

  // Initial "Copilot-style" open input
  if (!hasStarted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed">
                What plumbing issue can I help you with?
              </p>
            </div>

            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your plumbing problem..."
                rows={2}
                className="w-full px-5 py-4 bg-[#fafaf8] border border-gray-200 rounded-xl text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:border-[#e5a527] focus:ring-2 focus:ring-[#e5a527]/20 transition-all resize-none"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Powered by Websimple AI
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Conversational chat view - wider when showing results
  const hasResults = matchResults !== null;

  return (
    <div className={`w-full mx-auto transition-all duration-300 ${hasResults ? 'max-w-5xl' : 'max-w-4xl'}`}>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Messages Container - taller when showing results */}
        <div className={`overflow-y-auto p-4 md:p-6 bg-[#fafaf8] transition-all duration-300 ${hasResults ? 'h-[600px] md:h-[700px]' : 'h-[500px] md:h-[550px]'}`}>
          {chatState.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isThinking && <ThinkingIndicator />}

          {matchResults && !isThinking && (
            <ChatResults
              plumbers={matchResults.plumbers}
              city={matchResults.city}
              matchedService={matchResults.matchedService}
              onStartOver={handleStartOver}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={isThinking}
              className="w-full px-4 py-3 pr-12 bg-[#fafaf8] border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e5a527] focus:ring-2 focus:ring-[#e5a527]/20 transition-all resize-none disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isThinking}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#e85d04] to-[#f77f3a] text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Powered by Websimple AI
          </p>
        </div>
      </div>
    </div>
  );
}
