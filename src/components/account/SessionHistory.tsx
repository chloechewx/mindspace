import React, { useState } from 'react';
import { Calendar, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const SessionHistory: React.FC = () => {
  const sessionHistory = useUserStore((state) => state.sessionHistory);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSession = (id: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSessions(newExpanded);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (sessionHistory.length === 0) {
    return (
      <div className="soft-card p-12 text-center">
        <FileText className="w-16 h-16 text-lavender-300 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
          No Session History
        </h3>
        <p className="text-gray-600 mb-6">
          Your completed therapy sessions will appear here
        </p>
        <button className="btn-warm">
          Book Your First Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Session History
        </h2>
        <p className="text-gray-600">
          {sessionHistory.length} completed session{sessionHistory.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {sessionHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((session) => {
            const isExpanded = expandedSessions.has(session.id);
            
            return (
              <div
                key={session.id}
                className="soft-card overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleSession(session.id)}
                  className="w-full p-6 text-left hover:bg-sage-50 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                        {session.therapistName}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sage-500" />
                          <span>{formatDate(session.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-sage-500" />
                          <span>{session.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4 animate-fade-in">
                    <div className="border-t-2 border-sage-100 pt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Session Type</h4>
                      <p className="text-gray-600">{session.sessionType}</p>
                    </div>

                    {session.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Your Notes</h4>
                        <div className="bg-sage-50 rounded-2xl p-4 border-2 border-sage-100">
                          <p className="text-gray-700 whitespace-pre-wrap">{session.notes}</p>
                        </div>
                      </div>
                    )}

                    {session.therapistNotes && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Therapist Notes</h4>
                        <div className="bg-lavender-50 rounded-2xl p-4 border-2 border-lavender-100">
                          <p className="text-gray-700 whitespace-pre-wrap">{session.therapistNotes}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button className="btn-soft flex-1">
                        Add Reflection
                      </button>
                      <button className="btn-warm flex-1">
                        Book Follow-up
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
