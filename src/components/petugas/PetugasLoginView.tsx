import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
  KeyRound
} from 'lucide-react';

export const PetugasLoginView: React.FC = () => {
  const { login, quickSwitchUser, setPortalMode } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    }, 300);
  };

  const handleQuickLogin = (role: 'admin' | 'nurul' | 'hendra' | 'rina') => {
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      quickSwitchUser(role);
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glows & Pattern */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Top Bar Switcher */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo-unri.png"
            alt="Logo Universitas Riau"
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs"
          />
          <div className="border-l border-slate-300 pl-3">
            <span className="block text-xs font-black tracking-widest text-[#003366] uppercase">
              UPA Perpustakaan UNRI
            </span>
            <span className="text-[11px] font-bold text-blue-600">
              Workstation Petugas Repositori
            </span>
          </div>
        </div>

        <button
          onClick={() => setPortalMode('student')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-blue-600" />
          <span>Beralih ke Web Mahasiswa</span>
        </button>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Left Hero / Petugas Portal Identity Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/60 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 border border-blue-200 text-blue-700 mb-6">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Area Khusus Staf & Pustakawan</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Pusat Kendali Petugas Repositori
              </h1>
              
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Akses terpadu untuk verifikasi naskah softcopy digital, penerbitan Surat Tanda Terima, dan integrasi repositori daring.
              </p>

              {/* Feature Highlights */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Validasi realtime terkoneksi langsung ke portal mahasiswa</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Penerbitan nomor surat resmi & cetak bukti bebas pustaka</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Manajemen data master prodi, pejabat, dan panduan repositori</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials Switcher */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  Akses Cepat Petugas:
                </span>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">1-Klik</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:text-blue-600">
                    <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Admin Utama</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">user: admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('nurul')}
                  className="p-2.5 rounded-xl bg-white hover:bg-emerald-50/80 border border-slate-200 hover:border-emerald-300 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:text-emerald-600">
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pustakawan</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Nurul Hidayati</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('hendra')}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:text-amber-600">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Koordinator</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Hendra Wijaya</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('rina')}
                  className="p-2.5 rounded-xl bg-white hover:bg-purple-50/80 border border-slate-200 hover:border-purple-300 transition-all text-left cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs group-hover:text-purple-600">
                    <UserIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Staf Administrasi</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">Rina Marlina</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Autentikasi Staf / Operator
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan masukkan kredensial resmi NIP atau username administrator Anda.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                  NIP Petugas / Username Administrator
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: admin atau 198406202008012005"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 font-mono transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all pr-10 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ingat sesi petugas ini</span>
                </label>
                <span className="text-slate-500 hover:text-slate-700">Default: admin123 / petugas123</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#004080] hover:bg-[#003366] text-white font-bold text-sm shadow-md shadow-blue-900/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Workstation Petugas</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                Apakah Anda seorang mahasiswa?{' '}
                <button
                  type="button"
                  onClick={() => setPortalMode('student')}
                  className="text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                >
                  Beralih ke Portal Mahasiswa & Bebas Pustaka
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 py-4 text-center text-xs text-slate-500">
        Unit Penunjang Akademik (UPA) Perpustakaan — Universitas Riau © 2026. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};
