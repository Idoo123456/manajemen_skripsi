import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  BookOpen,
  Building2,
  Files,
  ArrowRight,
  Calendar,
  Bell,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  BookMarked
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface HeroAndBentoProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExploreClick: () => void;
}

export const HeroAndBento: React.FC<HeroAndBentoProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
}) => {
  const {
    skripsi,
    fakultas,
    jenisDokumen,
    tulisan,
    setSelectedAnnouncement,
    setActiveTab
  } = useApp();

  const [filterJenisTulisan, setFilterJenisTulisan] = useState<number | 'all'>('all');

  // Computed stats
  const totalSkripsi = skripsi.length;
  const verifiedCount = skripsi.filter(s => s.hard_copy === 1 && s.soft_copy === 1).length;
  const totalFakultas = fakultas.length;
  const totalJenisDokumen = jenisDokumen.length;

  // Filtered active articles/announcements
  const activeTulisan = tulisan
    .filter(t => t.Aktif === 1)
    .filter(t => (filterJenisTulisan === 'all' ? true : t.JenisTulisan === filterJenisTulisan));

  return (
    <div className="relative pt-8 sm:pt-12 pb-16 bg-[#F8FAFC] border-b border-slate-200">
      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Floating Pill Badge */}
        <ScrollReveal delay={0} direction="down">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-blue-900 tracking-wide">
                Layanan Resmi UPA Perpustakaan Universitas Riau
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Headline */}
        <ScrollReveal delay={100} direction="up">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-5xl font-extrabold tracking-tight leading-[1.2] text-slate-900">
              <span className="block text-slate-900">Sistem Penyerahan Karya Ilmiah &</span>
              <span className="text-[#004080]">
                Surat Bebas Pustaka Online
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Portal repositori digital resmi untuk penyerahan naskah tugas akhir, skripsi, tesis, serta penerbitan Surat Keterangan Bebas Pustaka terintegrasi UPA Perpustakaan Universitas Riau.
            </p>

            {/* Interactive Search Bar */}
            <div className="mt-7 max-w-2xl mx-auto">
              <div className="relative">
                <div className="flex items-center bg-white border-2 border-slate-300 focus-within:border-blue-600 rounded-2xl p-2 shadow-sm transition-all">
                  <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan NIM, Nama Mahasiswa, atau Judul Skripsi..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none px-2 py-2"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
                    >
                      Hapus
                    </button>
                  )}
                  <button
                    onClick={onExploreClick}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <span>Telusuri</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-slate-500">
                {skripsi.length > 0 ? (
                  <>
                    <span>Pencarian cepat:</span>
                    {skripsi.slice(0, 3).map((s) => (
                      <button
                        key={s.id_skripsi}
                        onClick={() => setSearchQuery(s.nim)}
                        className="text-blue-700 hover:underline underline-offset-2 font-medium"
                      >
                        {s.nim}
                      </button>
                    ))}
                  </>
                ) : (
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    Katalog repositori terhubung langsung ke pangkalan data UPA Perpustakaan
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action Badges without Emojis */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveTab('student')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-sky-200" />
                <span>Formulir Bebas Pustaka</span>
                <ChevronRight className="w-3.5 h-3.5 text-sky-200" />
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4 text-blue-700" />
                <span>Lacak Status & Resi Digital</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 transition-all shadow-xs cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-blue-700" />
                <span>Panduan Penyerahan</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* 4 Bento Grid Stat Cards with Staggered Scroll Reveal */}
        <div id="bento-stats-section" className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Skripsi */}
          <ScrollReveal delay={50} direction="up">
            <div className="relative group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/60 transition-all duration-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Karya Terdata
                </span>
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalSkripsi}</span>
                <span className="text-xs text-blue-600 font-semibold">Dokumen Ilmiah</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Karya akhir sarjana, magister, diploma yang terarsip di sistem repositori.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 2: Fakultas */}
          <ScrollReveal delay={150} direction="up">
            <div className="relative group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-500/60 transition-all duration-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-sky-500/10 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Fakultas Terintegrasi
                </span>
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-600">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalFakultas}</span>
                <span className="text-xs text-sky-600 font-semibold">Fakultas UNRI</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Mencakup FT, FMIPA, FEB, FKIP, FISIP, FP, FPK, FH, FK, dan FKp.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 3: Dokumen Types */}
          <ScrollReveal delay={250} direction="up">
            <div className="relative group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500/60 transition-all duration-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Kategori Dokumen
                </span>
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <Files className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{totalJenisDokumen}</span>
                <span className="text-xs text-indigo-600 font-semibold">Jenis Karya</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Skripsi, TA, Tesis, Disertasi, PKL, Artikel, Prosiding, & Paten Inovasi.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4: Verified */}
          <ScrollReveal delay={350} direction="up">
            <div className="relative group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-500/10 h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lengkap Terverifikasi
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{verifiedCount}</span>
                <span className="text-xs text-emerald-600 font-semibold">
                  {Math.round((verifiedCount / (totalSkripsi || 1)) * 100)}% Kelengkapan
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Hardcopy & Softcopy lengkap disetujui pustakawan repositori.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bento Grid: Pengumuman Layanan & Standar Dokumen (`tulisan`) */}
        <ScrollReveal delay={100} direction="up" className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 mb-2">
                <Bell className="w-3 h-3" />
                Pemberitahuan & Petunjuk Resmi
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pengumuman Layanan & Standar Dokumen
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Informasi terbaru mengenai alur verifikasi, syarat bebas pustaka, dan regulasi penulisan.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setFilterJenisTulisan('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterJenisTulisan === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({tulisan.filter(t => t.Aktif === 1).length})
              </button>
              <button
                onClick={() => setFilterJenisTulisan(1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterJenisTulisan === 1
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Layanan
              </button>
              <button
                onClick={() => setFilterJenisTulisan(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterJenisTulisan === 2
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standar Dokumen
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTulisan.map((item, idx) => (
              <ScrollReveal key={item.idTulisan} delay={idx * 80} direction="up">
                <div
                  onClick={() => setSelectedAnnouncement(item)}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/60 transition-all duration-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between cursor-pointer hover:-translate-y-1 h-full"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.JenisTulisan === 1
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {item.JenisTulisan === 1 ? 'Pengumuman Layanan' : 'Panduan & Standar'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{item.TanggalDibuat}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.Judul}
                    </h3>

                    <p className="mt-2.5 text-xs text-slate-600 line-clamp-4 leading-relaxed">
                      {item.Isi}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span>Baca Selengkapnya</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
