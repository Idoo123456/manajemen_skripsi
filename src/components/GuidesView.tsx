import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  BookMarked,
  Layers,
  GraduationCap
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const GuidesView: React.FC = () => {
  const { setActiveTab, tulisan, setSelectedAnnouncement } = useApp();

  const standardGuides = tulisan.filter(t => t.JenisTulisan === 2 && t.Aktif === 1);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <ScrollReveal delay={0} direction="up">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800 mb-4 shadow-xs">
            <BookMarked className="w-4 h-4 text-blue-700" />
            <span>Pedoman & Standarisasi Dokumen Repositori</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Panduan Penyerahan Naskah Skripsi & Tugas Akhir
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Petunjuk teknis resmi bagi mahasiswa jenjang Diploma, Sarjana, Magister, dan Doktoral Universitas Riau
            dalam penyerahan naskah hardcopy fisik dan softcopy digital ke UPA Perpustakaan.
          </p>
        </div>
      </ScrollReveal>

      {/* Step by step Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {/* Step 1 */}
        <ScrollReveal delay={50} direction="up">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all h-full">
            <div className="text-3xl font-black text-blue-200 mb-2 font-mono">01</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Sidang & Pengesahan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mahasiswa menyelesaikan ujian sidang tugas akhir dan memperoleh tanda tangan lembar pengesahan lengkap dari dosen pembimbing & penguji.
            </p>
          </div>
        </ScrollReveal>

        {/* Step 2 */}
        <ScrollReveal delay={150} direction="up">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 hover:border-sky-400 hover:shadow-xl transition-all h-full">
            <div className="text-3xl font-black text-sky-200 mb-2 font-mono">02</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Format PDF & Turnitin</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Memastikan skor similaritas Turnitin maksimal 25% serta menyiapkan file PDF naskah lengkap (cover, lembar pengesahan, abstrak, BAB I-V, lampiran).
            </p>
          </div>
        </ScrollReveal>

        {/* Step 3 */}
        <ScrollReveal delay={250} direction="up">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 hover:border-indigo-400 hover:shadow-xl transition-all h-full">
            <div className="text-3xl font-black text-indigo-200 mb-2 font-mono">03</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Penyerahan Hardcopy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menyerahkan buku fisik naskah skripsi jilid resmi dengan warna sampul sesuai fakultas masing-masing ke loket UPA Perpustakaan.
            </p>
          </div>
        </ScrollReveal>

        {/* Step 4 */}
        <ScrollReveal delay={350} direction="up">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 hover:border-emerald-400 hover:shadow-xl transition-all h-full">
            <div className="text-3xl font-black text-emerald-200 mb-2 font-mono">04</div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Penerbitan Tanda Terima</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pustakawan menerbitkan Surat Tanda Terima Penyerahan Skripsi resmi ber-QR Code untuk kelengkapan berkas pendaftaran yudisium dan wisuda.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Standard Articles Grid */}
      <div className="mb-16">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Artikel Standar Format Dokumen</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardGuides.map((item) => (
            <div
              key={item.idTulisan}
              onClick={() => setSelectedAnnouncement(item)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/50 transition-all shadow-md shadow-slate-200/50 hover:shadow-xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Panduan Resmi
                </span>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mt-3">
                  {item.Judul}
                </h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-4 leading-relaxed">
                  {item.Isi}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                <span>Baca Rincian Ketentuan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box to Student Portal */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Sudah Mempersiapkan Naskah & Ingin Mengajukan?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 mt-1.5 max-w-xl">
            Akses langsung Portal Mahasiswa untuk mendaftarkan naskah karya ilmiah, mengunggah berkas softcopy PDF, dan mencetak bukti tanda terima penyerahan skripsi Anda.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('student')}
          className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-lg shadow-black/10 transition-all cursor-pointer"
        >
          <GraduationCap className="w-4 h-4 text-blue-700" />
          <span>Isi Formulir Penyerahan Skripsi</span>
        </button>
      </div>
    </div>
  );
};
