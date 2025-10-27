import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const EventsCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    { date: 25, title: 'Sunrise Yoga', type: 'exercise' },
    { date: 26, title: 'Art Therapy', type: 'arts' },
    { date: 27, title: 'Meditation Circle', type: 'workshop' },
    { date: 28, title: 'Farmers Market', type: 'market' },
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-serif font-semibold text-gray-800">
            {monthName}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 rounded-full hover:bg-sage-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-sage-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const hasEvent = events.some(e => e.date === day);
            const isToday = day === new Date().getDate() &&
                           currentDate.getMonth() === new Date().getMonth();

            return (
              <div
                key={day}
                className={`
                  aspect-square flex items-center justify-center rounded-xl text-center
                  transition-all duration-300 cursor-pointer
                  ${isToday ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white font-bold' : ''}
                  ${hasEvent && !isToday ? 'bg-sage-100 text-sage-700 font-semibold hover:bg-sage-200' : ''}
                  ${!hasEvent && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="soft-card p-6">
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-4">
          Upcoming Events
        </h3>
        <div className="space-y-3">
          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 bg-sage-50 rounded-2xl hover:bg-sage-100 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-xl flex items-center justify-center text-white font-bold">
                {event.date}
              </div>
              <div>
                <div className="font-semibold text-gray-800">{event.title}</div>
                <div className="text-sm text-gray-600 capitalize">{event.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
