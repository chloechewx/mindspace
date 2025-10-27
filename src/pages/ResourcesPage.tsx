import React, { useState } from 'react';
import { BookOpen, ExternalLink, Search, Clock, Heart, Brain, Sparkles, Trophy, Target, Zap, Phone, CheckCircle } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: 'mental-health' | 'self-care' | 'wellness';
  readTime: string;
  excerpt: string;
  image: string;
  tags: string[];
  url: string; // External article URL
}

interface Helpline {
  id: string;
  name: string;
  phone: string;
  description: string;
  availability: string;
  category: 'crisis' | 'mental-health' | 'support';
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Anxiety: A Comprehensive Guide',
    category: 'mental-health',
    readTime: '8 min read',
    excerpt: 'Learn about anxiety disorders, their symptoms, and evidence-based coping strategies that can help you manage daily challenges.',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Anxiety', 'Mental Health', 'Coping'],
    url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
  },
  {
    id: '2',
    title: 'The Power of Mindfulness Meditation',
    category: 'wellness',
    readTime: '6 min read',
    excerpt: 'Discover how mindfulness meditation can reduce stress, improve focus, and enhance your overall well-being.',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Mindfulness', 'Meditation', 'Stress'],
    url: 'https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858',
  },
  {
    id: '3',
    title: 'Building Healthy Sleep Habits',
    category: 'self-care',
    readTime: '7 min read',
    excerpt: 'Quality sleep is essential for mental health. Learn practical tips to improve your sleep hygiene and wake up refreshed.',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Sleep', 'Self-Care', 'Health'],
    url: 'https://www.sleepfoundation.org/sleep-hygiene',
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
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: 'Free, confidential support 24/7 for people in distress. Call or text for immediate help.',
    availability: '24/7',
    category: 'crisis',
  },
  {
    id: '2',
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Text with a trained crisis counselor. Free, 24/7 support for anyone in crisis.',
    availability: '24/7',
    category: 'crisis',
  },
  {
    id: '3',
    name: 'NAMI Helpline',
    phone: '1-800-950-6264',
    description: 'National Alliance on Mental Illness helpline for information, referrals, and support.',
    availability: 'Mon-Fri, 10am-10pm ET',
    category: 'mental-health',
  },
  {
    id: '4',
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Treatment referral and information service for mental health and substance use disorders.',
    availability: '24/7',
    category: 'mental-health',
  },
  {
    id: '5',
    name: 'Anxiety and Depression Hotline',
    phone: '1-800-273-8255',
    description: 'Specialized support for anxiety and depression. Trained counselors available to help.',
    availability: '24/7',
    category: 'support',
  },
  {
    id: '6',
    name: 'Veterans Crisis Line',
    phone: '988 then Press 1',
    description: 'Confidential support for veterans and their families. Available 24/7.',
    availability: '24/7',
    category: 'crisis',
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
  { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8 },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4 },
  { name: 'Calm Breathing', inhale: 5, hold: 2, exhale: 5 },
];

