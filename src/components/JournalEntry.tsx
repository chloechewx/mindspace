import React, { useState } from 'react';
import { Save, Sparkles, Heart, Target } from 'lucide-react';
import { useDiaryStore } from '../store/diaryStore';
import { MoodType } from '../types';
import { generateAIInsights } from '../services/aiService';
import { SectionDivider } from './SectionDivider';

export const JournalEntry: React.FC = () => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('neutral');
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [goals, setGoals] = useState(['']);
  const [isGenerating, setIsGenerating] = useState(false);
  const addEntry = useDiaryStore((state) => state.addEntry);

  const moods: { value: MoodType; label: string; emoji: string; color: string }[] = [
    { value: 'excellent', label: 'Wonderful', emoji: '🌟', color: 'bg-lavender-200 border-lavender-300 text-lavender-800' },
    { value: 'good', label: 'Good', emoji: '😊', color: 'bg-sage-200 border-sage-300 text-sage-800' },
    { value: 'neutral', label: 'Okay', emoji: '😐', color: 'bg-cream-300 border-cream-400 text-cream-900' },
    { value: 'low', label: 'Low', emoji: '😔', color: 'bg-blush-200 border-blush-300 text-blush-800' },
    { value: 'struggling', label: 'Struggling', emoji: '💙', color: 'bg-lavender-300 border-lavender-400 text-lavender-900' },
  ];

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    const aiInsights = await generateAIInsights(content, mood);
    setIsGenerating(false);

    addEntry({
      date: new Date(),
      content,
      mood,
      tags: [],
      aiInsights,
      gratitude: gratitude.filter(g => g.trim()),
      goals: goals.filter(g => g.trim()),
    });

    setContent('');
    setMood('neutral');
    setGratitude(['', '', '']);
    setGoals(['']);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Mood Selector */}
      <section className="soft-card p-8 md:p-10">
        <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-3 text-gray-800">
          How are you feeling today?
        </h3>
        <p className="text-gray-600 mb-8 text-lg">Choose the emotion that resonates with you right now</p>
        
        <div className="flex flex-wrap gap-4">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className={`
                flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 border-2
                ${mood === m.value 
                  ? `${m.color} shadow-[0_6px_20px_rgba(0,0,0,0.12)] scale-105` 
                  : 'bg-white border-sage-200 text-gray-700 hover:border-sage-300 hover:scale-105 shadow-sm'
                }
              `}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Main Journal Entry */}
      <section className="soft-card p-8 md:p-10 bg-gradient-to-br from-sage-50 to-cream-50">
        <h3 className="text-3xl md:text-4xl font-serif font-semibold mb-3 text-gray-800">
          What's on your mind?
        </h3>
        <p className="text-gray-600 mb-6 text-lg">Share your thoughts, feelings, and experiences freely</p>
        
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Today I feel... I'm thinking about... I'm grateful for..."
          className="w-full h-72 p-6 rounded-3xl border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all duration-300 resize-none text-lg bg-white shadow-sm text-gray-800"
        />
      </section>

      <SectionDivider variant="curve" />

      {/* Gratitude Section */}
      <section className="soft-card p-8 md:p-10 bg-gradient-to-br from-blush-50 to-cream-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-blush-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-serif font-semibold text-gray-800">Gratitude Practice</h3>
            <p className="text-gray-600 text-sm">Three things that brought you joy today</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {gratitude.map((item, index) => (
            <div key={index} className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-blush-500 font-semibold">
                {index + 1}.
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newGratitude = [...gratitude];
                  newGratitude[index] = e.target.value;
                  setGratitude(newGratitude);
                }}
                placeholder="Something you're grateful for..."
                className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-sage-200 focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition-all duration-300 bg-white shadow-sm text-gray-800"
              />
            </div>
          ))}
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Goals Section */}
      <section className="soft-card p-8 md:p-10 bg-gradient-to-br from-lavender-50 to-sage-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-3xl font-serif font-semibold text-gray-800">Today's Intentions</h3>
            <p className="text-gray-600 text-sm">What would you like to focus on?</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal, index) => (
            <input
              key={index}
              type="text"
              value={goal}
              onChange={(e) => {
                const newGoals = [...goals];
                newGoals[index] = e.target.value;
                setGoals(newGoals);
              }}
              placeholder="An intention or goal for today..."
              className="w-full px-6 py-4 rounded-full border-2 border-sage-200 focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 transition-all duration-300 bg-white shadow-sm text-gray-800"
            />
          ))}
          <button
            onClick={() => setGoals([...goals, ''])}
            className="text-lavender-700 hover:text-lavender-800 font-semibold transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add another intention
          </button>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-center py-8">
        <button
          onClick={handleSave}
          disabled={!content.trim() || isGenerating}
          className="btn-warm flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed px-12 py-4"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-6 h-6 animate-spin" />
              <span>Creating your insights...</span>
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              <span>Save & Get AI Insights</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
