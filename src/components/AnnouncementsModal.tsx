import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, CheckCircle2 } from 'lucide-react';

export const AnnouncementsModal: React.FC = () => {
  const { selectedAnnouncement, setSelectedAnnouncement } = useApp();

  if (!selectedAnnouncement) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              selectedAnnouncement.JenisTulisan === 1
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {selectedAnnouncement.JenisTulisan === 1 ? 'Pengumuman Layanan' : 'Panduan & Standar Dokumen'}
          </span>

          <button
            onClick={() => setSelectedAnnouncement(null)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Tanggal Publikasi: {selectedAnnouncement.TanggalDibuat}</span>
            <span>•</span>
            <span>UPA Perpustakaan Universitas Riau</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
            {selectedAnnouncement.Judul}
          </h2>

          <div className="mt-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
            {selectedAnnouncement.Isi}
          </div>

          {/* Guidelines notes */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Ketentuan Pemustaka</span>
            </div>
            <p>
              Informasi ini berlaku resmi untuk seluruh mahasiswa Universitas Riau yang sedang mengurus
              persyaratan yudisium dan bebas pustaka. Hubungi pustakawan repositori jika membutuhkan panduan lebih lanjut.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setSelectedAnnouncement(null)}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