export const ResourcesPage: React.FC = () => {
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

  const getHelplineColor = (category: string) => {
    switch (category) {
      case 'crisis': return 'bg-red-100 text-red-700 border-red-200';
      case 'mental-health': return 'bg-sage-100 text-sage-700 border-sage-200';
      case 'support': return 'bg-lavender-100 text-lavender-700 border-lavender-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Article click handler
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

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sage-100 to-lavender-100 px-6 py-3 rounded-full">
          <Sparkles className="w-6 h-6 text-sage-600" />
          <span className="text-sage-700 font-semibold text-lg">Mental Wellness Hub</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
          Learn, Practice & Grow
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore helpful articles, test your knowledge, and practice mindfulness exercises
        </p>
      </div>

      {/* Interactive Games Section */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Mental Health Quiz */}
        <div className="soft-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-semibold text-gray-800">Mental Health Quiz</h3>
              <p className="text-gray-600">Test your wellness knowledge</p>
            </div>
          </div>

          {!quizStarted ? (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Challenge yourself with our interactive quiz covering mental health basics, self-care practices, and wellness strategies.
              </p>
              <button
                onClick={startQuiz}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                Start Quiz
              </button>
            </div>
          ) : quizCompleted ? (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h4>
                <p className="text-xl text-gray-600">
                  You scored <span className="font-bold text-purple-600">{score}</span> out of {quizQuestions.length}
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(score / quizQuestions.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {score === quizQuestions.length ? '🎉 Perfect score!' : 
                   score >= quizQuestions.length * 0.7 ? '👏 Great job!' : 
                   '💪 Keep learning!'}
                </p>
              </div>
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="text-sm font-semibold text-purple-600">
                  Score: {score}
                </span>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {quizQuestions[currentQuestion].question}
                </h4>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
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
                      <div className="flex items-center gap-3">
                        {showExplanation && index === quizQuestions[currentQuestion].correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {option}
                      </div>
                    </button>
                  ))}
                </div>

                {showExplanation && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>Explanation:</strong> {quizQuestions[currentQuestion].explanation}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  {!showExplanation ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breathing Exercise */}
        <div className="soft-card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-semibold text-gray-800">Breathing Exercise</h3>
              <p className="text-gray-600">Calm your mind in minutes</p>
            </div>
          </div>

          {!breathingActive ? (
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Practice guided breathing exercises to reduce stress and anxiety. Choose your preferred technique and follow along.
              </p>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Exercise
                </label>
                {breathingExercises.map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedExercise(index)}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                      selectedExercise === index
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{exercise.name}</span>
                      <span className="text-sm text-gray-600">
                        {exercise.inhale}-{exercise.hold}-{exercise.exhale}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={startBreathing}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Start Exercise
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto">
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
                    <span className="text-4xl font-bold text-white mb-2">{breathingTimer}</span>
                    <span className="text-lg font-semibold text-white capitalize">{breathingPhase}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {breathingExercises[selectedExercise].name}
                  </h4>
                  <p className="text-gray-600">
                    {breathingPhase === 'inhale' && 'Breathe in slowly through your nose...'}
                    {breathingPhase === 'hold' && 'Hold your breath gently...'}
                    {breathingPhase === 'exhale' && 'Breathe out slowly through your mouth...'}
                  </p>
                </div>
              </div>

              <button
                onClick={stopBreathing}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Stop Exercise
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Self-Help Articles Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-sage-600" />
            <h2 className="text-3xl font-serif font-semibold text-gray-800">Self-Help Articles</h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
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
      </section>

      {/* Additional Resources Banner */}
      <section className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-3xl p-8">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 text-sage-600 mx-auto" />
          <h3 className="text-2xl font-serif font-semibold text-gray-800">
            Remember: You're Not Alone
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Mental health challenges are common, and seeking help is a sign of strength. 
            Whether you're struggling or just need someone to talk to, support is always available.
          </p>
        </div>
      </section>

      {/* Helplines Section - Moved to Bottom */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Phone className="w-8 h-8 text-blush-600" />
          <h2 className="text-3xl font-serif font-semibold text-gray-800">24/7 Support Helplines</h2>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                In Crisis? Get Immediate Help
              </h3>
              <p className="text-gray-700 mb-4">
                If you're experiencing a mental health emergency, please reach out immediately. Help is available 24/7.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="tel:988"
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Call 988
                </a>
                <a
                  href="sms:741741&body=HOME"
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all"
                >
                  Text HOME to 741741
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {helplines.map((helpline) => (
            <div
              key={helpline.id}
              className={`rounded-2xl shadow-lg p-6 border-2 ${getHelplineColor(helpline.category)} hover:shadow-xl transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blush-400 to-lavender-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow space-y-3">
                  <h3 className="text-xl font-serif font-semibold text-gray-800">
                    {helpline.name}
                  </h3>
                  <a
                    href={`tel:${helpline.phone.replace(/[^0-9]/g, '')}`}
                    className="text-2xl font-bold text-sage-600 hover:text-sage-700 transition-colors block"
                  >
                    {helpline.phone}
                  </a>
                  <p className="text-gray-700 leading-relaxed">
                    {helpline.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{helpline.availability}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
