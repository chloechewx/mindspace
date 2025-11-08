import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Search, Clock, Heart, Brain, Sparkles, Trophy, Target, Zap, Phone, CheckCircle, GraduationCap, Gamepad2, HeartHandshake, Moon, Activity, Timer, MessageCircle, Shield } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  category: 'mental-health' | 'self-care' | 'wellness';
  readTime: string;
  excerpt: string;
  image: string;
  tags: string[];
  url: string;
}

interface Helpline {
  id: string;
  name: string;
  phone: string;
  description: string;
  availability: string;
  category: 'crisis' | 'mental-health' | 'support';
  isEmergency?: boolean;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

type TabType = 'learn' | 'practice' | 'support';

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Comprehensive Guide',
    category: 'mental-health',
    readTime: '8 min read',
    excerpt: 'Learn about anxiety disorders, their symptoms, and evidence-based coping strategies that can help you manage daily challenges.',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Anxiety', 'Mental Health', 'Coping'],
    url: 'https://www.healthhub.sg/programmes/mindsg/caring-for-ourselves/dealing-with-anxiety-disorder-adults',
  },
  {
    id: '2',
    title: 'The Power of Mindfulness Meditation',
    category: 'wellness',
    readTime: '6 min read',
    excerpt: 'Discover how mindfulness meditation can reduce stress, improve focus, and enhance your overall well-being.',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Mindfulness', 'Meditation', 'Stress'],
    url: 'https://www.happify.com/hd/the-power-of-mindfulness/',
  },
  {
    id: '3',
    title: 'Building Healthy Sleep Habits',
    category: 'self-care',
    readTime: '7 min read',
    excerpt: 'Quality sleep is essential for mental health. Learn practical tips to improve your sleep hygiene and wake up refreshed.',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Sleep', 'Self-Care', 'Health'],
    url: 'https://www.healthhub.sg/well-being-and-lifestyle/mental-wellness/overcoming_insomnia',
  },
  {
    id: '4',
    title: 'Managing Depression: Hope and Healing',
    category: 'mental-health',
    readTime: '10 min read',
    excerpt: 'Depression is treatable. Explore different approaches to managing symptoms and finding your path to recovery.',
    image: 'https://images.pexels.com/photos/3759660/pexels-photo-3759660.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Depression', 'Recovery', 'Support'],
    url: 'https://www.nimh.nih.gov/health/topics/depression',
  },
  {
    id: '5',
    title: 'The Art of Self-Compassion',
    category: 'self-care',
    readTime: '5 min read',
    excerpt: 'Learn to treat yourself with the same kindness you would offer a good friend. Self-compassion is key to mental wellness.',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Self-Compassion', 'Kindness', 'Growth'],
    url: 'https://self-compassion.org/the-three-elements-of-self-compassion-2/',
  },
  {
    id: '6',
    title: 'Stress Management Techniques That Work',
    category: 'wellness',
    readTime: '9 min read',
    excerpt: 'Practical, science-backed strategies to manage stress in your daily life and build resilience.',
    image: 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Stress', 'Resilience', 'Wellness'],
    url: 'https://www.apa.org/topics/stress/manage',
  },
];

