import React from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { TrendingUp, Calendar, Heart, Target, Smile, Meh, Frown } from 'lucide-react';
import { format, subDays } from 'date-fns';

export const AnalyticsView: React.FC = () => {
  const { entries } = useDiaryStore();

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in">
        <div className="soft-card p-16 bg-gradient-to-br from-sage-50 to-cream-50">
          <TrendingUp className="w-24 h-24 mx-auto mb-6 text-sage-400" />
          <h3 className="text-4xl font-serif font-semibold mb-4 text-gray-800">Track Your Progress</h3>
          <p className="text-xl text-gray-700 leading-relaxed">
            Start journaling to see your mood trends and wellness analytics
          </p>
        </div>
      </div>
    );
  }

  // Prepare mood data
  const moodValues: { [key: string]: number } = {
    'excellent': 5,
    'good': 4,
    'neutral': 3,
    'low': 2,
    'struggling': 1,
  };

  const moodColors: { [key: string]: string } = {
    'excellent': 'bg-green-500',
    'good': 'bg-blue-500',
    'neutral': 'bg-yellow-500',
    'low': 'bg-orange-500',
    'struggling': 'bg-red-500',
  };

  // Last 30 days mood trend
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = entries.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dateStr);
    
    const avgMood = dayEntries.length > 0
      ? dayEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / dayEntries.length
      : null;

    return {
      date: format(date, 'MMM d'),
      mood: avgMood,
      entries: dayEntries.length,
    };
  });

  // Mood distribution
  const moodDistribution = Object.keys(moodValues).map(mood => ({
    mood: mood.charAt(0).toUpperCase() + mood.slice(1),
    key: mood,
    count: entries.filter(e => e.mood === mood).length,
  }));

  const maxMoodCount = Math.max(...moodDistribution.map(m => m.count), 1);

  // Calculate streaks
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const hasEntry = entries.some(e => {
        const entryDate = new Date(e.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });

      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  };

  const currentStreak = calculateStreak();
  const maxMood = Math.max(...last30Days.filter(d => d.mood !== null).map(d => d.mood!), 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <section className="soft-card p-8">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6">Your Progress</h2>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="soft-card bg-gradient-to-br from-sage-50 to-sage-100 p-6 border-sage-200">
            <Calendar className="w-8 h-8 text-sage-700 mb-3" />
            <div className="text-3xl font-serif font-bold text-sage-800 mb-1">{currentStreak}</div>
            <div className="text-sage-700 font-semibold">Day Streak</div>
          </div>

          <div className="soft-card bg-gradient-to-br from-lavender-50 to-lavender-100 p-6 border-lavender-200">
            <TrendingUp className="w-8 h-8 text-lavender-700 mb-3" />
            <div className="text-3xl font-serif font-bold text-lavender-800 mb-1">{entries.length}</div>
            <div className="text-lavender-700 font-semibold">Total Entries</div>
          </div>

          <div className="soft-card bg-gradient-to-br from-blush-50 to-blush-100 p-6 border-blush-200">
            <Heart className="w-8 h-8 text-blush-700 mb-3" />
            <div className="text-3xl font-serif font-bold text-blush-800 mb-1">
              {entries.reduce((acc, e) => acc + (e.gratitude?.length || 0), 0)}
            </div>
            <div className="text-blush-700 font-semibold">Gratitudes</div>
          </div>

          <div className="soft-card bg-gradient-to-br from-cream-100 to-cream-200 p-6 border-cream-300">
            <Target className="w-8 h-8 text-cream-800 mb-3" />
            <div className="text-3xl font-serif font-bold text-cream-900 mb-1">
              {entries.reduce((acc, e) => acc + (e.goals?.length || 0), 0)}
            </div>
            <div className="text-cream-800 font-semibold">Intentions</div>
          </div>
        </div>
      </section>

      {/* Mood Trend Chart */}
      <section className="soft-card p-8">
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">30-Day Mood Trend</h3>
        
        <div className="relative h-80 bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-6">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 py-6">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full flex items-end justify-between gap-1">
            {last30Days.map((day, index) => {
              const height = day.mood ? (day.mood / maxMood) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  {/* Bar */}
                  <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                    {day.mood && (
                      <div
                        className="w-full bg-gradient-to-t from-sage-500 to-lavender-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${height}%` }}
                      />
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  {day.mood && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white shadow-lg rounded-xl p-3 text-xs whitespace-nowrap z-10 border-2 border-sage-200">
                      <div className="font-semibold text-gray-800">{day.date}</div>
                      <div className="text-gray-600">Mood: {day.mood.toFixed(1)}/5</div>
                      <div className="text-gray-600">{day.entries} {day.entries === 1 ? 'entry' : 'entries'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis labels (show every 5th day) */}
          <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
            {last30Days.map((day, index) => (
              index % 5 === 0 ? <span key={index}>{day.date}</span> : <span key={index}></span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Frown className="w-4 h-4 text-red-500" />
            <span>1 = Struggling</span>
          </div>
          <div className="flex items-center gap-2">
            <Meh className="w-4 h-4 text-yellow-500" />
            <span>3 = Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-green-500" />
            <span>5 = Excellent</span>
          </div>
        </div>
      </section>

      {/* Mood Distribution */}
      <section className="soft-card p-8">
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Mood Distribution</h3>
        
        <div className="space-y-4">
          {moodDistribution.map((item) => {
            const percentage = (item.count / entries.length) * 100;
            const barWidth = (item.count / maxMoodCount) * 100;
            
            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">{item.mood}</span>
                  <span className="text-gray-600">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${moodColors[item.key]} transition-all duration-500 rounded-full flex items-center justify-end pr-3`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {item.count > 0 && (
                      <span className="text-white text-xs font-semibold">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="soft-card p-8">
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          {entries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-sage-50 to-lavender-50 rounded-2xl">
              <div className={`w-12 h-12 ${moodColors[entry.mood]} rounded-full flex items-center justify-center flex-shrink-0`}>
                {entry.mood === 'excellent' && <Smile className="w-6 h-6 text-white" />}
                {entry.mood === 'good' && <Smile className="w-6 h-6 text-white" />}
                {entry.mood === 'neutral' && <Meh className="w-6 h-6 text-white" />}
                {(entry.mood === 'low' || entry.mood === 'struggling') && <Frown className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {format(new Date(entry.date), 'MMMM d, yyyy')}
                </div>
                <div className="text-sm text-gray-600 line-clamp-1">
                  {entry.content}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-700 capitalize">
                {entry.mood}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
