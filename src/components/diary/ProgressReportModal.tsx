import React from 'react';
import { X, Download, Share2, TrendingUp, Heart, Lightbulb, Calendar } from 'lucide-react';
import { useDiaryStore } from '../../store/diaryStore';
import { format, subDays } from 'date-fns';

interface ProgressReportModalProps {
  onClose: () => void;
}

export const ProgressReportModal: React.FC<ProgressReportModalProps> = ({ onClose }) => {
  const { entries, patterns } = useDiaryStore();
  
  // Calculate report data for last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentEntries = entries.filter(e => new Date(e.date) >= thirtyDaysAgo);
  
  const totalGratitudes = recentEntries.reduce((acc, e) => acc + (e.gratitude?.length || 0), 0);
  const totalGoals = recentEntries.reduce((acc, e) => acc + (e.goals?.length || 0), 0);
  
  const moodCounts = recentEntries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

  const handleDownload = () => {
    // Create a simple text report
    const reportText = `
MindSpace Progress Report
Generated: ${format(new Date(), 'MMMM d, yyyy')}
Period: Last 30 Days

SUMMARY
-------
Total Entries: ${recentEntries.length}
Gratitudes Recorded: ${totalGratitudes}
Intentions Set: ${totalGoals}
Most Common Mood: ${mostCommonMood}

PATTERNS DETECTED
-----------------
${patterns.map(p => `• ${p.pattern} (${Math.round(p.confidence * 100)}% confidence)`).join('\n')}

MOOD DISTRIBUTION
-----------------
${Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count} entries`).join('\n')}
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindspace-report-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="soft-card max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
          <h2 className="text-xl font-serif font-semibold text-gray-800">Progress Report</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Report Content */}
        <div className="space-y-4">
          {/* Period */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 30 Days • Generated {format(new Date(), 'MMMM d, yyyy')}</span>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-2.5">
            <div className="soft-card bg-gradient-to-br from-lavender-50 to-lavender-100 p-3.5 border-lavender-200">
              <TrendingUp className="w-5 h-5 text-lavender-700 mb-1.5" />
              <div className="text-xl font-serif font-bold text-lavender-800 mb-0.5">
                {recentEntries.length}
              </div>
              <div className="text-xs text-lavender-700 font-semibold">Journal Entries</div>
            </div>

            <div className="soft-card bg-gradient-to-br from-blush-50 to-blush-100 p-3.5 border-blush-200">
              <Heart className="w-5 h-5 text-blush-700 mb-1.5" />
              <div className="text-xl font-serif font-bold text-blush-800 mb-0.5">
                {totalGratitudes}
              </div>
              <div className="text-xs text-blush-700 font-semibold">Gratitudes</div>
            </div>

            <div className="soft-card bg-gradient-to-br from-sage-50 to-sage-100 p-3.5 border-sage-200">
              <Lightbulb className="w-5 h-5 text-sage-700 mb-1.5" />
              <div className="text-xl font-serif font-bold text-sage-800 mb-0.5">
                {totalGoals}
              </div>
              <div className="text-xs text-sage-700 font-semibold">Intentions</div>
            </div>
          </div>

          {/* Mood Distribution */}
          <div className="soft-card bg-gradient-to-br from-cream-50 to-cream-100 p-4">
            <h3 className="text-base font-serif font-semibold text-gray-800 mb-2.5">Mood Distribution</h3>
            <div className="space-y-2">
              {Object.entries(moodCounts).map(([mood, count]) => {
                const percentage = (count / recentEntries.length) * 100;
                return (
                  <div key={mood}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium capitalize">{mood}</span>
                      <span className="text-xs text-gray-600">{count} entries ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-sage-500 to-lavender-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patterns */}
          {patterns.length > 0 && (
            <div className="soft-card bg-gradient-to-br from-lavender-50 to-sage-50 p-4">
              <h3 className="text-base font-serif font-semibold text-gray-800 mb-2.5">AI-Detected Patterns</h3>
              <div className="space-y-2">
                {patterns.slice(0, 5).map((pattern) => (
                  <div key={pattern.id} className="bg-white/60 backdrop-blur-sm p-2.5 rounded-lg">
                    <p className="text-sm text-gray-800 font-medium mb-1">{pattern.pattern}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span>{pattern.occurrences} occurrences</span>
                      <span>•</span>
                      <span>{Math.round(pattern.confidence * 100)}% confidence</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          <div className="soft-card bg-gradient-to-br from-sage-50 to-cream-50 p-4">
            <h3 className="text-base font-serif font-semibold text-gray-800 mb-2.5">Key Insights</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-1.5">
                <span className="text-sage-600 text-base mt-0.5">•</span>
                <span>You've been consistent with journaling, recording {recentEntries.length} entries in the past 30 days.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sage-600 text-base mt-0.5">•</span>
                <span>Your most common mood was "{mostCommonMood}", appearing in {moodCounts[mostCommonMood]} entries.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sage-600 text-base mt-0.5">•</span>
                <span>You practiced gratitude {totalGratitudes} times, strengthening your positive mindset.</span>
              </li>
              {patterns.length > 0 && (
                <li className="flex items-start gap-1.5">
                  <span className="text-sage-600 text-base mt-0.5">•</span>
                  <span>AI analysis identified {patterns.length} recurring patterns in your wellness journey.</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-5 pt-4 border-t-2 border-gray-200">
          <button
            onClick={handleDownload}
            className="btn-warm flex-1 flex items-center justify-center gap-1.5 text-sm py-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
          <button className="btn-soft flex-1 flex items-center justify-center gap-1.5 text-sm py-2">
            <Share2 className="w-3.5 h-3.5" />
            Share with Therapist
          </button>
        </div>
      </div>
    </div>
  );
};