const helplines: Helpline[] = [
  {
    id: '1',
    name: 'Samaritans of Singapore (SOS)',
    phone: '1767',
    description: 'Free, confidential support 24/7 for anyone in distress or thinking about suicide. Call or WhatsApp 9151 1767 for help.',
    availability: '24/7',
    category: 'crisis',
    isEmergency: true,
  },
  {
    id: '2',
    name: 'Institute of Mental Health (IMH) Helpline',
    phone: '6389 2222',
    description: '24-hour helpline for mental health emergencies or when someone may be in danger of harm.',
    availability: '24/7',
    category: 'crisis',
    isEmergency: true,
  },
  {
    id: '3',
    name: 'Singapore Association for Mental Health (SAMH)',
    phone: '1800 283 7019',
    description: 'Provides emotional support and counselling for individuals and families experiencing distress.',
    availability: 'Mon–Fri, 9am–6pm',
    category: 'mental-health',
  },
  {
    id: '4',
    name: 'Care Corner Counselling Centre (Mandarin)',
    phone: '1800 353 5800',
    description: 'Mandarin-language counselling and emotional support line. Available daily 10am–10pm.',
    availability: '10am–10pm daily',
    category: 'mental-health',
  },
  {
    id: '5',
    name: 'CARE Singapore – Hear4U WhatsApp Line',
    phone: 'WhatsApp 6978 2728',
    description: 'WhatsApp-based emotional support for anyone feeling stressed or overwhelmed. Not for emergencies.',
    availability: 'Mon–Fri, 10am–5pm',
    category: 'support',
  },
  {
    id: '6',
    name: 'Oogachaga (LGBTQ+ Support)',
    phone: '1800 222 6222',
    description: 'Confidential counselling and support for the LGBTQ+ community. WhatsApp 8592 0609 for text-based support.',
    availability: 'Mon–Fri, 10am–6pm',
    category: 'community',
  },
];


const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the recommended amount of sleep for adults per night?',
    options: ['5-6 hours', '7-9 hours', '10-12 hours', '4-5 hours'],
    correctAnswer: 1,
    explanation: 'Adults need 7-9 hours of sleep per night for optimal mental and physical health.',
  },
  {
    id: 2,
    question: 'Which of these is a healthy coping mechanism for stress?',
    options: ['Avoiding all stressful situations', 'Deep breathing exercises', 'Ignoring your feelings', 'Working without breaks'],
    correctAnswer: 1,
    explanation: 'Deep breathing exercises activate the parasympathetic nervous system, helping reduce stress and anxiety.',
  },
  {
    id: 3,
    question: 'What does "mindfulness" mean?',
    options: ['Thinking about the future', 'Being present in the moment', 'Multitasking efficiently', 'Planning ahead'],
    correctAnswer: 1,
    explanation: 'Mindfulness is the practice of being fully present and engaged in the current moment without judgment.',
  },
  {
    id: 4,
    question: 'How often should you practice self-care?',
    options: ['Only when stressed', 'Once a month', 'Daily', 'Only on weekends'],
    correctAnswer: 2,
    explanation: 'Self-care should be a daily practice, not just something you do when you\'re already overwhelmed.',
  },
  {
    id: 5,
    question: 'Which activity is proven to boost mental health?',
    options: ['Staying indoors all day', 'Regular physical exercise', 'Skipping meals', 'Avoiding social contact'],
    correctAnswer: 1,
    explanation: 'Regular physical exercise releases endorphins and has been proven to reduce symptoms of depression and anxiety.',
  },
];

const breathingExercises = [
  { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, description: 'Promotes relaxation and sleep' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, description: 'Used by Navy SEALs for focus' },
  { name: 'Calm Breathing', inhale: 5, hold: 2, exhale: 5, description: 'Quick stress relief' },
];

const affirmations = [
  "I am worthy of love and respect.",
  "I choose to focus on what I can control.",
  "My feelings are valid and important.",
  "I am doing the best I can, and that's enough.",
  "I deserve peace and happiness.",
  "Every day is a new opportunity to grow.",
  "I am stronger than my challenges.",
  "I trust myself to make good decisions.",
];

