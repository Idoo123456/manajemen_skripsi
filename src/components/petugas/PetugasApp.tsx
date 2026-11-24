import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Skripsi, User, Pelapor, Tulisan } from '../../types/database';
import {
  Shield,
  FileCheck2,
  Users,
  Award,
  Database,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Printer,
  Send,
  ArrowRight,
  LayoutDashboard,
  CheckCheck,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  BookOpen,
  LogOut,
  FolderKanban,
  AlertTriangle,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { PrintCertificateModal } from '../PrintCertificateModal';

type PetugasViewTab = 'dashboard' | 'skripsi' | 'certificate' | 'pelapor' | 'tulisan' | 'users' | 'master';

export const PetugasApp: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    logout,
    setPortalMode,
    isDbConnected,
    skripsi,
    users,
    pelapor,
    tulisan,
    fakultas,
    jurusan,
    jenisDokumen,
    toggleSoftCopy,
    updateSkripsi,
    deleteSkripsi,
    addSkripsi,
    addUser,
    updateUser,
    deleteUser,
    togglePelaporActive,
    addPelapor,
    updatePelapor,
    deletePelapor,
    toggleTulisanAktif,
    addTulisan,
    updateTulisan,
    deleteTulisan,
    sendCertificateToGmail,
  } = useApp();

  const [activeTab, setActiveTab] = useState<PetugasViewTab>('dashboard');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'no_surat'>('all');
  const [facultyFilter, setFacultyFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [editingSkripsi, setEditingSkripsi] = useState<Skripsi | null>(null);
  const [isAddSkripsiOpen, setIsAddSkripsiOpen] = useState<boolean>(false);
  const [previewSkripsiPrint, setPreviewSkripsiPrint] = useState<Skripsi | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);

  const [editingPelapor, setEditingPelapor] = useState<Pelapor | null>(null);
  const [isAddPelaporOpen, setIsAddPelaporOpen] = useState<boolean>(false);

  const [editingTulisan, setEditingTulisan] = useState<Tulisan | null>(null);
  const [isAddTulisanOpen, setIsAddTulisanOpen] = useState<boolean>(false);

  const [masterSubTab, setMasterSubTab] = useState<'fakultas' | 'jurusan' | 'jenis'>('fakultas');

  // Selected rows for batch actions
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Quick Stats Computation
  const stats = useMemo(() => {
    const total = skripsi.length;
    const verifiedFull = skripsi.filter(s => s.soft_copy === 1).length;
    const pendingSoft = skripsi.filter(s => s.soft_copy === 0).length;
    const hasSurat = skripsi.filter(s => !!s.no_surat).length;
    const pendingSurat = skripsi.filter(s => !s.no_surat && s.soft_copy === 1).length;
    const emailSent = skripsi.filter(s => !!s.email_sent_at).length;
    const totalMhs = users.filter(u => u.JenisUser === 2).length;
    const totalPetugas = users.filter(u => u.JenisUser === 1).length;

    return {
      total,
      verifiedFull,
      pendingSoft,
      hasSurat,
      pendingSurat,
      emailSent,
      totalMhs,
      totalPetugas,
      verificationRate: total > 0 ? Math.round((verifiedFull / total) * 100) : 0,
    };
  }, [skripsi, users]);

  // Filtered Skripsi list
  const filteredSkripsi = useMemo(() => {
    return skripsi.filter(item => {
      const q = searchFilter.toLowerCase();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.nim.toLowerCase().includes(q) ||
        item.judul.toLowerCase().includes(q) ||
        (item.no_surat && item.no_surat.toLowerCase().includes(q));

      const matchFaculty =
        facultyFilter === 'all' || item.id_fakultas === Number(facultyFilter);

      let matchStatus = true;
      if (statusFilter === 'pending') {
        matchStatus = item.soft_copy === 0;
      } else if (statusFilter === 'verified') {
        matchStatus = item.soft_copy === 1;
      } else if (statusFilter === 'no_surat') {
        matchStatus = !item.no_surat;
      }

      return matchSearch && matchFaculty && matchStatus;
    });
  }, [skripsi, searchFilter, facultyFilter, statusFilter]);

  // Auto-generate surat number helper
  const handleGenerateSurat = (item: Skripsi) => {
    const year = new Date().getFullYear();
    const fak = fakultas.find(f => f.id_fakultas === item.id_fakultas);
    const fakCode = fak ? fak.fakultas.replace(/fakultas\s+/i, '').substring(0, 3).toUpperCase() : 'UNR';
    const num = String(item.id_skripsi).padStart(3, '0');
    const generated = `${num}/SKR/${fakCode}/${year}`;

    updateSkripsi(item.id_skripsi, { no_surat: generated });
    showToast(`✅ Nomor surat ${generated} berhasil diterbitkan untuk ${item.nama}!`);
  };

  // Batch verify softcopy
  const handleBatchVerifySoft = () => {
    if (selectedRowIds.length === 0) return;
    selectedRowIds.forEach(id => {
      updateSkripsi(id, { soft_copy: 1 });
    });
    showToast(`✅ ${selectedRowIds.length} berkas softcopy berhasil diverifikasi!`);
    setSelectedRowIds([]);
  };

  // Batch generate surat
  const handleBatchGenerateSurat = () => {
    if (selectedRowIds.length === 0) return;
    selectedRowIds.forEach(id => {
      const target = skripsi.find(s => s.id_skripsi === id);
      if (target && !target.no_surat) {
        handleGenerateSurat(target);
      }
    });
    setSelectedRowIds([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] max-w-md bg-white border border-emerald-300 text-emerald-800 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. LEFT SIDEBAR: Ultra-modern Light Petugas Command Center */}
      {/* ============================================================== */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200/90 flex flex-col shrink-0 select-none shadow-xs">
        {/* Brand & System Status */}
        <div className="p-5 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <img
              src="/logo-unri.png"
              alt="Logo Universitas Riau"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-[#003366]">SIPETUGAS</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                  v2.5
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">
                UPA Perpustakaan UNRI
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sistem Online
            </span>
            <span className="font-mono text-slate-400">Live Sync</span>
          </div>
        </div>

        {/* Active Staff Profile Card */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200/60 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004080] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs">
              {currentUser?.Nama ? currentUser.Nama.charAt(0) : 'P'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {currentUser?.Nama || 'Petugas Repositori'}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                NIP/ID: {currentUser?.UserName || 'admin'}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Shield className="w-2.5 h-2.5 text-emerald-600" />
                <span>Petugas Berwenang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Operasional
          </div>

          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard & Statistik</span>
            </div>
          </button>

          {/* 2. Verifikasi Skripsi */}
          <button
            onClick={() => setActiveTab('skripsi')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'skripsi'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Verifikasi Naskah</span>
            </div>
            {stats.pendingSoft > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {stats.pendingSoft}
              </span>
            )}
          </button>

          {/* 3. Penerbitan Tanda Terima & Bebas Pustaka */}
          <button
            onClick={() => setActiveTab('certificate')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4" />
              <span>Penerbitan Tanda Terima</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700 font-bold">
              {stats.hasSurat}
            </span>
          </button>

          <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Administrasi & Master Data
          </div>

          {/* 4. Pejabat / Pelapor */}
          <button
            onClick={() => setActiveTab('pelapor')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pelapor'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Pejabat Penandatangan</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">{pelapor.length}</span>
          </button>

          {/* 5. Warta & Panduan */}
          <button
            onClick={() => setActiveTab('tulisan')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tulisan'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4" />
              <span>Warta & Panduan</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">{tulisan.length}</span>
          </button>

          {/* 6. Pengguna & Mahasiswa */}
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4" />
              <span>Data Akun Pengguna</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">{users.length}</span>
          </button>

          {/* 7. Master Data */}
          <button
            onClick={() => setActiveTab('master')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'master'
                ? 'bg-[#004080] text-white shadow-md shadow-blue-900/15 font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4" />
              <span>Master Fakultas & Prodi</span>
            </div>
          </button>
        </nav>

        {/* Bottom Actions: Seamless Web Switcher & Logout */}
        <div className="p-4 border-t border-slate-200/80 space-y-2 bg-slate-50/50">
          {/* Prominent Switcher to Student Web */}
          <button
            onClick={() => setPortalMode('student')}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-[#003366] text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-blue-600" />
            <span>Lihat Tampilan Web Mahasiswa</span>
          </button>

          <button
            onClick={() => {
              logout();
              setPortalMode('student');
            }}
            className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi Petugas</span>
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN WORKSTATION CONTENT AREA */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Workstation Petugas</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-[#004080] capitalize">
                {activeTab === 'dashboard' && 'Dashboard Analitik & Ringkasan'}
                {activeTab === 'skripsi' && 'Verifikasi Naskah Skripsi'}
                {activeTab === 'certificate' && 'Penerbitan Tanda Terima'}
                {activeTab === 'pelapor' && 'Daftar Pejabat Penandatangan'}
                {activeTab === 'tulisan' && 'Manajemen Warta & Panduan'}
                {activeTab === 'users' && 'Manajemen Akun Pengguna'}
                {activeTab === 'master' && 'Master Data Fakultas & Prodi'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live MySQL Database Status Badge */}
            <div
              className={`hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                isDbConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Koneksi Basis Data MySQL XAMPP"
            >
              <span className={`w-2 h-2 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isDbConnected ? 'MySQL XAMPP (127.0.0.1:3306 • manajemen_skripsi)' : 'Database Offline'}</span>
            </div>

            {/* Action Button: Tambah Skripsi */}
            <button
              onClick={() => setIsAddSkripsiOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah Berkas Skripsi</span>
              <span className="sm:hidden">Tambah</span>
            </button>

            {/* Switch User dropdown demo */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-all cursor-pointer shadow-xs">
                <span>Ganti Akun</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 hidden group-hover:block z-50 animate-in fade-in">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Staf Petugas:
                </div>
                {users.filter(u => u.JenisUser === 1).map(u => (
                  <button
                    key={u.idUser}
                    onClick={() => setCurrentUser(u)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="font-semibold truncate max-w-[130px]">{u.Nama}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{u.UserName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-4 sm:p-8 flex-1">
          {/* ============================================================== */}
          {/* TAB 1: DASHBOARD & STATISTIK */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Alert notification banner if pending */}
              {stats.pendingSoft > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-50/50 to-transparent border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Menunggu Verifikasi: {stats.pendingSoft} Naskah Softcopy
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Terdapat berkas skripsi mahasiswa yang baru masuk dan perlu divalidasi keabsahannya.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setActiveTab('skripsi');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Buka Antrean Verifikasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Skripsi */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Total Berkas Skripsi</span>
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                    <span className="text-xs text-slate-500 font-medium">Naskah</span>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">100%</span>
                    <span>Tersinkron di repositori publik</span>
                  </div>
                </div>

                {/* Terverifikasi Penuh */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Terverifikasi Penuh</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-700">{stats.verifiedFull}</span>
                    <span className="text-xs text-slate-500 font-medium">/ {stats.total} Naskah</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${stats.verificationRate}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      {stats.verificationRate}%
                    </span>
                  </div>
                </div>

                {/* Surat Diterbitkan */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Surat Tanda Terima</span>
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-700">{stats.hasSurat}</span>
                    <span className="text-xs text-slate-500 font-medium">Telah Terbit</span>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="text-indigo-700 font-bold">{stats.pendingSurat}</span>
                    <span>Siap diterbitkan nomor surat</span>
                  </div>
                </div>

                {/* Total Pengguna */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <span>Mahasiswa & Pengguna</span>
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-purple-700">{stats.totalMhs}</span>
                    <span className="text-xs text-slate-500 font-medium">Akun Mhs</span>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500">
                    Didampingi <strong className="text-slate-900">{stats.totalPetugas} Petugas</strong> pustakawan
                  </div>
                </div>
              </div>

              {/* Middle Section: Quick Actions & Recent Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Quick Workstation Tasks */}
                <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-[#004080]" />
                      <span>Antrean Cepat Validasi Berkas</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('skripsi')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Semua</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {skripsi.slice(0, 5).map(item => {
                      return (
                        <div
                          key={item.id_skripsi}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#003366] font-mono">{item.nim}</span>
                              <span className="text-xs text-slate-700 font-semibold truncate">— {item.nama}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5 max-w-md">
                              {item.judul}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">

                            {/* Toggle Softcopy */}
                            <button
                              onClick={() => {
                                toggleSoftCopy(item.id_skripsi);
                                showToast(`Status Softcopy ${item.nama} diperbarui.`);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                item.soft_copy === 1
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800'
                              }`}
                              title="Klik untuk ubah status softcopy"
                            >
                              <span>Soft:</span>
                              {item.soft_copy === 1 ? 'OK' : 'Belum'}
                            </button>

                            {/* Direct print preview */}
                            <button
                              onClick={() => setPreviewSkripsiPrint(item)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                              title="Cetak Tanda Terima"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right 5 cols: Live System Activity Log */}
                <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>Aktivitas & Log Repositori Terkini</span>
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-slate-700 font-medium">
                            Surat keterangan bebas pustaka siap dicetak untuk <strong>{stats.verifiedFull}</strong> skripsi lengkap.
                          </p>
                          <span className="text-[10px] text-slate-400">Realtime sync aktif</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-slate-700 font-medium">
                            Pejabat verifikator aktif:{' '}
                            <strong>{pelapor.filter(p => p.active === 1).map(p => p.nama_pelapor).join(', ')}</strong>
                          </p>
                          <span className="text-[10px] text-slate-400">Tanda tangan digital terhubung</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="text-slate-700 font-medium">
                            Sebanyak <strong>{tulisan.length} panduan & warta</strong> repositori aktif dan dapat diakses mahasiswa.
                          </p>
                          <span className="text-[10px] text-slate-400">Informasi publik update</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Switch to Mahasiswa Card */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#003366]">Hubungkan ke Mahasiswa</div>
                        <div className="text-[10px] text-slate-600">Lihat bagaimana perubahan Anda tampil di sisi mahasiswa</div>
                      </div>
                      <button
                        onClick={() => setPortalMode('student')}
                        className="px-3 py-1.5 rounded-lg bg-[#004080] hover:bg-[#003366] text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                      >
                        Buka Web Mhs
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: VERIFIKASI SKRIPSI (CORE WORKSTATION) */}
          {/* ============================================================== */}
          {activeTab === 'skripsi' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Cari berdasarkan NIM, Nama Mahasiswa, Judul, atau No. Surat..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
                  >
                    <option value="all">Semua Status</option>
                    <option value="pending">Perlu Verifikasi (Hard/Soft)</option>
                    <option value="verified">Terverifikasi Penuh</option>
                    <option value="no_surat">Belum Ada No. Surat</option>
                  </select>

                  <select
                    value={facultyFilter}
                    onChange={(e) => setFacultyFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
                  >
                    <option value="all">Semua Fakultas</option>
                    {fakultas.map(f => (
                      <option key={f.id_fakultas} value={f.id_fakultas}>
                        {f.fakultas}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsAddSkripsiOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Naskah Baru</span>
                  </button>
                </div>
              </div>

              {/* Batch Action Bar if rows selected */}
              {selectedRowIds.length > 0 && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3 text-xs animate-in fade-in shadow-xs">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    <span>{selectedRowIds.length} berkas dipilih</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBatchVerifySoft}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Setujui Softcopy
                    </button>
                    <button
                      onClick={handleBatchGenerateSurat}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Terbitkan No Surat
                    </button>
                    <button
                      onClick={() => setSelectedRowIds([])}
                      className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Data Table */}
              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedRowIds.length > 0 &&
                              selectedRowIds.length === filteredSkripsi.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRowIds(filteredSkripsi.map(s => s.id_skripsi));
                              } else {
                                setSelectedRowIds([]);
                              }
                            }}
                            className="rounded bg-slate-100 border-slate-300 text-blue-600"
                          />
                        </th>
                        <th className="py-3 px-4">Mahasiswa & NIM</th>
                        <th className="py-3 px-4">Program Studi</th>
                        <th className="py-3 px-4">Judul Dokumen</th>
                        <th className="py-3 px-4 text-center">Softcopy (Word & PDF)</th>
                        <th className="py-3 px-4">No. Surat</th>
                        <th className="py-3 px-4 text-right">Aksi Petugas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSkripsi.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            Tidak ada berkas skripsi yang sesuai dengan kriteria pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredSkripsi.map((item) => {
                          const jur = jurusan.find(j => j.id_jurusan === item.id_jurusan);
                          const fak = fakultas.find(f => f.id_fakultas === item.id_fakultas);
                          const isSelected = selectedRowIds.includes(item.id_skripsi);

                          return (
                            <tr
                              key={item.id_skripsi}
                              className={`hover:bg-slate-50/80 transition-colors ${
                                isSelected ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <td className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedRowIds([...selectedRowIds, item.id_skripsi]);
                                    } else {
                                      setSelectedRowIds(selectedRowIds.filter(id => id !== item.id_skripsi));
                                    }
                                  }}
                                  className="rounded bg-slate-100 border-slate-300 text-blue-600"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-bold text-slate-900">{item.nama}</div>
                                <div className="text-[11px] font-mono text-[#004080] font-bold">{item.nim}</div>
                                {item.email && (
                                  <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                                    {item.email}
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-slate-800 font-semibold">{jur ? jur.jurusan : '-'}</div>
                                <div className="text-[10px] text-slate-500">{fak ? fak.fakultas : '-'}</div>
                              </td>
                              <td className="py-3 px-4 max-w-xs">
                                <p className="text-slate-700 line-clamp-2" title={item.judul}>
                                  {item.judul}
                                </p>
                                <span className="text-[10px] text-slate-400 font-medium">Tgl: {item.tanggal}</span>
                              </td>
                              {/* Softcopy Switch */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => {
                                    toggleSoftCopy(item.id_skripsi);
                                    showToast(`Status Softcopy ${item.nama} diubah.`);
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                    item.soft_copy === 1
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                  }`}
                                  title="Klik untuk beralih status Softcopy"
                                >
                                  {item.soft_copy === 1 ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>Valid</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      <span>Menunggu</span>
                                    </>
                                  )}
                                </button>
                              </td>
                              {/* Nomor Surat */}
                              <td className="py-3 px-4 font-mono">
                                {item.no_surat ? (
                                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[#003366] font-bold text-[11px]">
                                    {item.no_surat}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleGenerateSurat(item)}
                                    className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    + Terbitkan No
                                  </button>
                                )}
                              </td>
                              {/* Actions */}
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  {/* Print Certificate button */}
                                  <button
                                    onClick={() => setPreviewSkripsiPrint(item)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#004080] text-slate-600 hover:text-white transition-colors cursor-pointer"
                                    title="Cetak Surat Tanda Terima"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>

                                  {/* Send email button */}
                                  <button
                                    onClick={() => {
                                      const res = sendCertificateToGmail(item.id_skripsi, item.email);
                                      showToast(res.message);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 text-slate-600 hover:text-white transition-colors cursor-pointer"
                                    title="Kirim Bukti ke Email Mahasiswa"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>

                                  {/* Edit button */}
                                  <button
                                    onClick={() => setEditingSkripsi(item)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-600 text-slate-600 hover:text-white transition-colors cursor-pointer"
                                    title="Edit Berkas Skripsi"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>

                                  {/* Delete button */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`Yakin ingin menghapus skripsi mahasiswa: ${item.nama}?`)) {
                                        deleteSkripsi(item.id_skripsi);
                                        showToast(`Skripsi ${item.nama} telah dihapus.`);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white transition-colors cursor-pointer"
                                    title="Hapus Skripsi"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Menampilkan {filteredSkripsi.length} dari {skripsi.length} total naskah</span>
                  <span className="font-mono text-emerald-700 font-semibold">Sinkronisasi Database MySQL Aktif</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: PENERBITAN TANDA TERIMA & BEBAS PUSTAKA */}
          {/* ============================================================== */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <span>Pusat Cetak & Penerbitan Surat Bebas Pustaka</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Pilih berkas skripsi yang telah diverifikasi lengkap untuk mencetak Surat Tanda Terima resmi dengan tanda tangan digital & QR Code.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Verified Skripsi Ready for Printing */}
              {skripsi.length === 0 ? (
                <div className="p-10 rounded-2xl bg-white border border-slate-200/90 text-center text-slate-500 shadow-xs">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-700 text-sm">Belum Ada Naskah Skripsi Masuk</p>
                  <p className="text-xs text-slate-500 mt-1">Data naskah yang diajukan oleh mahasiswa akan tampil di sini untuk verifikasi & penerbitan tanda terima.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skripsi.map((item) => {
                  const isReady = item.soft_copy === 1;
                  const fak = fakultas.find(f => f.id_fakultas === item.id_fakultas);
                  const jur = jurusan.find(j => j.id_jurusan === item.id_jurusan);

                  return (
                    <div
                      key={item.id_skripsi}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all shadow-xs group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-[#004080]">{item.nim}</span>
                          {isReady ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Siap Terbit
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Belum Lengkap
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {item.nama}
                        </h4>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {jur ? jur.jurusan : '-'} • {fak ? fak.fakultas : '-'}
                        </div>

                        <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                          {item.judul}
                        </p>

                        <div className="mt-3 text-[11px] font-mono text-slate-600">
                          No. Surat:{' '}
                          <span className="text-[#004080] font-bold">{item.no_surat || 'Belum Terbit'}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => setPreviewSkripsiPrint(item)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Cetak Surat</span>
                        </button>

                        <button
                          onClick={() => {
                            const res = sendCertificateToGmail(item.id_skripsi, item.email);
                            showToast(res.message);
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Kirim ke Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: PEJABAT PENANDATANGAN */}
          {/* ============================================================== */}
          {activeTab === 'pelapor' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Pejabat Penandatangan Surat Bebas Pustaka</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Data pejabat penandatangan yang dicantumkan pada Surat Tanda Terima Penyerahan Skripsi.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddPelaporOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pejabat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pelapor.map((p) => (
                  <div
                    key={p.id_pelapor}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono text-slate-400">ID: #{p.id_pelapor}</span>
                        <button
                          onClick={() => {
                            togglePelaporActive(p.id_pelapor);
                            showToast(`Status keaktifan ${p.nama_pelapor} diperbarui.`);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                            p.active === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {p.active === 1 ? 'Aktif Bertugas' : 'Nonaktif'}
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{p.nama_pelapor}</h4>
                      <p className="text-xs text-[#004080] font-semibold mt-0.5">{p.jabatan_pelapor}</p>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">NIP: {p.nip_pelapor}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        Berkas TTD: {p.ttd_file_name || 'ttd.png'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingPelapor(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                          title="Edit Pejabat"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pejabat ${p.nama_pelapor}?`)) {
                              deletePelapor(p.id_pelapor);
                              showToast(`Pejabat ${p.nama_pelapor} dihapus.`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700"
                          title="Hapus Pejabat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: WARTA & PANDUAN REPOSITORI */}
          {/* ============================================================== */}
          {activeTab === 'tulisan' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>Warta, Pengumuman, & Panduan Mahasiswa</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Publikasikan tata cara penyerahan naskah, batas waktu wisuda, dan instruksi repositori bagi mahasiswa.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTulisanOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Warta Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {tulisan.map((t) => (
                  <div
                    key={t.idTulisan}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-blue-300 hover:shadow-xs transition-colors shadow-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {t.JenisTulisan === 1 ? 'Pengumuman Layanan' : 'Panduan Naskah'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">Dibuat: {t.TanggalDibuat}</span>
                        <button
                          onClick={() => {
                            toggleTulisanAktif(t.idTulisan);
                            showToast(`Status publikasi "${t.Judul}" diperbarui.`);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                            t.Aktif === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {t.Aktif === 1 ? 'Dipublikasikan' : 'Disembunyikan'}
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{t.Judul}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{t.Isi}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingTulisan(t)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Edit Tulisan"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus tulisan: ${t.Judul}?`)) {
                            deleteTulisan(t.idTulisan);
                            showToast('Tulisan berhasil dihapus.');
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700"
                        title="Hapus Tulisan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 6: PENGGUNA & MAHASISWA */}
          {/* ============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#004080]" />
                    <span>Manajemen Akun Mahasiswa & Administrator</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Daftar akun yang berhak mengakses sistem repositori dan portal penyerahan skripsi daring.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddUserOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengguna</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Nama Lengkap</th>
                        <th className="py-3 px-4">NIM / NIP / Username</th>
                        <th className="py-3 px-4">Peran</th>
                        <th className="py-3 px-4">Tempat & Tgl Lahir</th>
                        <th className="py-3 px-4">Alamat</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u.idUser} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{u.Nama}</td>
                          <td className="py-3 px-4 font-mono text-[#004080] font-bold">{u.UserName}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.JenisUser === 1
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {u.JenisUser === 1 ? 'Administrator / Petugas' : 'Mahasiswa'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {u.TempatLahir}, {u.TanggalLahir}
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{u.Alamat}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingUser(u)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700"
                                title="Edit Pengguna"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus pengguna ${u.Nama}?`)) {
                                    deleteUser(u.idUser);
                                    showToast(`Pengguna ${u.Nama} berhasil dihapus.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: MASTER DATA FAKULTAS & PRODI */}
          {/* ============================================================== */}
          {activeTab === 'master' && (
            <div className="space-y-4">
              {/* Subtabs Navigation */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setMasterSubTab('fakultas')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    masterSubTab === 'fakultas'
                      ? 'bg-[#004080] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Fakultas ({fakultas.length})
                </button>
                <button
                  onClick={() => setMasterSubTab('jurusan')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    masterSubTab === 'jurusan'
                      ? 'bg-[#004080] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Jurusan & Prodi ({jurusan.length})
                </button>
                <button
                  onClick={() => setMasterSubTab('jenis')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    masterSubTab === 'jenis'
                      ? 'bg-[#004080] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  Jenis Dokumen ({jenisDokumen.length})
                </button>
              </div>

              {/* Master: Fakultas */}
              {masterSubTab === 'fakultas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fakultas.map(f => (
                    <div key={f.id_fakultas} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="text-[10px] font-mono text-slate-400 font-bold">ID: #{f.id_fakultas}</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{f.fakultas}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{f.keterangan}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Master: Jurusan */}
              {masterSubTab === 'jurusan' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {jurusan.map(j => {
                    const fak = fakultas.find(f => f.id_fakultas === j.id_fakultas);
                    return (
                      <div key={j.id_jurusan} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                        <div className="text-[10px] font-mono text-slate-400 font-bold">ID: #{j.id_jurusan}</div>
                        <div className="text-sm font-bold text-slate-900 mt-1">{j.jurusan}</div>
                        <div className="text-xs text-[#004080] font-semibold mt-0.5">{fak ? fak.fakultas : '-'}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{j.keterangan}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Master: Jenis Dokumen */}
              {masterSubTab === 'jenis' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {jenisDokumen.map(jd => (
                    <div key={jd.id_jenis_dokumen} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
                      <div className="text-[10px] font-mono text-slate-400 font-bold">ID: #{jd.id_jenis_dokumen}</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{jd.jenis_dokumen}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{jd.keterangan_jenis_dokumen}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* GLOBAL MODALS IN PETUGAS WORKSTATION */}
      {/* ============================================================== */}

      {/* 1. Print Certificate Modal */}
      {previewSkripsiPrint && (
        <PrintCertificateModal
          skripsiItem={previewSkripsiPrint}
          onClose={() => setPreviewSkripsiPrint(null)}
        />
      )}

      {/* 2. Add / Edit Skripsi Modal */}
      {(isAddSkripsiOpen || editingSkripsi) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#004080]" />
                <span>{editingSkripsi ? 'Edit Berkas Skripsi' : 'Tambah Skripsi Baru'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddSkripsiOpen(false);
                  setEditingSkripsi(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  nama: formData.get('nama') as string,
                  nim: formData.get('nim') as string,
                  email: formData.get('email') as string,
                  id_fakultas: Number(formData.get('id_fakultas')),
                  id_jurusan: Number(formData.get('id_jurusan')),
                  id_jenis_dokumen: Number(formData.get('id_jenis_dokumen') || 1),
                  judul: formData.get('judul') as string,
                  no_surat: (formData.get('no_surat') as string) || null,
                  hard_copy: 1, // Defaulted since hardcopy is removed
                  soft_copy: formData.get('soft_copy') === '1' ? 1 : 0,
                  tanggal: (formData.get('tanggal') as string) || new Date().toISOString().split('T')[0],
                };

                if (editingSkripsi) {
                  updateSkripsi(editingSkripsi.id_skripsi, payload);
                  showToast(`Skripsi ${payload.nama} berhasil diperbarui.`);
                } else {
                  addSkripsi(payload);
                  showToast(`Skripsi baru untuk ${payload.nama} berhasil didaftarkan.`);
                }

                setIsAddSkripsiOpen(false);
                setEditingSkripsi(null);
              }}
              className="mt-4 space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Nama Mahasiswa</label>
                  <input
                    type="text"
                    name="nama"
                    defaultValue={editingSkripsi?.nama || ''}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">NIM Mahasiswa</label>
                  <input
                    type="text"
                    name="nim"
                    defaultValue={editingSkripsi?.nim || ''}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Alamat Email Mahasiswa</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingSkripsi?.email || ''}
                  placeholder="student@unri.ac.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Fakultas</label>
                  <select
                    name="id_fakultas"
                    defaultValue={editingSkripsi?.id_fakultas || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                  >
                    {fakultas.map(f => (
                      <option key={f.id_fakultas} value={f.id_fakultas}>
                        {f.fakultas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Program Studi</label>
                  <select
                    name="id_jurusan"
                    defaultValue={editingSkripsi?.id_jurusan || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                  >
                    {jurusan.map(j => (
                      <option key={j.id_jurusan} value={j.id_jurusan}>
                        {j.jurusan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Judul Karya Ilmiah / Skripsi</label>
                <textarea
                  name="judul"
                  rows={3}
                  defaultValue={editingSkripsi?.judul || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">No. Surat</label>
                  <input
                    type="text"
                    name="no_surat"
                    defaultValue={editingSkripsi?.no_surat || ''}
                    placeholder="001/SKR/FT/2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Status Softcopy</label>
                  <select
                    name="soft_copy"
                    defaultValue={editingSkripsi?.soft_copy !== undefined ? editingSkripsi.soft_copy : 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                  >
                    <option value="1">Terverifikasi (1)</option>
                    <option value="0">Belum Diverifikasi (0)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddSkripsiOpen(false);
                    setEditingSkripsi(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white font-bold shadow-xs"
                >
                  Simpan Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add / Edit Pejabat Modal */}
      {(isAddPelaporOpen || editingPelapor) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingPelapor ? 'Edit Pejabat Penandatangan' : 'Tambah Pejabat Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddPelaporOpen(false);
                  setEditingPelapor(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  nama_pelapor: formData.get('nama') as string,
                  nip_pelapor: formData.get('nip') as string,
                  jabatan_pelapor: formData.get('jabatan') as string,
                  ttd_url: 'ttd.png',
                  ttd_file_name: 'ttd.png',
                  active: formData.get('active') === '1' ? 1 : 0,
                };

                if (editingPelapor) {
                  updatePelapor(editingPelapor.id_pelapor, payload);
                  showToast(`Pejabat ${payload.nama_pelapor} diperbarui.`);
                } else {
                  addPelapor(payload);
                  showToast(`Pejabat baru ${payload.nama_pelapor} ditambahkan.`);
                }

                setIsAddPelaporOpen(false);
                setEditingPelapor(null);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={editingPelapor?.nama_pelapor || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">NIP Pejabat</label>
                <input
                  type="text"
                  name="nip"
                  defaultValue={editingPelapor?.nip_pelapor || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Jabatan Resmi</label>
                <input
                  type="text"
                  name="jabatan"
                  defaultValue={editingPelapor?.jabatan_pelapor || ''}
                  required
                  placeholder="Contoh: Koordinator Repositori"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Status Keaktifan</label>
                <select
                  name="active"
                  defaultValue={editingPelapor?.active !== undefined ? editingPelapor.active : 1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                >
                  <option value="1">Aktif Bertugas (1)</option>
                  <option value="0">Nonaktif (0)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPelaporOpen(false);
                    setEditingPelapor(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white font-bold shadow-xs"
                >
                  Simpan Pejabat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Tulisan Modal */}
      {(isAddTulisanOpen || editingTulisan) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingTulisan ? 'Edit Warta / Panduan' : 'Tambah Warta Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddTulisanOpen(false);
                  setEditingTulisan(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  Judul: formData.get('judul') as string,
                  Isi: formData.get('isi') as string,
                  JenisTulisan: Number(formData.get('jenis')),
                  Aktif: formData.get('aktif') === '1' ? 1 : 0,
                  TanggalDibuat: new Date().toISOString().split('T')[0],
                };

                if (editingTulisan) {
                  updateTulisan(editingTulisan.idTulisan, payload);
                  showToast('Warta berhasil diperbarui.');
                } else {
                  addTulisan(payload);
                  showToast('Warta baru dipublikasikan.');
                }

                setIsAddTulisanOpen(false);
                setEditingTulisan(null);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Judul Warta / Panduan</label>
                <input
                  type="text"
                  name="judul"
                  defaultValue={editingTulisan?.Judul || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Kategori Informasi</label>
                <select
                  name="jenis"
                  defaultValue={editingTulisan?.JenisTulisan || 1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                >
                  <option value="1">Pengumuman Layanan Wisuda</option>
                  <option value="2">Panduan Naskah & Format PDF</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Isi Konten</label>
                <textarea
                  name="isi"
                  rows={4}
                  defaultValue={editingTulisan?.Isi || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Status Publikasi</label>
                <select
                  name="aktif"
                  defaultValue={editingTulisan?.Aktif !== undefined ? editingTulisan.Aktif : 1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                >
                  <option value="1">Langsung Publikasikan (1)</option>
                  <option value="0">Simpan Sebagai Draft (0)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddTulisanOpen(false);
                    setEditingTulisan(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white font-bold shadow-xs"
                >
                  Simpan Warta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add / Edit User Modal */}
      {(isAddUserOpen || editingUser) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddUserOpen(false);
                  setEditingUser(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  Nama: formData.get('nama') as string,
                  UserName: formData.get('username') as string,
                  Password: (formData.get('password') as string) || 'mhs123',
                  JenisUser: Number(formData.get('jenis_user')),
                  JenisKelamin: Number(formData.get('jenis_kelamin') || 1),
                  TempatLahir: (formData.get('tempat_lahir') as string) || 'Pekanbaru',
                  TanggalLahir: (formData.get('tanggal_lahir') as string) || '2002-01-01',
                  Alamat: (formData.get('alamat') as string) || 'Pekanbaru',
                  NoKTP: (formData.get('no_ktp') as string) || '1471000000000000',
                  foto: 'default.png',
                };

                if (editingUser) {
                  updateUser(editingUser.idUser, payload);
                  showToast(`Akun ${payload.Nama} diperbarui.`);
                } else {
                  addUser(payload);
                  showToast(`Akun baru untuk ${payload.Nama} didaftarkan.`);
                }

                setIsAddUserOpen(false);
                setEditingUser(null);
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  defaultValue={editingUser?.Nama || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">NIM / NIP / Username</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingUser?.UserName || ''}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Kata Sandi (Password)</label>
                <input
                  type="text"
                  name="password"
                  defaultValue={editingUser?.Password || ''}
                  placeholder="Kosongkan jika tetap"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Peran Pengguna</label>
                <select
                  name="jenis_user"
                  defaultValue={editingUser?.JenisUser || 2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                >
                  <option value="2">Mahasiswa (JenisUser 2)</option>
                  <option value="1">Administrator / Petugas (JenisUser 1)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  defaultValue={editingUser?.Alamat || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004080] hover:bg-[#003366] text-white font-bold shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
