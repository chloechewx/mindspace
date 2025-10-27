import React from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { Sparkles, TrendingUp, Heart, Lightbulb, Brain, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const InsightsView: React.FC = () => {
  const { entries, patterns } = useDiaryStore();
  const recentEntries = entries.slice(0, 5);

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in">
        <div className="soft-card p-16 bg-gradient-to-br from-lavender-50 to-sage-50">
          <Sparkles className="w-24 h-24 mx-auto mb-6 text-lavender-400" />
          <h3 className="text-4xl font-serif font-semibold mb-4 text-gray-800">Begin Your Journey</h3>
          <p className="text-xl text-gray-700 leading-relaxed">
            Start journaling to receive personalized insights and track your emotional wellness
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalGratitudes = entries.reduce((acc, e) => acc + (e.gratitude?.length || 0), 0);
  const totalGoals = entries.reduce((acc, e) => acc + (e.goals?.length || 0), 0);
  const entriesWithInsights = entries.filter(e => e.aiInsights).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header Stats */}
      <section className="soft-card p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-lavender-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-gray-800">Your Wellness Insights</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="soft-card bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 border-lavender-200">
            <TrendingUp className="w-10 h-10 text-lavender-700 mb-4" />
            <div className="text-4xl font-serif font-bold text-lavender-800 mb-2">{entries.length}</div>
            <div className="text-lavender-700 font-semibold">Journal Entries</div>
          </div>

          <div className="soft-card bg-gradient-to-br from-blush-50 to-blush-100 p-6 border-blush-200">
            <Heart className="w-10 h-10 text-blush-700 mb-4" />
            <div className="text-4xl font-serif font-bold text-blush-800 mb-2">{totalGratitudes}</div>
            <div className="text-blush-700 font-semibold">Gratitudes</div>
          </div>

          <div className="soft-card bg-gradient-to-br from-sage-50 to-sage-100 p-6 border-sage-200">
            <Lightbulb className="w-10 h-10 text-sage-700 mb-4" />
            <div className="text-4xl font-serif font-bold text-sage-800 mb-2">{totalGoals}</div>
            <div className="text-sage-700 font-semibold">Intentions</div>
          </div>
        </div>

        {/* AI Patterns Section */}
        {patterns.length > 0 && (
          <div className="soft-card bg-gradient-to-br from-lavender-50 via-sage-50 to-blush-50 p-6 border-lavender-200">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-lavender-700" />
              <h3 className="text-2xl font-serif font-semibold text-lavender-800">AI-Detected Patterns</h3>
            </div>
            <div className="space-y-3">
              {patterns.slice(0, 3).map((pattern) => (
                <div key={pattern.id} className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium mb-1">{pattern.pattern}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          First detected: {format(new Date(pattern.firstDetected), 'MMM d, yyyy')}
                        </span>
                        <span>•</span>
                        <span>{pattern.occurrences} occurrences</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-sm font-semibold">
                        {Math.round(pattern.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recent Entries with Insights */}
      <div className="space-y-6">
        <h3 className="text-3xl font-serif font-semibold text-gray-800">Recent Reflections</h3>
        
        {recentEntries.map((entry, index) => (
          <section key={entry.id} className="soft-card p-8 md:p-10 animate-slide-up hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">
                  {entry.mood === 'excellent' && '🌟'}
                  {entry.mood === 'good' && '😊'}
                  {entry.mood === 'neutral' && '😐'}
                  {entry.mood === 'low' && '😔'}
                  {entry.mood === 'struggling' && '💙'}
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-medium mb-1">
                    {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div className="text-xl font-serif font-semibold text-gray-800 capitalize">
                    Feeling {entry.mood}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 font-serif">Your Reflection</h4>
              <p className="text-gray-700 leading-relaxed">{entry.content}</p>
            </div>

            {entry.aiInsights && (
              <div className="soft-card bg-gradient-to-br from-lavender-50 via-sage-50 to-blush-50 p-6 border-lavender-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-lavender-700" />
                  <h4 className="text-xl font-serif font-semibold text-lavender-800">AI Insights</h4>
                </div>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{entry.aiInsights}</p>
              </div>
            )}

            {entry.gratitude && entry.gratitude.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-blush-600" />
                  <h4 className="text-lg font-serif font-semibold text-gray-800">Gratitudes</h4>
                </div>
                <ul className="space-y-2">
                  {entry.gratitude.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blush-500 text-xl mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.goals && entry.goals.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-sage-600" />
                  <h4 className="text-lg font-serif font-semibold text-gray-800">Intentions</h4>
                </div>
                <ul className="space-y-2">
                  {entry.goals.map((goal, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-sage-500 text-xl mt-0.5">•</span>
                      <span className="leading-relaxed">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Insights Summary */}
      {entriesWithInsights > 0 && (
        <section className="soft-card p-8 bg-gradient-to-br from-sage-50 to-cream-50">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-sage-700" />
            <h3 className="text-2xl font-serif font-semibold text-gray-800">Your Growth Journey</h3>
          </div>
          <div className="space-y-3 text-gray-700">
            <p className="leading-relaxed">
              You've received AI-powered insights on <span className="font-semibold text-sage-700">{entriesWithInsights}</span> of your journal entries.
            </p>
            <p className="leading-relaxed">
              These insights help you understand patterns in your thoughts, emotions, and behaviors, supporting your personal growth and self-awareness.
            </p>
            {patterns.length > 0 && (
              <p className="leading-relaxed">
                We've identified <span className="font-semibold text-lavender-700">{patterns.length}</span> recurring patterns in your wellness journey.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
