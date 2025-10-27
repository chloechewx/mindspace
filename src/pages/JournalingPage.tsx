import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, TrendingUp, Calendar, Sparkles, Heart, Smile, Meh, Frown, CloudRain } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { supabase } from '../lib/supabase';

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  title: string;
  content: string;
  gratitude: string;
  goals: string;
  created_at: string;
}

interface MoodStats {
  average: number;
  trend: 'up' | 'down' | 'stable';
  mostCommon: number;
}

const moodEmojis = [
  { value: 1, icon: CloudRain, label: 'Struggling', color: 'text-gray-500' },
  { value: 2, icon: Frown, label: 'Low', color: 'text-blue-500' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-green-500' },
  { value: 5, icon: Heart, label: 'Great', color: 'text-pink-500' },
];

export const JournalingPage: React.FC = () => {
  const { user } = useUserStore();
  const [activeView, setActiveView] = useState<'write' | 'entries' | 'analysis'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);

  // Form state
  const [mood, setMood] = useState<number>(3);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [goals, setGoals] = useState('');

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      setEntries(data || []);
      calculateMoodStats(data || []);
    } catch (error) {
      console.error('Failed to load entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMoodStats = (entries: JournalEntry[]) => {
    if (entries.length === 0) {
      setMoodStats(null);
      return;
    }

    const moods = entries.map(e => e.mood);
    const average = moods.reduce((a, b) => a + b, 0) / moods.length;
    
    // Calculate trend (last 7 vs previous 7)
    const recent = moods.slice(0, 7);
    const previous = moods.slice(7, 14);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : recentAvg;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > previousAvg + 0.3) trend = 'up';
    else if (recentAvg < previousAvg - 0.3) trend = 'down';

    // Most common mood
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const mostCommon = parseInt(Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]);

    setMoodStats({ average, trend, mostCommon });
  };

  const handleSaveEntry = async () => {
    if (!user || !content.trim()) {
      alert('Please write something in your journal entry');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          mood,
          title: title.trim() || 'Untitled Entry',
          content: content.trim(),
          gratitude: gratitude.trim(),
          goals: goals.trim(),
        });

      if (error) throw error;

      // Reset form
      setTitle('');
      setContent('');
      setGratitude('');
      setGoals('');
      setMood(3);

      // Reload entries
      await loadEntries();
      
      // Switch to entries view
      setActiveView('entries');
      
      alert('✅ Journal entry saved successfully!');
    } catch (error: any) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMoodEmoji = (moodValue: number) => {
    const mood = moodEmojis.find(m => m.value === moodValue) || moodEmojis[2];
    const Icon = mood.icon;
    return <Icon className={`w-6 h-6 ${mood.color}`} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sage-100 to-lavender-100 px-6 py-3 rounded-full">
          <BookOpen className="w-6 h-6 text-sage-600" />
          <span className="text-sage-700 font-semibold text-lg">Your Personal Journal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
          Express, Reflect, Grow
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A safe space to capture your thoughts, track your mood, and discover patterns in your journey
        </p>
      </div>

      {/* View Tabs */}
      <div className="flex gap-4 justify-center">
        {[
          { id: 'write', label: 'Write Entry', icon: BookOpen },
          { id: 'entries', label: 'Past Entries', icon: Calendar },
          { id: 'analysis', label: 'Insights', icon: Brain },
        ].map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeView === view.id
                  ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {view.label}
            </button>
          );
        })}
      </div>

      {/* Write Entry View */}
      {activeView === 'write' && (
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-lavender-500" />
            <h2 className="text-2xl font-serif font-semibold text-gray-800">
              How are you feeling today?
            </h2>
          </div>

          {/* Mood Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Your Mood</label>
            <div className="flex gap-4 justify-center">
              {moodEmojis.map((moodOption) => {
                const Icon = moodOption.icon;
                return (
                  <button
                    key={moodOption.value}
                    onClick={() => setMood(moodOption.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      mood === moodOption.value
                        ? 'bg-gradient-to-br from-sage-100 to-lavender-100 scale-110 shadow-lg'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${moodOption.color}`} />
                    <span className="text-xs font-medium text-gray-700">{moodOption.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Entry Title (Optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Main Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">What's on your mind?</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely... your thoughts, feelings, experiences..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          {/* Gratitude */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">What are you grateful for?</label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="List 3 things you're grateful for today..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          {/* Goals */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Goals for tomorrow</label>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="What do you want to accomplish tomorrow?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveEntry}
            disabled={isSaving || !content.trim()}
            className="w-full py-4 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                Save Entry
              </>
            )}
          </button>
        </div>
      )}

      {/* Past Entries View */}
      {activeView === 'entries' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">No entries yet</h3>
              <p className="text-gray-600 mb-6">Start your journaling journey today!</p>
              <button
                onClick={() => setActiveView('write')}
                className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Write Your First Entry
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getMoodEmoji(entry.mood)}
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-gray-800">{entry.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{entry.content}</p>
                  {entry.gratitude && (
                    <div className="bg-sage-50 rounded-xl p-4 mb-3">
                      <p className="text-sm font-semibold text-sage-700 mb-1">Grateful for:</p>
                      <p className="text-sm text-gray-700">{entry.gratitude}</p>
                    </div>
                  )}
                  {entry.goals && (
                    <div className="bg-lavender-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-lavender-700 mb-1">Goals:</p>
                      <p className="text-sm text-gray-700">{entry.goals}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analysis View */}
      {activeView === 'analysis' && (
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Not enough data yet</h3>
              <p className="text-gray-600 mb-6">Write a few entries to see your insights and patterns</p>
              <button
                onClick={() => setActiveView('write')}
                className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Start Journaling
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mood Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-sage-600" />
                  <h3 className="text-xl font-serif font-semibold text-gray-800">Mood Overview</h3>
                </div>
                {moodStats && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-sage-50 rounded-xl">
                      <span className="text-gray-700 font-medium">Average Mood</span>
                      <div className="flex items-center gap-2">
                        {getMoodEmoji(Math.round(moodStats.average))}
                        <span className="text-2xl font-bold text-sage-600">{moodStats.average.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-lavender-50 rounded-xl">
                      <span className="text-gray-700 font-medium">Trend</span>
                      <span className={`text-2xl font-bold ${
                        moodStats.trend === 'up' ? 'text-green-600' : 
                        moodStats.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {moodStats.trend === 'up' ? '↗️ Improving' : 
                         moodStats.trend === 'down' ? '↘️ Declining' : 
                         '→ Stable'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blush-50 rounded-xl">
                      <span className="text-gray-700 font-medium">Most Common</span>
                      <div className="flex items-center gap-2">
                        {getMoodEmoji(moodStats.mostCommon)}
                        <span className="text-sm text-gray-600">
                          {moodEmojis.find(m => m.value === moodStats.mostCommon)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Journaling Streak */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-lavender-600" />
                  <h3 className="text-xl font-serif font-semibold text-gray-800">Your Progress</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-sage-50 to-lavender-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Total Entries</p>
                    <p className="text-5xl font-bold text-sage-600">{entries.length}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-lavender-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">This Week</p>
                      <p className="text-2xl font-bold text-lavender-600">
                        {entries.filter(e => {
                          const entryDate = new Date(e.created_at);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return entryDate >= weekAgo;
                        }).length}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blush-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">This Month</p>
                      <p className="text-2xl font-bold text-blush-600">
                        {entries.filter(e => {
                          const entryDate = new Date(e.created_at);
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return entryDate >= monthAgo;
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl shadow-lg p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-6 h-6 text-sage-600" />
                  <h3 className="text-xl font-serif font-semibold text-gray-800">Insights & Patterns</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-700">
                      <strong className="text-sage-600">Consistency:</strong> You've been journaling regularly! 
                      Keep up the great work - consistent reflection helps build self-awareness.
                    </p>
                  </div>
                  {moodStats && moodStats.trend === 'up' && (
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-gray-700">
                        <strong className="text-green-600">Positive Trend:</strong> Your mood has been improving lately. 
                        This is wonderful progress! Consider what's been working well for you.
                      </p>
                    </div>
                  )}
                  {moodStats && moodStats.trend === 'down' && (
                    <div className="bg-white rounded-xl p-4">
                      <p className="text-gray-700">
                        <strong className="text-orange-600">Gentle Reminder:</strong> Your mood has been lower recently. 
                        Remember to be kind to yourself and reach out for support if needed.
                      </p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-gray-700">
                      <strong className="text-lavender-600">Gratitude Practice:</strong> 
                      {entries.filter(e => e.gratitude).length > 0 
                        ? ` You've practiced gratitude in ${entries.filter(e => e.gratitude).length} entries. Research shows this can boost happiness!`
                        : ' Try adding gratitude to your entries - it can significantly improve your mood!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
