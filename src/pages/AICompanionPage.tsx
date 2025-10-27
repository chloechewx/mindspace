import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader, RefreshCw, BookOpen, Calendar, Heart, Lock } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthModalStore } from '../store/authModalStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { geminiService } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface JournalEntry {
  id: string;
  content: string;
  mood: string;
  created_at: string;
}

export const AICompanionPage: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useAuthModalStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoadingJournal, setIsLoadingJournal] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadJournalEntries();
      initializeChat();
    } else {
      setIsLoadingJournal(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadJournalEntries = async () => {
    if (!user) return;

    console.log('📖 Loading journal entries for AI context...');
    setIsLoadingJournal(true);

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('id, content, mood, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ Error loading journal entries:', error);
        throw error;
      }

      console.log(`✅ Loaded ${data?.length || 0} journal entries`);
      setJournalEntries(data || []);
    } catch (error: any) {
      console.error('💥 Failed to load journal entries:', error);
    } finally {
      setIsLoadingJournal(false);
    }
  };

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! 👋 I'm your AI Companion, here to support your mental wellness journey.\n\nI've read your journal entries and I'm here to:\n• Provide compassionate support and insights\n• Help you reflect on your emotional patterns\n• Offer personalized suggestions for your well-being\n• Be a safe space for your thoughts and feelings\n\nHow can I support you today?`,
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
  };

  const getSuggestedPrompts = (): string[] => {
    if (journalEntries.length === 0) {
      return [
        "I'd like to start journaling. Where should I begin?",
        "What are some good mental wellness practices?",
        "How can I better understand my emotions?",
      ];
    }

    const recentEntry = journalEntries[0];
    const recentMood = recentEntry.mood;
    const entryCount = journalEntries.length;
    const recentDate = format(new Date(recentEntry.created_at), 'MMMM d');

    const moodCounts = journalEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    return [
      `I noticed I was feeling ${recentMood} on ${recentDate}. Can you help me understand why?`,
      `I've journaled ${entryCount} times. What patterns do you see in my entries?`,
      `My mood has been mostly ${dominantMood} lately. What does this mean?`,
      `Can you give me insights based on my recent journal entries?`,
    ];
  };

  const buildJournalContext = (): string => {
    if (journalEntries.length === 0) {
      return "The user hasn't written any journal entries yet.";
    }

    const recentEntries = journalEntries.slice(0, 10);
    const context = recentEntries.map((entry, index) => {
      const date = format(new Date(entry.created_at), 'MMMM d, yyyy');
      return `Entry ${index + 1} (${date}, Mood: ${entry.mood}):\n${entry.content}`;
    }).join('\n\n---\n\n');

    return `Here are the user's recent journal entries:\n\n${context}`;
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    
    if (!textToSend || isLoading) return;

    console.log('💬 Sending message to AI Companion:', textToSend);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const journalContext = buildJournalContext();
      
      const conversationHistory = messages
        .slice(-5)
        .map(msg => `${msg.role === 'user' ? 'User' : 'AI Companion'}: ${msg.content}`)
        .join('\n\n');

      const prompt = `You are a compassionate AI mental wellness companion. You have access to the user's journal entries and conversation history.

${journalContext}

Recent Conversation:
${conversationHistory}

User's Current Message: ${textToSend}

Instructions:
- Be warm, empathetic, and supportive
- Reference specific journal entries when relevant (mention dates and moods)
- Provide personalized insights based on their journal patterns
- Offer actionable, gentle suggestions
- Validate their feelings and experiences
- Keep responses conversational and natural (2-4 paragraphs)
- If they ask about patterns, analyze their mood trends and themes
- Be encouraging and hopeful while acknowledging challenges

Respond to the user's message:`;

      console.log('🤖 Calling Gemini API...');
      const response = await geminiService.generateChatResponse(prompt);

      console.log('✅ AI response received');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('❌ Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment. Your well-being is important to me, and I'm here when you're ready to talk.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    handleSendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewConversation = () => {
    if (confirm('Start a new conversation? Your current chat will be cleared.')) {
      initializeChat();
    }
  };

  const handleLockClick = () => {
    console.log('🔒 Lock clicked - opening sign in modal');
    openModal('login', 'Sign in to access your AI Companion and get personalized mental wellness support');
  };

  // Show lock overlay if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="space-y-6 animate-fade-in relative">
        {/* Header */}
        <section className="soft-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-gray-800">
                AI Companion
              </h1>
              <p className="text-gray-600">
                Your personal wellness companion who knows your journey
              </p>
            </div>
          </div>
        </section>

        {/* Lock Overlay */}
        <div className="relative">
          {/* Blurred Preview Content */}
          <div className="filter blur-sm pointer-events-none select-none">
            <section className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="soft-card p-4 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl">
                  <BookOpen className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-semibold text-gray-800">12</div>
                  <div className="text-sm text-gray-600">Journal Entries</div>
                </div>
              </div>

              <div className="soft-card p-4 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl">
                  <Calendar className="w-6 h-6 text-lavender-600" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-semibold text-gray-800">Today</div>
                  <div className="text-sm text-gray-600">Last Entry</div>
                </div>
              </div>

              <div className="soft-card p-4 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blush-100 to-blush-200 rounded-xl">
                  <Heart className="w-6 h-6 text-blush-600" />
                </div>
                <div>
                  <div className="text-2xl font-serif font-semibold text-gray-800">Happy</div>
                  <div className="text-sm text-gray-600">Recent Mood</div>
                </div>
              </div>
            </section>

            <section className="soft-card p-6" style={{ height: '500px' }}>
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-br from-lavender-50 to-purple-50">
                    <p className="text-gray-800">Hello! I'm your AI Companion...</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Lock Screen Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-md">
            <div className="text-center space-y-6 max-w-md px-6">
              <button
                onClick={handleLockClick}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
                aria-label="Sign in to unlock AI Companion"
              >
                <Lock className="w-12 h-12 text-white group-hover:animate-pulse" />
              </button>

              <div className="space-y-3">
                <h2 className="text-3xl font-serif font-bold text-gray-800">
                  Sign In to Continue
                </h2>
                <p className="text-lg text-gray-600">
                  Your AI Companion is waiting to support your mental wellness journey
                </p>
              </div>

              <div className="space-y-3 text-left bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-lavender-600" />
                  What You'll Get:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-lavender-600 mt-1">•</span>
                    <span>Personalized insights based on your journal entries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender-600 mt-1">•</span>
                    <span>Compassionate support and emotional guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender-600 mt-1">•</span>
                    <span>Pattern recognition in your moods and experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lavender-600 mt-1">•</span>
                    <span>Actionable wellness suggestions tailored to you</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleLockClick}
                className="w-full px-8 py-4 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Sign In to Unlock
              </button>

              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  onClick={() => openModal('signup', 'Create an account to access your AI Companion')}
                  className="text-lavender-600 hover:text-lavender-700 font-semibold"
                >
                  Sign up free
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user view
  if (isLoadingJournal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-sage-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading your journal entries...</p>
        </div>
      </div>
    );
  }

  const suggestedPrompts = getSuggestedPrompts();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <section className="soft-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-semibold text-gray-800">
                AI Companion
              </h1>
              <p className="text-gray-600">
                Your personal wellness companion who knows your journey
              </p>
            </div>
          </div>
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-2 px-4 py-2 bg-lavender-50 text-lavender-600 rounded-xl font-semibold hover:bg-lavender-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </section>

      {/* Journal Stats */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="soft-card p-4 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-sage-100 to-sage-200 rounded-xl">
            <BookOpen className="w-6 h-6 text-sage-600" />
          </div>
          <div>
            <div className="text-2xl font-serif font-semibold text-gray-800">
              {journalEntries.length}
            </div>
            <div className="text-sm text-gray-600">Journal Entries</div>
          </div>
        </div>

        <div className="soft-card p-4 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-lavender-100 to-lavender-200 rounded-xl">
            <Calendar className="w-6 h-6 text-lavender-600" />
          </div>
          <div>
            <div className="text-2xl font-serif font-semibold text-gray-800">
              {journalEntries.length > 0 
                ? format(new Date(journalEntries[0].created_at), 'MMM d')
                : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Last Entry</div>
          </div>
        </div>

        <div className="soft-card p-4 flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blush-100 to-blush-200 rounded-xl">
            <Heart className="w-6 h-6 text-blush-600" />
          </div>
          <div>
            <div className="text-2xl font-serif font-semibold text-gray-800">
              {journalEntries.length > 0 ? journalEntries[0].mood : 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Recent Mood</div>
          </div>
        </div>
      </section>

      {/* Chat Container */}
      <section className="soft-card p-6 flex flex-col" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white'
                    : 'bg-gradient-to-br from-lavender-50 to-purple-50 text-gray-800'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-lavender-600" />
                    <span className="text-sm font-semibold text-lavender-600">AI Companion</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {format(message.timestamp, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-lavender-50 to-purple-50 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 text-lavender-600 animate-spin" />
                  <span className="text-gray-600">AI Companion is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && !isLoading && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600 font-semibold mb-2">💡 Suggested prompts:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="text-left p-3 bg-gradient-to-br from-lavender-50 to-purple-50 hover:from-lavender-100 hover:to-purple-100 rounded-xl text-sm text-gray-700 transition-all hover:shadow-md"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts with your AI companion..."
            className="flex-1 px-4 py-3 border-2 border-lavender-200 rounded-2xl focus:outline-none focus:border-lavender-400 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </section>

      {/* Info Card */}
      <section className="soft-card p-6 bg-gradient-to-br from-lavender-50 to-purple-50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
              How Your AI Companion Works
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>I read and remember your journal entries to provide personalized support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>I can identify patterns in your moods and experiences over time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>I offer compassionate insights and actionable wellness suggestions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>Your conversations with me are private and secure</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