export const ResourcesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Breathing exercise state
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(0);

  // Meditation timer state
  const [meditationTime, setMeditationTime] = useState(5);
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTimer, setMeditationTimer] = useState(0);

  // Affirmation state
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  // Initialize tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['learn', 'practice', 'support'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Keyboard navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, tab: TabType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabChange(tab);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const tabs: TabType[] = ['learn', 'practice', 'support'];
      const currentIndex = tabs.indexOf(activeTab);
      const nextIndex = (currentIndex + 1) % tabs.length;
      handleTabChange(tabs[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const tabs: TabType[] = ['learn', 'practice', 'support'];
      const currentIndex = tabs.indexOf(activeTab);
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      handleTabChange(tabs[prevIndex]);
    }
  };

  const categories = ['all', 'mental-health', 'self-care', 'wellness'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental-health': return 'bg-sage-100 text-sage-700';
      case 'self-care': return 'bg-lavender-100 text-lavender-700';
      case 'wellness': return 'bg-blush-100 text-blush-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleArticleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Quiz handlers
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  // Breathing exercise handlers
  const startBreathing = () => {
    setBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTimer(breathingExercises[selectedExercise].inhale);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
  };

  React.useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          const exercise = breathingExercises[selectedExercise];
          if (breathingPhase === 'inhale') {
            setBreathingPhase('hold');
            return exercise.hold;
          } else if (breathingPhase === 'hold') {
            setBreathingPhase('exhale');
            return exercise.exhale;
          } else {
            setBreathingPhase('inhale');
            return exercise.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase, selectedExercise]);

  // Meditation timer handlers
  const startMeditation = () => {
    setMeditationActive(true);
    setMeditationTimer(meditationTime * 60);
  };

  const stopMeditation = () => {
    setMeditationActive(false);
    setMeditationTimer(0);
  };

  React.useEffect(() => {
    if (!meditationActive || meditationTimer <= 0) {
      if (meditationTimer === 0 && meditationActive) {
        setMeditationActive(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setMeditationTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [meditationActive, meditationTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Affirmation handlers
  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const tabs = [
    {
      id: 'learn' as TabType,
      label: 'Learn',
      icon: GraduationCap,
      color: 'from-sage-500 to-emerald-500',
    },
    {
      id: 'practice' as TabType,
      label: 'Practice',
      icon: Gamepad2,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'support' as TabType,
      label: 'Support',
      icon: HeartHandshake,
      color: 'from-rose-400 to-coral-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sage-100 to-lavender-100 px-4 py-2 rounded-full">
          <Sparkles className="w-5 h-5 text-sage-600" />
          <span className="text-sage-700 font-semibold">Mental Wellness Hub</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
          Learn, Practice & Get Support
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore helpful articles, practice mindfulness exercises, and access 24/7 crisis support
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-md p-1.5">
        <div 
          className="grid grid-cols-3 gap-1.5"
          role="tablist"
          aria-label="Resource categories"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabChange(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br ' + tab.color + ' text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[600px]">
        {/* Learn Tab */}
        {activeTab === 'learn' && (
          <div
            role="tabpanel"
            id="learn-panel"
            aria-labelledby="learn-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sage-600" />
              <h2 className="text-2xl font-serif font-semibold text-gray-800">Self-Help Articles</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                  aria-label="Search articles"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                    aria-pressed={selectedCategory === category}
                  >
                    {category === 'all' ? 'All' : category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article.url)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
                        {article.category.split('-').join(' ')}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-5 h-5 text-sage-600" />
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-gray-800 group-hover:text-sage-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found matching your search.</p>
              </div>
            )}

            {/* Additional Resources Banner */}
            <div className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-6 mt-6">
              <div className="text-center space-y-3">
                <Heart className="w-10 h-10 text-sage-600 mx-auto" />
                <h3 className="text-xl font-serif font-semibold text-gray-800">
                  Remember: You're Not Alone
                </h3>
                <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-sm">
                  Mental health challenges are common, and seeking help is a sign of strength. 
                  Whether you're struggling or just need someone to talk to, support is always available.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div
            role="tabpanel"
            id="practice-panel"
            aria-labelledby="practice-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-serif font-semibold text-gray-800">Interactive Tools</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Mental Health Quiz */}
              <div className="soft-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-800">Mental Health Quiz</h3>
                    <p className="text-xs text-gray-600">Test your knowledge</p>
                  </div>
                </div>

                {!quizStarted ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Challenge yourself with our interactive quiz covering mental health basics and wellness strategies.
                    </p>
                    <button
                      onClick={startQuiz}
                      className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Trophy className="w-4 h-4" />
                      Start Quiz
                    </button>
                  </div>
                ) : quizCompleted ? (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">Complete!</h4>
                      <p className="text-sm text-gray-600">
                        Score: <span className="font-bold text-purple-600">{score}/{quizQuestions.length}</span>
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(score / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={startQuiz}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">
                        Q{currentQuestion + 1}/{quizQuestions.length}
                      </span>
                      <span className="font-semibold text-purple-600">
                        Score: {score}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {quizQuestions[currentQuestion].question}
                      </h4>

                      <div className="space-y-2">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showExplanation}
                            className={`w-full p-3 rounded-lg text-left text-sm font-medium transition-all ${
                              selectedAnswer === index
                                ? showExplanation
                                  ? index === quizQuestions[currentQuestion].correctAnswer
                                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                    : 'bg-red-100 border-2 border-red-500 text-red-800'
                                  : 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                                : showExplanation && index === quizQuestions[currentQuestion].correctAnswer
                                ? 'bg-green-100 border-2 border-green-500 text-green-800'
                                : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {showExplanation && index === quizQuestions[currentQuestion].correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                              {option}
                            </div>
                          </button>
                        ))}
                      </div>

                      {showExplanation && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800 leading-relaxed">
                            <strong>Explanation:</strong> {quizQuestions[currentQuestion].explanation}
                          </p>
                        </div>
                      )}

                      {!showExplanation ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={selectedAnswer === null}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Submit
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                        >
                          {currentQuestion < quizQuestions.length - 1 ? 'Next' : 'Results'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Breathing Exercise */}
              <div className="soft-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-800">Breathing Exercise</h3>
                    <p className="text-xs text-gray-600">Calm your mind</p>
                  </div>
                </div>

                {!breathingActive ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Practice guided breathing to reduce stress and anxiety.
                    </p>

                    <div className="space-y-2">
                      {breathingExercises.map((exercise, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedExercise(index)}
                          className={`w-full p-3 rounded-lg text-left transition-all ${
                            selectedExercise === index
                              ? 'bg-blue-100 border-2 border-blue-500'
                              : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-semibold text-gray-800">{exercise.name}</span>
                              <p className="text-xs text-gray-600">{exercise.description}</p>
                            </div>
                            <span className="text-xs text-gray-600 font-mono">
                              {exercise.inhale}-{exercise.hold}-{exercise.exhale}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={startBreathing}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Target className="w-4 h-4" />
                      Start
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <div className="relative w-32 h-32 mx-auto">
                        <div
                          className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                            breathingPhase === 'inhale'
                              ? 'bg-gradient-to-br from-blue-400 to-cyan-400 scale-100'
                              : breathingPhase === 'hold'
                              ? 'bg-gradient-to-br from-purple-400 to-pink-400 scale-100'
                              : 'bg-gradient-to-br from-green-400 to-emerald-400 scale-75'
                          }`}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-white mb-1">{breathingTimer}</span>
                          <span className="text-sm font-semibold text-white capitalize">{breathingPhase}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        {breathingPhase === 'inhale' && 'Breathe in slowly...'}
                        {breathingPhase === 'hold' && 'Hold gently...'}
                        {breathingPhase === 'exhale' && 'Breathe out slowly...'}
                      </p>
                    </div>

                    <button
                      onClick={stopBreathing}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm"
                    >
                      Stop
                    </button>
                  </div>
                )}
              </div>

              {/* Meditation Timer */}
              <div className="soft-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-800">Meditation Timer</h3>
                    <p className="text-xs text-gray-600">Guided meditation</p>
                  </div>
                </div>

                {!meditationActive ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Set a timer for your meditation practice.
                    </p>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Duration (minutes)
                      </label>
                      <div className="flex gap-2">
                        {[5, 10, 15, 20].map((time) => (
                          <button
                            key={time}
                            onClick={() => setMeditationTime(time)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                              meditationTime === time
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {time}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={startMeditation}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Moon className="w-4 h-4" />
                      Start Meditation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 animate-pulse" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-white">{formatTime(meditationTimer)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Focus on your breath...</p>
                    </div>

                    <button
                      onClick={stopMeditation}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm"
                    >
                      Stop
                    </button>
                  </div>
                )}
              </div>

              {/* Daily Affirmation */}
              <div className="soft-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-800">Daily Affirmation</h3>
                    <p className="text-xs text-gray-600">Positive thoughts</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 text-center space-y-4">
                  <div className="text-4xl">✨</div>
                  <p className="text-lg font-serif font-semibold text-gray-800 leading-relaxed">
                    "{affirmations[currentAffirmation]}"
                  </p>
                </div>

                <button
                  onClick={nextAffirmation}
                  className="w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                >
                  Next Affirmation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Support Tab - SOFTER PASTEL RED THEME */}
        {activeTab === 'support' && (
          <div
            role="tabpanel"
            id="support-panel"
            aria-labelledby="support-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-serif font-semibold text-gray-800">24/7 Support Helplines</h2>
            </div>

            {/* Emergency Banner - SOFTER PASTEL RED */}
            <div className="bg-gradient-to-r from-rose-100 to-coral-100 rounded-2xl p-6 border-2 border-rose-200 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-200/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-rose-700" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-serif font-bold mb-2 text-rose-900">
                    💛 If You’re Struggling, Help Is Just a Call Away
                  </h3>
                  <p className="text-rose-800 mb-4 text-sm leading-relaxed">
                    If you're experiencing a mental health emergency, please reach out immediately. Help is available 24/7, and you're not alone.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="tel:1767"
                      className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Call Samaritans of Singapore 1767
                    </a>
                    <a
                      href="sms:741741&body=HOME"
                      className="px-6 py-3 bg-white text-rose-700 border-2 border-rose-300 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp 9151 1767 (SOS Care Text)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Helplines Grid - SOFTER PASTEL RED FOR CRISIS */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-sage-600" />
                Available Support Services
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {helplines.map((helpline) => (
                  <div
                    key={helpline.id}
                    className={`rounded-xl shadow-md p-5 border-2 transition-all hover:shadow-lg ${
                      helpline.isEmergency
                        ? 'bg-gradient-to-br from-rose-50 to-coral-50 border-rose-200'
                        : 'bg-white border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        helpline.isEmergency
                          ? 'bg-gradient-to-br from-rose-400 to-coral-400'
                          : 'bg-gradient-to-br from-sage-400 to-lavender-400'
                      }`}>
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-semibold text-gray-800 text-base">
                            {helpline.name}
                          </h4>
                          {helpline.isEmergency && (
                            <span className="px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                              URGENT
                            </span>
                          )}
                        </div>
                        <a
                          href={`tel:${helpline.phone.replace(/[^0-9]/g, '')}`}
                          className={`text-xl font-bold block transition-colors ${
                            helpline.isEmergency
                              ? 'text-rose-700 hover:text-rose-800'
                              : 'text-sage-600 hover:text-sage-700'
                          }`}
                        >
                          {helpline.phone}
                        </a>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {helpline.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg w-fit">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-medium">{helpline.availability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Message */}
            <div className="bg-gradient-to-br from-sage-50 via-lavender-50 to-blush-50 rounded-2xl p-8">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-800">
                  You're Not Alone
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Reaching out for help is a sign of <strong>strength</strong>, not weakness. These helplines are staffed by trained professionals who genuinely care and want to help you through difficult times. Your mental health matters, and support is always available.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
