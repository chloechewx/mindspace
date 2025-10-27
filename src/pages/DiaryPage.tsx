import React, { useEffect, useState } from 'react';
import { JournalEntry } from '../components/diary/JournalEntry';
import { EntryList } from '../components/diary/EntryList';
import { AIInsights } from '../components/diary/AIInsights';
import { useDiaryStore } from '../store/diaryStore';
import { useUserStore } from '../store/userStore';
import { Calendar, TrendingUp } from 'lucide-react';

export const DiaryPage: React.FC = () => {
  const { loadEntries, entries } = useDiaryStore();
  const { isAuthenticated } = useUserStore();
  const [showWeeklyReflection, setShowWeeklyReflection] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadEntries();
    }
  }, [isAuthenticated, loadEntries]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-lavender-50 to-blush-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-4 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-3xl">
              <Calendar className="w-8 h-8 text-sage-600" />
            </div>
            <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-sage-600 to-lavender-600 bg-clip-text text-transparent">
              Your Wellness Journal
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reflect on your day, track your mood, and receive AI-powered insights to support your mental wellness journey
          </p>
        </div>

        {/* Weekly Reflection Toggle */}
        {isAuthenticated && entries.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowWeeklyReflection(!showWeeklyReflection)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5" />
              {showWeeklyReflection ? 'Hide' : 'View'} Weekly Reflection
            </button>
          </div>
        )}

        {/* Weekly Reflection */}
        {showWeeklyReflection && (
          <AIInsights showWeekly={true} />
        )}

        {/* Journal Entry Form */}
        <JournalEntry />

        {/* Past Entries */}
        {isAuthenticated && <EntryList />}
      </div>
    </div>
  );
};
