import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, TrendingUp, Calendar, Sparkles, Heart, Smile, Meh, Frown, CloudRain, Lock, Trash2, AlertCircle, Loader2, Wand2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthModalStore } from '../store/authModalStore';
import { supabase } from '../lib/supabase';
import { generateJournalInsights } from '../services/geminiService';

interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  title: string;
  content: string;
  gratitude: string;
  goals: string;
  created_at: string;
  insights?: string;
}

interface MoodStats {
  average: number;
  trend: 'up' | 'down' | 'stable';
  mostCommon: number;
}

const moodEmojis = [
  { value: 1, icon: CloudRain, label: 'Struggling', color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' },
  { value: 2, icon: Frown, label: 'Low', color: 'text-blue-500', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-green-500', bgColor: 'bg-green-100', borderColor: 'border-green-300' },
  { value: 5, icon: Heart, label: 'Great', color: 'text-pink-500', bgColor: 'bg-pink-100', borderColor: 'border-pink-300' },
];

export const JournalPage: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useAuthModalStore();
  const [activeView, setActiveView] = useState<'write' | 'entries' | 'calendar' | 'analysis'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [generatingInsights, setGeneratingInsights] = useState<string | null>(null);
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Form state - mood is now null by default (no default selection)
  const [mood, setMood] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [goals, setGoals] = useState('');
  const [moodError, setMoodError] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated) {
      loadEntries();
    }
  }, [user, isAuthenticated]);

  const loadEntries = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

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
    
    const recent = moods.slice(0, 7);
    const previous = moods.slice(7, 14);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : recentAvg;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > previousAvg + 0.3) trend = 'up';
    else if (recentAvg < previousAvg - 0.3) trend = 'down';

    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const mostCommon = parseInt(Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]);

    setMoodStats({ average, trend, mostCommon });
  };

  const handleGenerateInsights = async (entryId: string, isRegeneration: boolean = false) => {
    if (!isAuthenticated || !user) {
      openModal('login', 'Please log in to generate AI insights');
      return;
    }

    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    setGeneratingInsights(entryId);
    try {
      const insights = await generateJournalInsights(
        entry.mood,
        entry.gratitude,
        entry.goals,
        entry.content,
        isRegeneration
      );

      const { error } = await supabase
        .from('journal_entries')
        .update({ insights })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries(prev => prev.map(e => 
        e.id === entryId ? { ...e, insights } : e
      ));

      setExpandedInsights(prev => new Set(prev).add(entryId));
    } catch (error: any) {
      console.error('Failed to generate insights:', error);
      alert('Failed to generate insights. Please try again.');
    } finally {
      setGeneratingInsights(null);
    }
  };

  const toggleInsights = (entryId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const handleSaveEntry = async () => {
    if (!isAuthenticated || !user) {
      openModal('login', 'Please log in to save your journal entry');
      return;
    }

    // Validate mood selection
    if (mood === null) {
      setMoodError(true);
      alert('⚠️ Please select your mood before saving');
      return;
    }

    if (!content.trim()) {
      alert('Please write something in your journal entry');
      return;
    }

    setIsSaving(true);
    setMoodError(false);
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

      setTitle('');
      setContent('');
      setGratitude('');
      setGoals('');
      setMood(null);

      await loadEntries();
      setActiveView('entries');
      
      alert('✅ Journal entry saved successfully!');
    } catch (error: any) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!isAuthenticated || !user) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadEntries();
      setDeleteConfirm(null);
      alert('✅ Entry deleted successfully');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    } finally {
      setIsDeleting(false);
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

  const getMoodConfig = (moodValue: number) => {
    return moodEmojis.find(m => m.value === moodValue) || moodEmojis[2];
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEntryForDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.find(e => e.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = getEntryForDate(year, month, day);
      const isToday = isCurrentMonth && today.getDate() === day;
      const moodConfig = entry ? getMoodConfig(entry.mood) : null;

      days.push(
        <div
          key={day}
          className={`aspect-square p-2 rounded-xl border-2 transition-all ${
            isToday ? 'ring-2 ring-sage-500 ring-offset-2' : ''
          } ${
            entry 
              ? `${moodConfig?.bgColor} ${moodConfig?.borderColor} hover:scale-105 cursor-pointer shadow-sm hover:shadow-md` 
              : 'bg-white border-gray-200'
          }`}
          title={entry ? `${entry.title} - ${moodConfig?.label}` : ''}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-sage-700' : 'text-gray-700'}`}>
              {day}
            </div>
            {entry && moodConfig && (
              <div className="text-xl">
                {React.createElement(moodConfig.icon, { className: `w-5 h-5 ${moodConfig.color}` })}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
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

      {/* Login Prompt for Non-Authenticated Users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-sage-50 to-lavender-50 border-2 border-sage-200 rounded-3xl p-8 text-center">
          <Lock className="w-12 h-12 text-sage-600 mx-auto mb-4" />
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
            Sign in to Save Your Entries
          </h3>
          <p className="text-gray-600 mb-6">
            You can explore the journal interface, but you'll need to log in to save your entries and track your progress over time.
          </p>
          <button
            onClick={() => openModal('login', 'Log in to start journaling')}
            className="px-8 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Log In to Start Journaling
          </button>
        </div>
      )}

      {/* View Tabs */}
      <div className="flex gap-4 justify-center flex-wrap">
        {[
          { id: 'write', label: 'Write Entry', icon: BookOpen },
          { id: 'entries', label: 'Past Entries', icon: Calendar },
          { id: 'calendar', label: 'Mood Calendar', icon: Calendar },
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
            <label className="block text-sm font-semibold text-gray-700">
              Your Mood <span className="text-red-500">*</span>
            </label>
            {moodError && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>Please select your mood before saving</span>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              {moodEmojis.map((moodOption) => {
                const Icon = moodOption.icon;
                return (
                  <button
                    key={moodOption.value}
                    onClick={() => {
                      setMood(moodOption.value);
                      setMoodError(false);
                    }}
                    type="button"
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                      mood === moodOption.value
                        ? 'bg-gradient-to-br from-sage-100 to-lavender-100 scale-110 shadow-lg ring-2 ring-sage-500'
                        : mood === null && moodError
                        ? 'bg-red-50 hover:bg-red-100 ring-2 ring-red-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${moodOption.color}`} />
                    <span className="text-xs font-medium text-gray-700">{moodOption.label}</span>
                  </button>
                );
              })}
            </div>
            {mood === null && (
              <p className="text-center text-sm text-gray-500 italic">
                👆 Please select one mood to continue
              </p>
            )}
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
            disabled={isSaving}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isAuthenticated
                ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {!isAuthenticated ? (
              <>
                <Lock className="w-5 h-5" />
                Log In to Save Entry
              </>
            ) : isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
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
          {!isAuthenticated ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Log In to View Your Entries</h3>
              <p className="text-gray-600 mb-6">Your journal entries are private and only visible to you.</p>
              <button
                onClick={() => openModal('login', 'Log in to view your journal entries')}
                className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Log In
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto" />
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
                <div key={entry.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all relative">
                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteConfirm(entry.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-start justify-between mb-4 pr-12">
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
                    <div className="bg-lavender-50 rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-lavender-700 mb-1">Goals:</p>
                      <p className="text-sm text-gray-700">{entry.goals}</p>
                    </div>
                  )}

                  {/* AI Insights Section */}
                  <div className="border-t-2 border-gray-100 pt-4 mt-4">
                    {entry.insights ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleInsights(entry.id)}
                          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-purple-700">AI Insights</span>
                          </div>
                          <svg
                            className={`w-5 h-5 text-purple-600 transition-transform ${
                              expandedInsights.has(entry.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedInsights.has(entry.id) && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 animate-fade-in">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.insights}</p>
                            <button
                              onClick={() => handleGenerateInsights(entry.id, true)}
                              disabled={generatingInsights === entry.id}
                              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all text-sm font-medium"
                            >
                              {generatingInsights === entry.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Regenerating...
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-4 h-4" />
                                  Regenerate Insights
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleGenerateInsights(entry.id, false)}
                        disabled={generatingInsights === entry.id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingInsights === entry.id ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating AI Insights...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate AI Insights
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Delete Confirmation */}
                  {deleteConfirm === entry.id && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6">
                      <div className="text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h4 className="text-lg font-semibold text-gray-800">Delete this entry?</h4>
                        <p className="text-sm text-gray-600">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            disabled={isDeleting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Log In to View Calendar</h3>
              <p className="text-gray-600 mb-6">Track your mood patterns over time with the calendar view.</p>
              <button
                onClick={() => openModal('login', 'Log in to view your mood calendar')}
                className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Log In
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-semibold text-gray-800">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={previousMonth}
                    className="p-3 rounded-full hover:bg-sage-100 transition-colors"
                    aria-label="Previous month"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-3 rounded-full hover:bg-sage-100 transition-colors"
                    aria-label="Next month"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-3">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4">Mood Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {moodEmojis.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <div key={mood.value} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border-2 ${mood.bgColor} ${mood.borderColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${mood.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{mood.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4">This Month</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-sage-50 rounded-xl p-4">
                    <div className="text-3xl font-serif font-bold text-sage-800 mb-1">
                      {entries.filter(e => {
                        const entryDate = new Date(e.date);
                        return entryDate.getMonth() === currentMonth.getMonth() && 
                               entryDate.getFullYear() === currentMonth.getFullYear();
                      }).length}
                    </div>
                    <div className="text-gray-700 font-semibold">Entries</div>
                  </div>
                  <div className="bg-lavender-50 rounded-xl p-4">
                    <div className="text-3xl font-serif font-bold text-lavender-800 mb-1">
                      {(entries
                        .filter(e => {
                          const entryDate = new Date(e.date);
                          return entryDate.getMonth() === currentMonth.getMonth() && 
                                 entryDate.getFullYear() === currentMonth.getFullYear();
                        })
                        .reduce((sum, e) => sum + e.mood, 0) / 
                        Math.max(1, entries.filter(e => {
                          const entryDate = new Date(e.date);
                          return entryDate.getMonth() === currentMonth.getMonth() && 
                                 entryDate.getFullYear() === currentMonth.getFullYear();
                        }).length) || 0).toFixed(1)}
                    </div>
                    <div className="text-gray-700 font-semibold">Avg Mood</div>
                  </div>
                  <div className="bg-blush-50 rounded-xl p-4">
                    <div className="text-3xl font-serif font-bold text-blush-800 mb-1">
                      {Math.round((entries.filter(e => {
                        const entryDate = new Date(e.date);
                        return entryDate.getMonth() === currentMonth.getMonth() && 
                               entryDate.getFullYear() === currentMonth.getFullYear();
                      }).length / new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()) * 100)}%
                    </div>
                    <div className="text-gray-700 font-semibold">Consistency</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis View */}
      {activeView === 'analysis' && (
        <div className="space-y-6">
          {!isAuthenticated ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">Log In to View Insights</h3>
              <p className="text-gray-600 mb-6">Track your mood patterns and journaling progress.</p>
              <button
                onClick={() => openModal('login', 'Log in to view your insights')}
                className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Log In
              </button>
            </div>
          ) : entries.length === 0 ? (
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
