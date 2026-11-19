import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Mail,
  ExternalLink,
  BookOpen,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  const handleNavClick = (tab: 'home' | 'student' | 'tracking' | 'guides') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 bg-[#002244] text-slate-300 border-t-4 border-[#004080]">
      {/* Top Wave / Accent Divider */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-amber-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          
          {/* Kolom 1: Profil & Identitas Institusi */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/lambang-unri.png"
                alt="Lambang Resmi Universitas Riau"
                className="h-14 w-auto object-contain shrink-0 drop-shadow-md"
              />
              <div>
                <span className="text-white font-extrabold text-sm sm:text-base tracking-wide block leading-tight font-serif">
                  UNIVERSITAS RIAU
                </span>
                <span className="text-sky-300 text-xs font-semibold block leading-tight mt-0.5">
                  UPA Perpustakaan
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem Informasi Manajemen Skripsi dan Repositori Karya Ilmiah resmi Universitas Riau untuk pengumpulan, verifikasi, dan administrasi naskah tugas akhir mahasiswa.
            </p>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Kementerian Pendidikan Tinggi, Sains, dan Teknologi</span>
              </p>
              <p className="text-slate-400">Republik Indonesia</p>
            </div>
          </div>

          {/* Kolom 2: Layanan Mahasiswa */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Layanan Mahasiswa</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('student')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Penyerahan Naskah Skripsi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('tracking')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Lacak Status Verifikasi Naskah</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Repositori Naskah Skripsi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('guides')}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Panduan & Syarat Penyerahan</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Institusi & Repositori */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Tautan Kampus</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://unri.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Portal Universitas Riau</span>
                </a>
              </li>
              <li>
                <a
                  href="https://perpustakaan.unri.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Laman UPA Perpustakaan</span>
                </a>
              </li>
              <li>
                <a
                  href="https://repository.unri.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Repositori Institusi UNRI</span>
                </a>
              </li>
              <li>
                <a
                  href="https://ejournal.unri.ac.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                >
                  <ChevronRight className="w-3 h-3 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>E-Journal Universitas Riau</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Lokasi & Jam Layanan */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider border-b border-white/10 pb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Lokasi & Kontak</span>
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Gedung UPA Perpustakaan UNRI, Kampus Bina Widya Km. 12,5 Simpang Baru, Pekanbaru 28293, Riau
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>perpustakaan@unri.ac.id</span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Pelayanan Daring Aktif 24 Jam</span>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  Loket Fisik: Senin - Jumat (08.00 - 16.00 WIB)
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} UPA Perpustakaan Universitas Riau. Hak Cipta Dilindungi Undang-Undang.
          </p>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-sky-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Terverifikasi Resmi</span>
            </span>
            <span>•</span>
            <span>Versi 2.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
