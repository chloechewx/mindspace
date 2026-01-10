import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { TherapyPage } from './pages/TherapyPage';
import { CommunityPage } from './pages/CommunityPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AccountPage } from './pages/AccountPage';
import { AICompanionPage } from './pages/AICompanionPage';
import { useUserStore } from './store/userStore';

function App() {
  const { initializeAuth, isInitialized } = useUserStore();

  useEffect(() => {
    console.log('🚀 App mounted, initializing auth...');
    initializeAuth();
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 via-lavender-50 to-blush-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading MindSpace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-lavender-50 to-blush-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/therapy" element={<TherapyPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/event/:eventId" element={<EventDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/ai-companion" element={<AICompanionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </Router>
  );
}

export default App;
