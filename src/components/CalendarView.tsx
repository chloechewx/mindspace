import React, { useMemo, useState } from 'react';
import { useDiaryStore } from '../store/diaryStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { SectionDivider } from './SectionDivider';

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const entries = useDiaryStore((state) => state.entries);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const entryMap = useMemo(() => {
    const map = new Map();
    entries.forEach((entry) => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey).push(entry);
    });
    return map;
  }, [entries]);

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-lavender-400',
      good: 'bg-sage-400',
      neutral: 'bg-cream-400',
      low: 'bg-blush-400',
      struggling: 'bg-lavender-500',
    };
    return colors[mood] || 'bg-gray-300';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <section className="soft-card p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blush-500 to-lavender-500 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-serif font-semibold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={previousMonth}
              className="p-3 rounded-2xl bg-sage-100 hover:bg-sage-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-sage-800" />
            </button>
            <button
              onClick={nextMonth}
              className="p-3 rounded-2xl bg-sage-100 hover:bg-sage-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-sage-800" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-3 font-serif text-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {daysInMonth.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEntries = entryMap.get(dateKey) || [];
            const hasEntry = dayEntries.length > 0;
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={day.toString()}
                onClick={() => hasEntry && setSelectedEntry(dayEntries[0])}
                className={`
                  relative aspect-square rounded-3xl p-4 transition-all duration-300
                  ${hasEntry ? 'soft-card hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-105 cursor-pointer' : 'bg-sage-50'}
                  ${isToday ? 'ring-4 ring-lavender-400' : ''}
                  ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''}
                `}
              >
                <div className="text-lg font-semibold text-gray-800 font-serif">
                  {format(day, 'd')}
                </div>
                {hasEntry && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {dayEntries.slice(0, 3).map((entry, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${getMoodColor(entry.mood)}`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {selectedEntry && (
        <>
          <SectionDivider variant="wave" />
          <section className="soft-card p-8 md:p-10 animate-scale-in bg-gradient-to-br from-lavender-50 to-sage-50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-serif font-semibold text-gray-800">
                {format(new Date(selectedEntry.date), 'EEEE, MMMM d, yyyy')}
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="w-10 h-10 rounded-full bg-sage-200 hover:bg-sage-300 flex items-center justify-center text-gray-800 transition-colors font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-600 mb-2 font-semibold">Mood</div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${getMoodColor(selectedEntry.mood)}`} />
                  <span className="text-xl font-serif font-semibold capitalize text-gray-800">{selectedEntry.mood}</span>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-3 font-semibold">Your Reflection</div>
                <p className="text-gray-800 leading-relaxed text-lg">{selectedEntry.content}</p>
              </div>

              {selectedEntry.aiInsights && (
                <div className="soft-card bg-gradient-to-br from-blush-50 to-white p-6 border-blush-200">
                  <div className="text-sm text-blush-700 font-semibold mb-3 font-serif text-lg">AI Insights</div>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{selectedEntry.aiInsights}</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
