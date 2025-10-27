import React from 'react';
import { Sparkles, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { useDiaryStore } from '../../store/diaryStore';

interface AIInsightsProps {
  entryId?: string;
  showWeekly?: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ entryId, showWeekly = false }) => {
  const { insights, weeklyReflection, isGeneratingInsights, generateInsights, generateWeeklyReflection } = useDiaryStore();

  const handleRegenerateInsights = async () => {
    if (!entryId) return;
    
    try {
      await generateInsights(entryId);
    } catch (error) {
      console.error('Failed to regenerate insights:', error);
      alert('Failed to generate insights. Please try again.');
    }
  };

  const handleGenerateWeekly = async () => {
    try {
      await generateWeeklyReflection();
    } catch (error) {
      console.error('Failed to generate weekly reflection:', error);
      alert('Failed to generate weekly reflection. Please try again.');
    }
  };

  if (showWeekly) {
    return (
      <section className="soft-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-semibold text-gray-800">Weekly Reflection</h3>
              <p className="text-gray-600">AI-powered insights from your week</p>
            </div>
          </div>
          <button
            onClick={handleGenerateWeekly}
            disabled={isGeneratingInsights}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate weekly reflection"
          >
            {isGeneratingInsights ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
        </div>

        {isGeneratingInsights ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto" />
              <p className="text-gray-600 font-medium">Analyzing your week...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </div>
          </div>
        ) : weeklyReflection ? (
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{weeklyReflection}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Generate your weekly reflection to see patterns and insights</p>
            <button
              onClick={handleGenerateWeekly}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Generate Weekly Reflection
            </button>
          </div>
        )}
      </section>
    );
  }

  if (!insights && !isGeneratingInsights) {
    return null;
  }

  return (
    <section className="soft-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl">
            <Sparkles className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">AI Insights</h3>
            <p className="text-gray-600">Personalized reflections on your entry</p>
          </div>
        </div>
        {entryId && (
          <button
            onClick={handleRegenerateInsights}
            disabled={isGeneratingInsights}
            className="p-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Regenerate insights"
          >
            {isGeneratingInsights ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {isGeneratingInsights ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-sage-500 animate-spin mx-auto" />
            <p className="text-gray-600 font-medium">Generating insights...</p>
            <p className="text-sm text-gray-500">Our AI is analyzing your entry</p>
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-6 border border-sage-100">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{insights}</p>
          </div>
        </div>
      )}
    </section>
  );
};
