import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Mail,
  GraduationCap,
  FileCheck2,
  BookCheck,
  BookX,
  FileText,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const TrackingView: React.FC = () => {
  const {
    skripsi,
    users,
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

  // Find library user record for loans and identity
  const matchedUser = users.find(u => u.UserName.trim() === activeNim.trim() && u.JenisUser === 2);
  const pinjamCount = matchedUser ? matchedUser.Pinjam : 0;

  // Lookup faculty, major, and document type
  const fakObj = foundSkripsi ? fakultas.find(f => f.id_fakultas === foundSkripsi.id_fakultas) : null;
  const jurObj = foundSkripsi ? jurusan.find(j => j.id_jurusan === foundSkripsi.id_jurusan) : null;
  const docObj = foundSkripsi ? jenisDokumen.find(d => d.id_jenis_dokumen === foundSkripsi.id_jenis_dokumen) : null;

  // Verification calculations
  const isHardCopyValid = foundSkripsi ? foundSkripsi.hard_copy === 1 : false;
  const isSoftCopyValid = foundSkripsi ? foundSkripsi.soft_copy === 1 : false;
  const isLoanClear = pinjamCount === 0;
  const isFullyApproved = Boolean(foundSkripsi && isHardCopyValid && isSoftCopyValid && isLoanClear);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNim.trim()) return;
    setActiveNim(inputNim.trim());
    setTrackingNim(inputNim.trim());
    setEmailStatusMsg('');
  };

  const handleCopyResi = (resiCode: string) => {
    navigator.clipboard.writeText(resiCode);
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
    }, 700);
  };

  const receiptNumber = foundSkripsi
    ? `REC-UNRI-2024-${String(foundSkripsi.id_skripsi).padStart(4, '0')}`
    : `REC-UNRI-2024-0000`;

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Header Banner */}
        <ScrollReveal repeat={true} direction="down">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>SIM-SKRIPSI • Pelacakan Status Penyerahan Karya Ilmiah</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Pelacakan Status Berkas Skripsi Mahasiswa
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Pantau linimasa verifikasi naskah hardcopy & softcopy digital, status bebas tanggungan perpustakaan, serta unduh bukti tanda terima penyerahan skripsi secara mandiri.
            </p>
          </div>
        </ScrollReveal>

        {/* 2. Search Input Box & Quick Chips */}
        <ScrollReveal repeat={true} direction="up" delay={50}>
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-lg shadow-blue-900/5">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputNim}
                  onChange={(e) => setInputNim(e.target.value)}
                  placeholder="Masukkan Nomor Induk Mahasiswa (NIM), contoh: 2007111002"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-semibold text-slate-800 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Lacak Pengajuan</span>
              </button>
            </form>

            {/* Live Database Guide */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Layanan pelacakan status penyerahan resmi UPA Perpustakaan UNRI.
              </span>
              <span className="text-[11px] text-slate-400">
                Pencarian dapat menggunakan NIM yang diajukan pada formulir penyerahan.
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Result Section */}
        {!activeNim ? (
          /* Initial Empty Prompt State */
          <ScrollReveal repeat={true} direction="up" delay={100}>
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Masukkan NIM untuk Memulai Pelacakan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Ketik Nomor Induk Mahasiswa (NIM) Anda pada kotak pencarian di atas untuk memeriksa linimasa verifikasi, bebas peminjaman pustaka, serta mengunduh resi dan surat keterangan resmi.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('student')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Belum Mengajukan? Isi Formulir Bebas Pustaka</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : !foundSkripsi ? (
          /* Not Found State */
          <ScrollReveal repeat={true} direction="up" delay={100}>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Data Pengajuan dengan NIM "{activeNim}" Belum Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Pastikan NIM yang Anda masukkan sudah benar atau silakan lengkapi formulir pengajuan penyerahan tugas akhir terlebih dahulu.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('student')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Isi Formulir Bebas Pustaka Sekarang</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* Loaded Data: Status Dashboard & Receipt */
          <div className="space-y-8">
            
            {/* Top Status Banner */}
            <ScrollReveal repeat={true} direction="up" delay={80}>
              <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                isFullyApproved
                  ? 'bg-emerald-50/90 border-emerald-300 shadow-sm'
                  : !isLoanClear
                  ? 'bg-amber-50/90 border-amber-300 shadow-sm'
                  : 'bg-blue-50/90 border-blue-300 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isFullyApproved
                        ? 'bg-emerald-600 text-white'
                        : !isLoanClear
                        ? 'bg-amber-600 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {isFullyApproved ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : !isLoanClear ? (
                        <BookX className="w-6 h-6" />
                      ) : (
                        <Clock className="w-6 h-6 animate-spin" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isFullyApproved
                            ? 'bg-emerald-100 text-emerald-800'
                            : !isLoanClear
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isFullyApproved
                            ? 'SURAT BEBAS PUSTAKA SUDAH TERBIT'
                            : !isLoanClear
                            ? 'TERTAHAN: TUNGGAKAN PINJAMAN BUKU'
                            : 'VERIFIKASI BERKAS SEDANG BERJALAN'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          No. Surat: {foundSkripsi.no_surat || 'Menunggu Pengesahan'}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                        {foundSkripsi.nama} ({foundSkripsi.nim})
                      </h2>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {docObj?.jenis_dokumen} • {jurObj?.jurusan} • {fakObj?.fakultas}
                      </p>
                    </div>
                  </div>

                  {/* Top Action Quick Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {isFullyApproved && (
                      <button
                        onClick={() => setSelectedSkripsiForPrint(foundSkripsi)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Cetak Surat Bebas Pustaka</span>
                      </button>
                    )}
                    <button
                      onClick={handleSendEmail}
                      disabled={isSending}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Kirimkan surat ke Gmail mahasiswa"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isSending ? 'Mengirim...' : 'Kirim Gmail'}</span>
                    </button>
                  </div>
                </div>

                {emailStatusMsg && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white/80 border border-blue-200 text-xs text-blue-800 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{emailStatusMsg}</span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* 4. 4-Stage Progressive Timeline */}
            <ScrollReveal repeat={true} direction="up" delay={120}>
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Linimasa Tahapan Verifikasi & Bebas Pustaka
                    </h3>
                    <p className="text-xs text-slate-500">
                      Proses verifikasi resmi 4 tahap Unit Penunjang Akademik (UPA) Perpustakaan UNRI
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {isFullyApproved ? '4 / 4 Tahap Selesai' : isLoanClear ? '2 / 4 Tahap Selesai' : '1 / 4 Tahap Selesai'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  
                  {/* Step 1 */}
                  <div className="flex flex-col space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20 shrink-0">
                        <Check className="w-5 h-5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                          Tahap 1 • Selesai
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Pengajuan E-Form & Softcopy
                        </h4>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">Naskah Digital Diterima</p>
                      <p className="text-[11px] text-slate-500">
                        Berkas PDF skripsi dan metadata berhasil diunggah pada {foundSkripsi.tanggal}.
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Format & Lampiran Lengkap</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                        isLoanClear
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-amber-500 text-white shadow-amber-500/20 animate-pulse'
                      }`}>
                        {isLoanClear ? <Check className="w-5 h-5 stroke-[3]" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          isLoanClear ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          Tahap 2 • {isLoanClear ? 'Bebas Pustaka' : 'Ada Pinjaman'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Pengecekan Sirkulasi Buku
                        </h4>
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 border text-xs space-y-1 ${
                      isLoanClear
                        ? 'bg-slate-50 border-slate-200/70 text-slate-600'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}>
                      <p className="font-semibold text-slate-800">
                        {isLoanClear ? '0 Buku Dipinjam' : `${pinjamCount} Buku Belum Kembali`}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isLoanClear
                          ? 'Tidak ada tanggungan denda maupun peminjaman buku perpustakaan pusat.'
                          : 'Segera serahkan buku yang dipinjam ke loket sirkulasi lantai 1 perpustakaan.'}
                      </p>
                      <div className={`flex items-center gap-1 text-[11px] font-medium pt-1 ${
                        isLoanClear ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {isLoanClear ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        <span>{isLoanClear ? 'Sirkulasi Bebas Bersih' : 'Harap kembalikan buku'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                        isHardCopyValid
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-blue-500 text-white shadow-blue-500/20'
                      }`}>
                        {isHardCopyValid ? <Check className="w-5 h-5 stroke-[3]" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          isHardCopyValid ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          Tahap 3 • {isHardCopyValid ? 'Tervalidasi' : 'Dalam Proses'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Verifikasi Hardcopy & TTD
                        </h4>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-800">
                        {isHardCopyValid ? 'Jilid Lux Diterima' : 'Menunggu Penyerahan Fisik'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isHardCopyValid
                          ? 'Buku fisik dan lembar pengesahan dewan penguji telah diverifikasi petugas.'
                          : 'Serahkan naskah fisik jilid lux ke Ruang Repositori Lt. 2 Perpustakaan UNRI.'}
                      </p>
                      <div className={`flex items-center gap-1 text-[11px] font-medium pt-1 ${
                        isHardCopyValid ? 'text-emerald-700' : 'text-blue-700'
                      }`}>
                        {isHardCopyValid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isHardCopyValid ? 'Pengesahan Sah' : 'Loket Repositori Lt. 2'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col space-y-3 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0 ${
                        isFullyApproved
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-slate-300 text-slate-600'
                      }`}>
                        {isFullyApproved ? <Check className="w-5 h-5 stroke-[3]" /> : <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          isFullyApproved ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                          Tahap 4 • {isFullyApproved ? 'Resmi Terbit' : 'Menunggu Syarat'}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                          Penerbitan Surat Bebas
                        </h4>
                      </div>
                    </div>
                    <div className={`rounded-xl p-3 border text-xs space-y-1 ${
                      isFullyApproved
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200/70 text-slate-500'
                    }`}>
                      <p className="font-semibold text-slate-800">
                        {isFullyApproved ? 'Surat Siap Dicetak' : 'Belum Diterbitkan'}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isFullyApproved
                          ? 'Surat resmi ber-QR Code sudah dapat dicetak atau dikirimkan ke Gmail mahasiswa.'
                          : 'Akan terbit otomatis begitu Tahap 1, 2, dan 3 berstatus selesai.'}
                      </p>
                      <div className={`flex items-center gap-1 text-[11px] font-medium pt-1 ${
                        isFullyApproved ? 'text-emerald-700 font-bold' : 'text-slate-400'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{isFullyApproved ? 'Tanda Tangan Digital Sah' : 'Menunggu Persetujuan'}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>

            {/* 5. Official Digital Receipt Card ("Resi Digital Bukti Penyerahan") */}
            <ScrollReveal repeat={true} direction="up" delay={160}>
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-blue-900/5 overflow-hidden">
                
                {/* Receipt Header Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 sm:px-8 py-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      <FileCheck2 className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-sky-200 uppercase tracking-widest">
                        Tanda Terima Resmi Penyerahan Dokumen
                      </span>
                      <h3 className="text-base sm:text-lg font-bold">
                        Resi Digital Penyerahan Tugas Akhir & Bebas Pustaka
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/15">
                    <span className="text-xs text-sky-100 font-mono tracking-wider font-semibold">
                      {receiptNumber}
                    </span>
                    <button
                      onClick={() => handleCopyResi(receiptNumber)}
                      className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                      title="Salin Nomor Resi"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Receipt Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 rounded-xl p-5 border border-slate-200/80">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Nama Mahasiswa
                        </span>
                        <p className="text-sm font-bold text-slate-900">{foundSkripsi.nama}</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Nomor Induk Mahasiswa (NIM)
                        </span>
                        <p className="text-sm font-semibold text-slate-800">{foundSkripsi.nim}</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Fakultas & Program Studi
                        </span>
                        <p className="text-xs font-medium text-slate-700">
                          {fakObj?.fakultas} • {jurObj?.jurusan}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Jenis Dokumen & Tanggal Penyerahan
                        </span>
                        <p className="text-xs font-semibold text-slate-800">
                          {docObj?.jenis_dokumen} ({docObj?.keterangan_jenis_dokumen}) • {foundSkripsi.tanggal}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Alamat Gmail Penerima Dokumen
                        </span>
                        <p className="text-xs font-medium text-blue-700 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{foundSkripsi.email || `${foundSkripsi.nim}@student.unri.ac.id`}</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Nomor Surat Keterangan Resmi
                        </span>
                        <p className="text-xs font-bold text-slate-900">
                          {foundSkripsi.no_surat || 'Akan Diterbitkan Setelah Verifikasi Lengkap'}
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Judul Karya Ilmiah
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 italic mt-0.5">
                        "{foundSkripsi.judul}"
                      </p>
                    </div>
                  </div>

                  {/* Checklist Verifikasi */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100/80 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700">
                      Status Checklist Berkas & Administrasi
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">Naskah Softcopy (PDF Utuh & Bab Terpisah)</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isSoftCopyValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSoftCopyValid ? 'Lengkap & Valid' : 'Belum Diverifikasi'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <BookCheck className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">Naskah Hardcopy (Buku Jilid Lux Hardcover)</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isHardCopyValid ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isHardCopyValid ? 'Sudah Diserahkan' : 'Menunggu Penyerahan ke Loket'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-700">Tanggungan Peminjaman Buku Perpustakaan</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isLoanClear ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isLoanClear ? '0 Buku (Bebas Tanggungan)' : `${pinjamCount} Buku Belum Dikembalikan`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Receipt Footer Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center p-1">
                        <QrCode className="w-9 h-9 text-slate-700" />
                      </div>
                      <div className="text-xs text-slate-500">
                        <p className="font-bold text-slate-700">Verifikasi QR Code</p>
                        <p className="text-[11px]">Dapat dipindai oleh pihak BAAK / Fakultas untuk yudisium</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Resi</span>
                      </button>

                      {isFullyApproved ? (
                        <button
                          onClick={() => setSelectedSkripsiForPrint(foundSkripsi)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Buka Surat Bebas Pustaka</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('student')}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Perbarui Berkas / Formulir</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>
        )}

        {/* 6. Helpdesk & FAQ Quick Reference */}
        <ScrollReveal repeat={true} direction="up" delay={200}>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>Pertanyaan Umum & Bantuan Pengurusan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Panduan cepat menyelesaikan kendala penyerahan berkas dan bebas pinjaman buku
                </p>
              </div>

              <a
                href="https://wa.me/6281276543210?text=Halo%20Admin%20UPA%20Perpustakaan%20UNRI,%20saya%20ingin%20bertanya%20mengenai%20status%20bebas%20pustaka%20saya"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Pustakawan</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  1. Masih memiliki pinjaman buku?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Silakan bawa buku yang dipinjam ke Bagian Sirkulasi Lantai 1 Gedung UPA Perpustakaan UNRI. Begitu buku dikembalikan dan denda (jika ada) dilunasi, status sistem akan otomatis berubah menjadi Bebas Pustaka.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  2. Loket penyerahan hardcopy di mana?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Penyerahan fisik skripsi jilid lux hardcover dan lembar pengesahan basah dilayani di Ruang Pengolahan & Repositori Lantai 2, setiap hari kerja Senin – Jumat pukul 08.30 – 15.30 WIB.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 text-sm block">
                  3. Apakah surat ini sah untuk yudisium?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Ya, surat yang diterbitkan memiliki Nomor Surat Resmi, Cap Digital Institusi, dan QR Code verifikasi yang terhubung langsung dengan basis data UPA Perpustakaan Universitas Riau.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
