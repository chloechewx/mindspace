import React from 'react';
import { DollarSign } from 'lucide-react';

interface BudgetFilterProps {
  budgetRange: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}

export const BudgetFilter: React.FC<BudgetFilterProps> = ({ budgetRange, onChange }) => {
  return (
    <div className="soft-card bg-gradient-to-br from-sage-50 to-cream-50 p-6 border-sage-200">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-6 h-6 text-sage-700" />
        <h3 className="text-xl font-serif font-semibold text-gray-800">Budget Range</h3>
      </div>

      <div className="space-y-4">
        {/* Min Budget */}
        <div>
          <label htmlFor="min-budget" className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum per session
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
            <input
              id="min-budget"
              type="number"
              min="0"
              max={budgetRange.max}
              step="10"
              value={budgetRange.min}
              onChange={(e) => onChange({ ...budgetRange, min: parseInt(e.target.value) || 0 })}
              className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all"
            />
          </div>
        </div>

        {/* Max Budget */}
        <div>
          <label htmlFor="max-budget" className="block text-sm font-semibold text-gray-700 mb-2">
            Maximum per session
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">$</span>
            <input
              id="max-budget"
              type="number"
              min={budgetRange.min}
              max="500"
              step="10"
              value={budgetRange.max}
              onChange={(e) => onChange({ ...budgetRange, max: parseInt(e.target.value) || 200 })}
              className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-sage-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="font-semibold text-sage-700">${budgetRange.min}</span>
            <span className="text-gray-500">to</span>
            <span className="font-semibold text-sage-700">${budgetRange.max}</span>
          </div>
          <div className="relative h-2 bg-sage-200 rounded-full">
            <div
              className="absolute h-2 bg-gradient-to-r from-sage-500 to-lavender-500 rounded-full"
              style={{
                left: `${(budgetRange.min / 500) * 100}%`,
                right: `${100 - (budgetRange.max / 500) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-700 mb-2">Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Budget', min: 50, max: 90 },
              { label: 'Standard', min: 90, max: 130 },
              { label: 'Premium', min: 130, max: 180 },
              { label: 'All', min: 50, max: 200 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onChange({ min: preset.min, max: preset.max })}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  budgetRange.min === preset.min && budgetRange.max === preset.max
                    ? 'bg-sage-500 text-white shadow-md'
                    : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-sage-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
