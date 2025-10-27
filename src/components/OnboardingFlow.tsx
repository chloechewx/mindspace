import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { OnboardingAssessment } from '../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { completeOnboarding } = useUserStore();
  const [step, setStep] = useState(0);
  const [assessment, setAssessment] = useState<Partial<OnboardingAssessment>>({
    challenges: [],
    preferredLanguages: [],
    sessionFormat: [],
    budgetRange: { min: 50, max: 200 },
    distressLevel: 5,
    therapyGoals: '',
    preferredGender: 'No Preference',
  });

  const questions = [
    {
      id: 'challenges',
      title: 'What challenges are you currently facing?',
      subtitle: 'Select all that apply',
      type: 'multi-select',
      options: [
        'Stress', 'Relationships', 'Burnout', 'Anxiety', 
        'Depression', 'Trauma', 'Self-Esteem', 'Life Transitions', 'Other'
      ],
    },
    {
      id: 'preferredLanguages',
      title: 'Preferred therapist language(s)',
      subtitle: 'Select your preferred languages',
      type: 'multi-select',
      options: ['English', 'Spanish', 'Mandarin', 'French', 'German', 'Other'],
    },
    {
      id: 'preferredGender',
      title: 'Preferred therapist gender',
      subtitle: 'Optional - select if you have a preference',
      type: 'single-select',
      options: ['No Preference', 'Female', 'Male', 'Non-Binary'],
    },
    {
      id: 'sessionFormat',
      title: 'Preferred session format',
      subtitle: 'How would you like to attend sessions?',
      type: 'multi-select',
      options: ['Online Video', 'Phone', 'In-Person', 'Flexible'],
    },
    {
      id: 'budgetRange',
      title: 'Budget range per session',
      subtitle: 'What can you comfortably afford?',
      type: 'budget',
      options: [],
    },
    {
      id: 'distressLevel',
      title: 'Current emotional distress level',
      subtitle: 'On a scale of 1-10, how distressed do you feel?',
      type: 'scale',
      options: [],
    },
    {
      id: 'therapyGoals',
      title: 'What do you hope to gain from therapy?',
      subtitle: 'Share your goals in your own words (500 characters max)',
      type: 'text',
      options: [],
    },
  ];

  const currentQuestion = questions[step];

  const handleMultiSelect = (option: string) => {
    const field = currentQuestion.id as keyof OnboardingAssessment;
    const current = (assessment[field] as string[]) || [];
    
    if (current.includes(option)) {
      setAssessment({
        ...assessment,
        [field]: current.filter((item) => item !== option),
      });
    } else {
      setAssessment({
        ...assessment,
        [field]: [...current, option],
      });
    }
  };

  const handleSingleSelect = (option: string) => {
    setAssessment({
      ...assessment,
      [currentQuestion.id]: option,
    });
  };

  const handleBudgetChange = (min: number, max: number) => {
    setAssessment({
      ...assessment,
      budgetRange: { min, max },
    });
  };

  const handleScaleChange = (value: number) => {
    setAssessment({
      ...assessment,
      distressLevel: value,
    });
  };

  const handleTextChange = (value: string) => {
    setAssessment({
      ...assessment,
      therapyGoals: value.slice(0, 500),
    });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleComplete = () => {
    try {
      // Ensure all required fields have default values
      const completeAssessment: OnboardingAssessment = {
        challenges: assessment.challenges || [],
        preferredLanguages: assessment.preferredLanguages || ['English'],
        preferredGender: assessment.preferredGender || 'No Preference',
        sessionFormat: assessment.sessionFormat || ['Flexible'],
        budgetRange: assessment.budgetRange || { min: 50, max: 200 },
        distressLevel: assessment.distressLevel || 5,
        therapyGoals: assessment.therapyGoals || '',
      };

      completeOnboarding(completeAssessment);
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still complete onboarding even if there's an error
      onComplete();
    }
  };

  const canProceed = () => {
    const field = currentQuestion.id as keyof OnboardingAssessment;
    const value = assessment[field];
    
    if (currentQuestion.type === 'multi-select') {
      return Array.isArray(value) && value.length > 0;
    }
    if (currentQuestion.type === 'text') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    // Budget, scale, and single-select always have values
    return true;
  };

  const generateSummary = () => {
    const { challenges, preferredLanguages, preferredGender, sessionFormat, budgetRange, therapyGoals } = assessment;
    
    const genderText = preferredGender !== 'No Preference' ? `${preferredGender.toLowerCase()} ` : '';
    const languagesText = preferredLanguages?.join(', ') || 'English';
    const challengesText = challenges?.slice(0, 2).join(' and ') || 'personal growth';
    const formatText = sessionFormat?.join(' or ') || 'flexible';
    const budgetText = `$${budgetRange?.min || 50}-${budgetRange?.max || 200}`;
    const goalsText = therapyGoals || 'personal development';
    
    return `You're looking for a ${genderText}therapist who speaks ${languagesText}, specializes in ${challengesText}, offers ${formatText} sessions, and works within your ${budgetText} per session budget. Your goal: ${goalsText}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sage-100 p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-lavender-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-semibold text-gray-800">
                Let's find support that suits you
              </h2>
              <p className="text-sm text-gray-600">Optional but recommended</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  index <= step ? 'bg-gradient-to-r from-sage-400 to-lavender-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {step + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
              {currentQuestion.title}
            </h3>
            <p className="text-gray-600">{currentQuestion.subtitle}</p>
          </div>

          {/* Multi-Select */}
          {currentQuestion.type === 'multi-select' && (
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => {
                const field = currentQuestion.id as keyof OnboardingAssessment;
                const isSelected = (assessment[field] as string[])?.includes(option);
                
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleMultiSelect(option)}
                    className={`p-4 rounded-2xl font-medium transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-lg scale-105'
                        : 'bg-sage-50 text-gray-700 hover:bg-sage-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Single Select */}
          {currentQuestion.type === 'single-select' && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = assessment[currentQuestion.id as keyof OnboardingAssessment] === option;
                
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSingleSelect(option)}
                    className={`w-full p-4 rounded-2xl font-medium transition-all duration-300 text-left ${
                      isSelected
                        ? 'bg-gradient-to-br from-sage-500 to-lavender-500 text-white shadow-lg'
                        : 'bg-sage-50 text-gray-700 hover:bg-sage-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* Budget Range */}
          {currentQuestion.type === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  ${assessment.budgetRange?.min} - ${assessment.budgetRange?.max}
                </span>
                <span className="text-sm text-gray-600">per session</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Minimum</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={assessment.budgetRange?.min}
                  onChange={(e) => handleBudgetChange(parseInt(e.target.value), assessment.budgetRange?.max || 200)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Maximum</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={assessment.budgetRange?.max}
                  onChange={(e) => handleBudgetChange(assessment.budgetRange?.min || 50, parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Scale */}
          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Minimal</span>
                <span className="text-2xl font-bold text-gray-800">{assessment.distressLevel}</span>
                <span className="text-sm text-gray-600">Severe</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={assessment.distressLevel}
                onChange={(e) => handleScaleChange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === 'text' && (
            <div className="space-y-2">
              <textarea
                value={assessment.therapyGoals}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full h-32 p-4 rounded-2xl border-2 border-sage-100 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 text-right">
                {assessment.therapyGoals?.length || 0} / 500 characters
              </p>
            </div>
          )}

          {/* Summary (Last Step) */}
          {step === questions.length - 1 && assessment.therapyGoals && (
            <div className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-6 border border-sage-200">
              <h4 className="font-semibold text-gray-800 mb-3">Your Personalized Profile</h4>
              <p className="text-gray-700 leading-relaxed">{generateSummary()}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-sage-100 p-6 flex items-center justify-between rounded-b-3xl">
          <button
            onClick={handleBack}
            type="button"
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            type="button"
            disabled={!canProceed()}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          >
            <span>{step === questions.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
