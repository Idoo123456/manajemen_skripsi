import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  FileCheck2,
  Home,
  BookMarked,
  Search,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & University branding */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0 select-none"
          >
            <img
              src="/logo-unri.png"
              alt="Logo Resmi Universitas Riau"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col border-l border-slate-200 pl-3">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#003366] leading-tight">
                UPA PERPUSTAKAAN
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-tight mt-0.5">
                SIM Skripsi & Bebas Pustaka
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda & Repositori</span>
            </button>

            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-blue-700 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
              <span>Formulir Bebas Pustaka</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lacak Pengajuan</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'guides'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Panduan</span>
            </button>
          </nav>

          {/* Right Action: Clean Direct Action Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('student')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-sky-300" />
              <span>Ajukan Bebas Pustaka</span>
            </button>

            {/* Mobile / Tablet Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer"
              title="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 flex flex-col gap-2 animate-in fade-in duration-150">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Menu Layanan Mahasiswa
            </div>

            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition-colors flex items-center gap-2.5 ${
                activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-blue-600" />
              <span>Beranda & Repositori</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('student');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'student' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Formulir Bebas Pustaka</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                Online
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('tracking');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'tracking' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Lacak Status & Resi Digital</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Realtime
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('guides');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl text-left text-sm font-semibold transition-colors flex items-center gap-2.5 ${
                activeTab === 'guides' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <BookMarked className="w-4 h-4 text-blue-600" />
              <span>Panduan & Standar Dokumen</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveTab('student');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold shadow-sm"
              >
                <span>Mulai Pengisian Data Skripsi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
