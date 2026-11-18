import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  FileText,
  Printer,
  Calendar,
  BookX,
  BookCheck,
  Building,
  Layers,
  Save,
  Check,
  Mail,
  Send,
  ExternalLink,
  UserCheck,
  Search,
  Phone,
  UploadCloud,
  FileUp,
  FileCheck2,
  Users,
  ShieldCheck,
  Info,
  Clock
} from 'lucide-react';
import { PrintCertificateModal } from './PrintCertificateModal';
import { Skripsi } from '../types/database';
import { ScrollReveal } from './ScrollReveal';

export const StudentPortal: React.FC = () => {
  const {
    skripsi,
    users,
    fakultas,
    jenisDokumen,
    getJurusanByFakultas,
    addSkripsi,
    updateSkripsi,
    sendCertificateToGmail,
    setPreviewEmailModal,
    setActiveTab,
    setTrackingNim,
  } = useApp();

  // Form states - completely clean & empty, ready for real user entry!
  const [nim, setNim] = useState<string>('');
  const [nama, setNama] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [noHp, setNoHp] = useState<string>('');
  const [judul, setJudul] = useState<string>('');
  const [pembimbing1, setPembimbing1] = useState<string>('');
  const [pembimbing2, setPembimbing2] = useState<string>('');
  const [selectedFakultasId, setSelectedFakultasId] = useState<number>(1);
  const [selectedJurusanId, setSelectedJurusanId] = useState<number>(1);
  const [selectedJenisDokumenId, setSelectedJenisDokumenId] = useState<number>(1);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // File Upload states
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [pengesahanFileName, setPengesahanFileName] = useState<string>('');
  const [hardCopyChecked, setHardCopyChecked] = useState<boolean>(false);
  const [softCopyChecked, setSoftCopyChecked] = useState<boolean>(false);
  const [agreePlagiarism, setAgreePlagiarism] = useState<boolean>(false);

  // Status and feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<number | null>(null);

  // Find existing skripsi submission matching entered NIM
  const existingSkripsi = skripsi.find(s => s.nim.trim() === nim.trim());

  // Check student loan status from library database based on NIM
  const matchedUser = users.find(u => u.UserName.trim() === nim.trim() && u.JenisUser === 2);
  const pinjamCount = matchedUser ? matchedUser.Pinjam : 0;

  // Sync data when a known NIM is entered or selected
  const handleNimLookup = (targetNim: string) => {
    setNim(targetNim);
    const existing = skripsi.find(s => s.nim.trim() === targetNim.trim());
    if (existing) {
      setNama(existing.nama);
      setEmail(existing.email || `${targetNim}@student.unri.ac.id`);
      setJudul(existing.judul);
      setSelectedFakultasId(existing.id_fakultas);
      setSelectedJurusanId(existing.id_jurusan);
      setSelectedJenisDokumenId(existing.id_jenis_dokumen);
      setTanggal(existing.tanggal || new Date().toISOString().split('T')[0]);
      setHardCopyChecked(existing.hard_copy === 1);
      setSoftCopyChecked(existing.soft_copy === 1);
      setUploadedFileName(`Skripsi_${targetNim}_${existing.nama.replace(/\s+/g, '_')}.pdf`);
      setLastSubmittedId(existing.id_skripsi);
      return;
    }

    const usr = users.find(u => u.UserName.trim() === targetNim.trim() && u.JenisUser === 2);
    if (usr) {
      setNama(usr.Nama);
      setEmail(`${usr.UserName}@student.unri.ac.id`);
      setUploadedFileName(`Skripsi_${targetNim}_${usr.Nama.replace(/\s+/g, '_')}.pdf`);
      setLastSubmittedId(null);
    }
  };

  // Cascading Jurusan list
  const availableJurusan = getJurusanByFakultas(selectedFakultasId);

  // When faculty changes, update major to the first available
  const handleFakultasChange = (fakId: number) => {
    setSelectedFakultasId(fakId);
    const newJurusanList = getJurusanByFakultas(fakId);
    if (newJurusanList.length > 0) {
      setSelectedJurusanId(newJurusanList[0].id_jurusan);
    }
  };

  // Active skripsi item for printing/emailing
  const activeSkripsiItem: Skripsi = existingSkripsi
    ? existingSkripsi
    : {
        id_skripsi: lastSubmittedId || 999,
        id_jenis_dokumen: selectedJenisDokumenId,
        no_surat: `0${skripsi.length + 1}/SKR/FT/2024`,
        nama: nama.trim() || 'Nama Mahasiswa',
        nim: nim.trim() || '2007111002',
        email: email.trim() || `${nim}@student.unri.ac.id`,
        email_sent_at: null,
        id_fakultas: selectedFakultasId,
        id_jurusan: selectedJurusanId,
        judul: judul.trim() || 'Judul Karya Ilmiah Mahasiswa',
        hard_copy: hardCopyChecked ? 1 : 0,
        soft_copy: softCopyChecked ? 1 : 0,
        tanggal,
      };

  // Handle Save or Update Submission
  const handleSaveSubmission = (e: React.FormEvent, andSendToEmail: boolean = false) => {
    e.preventDefault();
    if (!nim.trim()) {
      alert('NIM Mahasiswa wajib diisi!');
      return;
    }
    if (!nama.trim()) {
      alert('Nama Mahasiswa wajib diisi!');
      return;
    }
    if (!email.trim()) {
      alert('Alamat Gmail Mahasiswa wajib diisi untuk pengiriman surat!');
      return;
    }
    if (!judul.trim()) {
      alert('Judul karya ilmiah wajib diisi!');
      return;
    }
    if (!agreePlagiarism) {
      alert('Harap menyetujui pernyataan keaslian karya ilmiah dan bebas plagiarisme.');
      return;
    }

    const emailToUse = email.trim();
    let currentId = existingSkripsi?.id_skripsi;

    if (existingSkripsi) {
      updateSkripsi(existingSkripsi.id_skripsi, {
        nama: nama.trim(),
        nim: nim.trim(),
        judul: judul.trim(),
        email: emailToUse,
        id_fakultas: selectedFakultasId,
        id_jurusan: selectedJurusanId,
        id_jenis_dokumen: selectedJenisDokumenId,
        tanggal,
        hard_copy: hardCopyChecked ? 1 : 0,
        soft_copy: softCopyChecked ? 1 : 0,
      });
      setLastSubmittedId(existingSkripsi.id_skripsi);
      setSaveSuccessMsg('Formulir penyerahan tugas akhir berhasil diperbarui!');
    } else {
      const nextId = skripsi.length > 0 ? Math.max(...skripsi.map(s => s.id_skripsi)) + 1 : 1;
      currentId = nextId;
      setLastSubmittedId(nextId);

      // Generate nomor surat resmi UPA Perpustakaan
      const fakObj = fakultas.find(f => f.id_fakultas === selectedFakultasId);
      const fakCode = fakObj?.fakultas.includes('Teknik')
        ? 'FT'
        : fakObj?.fakultas.includes('MIPA')
        ? 'FMIPA'
        : fakObj?.fakultas.includes('Ekonomi')
        ? 'FEB'
        : fakObj?.fakultas.includes('Keguruan')
        ? 'FKIP'
        : 'UNRI';

      const formattedNoSurat = `0${nextId}/SKR/${fakCode}/2024`;

      addSkripsi({
        id_jenis_dokumen: selectedJenisDokumenId,
        no_surat: formattedNoSurat,
        nama: nama.trim(),
        nim: nim.trim(),
        email: emailToUse,
        email_sent_at: null,
        id_fakultas: selectedFakultasId,
        id_jurusan: selectedJurusanId,
        judul: judul.trim(),
        hard_copy: hardCopyChecked ? 1 : 0,
        soft_copy: softCopyChecked ? 1 : 0,
        tanggal,
      });
      setSaveSuccessMsg('Penyerahan karya ilmiah berhasil disimpan & surat diterbitkan!');
    }

    if (andSendToEmail && currentId) {
      handleTriggerSendEmail(currentId, emailToUse);
    }

    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 4500);
  };

  const handleTriggerSendEmail = (targetId: number, targetEmail: string) => {
    setIsSendingEmail(true);
    setTimeout(() => {
      sendCertificateToGmail(targetId, targetEmail);
      setIsSendingEmail(false);
    }, 700);
  };

  // File change handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setSoftCopyChecked(true);
    }
  };

  const handlePengesahanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPengesahanFileName(file.name);
    }
  };

  // Determine eligibility
  const hasEnteredNim = Boolean(nim.trim());
  const isHardCopyReady = hardCopyChecked || existingSkripsi?.hard_copy === 1;
  const isSoftCopyReady = softCopyChecked || existingSkripsi?.soft_copy === 1;
  const isLoanClear = hasEnteredNim && pinjamCount === 0;
  const isEligibleToPrint = hasEnteredNim && isHardCopyReady && isSoftCopyReady && isLoanClear;

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner - Standar E-Form Resmi UPA Perpustakaan UNRI */}
      <ScrollReveal delay={0} direction="up">
        <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#003366] text-white border border-[#002244] shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                <FileCheck2 className="w-3.5 h-3.5 text-sky-300" />
                <span>Formulir Penyerahan Tugas Akhir & Permohonan Bebas Pustaka</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Penyerahan Karya Ilmiah & Surat Bebas Pustaka Online
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Formulir resmi Unit Penunjang Akademik (UPA) Perpustakaan Universitas Riau untuk penyerahan naskah skripsi, tesis, dan tugas akhir mahasiswa tingkat akhir sebagai kelengkapan berkas yudisium dan wisuda.
              </p>
            </div>

            {/* Database Status Indicator */}
            <div className="flex flex-col gap-2 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Status Basis Data:</span>
              </span>
              <div className="text-xs text-white/90">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Terhubung ke MySQL (manajemen_skripsi)</span>
                </p>
                <p className="text-[11px] text-blue-200 mt-1 max-w-[260px]">
                  Ketik NIM Anda untuk mengecek status pinjaman sirkulasi buku secara langsung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: STATUS SIRKULASI & SURAT BEBAS PUSTAKA      */}
        {/* ======================================================== */}
        <ScrollReveal delay={100} direction="up" className="lg:col-span-1">
          <div className="flex flex-col gap-6">
          
          {/* KARTU 1: STATUS PINJAMAN KOLEKSI REALTIME */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-all duration-300 ${
              !hasEnteredNim
                ? 'bg-slate-50/90 border-slate-200/90 shadow-slate-100/50'
                : pinjamCount > 0
                ? 'bg-rose-50/70 border-rose-200 shadow-rose-100/50'
                : 'bg-emerald-50/70 border-emerald-200 shadow-emerald-100/50'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-600">
                STATUS SIRKULASI PERPUSTAKAAN
              </span>
              <div
                className={`p-2 rounded-xl ${
                  !hasEnteredNim
                    ? 'bg-slate-200/70 text-slate-500 border border-slate-300'
                    : pinjamCount > 0
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {!hasEnteredNim ? (
                  <Clock className="w-5 h-5 text-slate-500" />
                ) : pinjamCount > 0 ? (
                  <BookX className="w-5 h-5" />
                ) : (
                  <BookCheck className="w-5 h-5" />
                )}
              </div>
            </div>

            <div className="mt-5">
              {!hasEnteredNim ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-400">—</span>
                    <span className="text-sm font-bold text-slate-600">
                      Menunggu Input NIM Mahasiswa
                    </span>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Search className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Belum Ada NIM Terisi</span>
                    </div>
                    <p>
                      Silakan ketik <strong>NIM Anda</strong> pada formulir di sebelah kanan. Sistem akan memeriksa catatan peminjaman buku perpustakaan secara otomatis begitu NIM diisi.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Status sirkulasi: <strong className="text-slate-500">BELUM TERVERIFIKASI</strong>.
                    </p>
                  </div>
                </>
              ) : pinjamCount > 0 ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-rose-600">{pinjamCount}</span>
                    <span className="text-sm font-bold text-slate-700">Buku Belum Dikembalikan</span>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-white border border-rose-200 text-rose-900 text-xs leading-relaxed space-y-2 shadow-sm">
                    <div className="flex items-center gap-1.5 font-bold text-rose-700">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Peringatan Tanggungan Aktif!</span>
                    </div>
                    <p>
                      NIM <strong>{nim}</strong> masih tercatat meminjam <strong>{pinjamCount} buku</strong> di perpustakaan UNRI.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Sistem mengunci penerbitan surat resmi sampai buku dikembalikan ke meja layanan sirkulasi.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-600">0</span>
                    <span className="text-sm font-bold text-slate-700">Tanggungan Koleksi (Bebas)</span>
                  </div>

                  <div className="mt-4 p-4 rounded-2xl bg-white border border-emerald-200 text-emerald-900 text-xs leading-relaxed space-y-2 shadow-sm">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Lolos Verifikasi Bebas Pustaka!</span>
                    </div>
                    <p>
                      Tidak ditemukan tanggungan peminjaman buku maupun denda pada akun NIM <strong>{nim}</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Status sirkulasi: <strong className="text-emerald-700">HIJAU (TERVERIFIKASI)</strong>.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                {hasEnteredNim
                  ? 'Data peminjaman diverifikasi secara realtime dari basis data perpustakaan.'
                  : 'Sistem siap memverifikasi data sirkulasi perpustakaan secara otomatis.'}
              </span>
            </div>
          </div>

          {/* KARTU 2: PENERBITAN SURAT & PENGIRIMAN GMAIL */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold tracking-wider uppercase text-slate-600">
                  SURAT KETERANGAN BEBAS PUSTAKA
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                  <Mail className="w-5 h-5" />
                </div>
              </div>

              {!hasEnteredNim ? (
                /* TAMPILAN KETIKA NIM MASIH KOSONG */
                <div className="mt-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200/70 flex items-center justify-center mx-auto shadow-xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-slate-800">
                        Menunggu Input NIM Mahasiswa
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Surat Keterangan Bebas Pustaka baru dapat diterbitkan setelah Anda mengisi <strong>NIM</strong> dan melengkapi data penyerahan karya ilmiah pada formulir di sebelah kanan.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs text-slate-600">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                      <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Alur Penerbitan Surat:</span>
                    </div>
                    <ul className="space-y-1.5 text-[11.5px] text-slate-600 list-disc list-inside">
                      <li>Ketik NIM pada formulir penyerahan.</li>
                      <li>Sistem otomatis mengecek sirkulasi pinjaman buku.</li>
                      <li>Unggah softcopy skripsi & konfirmasi hardcopy.</li>
                      <li>Surat resmi otomatis diterbitkan dan siap diunduh/dicetak.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                /* TAMPILAN KETIKA NIM SUDAH DIISI */
                <div className="mt-4 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Surat Resmi & Pengiriman Digital
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Surat resmi ber-kop UPA Perpustakaan Universitas Riau dikirim otomatis dalam format PDF resmi ke Gmail dan siap dicetak fisik ukuran A4.
                  </p>

                  {/* Requirements Checklist */}
                  <div className="space-y-2.5 py-2">
                    {/* 1. Hardcopy */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium flex items-center gap-2">
                        {isHardCopyReady ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span>1. Hardcopy Skripsi</span>
                      </span>
                      <span
                        className={`font-bold ${
                          isHardCopyReady ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                      >
                        {isHardCopyReady ? 'Sudah Diserahkan' : 'Belum Diserahkan'}
                      </span>
                    </div>

                    {/* 2. Softcopy */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium flex items-center gap-2">
                        {isSoftCopyReady ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span>2. Softcopy PDF Digital</span>
                      </span>
                      <span
                        className={`font-bold ${
                          isSoftCopyReady ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                      >
                        {isSoftCopyReady ? 'Lengkap & Valid' : 'Belum Diunggah'}
                      </span>
                    </div>

                    {/* 3. Bebas Pinjaman */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium flex items-center gap-2">
                        {isLoanClear ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>3. Bebas Pinjaman Buku</span>
                      </span>
                      <span
                        className={`font-bold ${
                          isLoanClear ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isLoanClear
                          ? '0 Tanggungan (Bebas)'
                          : `${pinjamCount} Buku Tertunggak`}
                      </span>
                    </div>
                  </div>

                  {/* Gmail Delivery Log badge */}
                  {activeSkripsiItem.email_sent_at && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Surat Telah Terkirim ke Gmail:</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1.5">
                        Penerima: <strong className="text-blue-800 font-semibold">{activeSkripsiItem.email}</strong>
                        <br />
                        Waktu kirim: {activeSkripsiItem.email_sent_at}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewEmailModal({
                            skripsi: activeSkripsiItem,
                            recipientEmail: activeSkripsiItem.email || email,
                          })
                        }
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                      >
                        <span>Buka Kotak Masuk Gmail Saya</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {hasEnteredNim && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                {/* Button: Kirim ke Gmail */}
                <button
                  type="button"
                  disabled={isSendingEmail || !isEligibleToPrint}
                  onClick={() => {
                    if (activeSkripsiItem.id_skripsi) {
                      handleTriggerSendEmail(activeSkripsiItem.id_skripsi, email);
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isEligibleToPrint
                      ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 cursor-pointer'
                      : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed opacity-75'
                  }`}
                >
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>{isSendingEmail ? 'Mengirim Surat ke Gmail...' : 'Kirim Salinan Surat ke Gmail'}</span>
                </button>

                {/* Button: Cetak Fisik A4 */}
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isEligibleToPrint
                      ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white shadow-blue-500/25 cursor-pointer'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 cursor-pointer'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>
                    {isEligibleToPrint ? 'Cetak Fisik Surat Resmi (A4)' : 'Pratinjau Format Cetak (A4)'}
                  </span>
                </button>

                {!isEligibleToPrint && (
                  <p className="text-[10px] text-center text-slate-400">
                    *Surat resmi dapat dicetak setelah hardcopy, softcopy, dan bebas sirkulasi terpenuhi.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: FORMULIR INPUT LENGKAP MANDIRI              */}
      {/* ======================================================== */}
      <ScrollReveal delay={200} direction="up" className="lg:col-span-2">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-bold tracking-wider uppercase text-blue-700">
                  FORMULIR PENYERAHAN DOKUMEN TUGAS AKHIR
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                  Data Penyerahan Karya Ilmiah & Identitas Mahasiswa
                </h2>
              </div>

              {existingSkripsi && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 font-medium">Nomor Surat:</span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold tracking-wide">
                    {existingSkripsi.no_surat || '002/SKR/FT/2024'}
                  </span>
                </div>
              )}
            </div>

            {saveSuccessMsg && (
              <div className="my-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingNim(nim);
                    setActiveTab('tracking');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Lacak Status & Resi Digital &rarr;</span>
                </button>
              </div>
            )}

            <form onSubmit={(e) => handleSaveSubmission(e, false)} className="mt-6 space-y-6">
              
              {/* BAGIAN 1: IDENTITAS MAHASISWA & KONTAK */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>1. Data Identitas Mahasiswa & Kontak</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>NIM Mahasiswa *</span>
                      <span className="text-[11px] text-blue-600 font-medium">Ketik NIM Anda</span>
                    </label>
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => handleNimLookup(e.target.value)}
                      placeholder="Contoh: 2007111002"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Nama Lengkap Mahasiswa *</span>
                      <span className="text-[11px] text-blue-600 font-medium">Sesuai Ijazah / KTM</span>
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Contoh: Siti Nurhaliza"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Alamat Gmail Mahasiswa (Untuk Surat PDF) *</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama.mahasiswa@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nomor WhatsApp / HP Aktif *</span>
                    </label>
                    <input
                      type="text"
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 2: DATA AKADEMIK & DOSEN PEMBIMBING */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>2. Program Studi & Dosen Pembimbing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      <span>Fakultas *</span>
                    </label>
                    <select
                      value={selectedFakultasId}
                      onChange={(e) => handleFakultasChange(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-medium transition-colors"
                    >
                      {fakultas.map((f) => (
                        <option key={f.id_fakultas} value={f.id_fakultas}>
                          {f.fakultas}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-sky-600" />
                      <span>Program Studi / Jurusan *</span>
                    </label>
                    <select
                      value={selectedJurusanId}
                      onChange={(e) => setSelectedJurusanId(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-medium transition-colors"
                    >
                      {availableJurusan.map((j) => (
                        <option key={j.id_jurusan} value={j.id_jurusan}>
                          {j.jurusan}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dosen Pembimbing I (Utama)</span>
                    </label>
                    <input
                      type="text"
                      value={pembimbing1}
                      onChange={(e) => setPembimbing1(e.target.value)}
                      placeholder="Nama Dosen Pembimbing I beserta gelar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dosen Pembimbing II (Pendamping)</span>
                    </label>
                    <input
                      type="text"
                      value={pembimbing2}
                      onChange={(e) => setPembimbing2(e.target.value)}
                      placeholder="Nama Dosen Pembimbing II beserta gelar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: INFORMASI KARYA ILMIAH */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>3. Rincian Karya Ilmiah</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>Jenis Dokumen Karya Ilmiah *</span>
                    </label>
                    <select
                      value={selectedJenisDokumenId}
                      onChange={(e) => setSelectedJenisDokumenId(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-medium transition-colors"
                    >
                      {jenisDokumen.map((d) => (
                        <option key={d.id_jenis_dokumen} value={d.id_jenis_dokumen}>
                          {d.jenis_dokumen} - {d.keterangan_jenis_dokumen}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>Tanggal Penyerahan / Sidang *</span>
                    </label>
                    <input
                      type="date"
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Judul Lengkap Karya Ilmiah / Tugas Akhir *</span>
                  </label>
                  <textarea
                    rows={4}
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Masukkan judul skripsi lengkap sesuai lembar pengesahan dewan penguji..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed placeholder-slate-400 font-normal transition-colors"
                    required
                  />
                </div>
              </div>

              {/* BAGIAN 4: UNGGAH BERKAS SOFTCOPY & HARDCOPY */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span>4. Unggah Berkas Digital (Softcopy PDF) & Hardcopy</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File 1: Naskah Lengkap PDF */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50/70 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck2 className="w-5 h-5 text-blue-700" />
                        <span className="text-xs font-bold text-blue-900">Naskah Skripsi Lengkap (PDF) *</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Format PDF berisi Cover, Abstrak, BAB 1 s/d Penutup, dan Daftar Pustaka.
                      </p>
                    </div>

                    <div className="mt-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-blue-300 text-blue-700 text-xs font-bold hover:bg-blue-50 cursor-pointer shadow-sm">
                        <FileUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pilih Berkas PDF</span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="truncate max-w-[170px] font-medium text-slate-600">
                          {uploadedFileName || 'Belum ada naskah PDF dipilih'}
                        </span>
                        {uploadedFileName && (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {uploadedFileSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File 2: Lembar Pengesahan */}
                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck2 className="w-5 h-5 text-slate-700" />
                        <span className="text-xs font-bold text-slate-900">Lembar Pengesahan Sidang *</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Scan lembar pengesahan bertanda tangan lengkap dewan penguji dan pimpinan fakultas.
                      </p>
                    </div>

                    <div className="mt-2">
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-sm">
                        <FileUp className="w-3.5 h-3.5 text-slate-600" />
                        <span>Pilih Lembar Pengesahan</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.png"
                          onChange={handlePengesahanUpload}
                          className="hidden"
                        />
                      </label>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                        <span className="truncate max-w-[170px] font-medium text-slate-600">
                          {pengesahanFileName || 'Belum ada lembar pengesahan'}
                        </span>
                        {pengesahanFileName && (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                            Siap
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Konfirmasi Hardcopy & Softcopy Checkbox */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-700 shrink-0" />
                    <span className="text-xs font-bold text-blue-900">
                      Konfirmasi Kelengkapan Berkas:
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={hardCopyChecked}
                        onChange={(e) => setHardCopyChecked(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>Hardcopy Dijilid & Diserahkan</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={softCopyChecked}
                        onChange={(e) => setSoftCopyChecked(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span>Softcopy PDF Telah Lengkap</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* BAGIAN 5: PERNYATAAN INTEGRITAS AKADEMIK */}
              <div className="pt-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 leading-relaxed">
                  <input
                    type="checkbox"
                    checked={agreePlagiarism}
                    onChange={(e) => setAgreePlagiarism(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 shrink-0"
                    required
                  />
                  <span>
                    Saya menyatakan dengan sesungguhnya bahwa karya ilmiah tugas akhir yang saya serahkan ini adalah <strong>asli, bebas dari plagiarisme</strong>, dan disusun sesuai dengan pedoman karya ilmiah Universitas Riau. Saya memberikan hak kepada UPA Perpustakaan Universitas Riau untuk mempublikasikan dan mengarsipkan dokumen ini.
                  </span>
                </label>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pl-7">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sesuai Surat Edaran Rektor UNRI No. Standar Mutu Repositori Digital.</span>
                </div>
              </div>

              {/* Action Buttons: Simpan & Kirim ke Gmail */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Draf Data</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSaveSubmission(e, true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Penyerahan & Dapatkan Surat ke Gmail</span>
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>
      </div>

      {/* Print Certificate Modal */}
      {showPrintModal && (
        <PrintCertificateModal
          skripsiItem={activeSkripsiItem}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
