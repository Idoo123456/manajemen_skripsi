import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Mail,
  GraduationCap,
  FileCheck2,
  FileText,
  Copy,
  Check,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const TrackingView: React.FC = () => {
  const {
    skripsi,
    fakultas,
    jurusan,
    jenisDokumen,
    trackingNim,
    setTrackingNim,
    setSelectedSkripsiForPrint,
    sendCertificateToGmail,
    setActiveTab,
  } = useApp();

  const [inputNim, setInputNim] = useState<string>(trackingNim || '');
  const [activeNim, setActiveNim] = useState<string>(trackingNim || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Sync if context trackingNim changed externally
  useEffect(() => {
    if (trackingNim) {
      setInputNim(trackingNim);
      setActiveNim(trackingNim);
    }
  }, [trackingNim]);

  // Find skripsi submission by NIM
  const foundSkripsi = skripsi.find(s => s.nim.trim() === activeNim.trim());

  // Lookup faculty, major, and document type
  const fakObj = foundSkripsi ? fakultas.find(f => f.id_fakultas === foundSkripsi.id_fakultas) : null;
  const jurObj = foundSkripsi ? jurusan.find(j => j.id_jurusan === foundSkripsi.id_jurusan) : null;
  const docObj = foundSkripsi ? jenisDokumen.find(d => d.id_jenis_dokumen === foundSkripsi.id_jenis_dokumen) : null;

  // Verification calculations
  const isSoftCopyValid = foundSkripsi ? foundSkripsi.soft_copy === 1 : false;
  const isFullyApproved = Boolean(foundSkripsi && isSoftCopyValid);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNim.trim()) return;
    setActiveNim(inputNim.trim());
    setTrackingNim(inputNim.trim());
    setEmailStatusMsg('');
  };

  const handleCopyNoSurat = (noSurat: string) => {
    navigator.clipboard.writeText(noSurat);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!foundSkripsi) return;
    setIsSending(true);
    setEmailStatusMsg('');

    setTimeout(() => {
      const res = sendCertificateToGmail(foundSkripsi.id_skripsi, foundSkripsi.email);
      setIsSending(false);
      setEmailStatusMsg(res.message);
    }, 600);
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <ScrollReveal delay={0} direction="up">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-800 mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Layanan Pelacakan Status Repositori</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pelacakan Status Penyerahan Naskah Skripsi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Pantau tahapan validasi naskah digital (softcopy ZIP Word & ZIP PDF) tugas akhir Anda di UPA Perpustakaan Universitas Riau secara realtime.
          </p>
        </div>
      </ScrollReveal>

      {/* NIM Search Bar */}
      <div className="max-w-xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={inputNim}
            onChange={(e) => setInputNim(e.target.value)}
            placeholder="Masukkan Nomor Induk Mahasiswa (NIM), contoh: 2007111002"
            className="w-full bg-white border border-slate-300 rounded-2xl pl-12 pr-32 py-3.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-medium transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Lacak
          </button>
        </form>
      </div>

      {/* Content Area */}
      {foundSkripsi ? (
        <div className="space-y-6">
          
          {/* Main Status Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Data Penulis & Karya Ilmiah
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  {foundSkripsi.nama}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800">
                    NIM: {foundSkripsi.nim}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    {fakObj?.fakultas} / {jurObj?.jurusan}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {foundSkripsi.tanggal}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {isFullyApproved ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wide">Terverifikasi Lengkap</div>
                      <div className="text-[10px] text-emerald-600">Tanda Terima Sah Diterbitkan</div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-pulse" />
                    <div>
                      <div className="font-bold text-xs uppercase tracking-wide">Menunggu Verifikasi</div>
                      <div className="text-[10px] text-amber-600">Kelengkapan Berkas Diproses</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Judul Skripsi */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Judul {docObj?.jenis_dokumen || 'Skripsi'}:
              </span>
              <p className="text-sm font-semibold text-slate-800 italic leading-relaxed">
                &ldquo;{foundSkripsi.judul}&rdquo;
              </p>
            </div>

            {/* Nomor Surat Resmi */}
            {foundSkripsi.no_surat && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-blue-700 font-medium">Nomor Surat Tanda Terima Repositori:</span>
                    <div className="text-sm font-mono font-bold text-blue-900">{foundSkripsi.no_surat}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyNoSurat(foundSkripsi.no_surat || '')}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 4 Tahapan Validasi Naskah */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Tahapan Verifikasi Naskah Skripsi</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Step 1: Pendaftaran Data */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">1. Data Naskah Terdaftar</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Biodata mahasiswa, program studi, dan judul naskah telah tercatat resmi di basis data sistem repositori.
                  </p>
                </div>
              </div>

              {/* Step 2: Softcopy PDF & Word */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isSoftCopyValid ? 'border-emerald-200 bg-emerald-50/50' : 'border-amber-200 bg-amber-50/50'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                  isSoftCopyValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {isSoftCopyValid ? '✓' : '...'}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">2. Validasi Naskah Softcopy (ZIP Word & PDF)</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {isSoftCopyValid
                      ? 'Berkas digital ZIP Word dan ZIP PDF naskah lengkap telah diverifikasi dan disetujui pustakawan.'
                      : 'Berkas naskah digital ZIP sedang dalam antrean pemeriksaan oleh pustakawan verifikator.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Tanda Terima Terbit */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isFullyApproved ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50'
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                  isFullyApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {isFullyApproved ? '✓' : '3'}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">3. Tanda Terima Sah Repositori</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {isFullyApproved
                      ? 'Surat Tanda Terima resmi ber-QR Code sah dan dapat dicetak sebagai syarat pendaftaran yudisium.'
                      : 'Surat tanda terima akan aktif setelah berkas digital diverifikasi lengkap.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {emailStatusMsg && (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{emailStatusMsg}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isSending ? 'Mengirim...' : 'Kirim ke Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSkripsiForPrint(foundSkripsi)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Tanda Terima (A4)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : activeNim ? (
        /* Empty Search Result */
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              Naskah Skripsi dengan NIM &ldquo;{activeNim}&rdquo; Belum Terdaftar
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Pastikan Anda telah memasukkan NIM yang benar atau daftarkan naskah tugas akhir Anda melalui portal penyerahan skripsi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Ke Formulir Penyerahan Skripsi</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};
