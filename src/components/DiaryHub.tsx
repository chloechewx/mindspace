import React, { useState } from 'react';
import { BookOpen, Brain, TrendingUp, Calendar } from 'lucide-react';
import { JournalEntry } from './JournalEntry';
import { InsightsView } from './InsightsView';
import { AnalyticsView } from './AnalyticsView';
import { CalendarView } from './CalendarView';

type DiaryView = 'journal' | 'insights' | 'analytics' | 'calendar';

export const DiaryHub: React.FC = () => {
  const [activeView, setActiveView] = useState<DiaryView>('journal');

  const views = [
    { id: 'journal' as DiaryView, label: 'Journal', icon: BookOpen, description: 'Write your thoughts' },
    { id: 'insights' as DiaryView, label: 'Insights', icon: Brain, description: 'AI reflections' },
    { id: 'analytics' as DiaryView, label: 'Progress', icon: TrendingUp, description: 'Track growth' },
    { id: 'calendar' as DiaryView, label: 'Calendar', icon: Calendar, description: 'View timeline' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'journal':
        return <JournalEntry />;
      case 'insights':
        return <InsightsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'calendar':
        return <CalendarView />;
      default:
        return <JournalEntry />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Sub-navigation */}
      <section className="soft-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif font-semibold text-gray-800">Your Personal Diary</h2>
            <p className="text-gray-700 mt-2">Express yourself, gain insights, and track your growth</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-2xl font-semibold transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-[0_4px_14px_rgba(90,146,90,0.4)] scale-105' 
                    : 'bg-sage-50 text-gray-700 hover:bg-sage-100 hover:scale-105 shadow-sm'
                  }
                `}
              >
                <Icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">{view.label}</div>
                  <div className={`text-xs mt-1 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                    {view.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active View Content */}
      <div>
        {renderView()}
      </div>
    </div>
  );
};
