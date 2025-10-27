import React, { useState } from 'react';
import { Sparkles, Heart, Target, Send, Loader2 } from 'lucide-react';
import { useDiaryStore } from '../../store/diaryStore';
import { useUserStore } from '../../store/userStore';
import { useAuthModalStore } from '../../store/authModalStore';
import { AuthModal } from '../AuthModal';
import { AIInsights } from './AIInsights';

const moods = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '😌', label: 'Calm', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😔', label: 'Sad', value: 2 },
  { emoji: '😰', label: 'Anxious', value: 1 },
];

export const JournalEntry: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [gratitude, setGratitude] = useState('');
  const [intentions, setIntentions] = useState('');
  const [thoughts, setThoughts] = useState('');
  const [showInsights, setShowInsights] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  
  const { addEntry, isLoading } = useDiaryStore();
  const { isAuthenticated } = useUserStore();
  const { isOpen, actionDescription, openAuthModal, closeAuthModal, executePendingAction } = useAuthModalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      openAuthModal(
        'Sign up to save your journal entry and unlock AI insights',
        () => submitEntry()
      );
      return;
    }
    
    await submitEntry();
  };

  const submitEntry = async () => {
    if (selectedMood === null) {
      alert('Please select your mood');
      return;
    }
    
    try {
      const entry = {
        mood: selectedMood,
        gratitude: gratitude.trim(),
        intentions: intentions.trim(),
        thoughts: thoughts.trim(),
      };
      
      await addEntry(entry);
      
      // Get the newly added entry ID
      const { entries } = useDiaryStore.getState();
      if (entries.length > 0) {
        setCurrentEntryId(entries[0].id);
        setShowInsights(true);
      }
      
      // Reset form
      setSelectedMood(null);
      setGratitude('');
      setIntentions('');
      setThoughts('');
      
      // Show success message
      alert('Journal entry saved successfully! 🎉 AI insights are being generated...');
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleAuthSuccess = () => {
    closeAuthModal();
    executePendingAction();
  };

  return (
    <>
      <section className="soft-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl">
            <Sparkles className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">Today's Check-In</h3>
            <p className="text-gray-600">How are you feeling right now?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Your Mood
            </label>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`
                    p-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500
                    ${selectedMood === mood.value
                      ? 'border-sage-500 bg-sage-50 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-sage-300 hover:bg-sage-50/50'
                    }
                  `}
                  aria-label={`Select ${mood.label} mood`}
                  aria-pressed={selectedMood === mood.value}
                >
                  <div className="text-4xl mb-2">{mood.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gratitude */}
          <div>
            <label htmlFor="gratitude" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Heart className="w-4 h-4 text-blush-500" />
              What are you grateful for today?
            </label>
            <textarea
              id="gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="I'm grateful for..."
            />
          </div>

          {/* Intentions */}
          <div>
            <label htmlFor="intentions" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Target className="w-4 h-4 text-lavender-500" />
              What are your intentions for today?
            </label>
            <textarea
              id="intentions"
              value={intentions}
              onChange={(e) => setIntentions(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Today I intend to..."
            />
          </div>

          {/* Thoughts */}
          <div>
            <label htmlFor="thoughts" className="block text-sm font-semibold text-gray-700 mb-3">
              Additional thoughts or reflections
            </label>
            <textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="What's on your mind?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={selectedMood === null || isLoading}
            className="w-full py-4 bg-gradient-to-r from-sage-500 to-lavender-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Entry...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Save Entry & Get AI Insights
              </>
            )}
          </button>
        </form>
      </section>

      {/* AI Insights Section */}
      {showInsights && currentEntryId && (
        <AIInsights entryId={currentEntryId} />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isOpen}
        onClose={closeAuthModal}
        onSuccess={handleAuthSuccess}
        actionDescription={actionDescription}
      />
    </>
  );
};
