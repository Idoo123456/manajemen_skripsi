import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, LogIn, Lock, User as UserIcon, Shield, GraduationCap, AlertCircle } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, quickSwitchUser } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Masuk Akun Pengguna</h3>
              <p className="text-xs text-slate-500">Portal SIM-SKRIPSI Universitas Riau</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 mb-1 font-semibold flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-blue-600" />
              NIM Mahasiswa / Username Admin
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: 2007111002 atau admin"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-600" />
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password akun..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-700/20 transition-all text-xs cursor-pointer"
          >
            Masuk Sekarang
          </button>
        </form>

        {/* Quick Demo Credentials shortcut */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Pilihan Akun Cepat:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                quickSwitchUser('siti');
                setIsLoginModalOpen(false);
              }}
              className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 hover:bg-blue-100 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Siti Nurhaliza</span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">Sistem Informasi (FMIPA)</div>
            </button>

            <button
              onClick={() => {
                quickSwitchUser('rizki');
                setIsLoginModalOpen(false);
              }}
              className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200 hover:bg-sky-100 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-sky-900 text-xs">
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                <span>M. Rizki</span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">Teknik Informatika (FT)</div>
            </button>
          </div>

          <button
            onClick={() => {
              quickSwitchUser('admin');
              setIsLoginModalOpen(false);
            }}
            className="mt-2 w-full p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 flex items-center justify-center gap-2 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span>Masuk Sebagai Administrator (admin / admin123)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
