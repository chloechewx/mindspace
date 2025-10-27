import React, { useState } from 'react';
import { useDiaryStore } from '../../store/diaryStore';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

export const CalendarView: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { entries } = useDiaryStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getMoodForDay = (day: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), day));
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return '🌟';
      case 'good': return '😊';
      case 'neutral': return '😐';
      case 'low': return '😔';
      case 'struggling': return '💙';
      default: return '';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-gradient-to-br from-lavender-100 to-lavender-200 border-lavender-300';
      case 'good': return 'bg-gradient-to-br from-sage-100 to-sage-200 border-sage-300';
      case 'neutral': return 'bg-gradient-to-br from-cream-100 to-cream-200 border-cream-300';
      case 'low': return 'bg-gradient-to-br from-blush-100 to-blush-200 border-blush-300';
      case 'struggling': return 'bg-gradient-to-br from-lavender-200 to-lavender-300 border-lavender-400';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <section className="soft-card p-8">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-semibold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-3 rounded-full hover:bg-sage-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-3 rounded-full hover:bg-sage-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-3">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day) => {
            const entry = getMoodForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                className={`
                  aspect-square p-2 rounded-2xl border-2 transition-all duration-300
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-sage-500 ring-offset-2' : ''}
                  ${entry ? getMoodColor(entry.mood) : 'bg-white border-gray-200'}
                  ${entry ? 'hover:scale-105 cursor-pointer shadow-sm hover:shadow-md' : ''}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-sage-700' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>
                  {entry && (
                    <div className="text-2xl" title={`Mood: ${entry.mood}`}>
                      {getMoodEmoji(entry.mood)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4">Mood Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { mood: 'excellent', label: 'Wonderful', emoji: '🌟' },
              { mood: 'good', label: 'Good', emoji: '😊' },
              { mood: 'neutral', label: 'Okay', emoji: '😐' },
              { mood: 'low', label: 'Low', emoji: '😔' },
              { mood: 'struggling', label: 'Struggling', emoji: '💙' },
            ].map(({ mood, label, emoji }) => (
              <div key={mood} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border-2 ${getMoodColor(mood)} flex items-center justify-center text-xl`}>
                  {emoji}
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Summary */}
      <section className="soft-card p-8 bg-gradient-to-br from-sage-50 to-cream-50">
        <div className="flex items-center gap-3 mb-4">
          <CalendarIcon className="w-8 h-8 text-sage-700" />
          <h3 className="text-2xl font-serif font-semibold text-gray-800">This Month</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-serif font-bold text-sage-800 mb-1">
              {entries.filter(e => isSameMonth(new Date(e.date), currentMonth)).length}
            </div>
            <div className="text-gray-700 font-semibold">Entries</div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-blush-800 mb-1">
              {entries
                .filter(e => isSameMonth(new Date(e.date), currentMonth))
                .reduce((acc, e) => acc + (e.gratitude?.length || 0), 0)}
            </div>
            <div className="text-gray-700 font-semibold">Gratitudes</div>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-lavender-800 mb-1">
              {entries
                .filter(e => isSameMonth(new Date(e.date), currentMonth))
                .reduce((acc, e) => acc + (e.goals?.length || 0), 0)}
            </div>
            <div className="text-gray-700 font-semibold">Intentions</div>
          </div>
        </div>
      </section>
    </div>
  );
};
