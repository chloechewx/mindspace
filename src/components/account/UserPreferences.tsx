import React, { useState } from 'react';
import { Save, DollarSign, Globe, Target, Bell, Shield } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserPreferences: React.FC = () => {
  const preferences = useUserStore((state) => state.preferences);
  const updatePreferences = useUserStore((state) => state.updatePreferences);

  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updatePreferences(localPrefs);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Mandarin', 
    'Arabic', 'Hindi', 'Portuguese', 'Japanese', 'Korean'
  ];

  const therapyGoals = [
    'Anxiety Management',
    'Depression Support',
    'Relationship Issues',
    'Stress Management',
    'Self-Esteem',
    'Trauma Recovery',
    'Life Transitions',
    'Career Guidance',
    'Family Conflicts',
    'Personal Growth',
  ];

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Your Preferences
        </h2>
        <p className="text-gray-600">
          Customize your MindSpace experience
        </p>
      </div>

      {/* Budget Range */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Budget Range</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium w-20">Min:</label>
            <input
              type="number"
              value={localPrefs.budgetRange.min}
              onChange={(e) => setLocalPrefs({
                ...localPrefs,
                budgetRange: { ...localPrefs.budgetRange, min: Number(e.target.value) }
              })}
              className="flex-1 px-4 py-2 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all"
            />
            <span className="text-gray-600">per session</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium w-20">Max:</label>
            <input
              type="number"
              value={localPrefs.budgetRange.max}
              onChange={(e) => setLocalPrefs({
                ...localPrefs,
                budgetRange: { ...localPrefs.budgetRange, max: Number(e.target.value) }
              })}
              className="flex-1 px-4 py-2 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all"
            />
            <span className="text-gray-600">per session</span>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Preferred Languages</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                const isSelected = localPrefs.preferredLanguages.includes(lang);
                setLocalPrefs({
                  ...localPrefs,
                  preferredLanguages: isSelected
                    ? localPrefs.preferredLanguages.filter(l => l !== lang)
                    : [...localPrefs.preferredLanguages, lang]
                });
              }}
              className={`
                px-4 py-2 rounded-full font-semibold transition-all duration-300
                ${localPrefs.preferredLanguages.includes(lang)
                  ? 'bg-gradient-to-br from-lavender-500 to-lavender-600 text-white shadow-md'
                  : 'bg-sage-50 text-gray-700 hover:bg-sage-100'
                }
              `}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Therapy Goals */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blush-400 to-blush-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Therapy Goals</h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {therapyGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => {
                const isSelected = localPrefs.therapyGoals.includes(goal);
                setLocalPrefs({
                  ...localPrefs,
                  therapyGoals: isSelected
                    ? localPrefs.therapyGoals.filter(g => g !== goal)
                    : [...localPrefs.therapyGoals, goal]
                });
              }}
              className={`
                px-4 py-2 rounded-full font-semibold transition-all duration-300
                ${localPrefs.therapyGoals.includes(goal)
                  ? 'bg-gradient-to-br from-blush-500 to-blush-600 text-white shadow-md'
                  : 'bg-sage-50 text-gray-700 hover:bg-sage-100'
                }
              `}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Notifications</h3>
        </div>
        
        <div className="space-y-3">
          {Object.entries(localPrefs.communicationPreferences).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setLocalPrefs({
                  ...localPrefs,
                  communicationPreferences: {
                    ...localPrefs.communicationPreferences,
                    [key]: e.target.checked
                  }
                })}
                className="w-5 h-5 rounded border-2 border-sage-300 text-sage-500 focus:ring-4 focus:ring-sage-100"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="soft-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800">Privacy</h3>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={localPrefs.privacySettings.shareProgressWithTherapist}
              onChange={(e) => setLocalPrefs({
                ...localPrefs,
                privacySettings: {
                  ...localPrefs.privacySettings,
                  shareProgressWithTherapist: e.target.checked
                }
              })}
              className="w-5 h-5 rounded border-2 border-sage-300 text-sage-500 focus:ring-4 focus:ring-sage-100"
            />
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              Share progress with therapist
            </span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={localPrefs.privacySettings.allowBuddyMatching}
              onChange={(e) => setLocalPrefs({
                ...localPrefs,
                privacySettings: {
                  ...localPrefs.privacySettings,
                  allowBuddyMatching: e.target.checked
                }
              })}
              className="w-5 h-5 rounded border-2 border-sage-300 text-sage-500 focus:ring-4 focus:ring-sage-100"
            />
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
              Allow buddy matching
            </span>
          </label>

          <div className="pt-2">
            <label className="block text-gray-700 font-medium mb-2">Profile Visibility</label>
            <select
              value={localPrefs.privacySettings.profileVisibility}
              onChange={(e) => setLocalPrefs({
                ...localPrefs,
                privacySettings: {
                  ...localPrefs.privacySettings,
                  profileVisibility: e.target.value as 'public' | 'private' | 'friends-only'
                }
              })}
              className="w-full px-4 py-2 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all"
            >
              <option value="private">Private</option>
              <option value="friends-only">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center py-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-warm flex items-center gap-3 px-12 py-4 text-lg disabled:opacity-50"
        >
          <Save className="w-6 h-6" />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
