import React, { useMemo } from 'react';
import { useDiaryStore } from '../store/diaryStore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Smile } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { SectionDivider } from './SectionDivider';

export const AnalyticsView: React.FC = () => {
  const entries = useDiaryStore((state) => state.entries);

  const moodData = useMemo(() => {
    const moodValues: Record<string, number> = {
      excellent: 5,
      good: 4,
      neutral: 3,
      low: 2,
      struggling: 1,
    };

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, 'MMM dd');
      const dayEntries = entries.filter(
        (e) => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((acc, e) => acc + moodValues[e.mood], 0) / dayEntries.length
        : 0;

      return {
        date: dateStr,
        mood: avgMood,
        entries: dayEntries.length,
      };
    });

    return last30Days;
  }, [entries]);

  const moodDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      excellent: 0,
      good: 0,
      neutral: 0,
      low: 0,
      struggling: 0,
    };

    entries.forEach((entry) => {
      distribution[entry.mood]++;
    });

    return Object.entries(distribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
    }));
  }, [entries]);

  const COLORS = ['#ab94ea', '#7dae7d', '#f4e7d0', '#f18a8a', '#c7baf2'];

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in">
        <div className="soft-card p-16 bg-gradient-to-br from-sage-50 to-lavender-50">
          <TrendingUp className="w-24 h-24 mx-auto mb-6 text-sage-500" />
          <h3 className="text-4xl font-serif font-semibold mb-4 text-gray-800">Track Your Progress</h3>
          <p className="text-xl text-gray-700 leading-relaxed">
            Start journaling to visualize your emotional wellness journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <section className="soft-card p-8 md:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-gray-800">Your Progress</h2>
        </div>

        {/* Mood Trend */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Smile className="w-7 h-7 text-lavender-600" />
            30-Day Emotional Journey
          </h3>
          <div className="soft-card bg-gradient-to-br from-cream-50 to-white p-8">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1e1d1" />
                <XAxis dataKey="date" stroke="#365d36" style={{ fontSize: '14px', fontWeight: '500' }} />
                <YAxis domain={[0, 5]} stroke="#365d36" style={{ fontSize: '14px', fontWeight: '500' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #d1e1d1',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: '#2d4a2d'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#7dae7d" 
                  strokeWidth={4}
                  dot={{ fill: '#5a925a', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <SectionDivider variant="wave" />

        {/* Entry Frequency */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-blush-600" />
            Journal Activity
          </h3>
          <div className="soft-card bg-gradient-to-br from-blush-50 to-white p-8">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fbd5d5" />
                <XAxis dataKey="date" stroke="#b03535" style={{ fontSize: '14px', fontWeight: '500' }} />
                <YAxis stroke="#b03535" style={{ fontSize: '14px', fontWeight: '500' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '2px solid #fbd5d5',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    color: '#922f2f'
                  }}
                />
                <Bar dataKey="entries" fill="#f18a8a" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <SectionDivider variant="curve" />

        {/* Mood Distribution */}
        <div>
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-6">Emotional Balance</h3>
          <div className="soft-card bg-gradient-to-br from-lavender-50 to-white p-8">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '14px', fontWeight: '600', fill: '#2d4a2d' }}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ color: '#2d4a2d', fontWeight: '600' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};
