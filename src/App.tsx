import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroAndBento } from './components/HeroAndBento';
import { RepositoryTable } from './components/RepositoryTable';
import { StudentPortal } from './components/StudentPortal';
import { TrackingView } from './components/TrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { GuidesView } from './components/GuidesView';
import { LoginModal } from './components/LoginModal';
import { AnnouncementsModal } from './components/AnnouncementsModal';
import { PrintCertificateModal } from './components/PrintCertificateModal';
import { Footer } from './components/Footer';
import { ArrowUp } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, selectedSkripsiForPrint, setSelectedSkripsiForPrint } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Scroll depth tracking (for smooth top progress bar & back-to-top button)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowBackToTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger smooth scroll to top and top loading bar when changing pages
  useEffect(() => {
    setIsPageLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleExploreClick = () => {
    setActiveTab('home');
    const el = document.getElementById('repository-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-blue-500/20 selection:text-blue-700 relative">
      
      {/* 1. Scroll-Driven Progress Bar at very top of screen (tracks scroll depth 0% to 100%) */}
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-[2.5px] bg-[#004080] z-[9999] transition-[width] duration-75 ease-out pointer-events-none"
      />

      {/* 2. Top Animated Loading Bar on Page Switch */}
      {isPageLoading && (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
          <div className="h-[2.5px] bg-[#004080] top-loader-bar"></div>
        </div>
      )}

      {/* Floating Navbar */}
      <Navbar />

      {/* Main View Switcher with Smooth Transition Animation */}
      <main className="flex-1">
        <div key={activeTab} className="animate-page-enter">
          {activeTab === 'home' && (
            <>
              <HeroAndBento
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onExploreClick={handleExploreClick}
              />
              <RepositoryTable
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </>
          )}

          {activeTab === 'guides' && <GuidesView />}

          {activeTab === 'student' && <StudentPortal />}

          {activeTab === 'tracking' && <TrackingView />}

          {activeTab === 'admin' && <AdminDashboard />}
        </div>
      </main>

      {/* Floating Back to Top Button with Smooth Scroll */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#003366] hover:bg-[#002244] text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group"
          title="Kembali ke Atas"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Global Modals */}
      <LoginModal />
      <AnnouncementsModal />
      {selectedSkripsiForPrint && (
        <PrintCertificateModal
          skripsiItem={selectedSkripsiForPrint}
          onClose={() => setSelectedSkripsiForPrint(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
