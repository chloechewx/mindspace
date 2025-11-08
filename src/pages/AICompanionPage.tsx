import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader, BookOpen, Calendar, Heart, Lock, Menu, X, Plus, Search, MessageSquare, ChevronRight, Trash2 } from 'lucide-react';
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

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created_at: Date;
  updated_at: Date;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadJournalEntries();
      loadChatSessions();
    } else {
      setIsLoadingJournal(false);
      setIsLoadingChats(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (shouldScrollRef.current && messagesContainerRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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

  const loadChatSessions = async () => {
    if (!user) return;

    console.log('💬 Loading chat sessions from database...');
    setIsLoadingChats(true);

    try {
      // Load sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      if (!sessionsData || sessionsData.length === 0) {
        console.log('ℹ️ No existing sessions, creating new one...');
        await createNewChat();
        return;
      }

      // Load messages for each session
      const sessionsWithMessages = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', session.id)
            .order('timestamp', { ascending: true });

          if (messagesError) throw messagesError;

          return {
            id: session.id,
            title: session.title,
            created_at: new Date(session.created_at),
            updated_at: new Date(session.updated_at),
            messages: (messagesData || []).map(msg => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant',
              content: msg.content,
              timestamp: new Date(msg.timestamp),
            })),
          };
        })
      );

      console.log(`✅ Loaded ${sessionsWithMessages.length} chat sessions`);
      setChatSessions(sessionsWithMessages);

      // Set current session to most recent
      if (sessionsWithMessages.length > 0) {
        const mostRecent = sessionsWithMessages[0];
        setCurrentSessionId(mostRecent.id);
        setMessages(mostRecent.messages);
      }
    } catch (error: any) {
      console.error('💥 Failed to load chat sessions:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const createNewChat = async () => {
    if (!user) return;

    console.log('➕ Creating new chat session...');

    try {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Hey there! 👋 I'm your wellness buddy.\n\nI've checked out your journal entries and I'm here to chat about whatever's on your mind. Need to talk through something? Want some insights? Just wanna vent?\n\nWhat's up?`,
        timestamp: new Date(),
      };

      // Create session in database
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Conversation',
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Save welcome message
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionData.id,
          role: welcomeMessage.role,
          content: welcomeMessage.content,
          timestamp: welcomeMessage.timestamp.toISOString(),
        });

      if (messageError) throw messageError;

      const newSession: ChatSession = {
        id: sessionData.id,
        title: sessionData.title,
        messages: [welcomeMessage],
        created_at: new Date(sessionData.created_at),
        updated_at: new Date(sessionData.updated_at),
      };

      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([welcomeMessage]);
      shouldScrollRef.current = true;

      console.log('✅ New chat session created:', sessionData.id);
    } catch (error: any) {
      console.error('💥 Failed to create new chat:', error);
    }
  };

  const getSuggestedPrompts = (): string[] => {
    if (journalEntries.length === 0) {
      return [
        "How do I start journaling?",
        "What helps with stress?",
      ];
    }

    const recentEntry = journalEntries[0];
    const recentMood = recentEntry.mood;
    const recentDate = format(new Date(recentEntry.created_at), 'MMM d');

    return [
      `I was feeling ${recentMood} on ${recentDate}. Any thoughts?`,
      `What patterns do you see in my entries?`,
    ];
  };

  const buildJournalContext = (): string => {
    if (journalEntries.length === 0) {
      return "The user hasn't written any journal entries yet.";
    }

    const recentEntries = journalEntries.slice(0, 10);
    const context = recentEntries.map((entry, index) => {
      const date = format(new Date(entry.created_at), 'MMM d, yyyy');
      return `Entry ${index + 1} (${date}, Mood: ${entry.mood}):\n${entry.content}`;
    }).join('\n\n---\n\n');

    return `Here are the user's recent journal entries:\n\n${context}`;
  };

  const updateSessionTitle = async (sessionId: string, firstUserMessage: string) => {
    try {
      // Generate title from first message (first 50 chars)
      const title = firstUserMessage.length > 50 
        ? firstUserMessage.substring(0, 50) + '...'
        : firstUserMessage;

      await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      // Update local state
      setChatSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, title } : session
      ));
    } catch (error) {
      console.error('Failed to update session title:', error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    
    if (!textToSend || isLoading || !currentSessionId || !user) return;

    console.log('💬 Sending message to AI Companion:', textToSend);

    // Disable auto-scroll when user sends message
    shouldScrollRef.current = false;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Save user message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          role: userMessage.role,
          content: userMessage.content,
          timestamp: userMessage.timestamp.toISOString(),
        });

      // Update session title if this is the first user message
      const currentSession = chatSessions.find(s => s.id === currentSessionId);
      if (currentSession && currentSession.title === 'New Conversation') {
        await updateSessionTitle(currentSessionId, textToSend);
      }

      const journalContext = buildJournalContext();
      
      const conversationHistory = messages
        .slice(-5)
        .map(msg => `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}`)
        .join('\n\n');

      const prompt = `You're chatting with a friend about their mental wellness. Keep it casual and conversational.

${journalContext}

Recent chat:
${conversationHistory}

Their message: ${textToSend}

Respond like a supportive friend would. Keep it short (2-4 sentences). Reference their journal if relevant. Ask a follow-up question or offer a quick thought.

Be real, be warm, be human.`;

      console.log('🤖 Calling Gemini API...');
      const response = await geminiService.generateChatResponse(prompt);

      console.log('✅ AI response received');

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      // Enable auto-scroll for AI response
      shouldScrollRef.current = true;

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to database
      await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          role: assistantMessage.role,
          content: assistantMessage.content,
          timestamp: assistantMessage.timestamp.toISOString(),
        });

      // Update session updated_at
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      // Update local state
      setChatSessions(prev => prev.map(session =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage, assistantMessage],
              updated_at: new Date(),
            }
          : session
      ));
    } catch (error: any) {
      console.error('❌ Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Oof, something went wrong on my end. Mind trying that again? I'm here when you're ready!",
        timestamp: new Date(),
      };

      shouldScrollRef.current = true;
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

  const handleNewChat = async () => {
    await createNewChat();
  };

  const handleSelectChat = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      shouldScrollRef.current = true;
    }
  };

  const handleDeleteChat = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Delete this conversation?')) return;

    try {
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      setChatSessions(prev => prev.filter(s => s.id !== sessionId));

      if (currentSessionId === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          handleSelectChat(remaining[0].id);
        } else {
          await createNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleLockClick = () => {
    console.log('🔒 Lock clicked - opening sign in modal');
    openModal('login', 'Sign in to chat with your AI wellness buddy');
  };

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Show lock overlay if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-lavender-50 to-purple-50">
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
              Your AI wellness buddy is waiting to chat
            </p>
          </div>

          <div className="space-y-3 text-left bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lavender-600" />
              What You'll Get:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>Casual, friendly conversations about your wellness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>Insights based on your journal entries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>Quick tips and suggestions when you need them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lavender-600 mt-1">•</span>
                <span>A supportive space to talk things through</span>
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
    );
  }

  // Authenticated user view - ChatGPT-style layout with light theme
  if (isLoadingJournal || isLoadingChats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-lavender-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading your AI Companion...</p>
        </div>
      </div>
    );
  }

  const suggestedPrompts = getSuggestedPrompts();

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white">
      {/* Sidebar - Light Theme */}
      <div
        className={`${
          isSidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl font-semibold hover:from-lavender-600 hover:to-purple-600 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-lavender-400 placeholder-gray-400 border border-gray-200"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSessions.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectChat(session.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                  currentSessionId === session.id
                    ? 'bg-lavender-50 text-gray-800 border border-lavender-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="w-5 h-5 flex-shrink-0 text-lavender-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{session.title}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {session.messages.length} messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                  aria-label="Delete chat"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </button>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-lavender-50 to-purple-50 rounded-lg border border-lavender-200">
            <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{journalEntries.length} journal entries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">AI Companion</h1>
                <p className="text-sm text-gray-500">Your wellness buddy</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-sage-600" />
              <span className="text-gray-600">{journalEntries.length} entries</span>
            </div>
            {journalEntries.length > 0 && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-lavender-600" />
                  <span className="text-gray-600">
                    {format(new Date(journalEntries[0].created_at), 'MMM d')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-blush-600" />
                  <span className="text-gray-600">{journalEntries[0].mood}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-lavender-500 to-purple-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-lavender-600" />
                      <span className="text-sm font-semibold text-lavender-600">AI Companion</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-3 ${message.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                    {format(message.timestamp, 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Loader className="w-5 h-5 text-lavender-600 animate-spin" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {/* Suggested Prompts */}
            {messages.length <= 1 && !isLoading && (
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-left p-4 bg-gradient-to-br from-lavender-50 to-purple-50 hover:from-lavender-100 hover:to-purple-100 rounded-xl text-sm text-gray-700 transition-all hover:shadow-md border border-lavender-200"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-lavender-600 mt-0.5 flex-shrink-0" />
                      <span>{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message AI Companion..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-lavender-400 resize-none bg-white shadow-sm"
                  rows={1}
                  disabled={isLoading}
                  style={{ minHeight: '52px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="px-5 py-3 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[52px]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-400 text-center mt-3">
              AI Companion can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
