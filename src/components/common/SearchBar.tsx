import React, { useState, useEffect, useRef } from 'react';
import { Search, Train as TrainIcon, History, X, ArrowRight, Sparkles } from 'lucide-react';
import type { Train } from '../../types';
import { railService } from '../../services/railService';
import { useAppStore } from '../../stores/useAppStore';

interface SearchBarProps {
  onSelectTrain?: (train: Train) => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectTrain, autoFocus = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Train[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setSelectedTrainNumber = useAppStore((s) => s.setSelectedTrainNumber);
  const recentSearches = useAppStore((s) => s.recentSearches);
  const addRecentSearch = useAppStore((s) => s.addRecentSearch);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search logic (250ms)
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const results = await railService.searchTrains(query);
        setSuggestions(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (train: Train) => {
    setSelectedTrainNumber(train.trainNumber);
    addRecentSearch(train);
    setIsOpen(false);
    setQuery('');
    if (onSelectTrain) onSelectTrain(train);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      {/* Input Field */}
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-blue-600" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search train number (e.g. 12951) or train name..."
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-3.5 bg-white/90 backdrop-blur-md text-slate-900 placeholder-slate-400 text-base font-medium rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Active Query Suggestions */}
          {query.trim().length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Matching Trains
              </div>

              {isLoading ? (
                <div className="px-4 py-6 text-center text-slate-400 text-sm animate-pulse">
                  Searching live railway database...
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((train) => (
                  <button
                    key={train.trainNumber}
                    onClick={() => handleSelect(train)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50/70 flex items-center justify-between group transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                        🚆
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          <span>{train.trainNumber}</span>
                          <span className="text-slate-400 text-xs font-normal">|</span>
                          <span className="truncate">{train.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {train.source} ({train.sourceCode}) → {train.destination} ({train.destinationCode})
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-slate-500 text-sm">
                  No trains found matching <span className="font-semibold">"{query}"</span>.
                  <div className="text-xs text-slate-400 mt-1">Try train number (12951, 20901) or name.</div>
                </div>
              )}
            </div>
          ) : (
            /* Recent Searches when Query is Empty */
            <div className="py-2">
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    Recent Searches
                  </div>
                  {recentSearches.map((train) => (
                    <button
                      key={`recent-${train.trainNumber}`}
                      onClick={() => handleSelect(train)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <TrainIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        <span className="font-medium text-slate-800 group-hover:text-blue-600 text-sm">
                          {train.trainNumber} - {train.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{train.sourceCode} → {train.destinationCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
