import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Sparkles, Send, ArrowRight, Check } from 'lucide-react';

export const AiSearchAssistantModal: React.FC = () => {
  const {
    aiSearchModalOpen,
    setAiSearchModalOpen,
    setSelectedCity,
    setCurrentView,
    addToast,
  } = useApp();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);

  if (!aiSearchModalOpen) return null;

  const quickExamples = [
    '2 bedroom pet-friendly apartment in San Francisco under $4,000 with in-unit laundry',
    'Modern high-rise condo in Austin near Downtown under $2,700 with parking',
    'Luxury 2-bed in New York Williamsburg under $4,800',
    'Quiet 1 bedroom studio in Seattle near tech offices under $2,500',
  ];

  const handleSearch = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    try {
      setLoading(true);
      const res = await api.aiSearchParse(textToSearch);
      setAiResponse(res.filters);

      // Apply city filter
      if (res.filters.city && res.filters.city !== 'ALL') {
        setSelectedCity(res.filters.city);
      }

      addToast('AI Search Applied', `Configured filters: ${res.filters.summary || textToSearch}`, 'success');
      setCurrentView('MARKETPLACE');
      setTimeout(() => {
        setAiSearchModalOpen(false);
      }, 1200);
    } catch (err) {
      console.error('AI search failed:', err);
      addToast('Search Failed', 'Could not parse query via AI. Fallback applied.', 'alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                Nestryy AI Rental Matcher
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Describe your dream home in plain English. Gemini AI converts it into precise verified filters.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiSearchModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Find me a 2-bedroom pet-friendly flat in San Francisco with parking and a dishwasher under $3,800/month..."
              className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400">Powered by Gemini 3.8 Flash</span>
            <button
              onClick={() => handleSearch(query)}
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {loading ? (
                <span>Parsing with AI...</span>
              ) : (
                <>
                  <span>Find Homes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
            Popular Prompts:
          </span>
          <div className="space-y-1.5">
            {quickExamples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(ex);
                  handleSearch(ex);
                }}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-between"
              >
                <span>&ldquo;{ex}&rdquo;</span>
                <ArrowRight className="w-3 h-3 text-stone-400" />
              </button>
            ))}
          </div>
        </div>

        {aiResponse && (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-900 dark:text-teal-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Match applied: {aiResponse.summary || 'Filters updated successfully!'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
