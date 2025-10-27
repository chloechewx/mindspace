import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDiaryStore } from '../store/diaryStore';

interface ReminderNotificationProps {
  onDismiss: () => void;
}

export const ReminderNotification: React.FC<ReminderNotificationProps> = ({ onDismiss }) => {
  const navigate = useNavigate();
  const { setLastReminderDate } = useDiaryStore();

  const handleJournal = () => {
    setLastReminderDate(new Date());
    navigate('/diary');
    onDismiss();
  };

  const handleDismiss = () => {
    setLastReminderDate(new Date());
    onDismiss();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="soft-card p-6 max-w-sm shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-lavender-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Time to Check In</h3>
              <p className="text-sm text-gray-600">You haven't journaled in 3 days</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Dismiss reminder"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          Hey, wanna doodle your mood? Even a quick check-in helps track your progress! 🎨
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleJournal}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Let's Journal
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 bg-sage-50 text-sage-700 rounded-full font-semibold hover:bg-sage-100 transition-colors"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};
