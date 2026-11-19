import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Printer,
  Building,
  Check,
  Search,
  Phone,
  FileCheck2,
  Users,
  Info,
  CheckCircle2,
  Mail,
  BookOpen,
  FileUp,
  ShieldCheck,
  Calendar
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
    setActiveTab,
    setTrackingNim,
  } = useApp();

  // Form states
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
  const [hardCopyChecked, setHardCopyChecked] = useState<boolean>(true);
  const [softCopyChecked, setSoftCopyChecked] = useState<boolean>(true);
  const [agreePlagiarism, setAgreePlagiarism] = useState<boolean>(false);

  // Status and feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [lastSubmittedId, setLastSubmittedId] = useState<number | null>(null);

  // Find existing skripsi submission matching entered NIM
  const existingSkripsi = skripsi.find(s => s.nim.trim() === nim.trim());
  const matchedUser = users.find(u => u.UserName.trim() === nim.trim() && u.JenisUser === 2);

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

  // Active skripsi item for printing
  const activeSkripsiItem: Skripsi = existingSkripsi
    ? existingSkripsi
    : {
        id_skripsi: lastSubmittedId || 999,
        id_jenis_dokumen: selectedJenisDokumenId,
        no_surat: `0${skripsi.length + 1}/SKR/FT/2026`,
        nama: nama.trim() || 'Nama Mahasiswa',
        nim: nim.trim() || '2007111002',
        email: email.trim() || `${nim}@student.unri.ac.id`,
        email_sent_at: null,
        id_fakultas: selectedFakultasId,
        id_jurusan: selectedJurusanId,
        judul: judul.trim() || 'Judul Naskah Skripsi Mahasiswa',
        hard_copy: hardCopyChecked ? 1 : 0,
        soft_copy: softCopyChecked ? 1 : 0,
        tanggal,
      };

  // Handle Save or Update Submission
  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim.trim()) {
      alert('NIM Penulis/Mahasiswa wajib diisi!');
      return;
    }
    if (!nama.trim()) {
      alert('Nama Mahasiswa wajib diisi!');
      return;
    }
    if (!email.trim()) {
      alert('Alamat Email Mahasiswa wajib diisi!');
      return;
    }
    if (!judul.trim()) {
      alert('Judul Naskah Skripsi wajib diisi!');
      return;
    }
    if (!agreePlagiarism) {
      alert('Harap centang persetujuan keaslian naskah skripsi dan bebas plagiarisme.');
      return;
    }

    const emailToUse = email.trim();

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
      setSaveSuccessMsg('Data naskah skripsi berhasil diperbarui di sistem repositori!');
    } else {
      const nextId = skripsi.length > 0 ? Math.max(...skripsi.map(s => s.id_skripsi)) + 1 : 1;
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

      const formattedNoSurat = `00${nextId}/SKR/${fakCode}/2026`;

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
      setSaveSuccessMsg('Naskah skripsi berhasil didaftarkan & Tanda Terima Resmi diterbitkan!');
    }

    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 6000);
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

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner Resmi SIM-SKRIPSI UNRI */}
      <ScrollReveal delay={0} direction="up">
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-[#002244] text-white border border-[#001833] shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-sky-200 border border-white/20">
                <FileCheck2 className="w-3.5 h-3.5 text-sky-300" />
                <span>SIM-SKRIPSI • Portal Penyerahan Karya Ilmiah</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Penyerahan Mandiri Naskah Skripsi & Tugas Akhir
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Formulir resmi UPA Perpustakaan Universitas Riau untuk pengumpulan, verifikasi naskah hardcopy & softcopy digital, serta penerbitan tanda terima penyerahan skripsi bagi mahasiswa tingkat akhir.
              </p>
            </div>

            {/* Ketentuan Berkas */}
            <div className="hidden md:flex flex-col gap-1.5 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-blue-100 max-w-xs">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-300" />
                <span>Ketentuan Penyerahan</span>
              </span>
              <p className="text-[11px] leading-relaxed text-blue-100/90">
                Pastikan naskah tugas akhir telah disahkan dewan penguji dan berkas softcopy PDF lengkap sebelum mengajukan formulir.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Alur 3 Langkah Penyerahan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shrink-0">
            01
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Data Penulis & Prodi</h4>
            <p className="text-[11px] text-slate-500">Ketik NIM untuk memuat data</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center border border-sky-200 shrink-0">
            02
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Judul & Unggah PDF</h4>
            <p className="text-[11px] text-slate-500">Naskah lengkap softcopy</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">
            03
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Tanda Terima Sah</h4>
            <p className="text-[11px] text-slate-500">Cetak surat berkop resmi A4</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
        
        {/* Banner Jika Naskah Sudah Pernah Diserahkan / Sukses */}
        {(existingSkripsi || lastSubmittedId) && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Naskah Skripsi Terdaftar di Repositori!</span>
              </div>
              <p className="text-xs text-slate-600">
                Nomor Surat Resmi: <strong className="text-slate-900 font-mono font-bold">{activeSkripsiItem.no_surat}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Tanda Terima (A4)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrackingNim(nim);
                  setActiveTab('tracking');
                }}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span>Lacak Status</span>
              </button>
            </div>
          </div>
        )}

        {saveSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveSubmission} className="space-y-8">
          
          {/* BAGIAN 1: IDENTITAS PENULIS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                <Users className="w-4 h-4 text-blue-600" />
                <span>1. Identitas Penulis / Mahasiswa</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">* Wajib diisi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Nomor Induk Mahasiswa (NIM) *</span>
                  <span className="text-[11px] text-blue-600 font-medium">Contoh: 2007111002</span>
                </label>
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => handleNimLookup(e.target.value)}
                  placeholder="Ketik NIM Anda..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  required
                />
                {matchedUser && (
                  <p className="mt-1.5 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mahasiswa Terverifikasi: {matchedUser.Nama}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Lengkap Mahasiswa *
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap sesuai ijazah / KTM..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Alamat Email Mahasiswa *</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama.mahasiswa@student.unri.ac.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Nomor WhatsApp Aktif</span>
                </label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 2: PROGRAM STUDI & PEMBIMBING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                <Building className="w-4 h-4 text-blue-600" />
                <span>2. Program Studi & Dosen Pembimbing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fakultas *
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Program Studi / Jurusan *
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dosen Pembimbing I
                </label>
                <input
                  type="text"
                  value={pembimbing1}
                  onChange={(e) => setPembimbing1(e.target.value)}
                  placeholder="Nama Lengkap & Gelar Dosen Pembimbing 1..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Dosen Pembimbing II
                </label>
                <input
                  type="text"
                  value={pembimbing2}
                  onChange={(e) => setPembimbing2(e.target.value)}
                  placeholder="Nama Lengkap & Gelar Dosen Pembimbing 2..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 3: DATA NASKAH SKRIPSI */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>3. Data Naskah Skripsi / Tugas Akhir</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jenis Dokumen Karya Ilmiah *
                </label>
                <select
                  value={selectedJenisDokumenId}
                  onChange={(e) => setSelectedJenisDokumenId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer font-medium transition-colors"
                >
                  {jenisDokumen.map((d) => (
                    <option key={d.id_jenis_dokumen} value={d.id_jenis_dokumen}>
                      {d.jenis_dokumen} ({d.keterangan_jenis_dokumen})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tanggal Penyerahan Naskah *</span>
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Lengkap Naskah Skripsi / Tugas Akhir *
              </label>
              <textarea
                rows={3}
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Tuliskan judul lengkap naskah skripsi Anda sesuai lembar pengesahan dewan penguji..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium transition-colors leading-relaxed"
                required
              />
            </div>
          </div>

          {/* BAGIAN 4: BERKAS & CHECKLIST VERIFIKASI */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#003366] uppercase tracking-wider">
                <FileUp className="w-4 h-4 text-blue-600" />
                <span>4. Berkas Softcopy & Konfirmasi Hardcopy</span>
              </div>
            </div>

            {/* Upload Softcopy Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-colors text-center">
              <input
                type="file"
                id="file-pdf-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-pdf-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-700 hover:underline">
                    Pilih Berkas Naskah PDF (Softcopy)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Format file: PDF (Maks. 50 MB) • Memuat naskah utuh & lembar pengesahan bertanda tangan
                  </p>
                </div>
              </label>

              {uploadedFileName && (
                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadedFileName}</span>
                  {uploadedFileSize && <span className="text-[11px] text-emerald-600">({uploadedFileSize})</span>}
                </div>
              )}
            </div>

            {/* Checklist Persyaratan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hardCopyChecked}
                  onChange={(e) => setHardCopyChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Konfirmasi Penyerahan Hardcopy (Fisik):</strong> Saya telah / bersedia menyerahkan naskah jilid tugas akhir lengkap dengan cover standar fakultas ke loket UPA Perpustakaan.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={softCopyChecked}
                  onChange={(e) => setSoftCopyChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong>Validasi Berkas Softcopy Digital:</strong> File PDF naskah tugas akhir telah sesuai ketentuan pemisahan berkas (Cover, Abstrak, BAB I-V, Daftar Pustaka).
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreePlagiarism}
                  onChange={(e) => setAgreePlagiarism(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  required
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-blue-900">Pernyataan Orisinalitas & Etika Ilmiah *:</strong> Saya menyatakan bahwa naskah ini adalah karya asli saya, bebas plagiarisme, dan telah melewati uji similaritas Turnitin sesuai regulasi kampus.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Dokumen diverifikasi langsung oleh Pustakawan Repositori UPA Perpustakaan</span>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{existingSkripsi ? 'Perbarui Data Naskah' : 'Simpan & Terbitkan Tanda Terima'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Cetak Tanda Terima A4 */}
      {showPrintModal && (
        <PrintCertificateModal
          skripsiItem={activeSkripsiItem}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
