import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Skripsi, User, Pelapor, Tulisan } from '../types/database';
import {
  Shield,
  FileCheck2,
  Users,
  Award,
  Bell,
  Database,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Printer,
  Minus,
  Check
} from 'lucide-react';
import { PrintCertificateModal } from './PrintCertificateModal';

type AdminTab = 'skripsi' | 'users' | 'pelapor' | 'tulisan' | 'master';

export const AdminDashboard: React.FC = () => {
  const {
    skripsi,
    users,
    pelapor,
    tulisan,
    fakultas,
    jurusan,
    jenisDokumen,
    toggleHardCopy,
    toggleSoftCopy,
    updateSkripsi,
    deleteSkripsi,
    addSkripsi,
    setUserLoan,
    clearUserLoan,
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
    addFakultas,
    deleteFakultas,
    addJurusan,
    deleteJurusan,
    addJenisDokumen,
    deleteJenisDokumen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('skripsi');
  const [searchFilter, setSearchFilter] = useState<string>('');

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

  // Master Data subtabs
  const [masterSubTab, setMasterSubTab] = useState<'fakultas' | 'jurusan' | 'jenis'>('fakultas');

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 mb-2">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Pusat Kendali Administrator Repositori
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Manajemen UPA Perpustakaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verifikasi berkas karya ilmiah, kelola tanggungan pinjaman buku, atur pejabat penandatangan, dan pengumuman.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
            Skripsi: <strong className="text-blue-700 font-bold">{skripsi.length}</strong>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
            Pengguna: <strong className="text-blue-700 font-bold">{users.length}</strong>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
            Penandatangan Aktif:{' '}
            <strong className="text-emerald-600 font-bold">{pelapor.filter(p => p.active === 1).length}</strong>
          </span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        <button
          onClick={() => {
            setActiveTab('skripsi');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'skripsi'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Verifikasi Skripsi ({skripsi.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('users');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Status Pinjaman & Akun ({users.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pelapor');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'pelapor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Pejabat Penandatangan ({pelapor.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tulisan');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'tulisan'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pengumuman & Panduan ({tulisan.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('master');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'master'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Master Data</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: VERIFIKASI SKRIPSI                                */}
      {/* ======================================================== */}
      {activeTab === 'skripsi' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari NIM, Nama, No. Surat, atau Judul..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            <button
              onClick={() => setIsAddSkripsiOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berkas Skripsi</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[150px]">No. Surat / Dokumen</th>
                  <th className="py-3 px-4 min-w-[180px]">Mahasiswa & NIM</th>
                  <th className="py-3 px-4 min-w-[320px]">Judul Karya Ilmiah</th>
                  <th className="py-3 px-4 min-w-[120px] text-center">Hardcopy (1-Klik)</th>
                  <th className="py-3 px-4 min-w-[120px] text-center">Softcopy (1-Klik)</th>
                  <th className="py-3 px-4 min-w-[120px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {skripsi
                  .filter((item) => {
                    if (!searchFilter.trim()) return true;
                    const q = searchFilter.toLowerCase();
                    return (
                      item.nama.toLowerCase().includes(q) ||
                      item.nim.toLowerCase().includes(q) ||
                      (item.no_surat || '').toLowerCase().includes(q) ||
                      item.judul.toLowerCase().includes(q)
                    );
                  })
                  .map((item) => (
                    <tr key={item.id_skripsi} className="hover:bg-blue-50/40">
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono text-blue-700 font-bold">{item.no_surat || '-'}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium">{item.tanggal}</div>
                      </td>
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-slate-900 text-sm">{item.nama}</div>
                        <div className="text-slate-500 font-mono text-xs mt-0.5 font-bold">NIM: {item.nim}</div>
                      </td>
                      {/* Judul Karya Lengkap tanpa terpotong */}
                      <td className="py-3 px-4 align-top">
                        <p className="text-xs text-slate-900 font-medium leading-relaxed break-words">
                          {item.judul}
                        </p>
                      </td>
                      {/* 1-Click Toggle Hardcopy */}
                      <td className="py-3 px-4 text-center align-top">
                        <button
                          onClick={() => toggleHardCopy(item.id_skripsi)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                            item.hard_copy === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                          title="Klik untuk mengubah status penyerahan hardcopy"
                        >
                          {item.hard_copy === 1 ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Diserahkan</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>Belum</span>
                            </>
                          )}
                        </button>
                      </td>
                      {/* 1-Click Toggle Softcopy */}
                      <td className="py-3 px-4 text-center align-top">
                        <button
                          onClick={() => toggleSoftCopy(item.id_skripsi)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                            item.soft_copy === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                          title="Klik untuk mengubah status penyerahan softcopy"
                        >
                          {item.soft_copy === 1 ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Diserahkan</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                              <span>Belum</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewSkripsiPrint(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700"
                            title="Pratinjau Cetak Bebas Pustaka"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingSkripsi(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-indigo-700"
                            title="Edit Data"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus berkas skripsi milik ${item.nama}?`)) {
                                deleteSkripsi(item.id_skripsi);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            title="Hapus"
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
      )}

      {/* ======================================================== */}
      {/* TAB 2: STATUS PINJAMAN & AKUN PENGGUNA                    */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari Username/NIM, Nama, No. KTP..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
              />
            </div>

            <button
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah User Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[140px]">User / NIM</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Lengkap</th>
                  <th className="py-3 px-4 min-w-[110px]">Tipe Akun</th>
                  <th className="py-3 px-4 min-w-[160px]">Tempat, Tgl Lahir</th>
                  <th className="py-3 px-4 min-w-[160px] text-center">Status Pinjam Buku (Bebas Pustaka)</th>
                  <th className="py-3 px-4 min-w-[100px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users
                  .filter((u) => {
                    if (!searchFilter.trim()) return true;
                    const q = searchFilter.toLowerCase();
                    return (
                      u.UserName.toLowerCase().includes(q) ||
                      u.Nama.toLowerCase().includes(q) ||
                      u.NoKTP.toLowerCase().includes(q)
                    );
                  })
                  .map((u) => (
                    <tr key={u.idUser} className="hover:bg-blue-50/40">
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono font-bold text-slate-900 text-xs">{u.UserName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">KTP: {u.NoKTP}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-xs align-top">{u.Nama}</td>
                      <td className="py-3 px-4 align-top">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                            u.JenisUser === 1
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {u.JenisUser === 1 ? 'Administrator' : 'Mahasiswa'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 align-top">
                        <div>{u.TempatLahir}</div>
                        <div className="text-[11px] text-slate-400">{u.TanggalLahir}</div>
                      </td>
                      {/* Quick Pinjam Counter & Clear */}
                      <td className="py-3 px-4 text-center align-top">
                        <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-50 border border-slate-200">
                          <button
                            onClick={() => setUserLoan(u.idUser, u.Pinjam - 1)}
                            disabled={u.Pinjam <= 0}
                            className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                            title="Kurangi pinjaman 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span
                            className={`px-2 text-xs font-bold ${
                              u.Pinjam > 0 ? 'text-amber-700' : 'text-emerald-700'
                            }`}
                          >
                            {u.Pinjam} Buku
                          </span>

                          <button
                            onClick={() => setUserLoan(u.idUser, u.Pinjam + 1)}
                            className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 shadow-sm"
                            title="Tambah pinjaman 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {u.Pinjam > 0 && (
                            <button
                              onClick={() => clearUserLoan(u.idUser)}
                              className="ml-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
                              title="Set 0 (Bebas Pustaka Seketika)"
                            >
                              Bebaskan
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus pengguna ${u.Nama}?`)) {
                                deleteUser(u.idUser);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                            title="Hapus User"
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
      )}

      {/* ======================================================== */}
      {/* TAB 3: PEJABAT PENANDATANGAN (`pelapor`)                 */}
      {/* ======================================================== */}
      {activeTab === 'pelapor' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Daftar Pejabat Penandatangan Surat Bebas Pustaka</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pejabat dengan status Aktif akan muncul di opsi pilihan penandatangan saat pencetakan surat.
              </p>
            </div>

            <button
              onClick={() => setIsAddPelaporOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pejabat Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[200px]">Nama Pejabat</th>
                  <th className="py-3 px-4 min-w-[170px]">NIP</th>
                  <th className="py-3 px-4 min-w-[180px]">Jabatan</th>
                  <th className="py-3 px-4 min-w-[110px] text-center">Status Aktif (1-Klik)</th>
                  <th className="py-3 px-4 min-w-[100px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pelapor.map((p) => (
                  <tr key={p.id_pelapor} className="hover:bg-blue-50/40">
                    <td className="py-3 px-4 font-bold text-slate-900">{p.nama_pelapor}</td>
                    <td className="py-3 px-4 font-mono text-blue-700 font-bold">{p.nip_pelapor}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{p.jabatan_pelapor}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => togglePelaporActive(p.id_pelapor)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          p.active === 1
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {p.active === 1 ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <span>Nonaktif</span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingPelapor(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pejabat ${p.nama_pelapor}?`)) {
                              deletePelapor(p.id_pelapor);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
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
      )}

      {/* ======================================================== */}
      {/* TAB 4: PENGUMUMAN & PANDUAN (`tulisan`)                  */}
      {/* ======================================================== */}
      {activeTab === 'tulisan' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manajemen Pengumuman & Standar Dokumen</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konten artikel yang dipublikasikan di halaman beranda dan panduan pemustaka.
              </p>
            </div>

            <button
              onClick={() => setIsAddTulisanOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Tulisan Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[100px]">Tanggal</th>
                  <th className="py-3 px-4 min-w-[320px]">Judul & Isi Pengumuman</th>
                  <th className="py-3 px-4 min-w-[160px]">Kategori</th>
                  <th className="py-3 px-4 min-w-[120px] text-center">Status Tayang (1-Klik)</th>
                  <th className="py-3 px-4 min-w-[100px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tulisan.map((t) => (
                  <tr key={t.idTulisan} className="hover:bg-blue-50/40">
                    <td className="py-3 px-4 font-mono text-slate-500 font-medium align-top">{t.TanggalDibuat}</td>
                    {/* Judul & Isi ditampilkan tanpa potongan clamp yang agresif */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-bold text-slate-900 text-sm">{t.Judul}</div>
                      <div className="text-xs text-slate-600 font-normal mt-1 leading-relaxed break-words">{t.Isi}</div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                          t.JenisTulisan === 1
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {t.JenisTulisan === 1 ? '1 - Pengumuman Layanan' : '2 - Standar & Panduan'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      <button
                        onClick={() => toggleTulisanAktif(t.idTulisan)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                          t.Aktif === 1
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {t.Aktif === 1 ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Tayang</span>
                          </>
                        ) : (
                          <span>Disembunyikan</span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingTulisan(t)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tulisan "${t.Judul}"?`)) {
                              deleteTulisan(t.idTulisan);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
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
      )}

      {/* ======================================================== */}
      {/* TAB 5: MASTER DATA                                       */}
      {/* ======================================================== */}
      {activeTab === 'master' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6">
            <button
              onClick={() => setMasterSubTab('fakultas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                masterSubTab === 'fakultas'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fakultas ({fakultas.length})
            </button>
            <button
              onClick={() => setMasterSubTab('jurusan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                masterSubTab === 'jurusan'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jurusan / Program Studi ({jurusan.length})
            </button>
            <button
              onClick={() => setMasterSubTab('jenis')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                masterSubTab === 'jenis'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenis Dokumen ({jenisDokumen.length})
            </button>
          </div>

          {/* SubTab 1: Fakultas */}
          {masterSubTab === 'fakultas' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-500 font-medium">Tabel `fakultas` (10 Unit Fakultas di Universitas Riau)</span>
                <button
                  onClick={() => {
                    const name = prompt('Nama Fakultas:');
                    if (name) {
                      const ket = prompt('Keterangan singkat:') || '';
                      addFakultas({ fakultas: name, keterangan: ket });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  + Tambah Fakultas
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 min-w-[60px]">ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Nama Fakultas</th>
                      <th className="py-2.5 px-3 min-w-[220px]">Keterangan</th>
                      <th className="py-2.5 px-3 min-w-[80px] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fakultas.map((f) => (
                      <tr key={f.id_fakultas} className="hover:bg-blue-50/30">
                        <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{f.id_fakultas}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{f.fakultas}</td>
                        <td className="py-2.5 px-3 text-slate-600">{f.keterangan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${f.fakultas}?`)) deleteFakultas(f.id_fakultas);
                            }}
                            className="p-1 text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab 2: Jurusan */}
          {masterSubTab === 'jurusan' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-500 font-medium">Tabel `jurusan` (Program Studi)</span>
                <button
                  onClick={() => {
                    const fakId = Number(prompt('ID Fakultas (1-10):') || '1');
                    const jur = prompt('Nama Jurusan/Prodi:');
                    if (jur) {
                      const ket = prompt('Keterangan:') || '';
                      addJurusan({ id_fakultas: fakId, jurusan: jur, keterangan: ket });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  + Tambah Jurusan
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 min-w-[60px]">ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Fakultas</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Nama Jurusan</th>
                      <th className="py-2.5 px-3 min-w-[220px]">Keterangan</th>
                      <th className="py-2.5 px-3 min-w-[80px] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jurusan.map((j) => {
                      const parentFak = fakultas.find(f => f.id_fakultas === j.id_fakultas);
                      return (
                        <tr key={j.id_jurusan} className="hover:bg-blue-50/30">
                          <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{j.id_jurusan}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium">{parentFak?.fakultas || j.id_fakultas}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{j.jurusan}</td>
                          <td className="py-2.5 px-3 text-slate-500">{j.keterangan}</td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                if (confirm(`Hapus ${j.jurusan}?`)) deleteJurusan(j.id_jurusan);
                              }}
                              className="p-1 text-rose-600 hover:text-rose-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab 3: Jenis Dokumen */}
          {masterSubTab === 'jenis' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-500 font-medium">Tabel `jenis_dokumen`</span>
                <button
                  onClick={() => {
                    const name = prompt('Nama Jenis Dokumen:');
                    if (name) {
                      const ket = prompt('Keterangan:') || '';
                      addJenisDokumen({ jenis_dokumen: name, keterangan_jenis_dokumen: ket });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                >
                  + Tambah Jenis Dokumen
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 min-w-[60px]">ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Jenis Dokumen</th>
                      <th className="py-2.5 px-3 min-w-[240px]">Keterangan</th>
                      <th className="py-2.5 px-3 min-w-[80px] text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {jenisDokumen.map((d) => (
                      <tr key={d.id_jenis_dokumen} className="hover:bg-blue-50/30">
                        <td className="py-2.5 px-3 font-mono text-blue-700 font-bold">{d.id_jenis_dokumen}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{d.jenis_dokumen}</td>
                        <td className="py-2.5 px-3 text-slate-600">{d.keterangan_jenis_dokumen}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${d.jenis_dokumen}?`)) deleteJenisDokumen(d.id_jenis_dokumen);
                            }}
                            className="p-1 text-rose-600 hover:text-rose-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SKRIPSI                                */}
      {/* ======================================================== */}
      {(editingSkripsi || isAddSkripsiOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkripsi ? 'Edit Data Berkas Skripsi' : 'Tambah Berkas Skripsi Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingSkripsi(null);
                  setIsAddSkripsiOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const no_surat = formData.get('no_surat') as string;
                const nama = formData.get('nama') as string;
                const nim = formData.get('nim') as string;
                const judul = formData.get('judul') as string;
                const id_fakultas = Number(formData.get('id_fakultas'));
                const id_jurusan = Number(formData.get('id_jurusan'));
                const id_jenis_dokumen = Number(formData.get('id_jenis_dokumen'));
                const hard_copy = formData.get('hard_copy') === 'on' ? 1 : 0;
                const soft_copy = formData.get('soft_copy') === 'on' ? 1 : 0;
                const tanggal = (formData.get('tanggal') as string) || new Date().toISOString().split('T')[0];

                if (editingSkripsi) {
                  updateSkripsi(editingSkripsi.id_skripsi, {
                    no_surat,
                    nama,
                    nim,
                    judul,
                    id_fakultas,
                    id_jurusan,
                    id_jenis_dokumen,
                    hard_copy,
                    soft_copy,
                    tanggal,
                  });
                } else {
                  addSkripsi({
                    no_surat,
                    nama,
                    nim,
                    judul,
                    id_fakultas,
                    id_jurusan,
                    id_jenis_dokumen,
                    hard_copy,
                    soft_copy,
                    tanggal,
                  });
                }

                setEditingSkripsi(null);
                setIsAddSkripsiOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Surat</label>
                  <input
                    name="no_surat"
                    defaultValue={editingSkripsi?.no_surat || `0${skripsi.length + 1}/SKR/FT/2024`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal"
                    defaultValue={editingSkripsi?.tanggal || new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIM Mahasiswa</label>
                  <input
                    name="nim"
                    defaultValue={editingSkripsi?.nim || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Mahasiswa</label>
                  <input
                    name="nama"
                    defaultValue={editingSkripsi?.nama || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fakultas</label>
                  <select
                    name="id_fakultas"
                    defaultValue={editingSkripsi?.id_fakultas || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  >
                    {fakultas.map(f => (
                      <option key={f.id_fakultas} value={f.id_fakultas}>
                        {f.fakultas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jurusan / Prodi</label>
                  <select
                    name="id_jurusan"
                    defaultValue={editingSkripsi?.id_jurusan || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  >
                    {jurusan.map(j => (
                      <option key={j.id_jurusan} value={j.id_jurusan}>
                        {j.jurusan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Dokumen</label>
                  <select
                    name="id_jenis_dokumen"
                    defaultValue={editingSkripsi?.id_jenis_dokumen || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                  >
                    {jenisDokumen.map(d => (
                      <option key={d.id_jenis_dokumen} value={d.id_jenis_dokumen}>
                        {d.jenis_dokumen}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Karya Ilmiah</label>
                <textarea
                  name="judul"
                  rows={3}
                  defaultValue={editingSkripsi?.judul || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hard_copy"
                    defaultChecked={editingSkripsi ? editingSkripsi.hard_copy === 1 : false}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Hardcopy Diserahkan</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="soft_copy"
                    defaultChecked={editingSkripsi ? editingSkripsi.soft_copy === 1 : true}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Softcopy PDF Diserahkan</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkripsi(null);
                    setIsAddSkripsiOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT USER                                   */}
      {/* ======================================================== */}
      {(editingUser || isAddUserOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsAddUserOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const UserName = formData.get('UserName') as string;
                const Nama = formData.get('Nama') as string;
                const JenisUser = Number(formData.get('JenisUser'));
                const Pinjam = Number(formData.get('Pinjam'));
                const TempatLahir = formData.get('TempatLahir') as string;
                const TanggalLahir = formData.get('TanggalLahir') as string;
                const NoKTP = formData.get('NoKTP') as string;
                const Alamat = formData.get('Alamat') as string;

                if (editingUser) {
                  updateUser(editingUser.idUser, {
                    UserName,
                    Nama,
                    JenisUser,
                    Pinjam,
                    TempatLahir,
                    TanggalLahir,
                    NoKTP,
                    Alamat,
                  });
                } else {
                  addUser({
                    UserName,
                    Password: 'mhs123',
                    Nama,
                    JenisUser,
                    JenisKelamin: 1,
                    TempatLahir,
                    TanggalLahir,
                    NoKTP,
                    Alamat,
                    foto: 'default.png',
                    Pinjam,
                  });
                }

                setEditingUser(null);
                setIsAddUserOpen(false);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Username / NIM</label>
                  <input
                    name="UserName"
                    defaultValue={editingUser?.UserName || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipe Akun</label>
                  <select
                    name="JenisUser"
                    defaultValue={editingUser?.JenisUser || 2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value={2}>Mahasiswa</option>
                    <option value={1}>Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap</label>
                <input
                  name="Nama"
                  defaultValue={editingUser?.Nama || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jumlah Pinjam Buku</label>
                  <input
                    type="number"
                    min="0"
                    name="Pinjam"
                    defaultValue={editingUser ? editingUser.Pinjam : 0}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor KTP / Identitas</label>
                  <input
                    name="NoKTP"
                    defaultValue={editingUser?.NoKTP || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tempat Lahir</label>
                  <input
                    name="TempatLahir"
                    defaultValue={editingUser?.TempatLahir || 'Pekanbaru'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="TanggalLahir"
                    defaultValue={editingUser?.TanggalLahir || '2002-01-01'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat</label>
                <input
                  name="Alamat"
                  defaultValue={editingUser?.Alamat || 'Pekanbaru, Riau'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setIsAddUserOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PELAPOR (SIGNATORIES)                   */}
      {/* ======================================================== */}
      {(editingPelapor || isAddPelaporOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingPelapor ? 'Edit Pejabat Penandatangan' : 'Tambah Pejabat Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingPelapor(null);
                  setIsAddPelaporOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const nama_pelapor = formData.get('nama_pelapor') as string;
                const nip_pelapor = formData.get('nip_pelapor') as string;
                const jabatan_pelapor = formData.get('jabatan_pelapor') as string;
                const active = formData.get('active') === 'on' ? 1 : 0;

                if (editingPelapor) {
                  updatePelapor(editingPelapor.id_pelapor, {
                    nama_pelapor,
                    nip_pelapor,
                    jabatan_pelapor,
                    active,
                  });
                } else {
                  addPelapor({
                    nama_pelapor,
                    nip_pelapor,
                    jabatan_pelapor,
                    ttd_url: 'ttd_default.png',
                    ttd_file_name: 'ttd_default.png',
                    active,
                  });
                }

                setEditingPelapor(null);
                setIsAddPelaporOpen(false);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Pejabat (Lengkap Gelar)</label>
                <input
                  name="nama_pelapor"
                  defaultValue={editingPelapor?.nama_pelapor || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP Pejabat</label>
                <input
                  name="nip_pelapor"
                  defaultValue={editingPelapor?.nip_pelapor || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jabatan Resmi</label>
                <input
                  name="jabatan_pelapor"
                  defaultValue={editingPelapor?.jabatan_pelapor || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingPelapor ? editingPelapor.active === 1 : true}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Status Aktif Sebagai Penandatangan Surat</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPelapor(null);
                    setIsAddPelaporOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Pejabat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT TULISAN (PENGUMUMAN)                   */}
      {/* ======================================================== */}
      {(editingTulisan || isAddTulisanOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTulisan ? 'Edit Artikel Tulisan' : 'Buat Tulisan / Pengumuman Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingTulisan(null);
                  setIsAddTulisanOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const Judul = formData.get('Judul') as string;
                const Isi = formData.get('Isi') as string;
                const JenisTulisan = Number(formData.get('JenisTulisan'));
                const Aktif = formData.get('Aktif') === 'on' ? 1 : 0;
                const TanggalDibuat = (formData.get('TanggalDibuat') as string) || new Date().toISOString().split('T')[0];

                if (editingTulisan) {
                  updateTulisan(editingTulisan.idTulisan, {
                    Judul,
                    Isi,
                    JenisTulisan,
                    Aktif,
                    TanggalDibuat,
                  });
                } else {
                  addTulisan({
                    Judul,
                    Isi,
                    JenisTulisan,
                    Aktif,
                    TanggalDibuat,
                  });
                }

                setEditingTulisan(null);
                setIsAddTulisanOpen(false);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Tulisan</label>
                  <select
                    name="JenisTulisan"
                    defaultValue={editingTulisan?.JenisTulisan || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value={1}>1 - Pengumuman Layanan</option>
                    <option value={2}>2 - Panduan & Standar Dokumen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Publikasi</label>
                  <input
                    type="date"
                    name="TanggalDibuat"
                    defaultValue={editingTulisan?.TanggalDibuat || new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  name="Judul"
                  defaultValue={editingTulisan?.Judul || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Isi Lengkap Konten</label>
                <textarea
                  name="Isi"
                  rows={5}
                  defaultValue={editingTulisan?.Isi || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="Aktif"
                    defaultChecked={editingTulisan ? editingTulisan.Aktif === 1 : true}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 font-medium">Tayang di Halaman Publik</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTulisan(null);
                    setIsAddTulisanOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Tulisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Certificate Modal for Previewing directly from Admin */}
      {previewSkripsiPrint && (
        <PrintCertificateModal
          skripsiItem={previewSkripsiPrint}
          onClose={() => setPreviewSkripsiPrint(null)}
        />
      )}
    </div>
  );
};
