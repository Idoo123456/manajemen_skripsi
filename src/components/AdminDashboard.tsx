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
  Printer
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
            <span>Pusat Kendali Administrator Repositori</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Manajemen Skripsi & Tugas Akhir
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Validasi berkas naskah fisik & digital, kelola akun mahasiswa, atur pejabat penandatangan, dan panduan repositori.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs font-medium">
            Total Skripsi: <strong className="text-blue-700 font-bold">{skripsi.length}</strong>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs font-medium">
            Pengguna: <strong className="text-blue-700 font-bold">{users.length}</strong>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-xs font-medium">
            Pejabat Aktif:{' '}
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Pengguna & Mahasiswa ({users.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('pelapor');
            setSearchFilter('');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berkas Skripsi</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[150px]">No. Surat / Tanggal</th>
                  <th className="py-3 px-4 min-w-[180px]">Mahasiswa & NIM</th>
                  <th className="py-3 px-4 min-w-[320px]">Judul Karya Ilmiah</th>
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
                      <td className="py-3 px-4 align-top">
                        <p className="text-xs text-slate-900 font-medium leading-relaxed break-words">
                          {item.judul}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-center align-top">
                        <button
                          onClick={() => toggleSoftCopy(item.id_skripsi)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
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
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 cursor-pointer"
                            title="Pratinjau Cetak Tanda Terima (A4)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingSkripsi(item)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-indigo-700 cursor-pointer"
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
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
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
      {/* TAB 2: PENGGUNA & MAHASISWA (`users`)                     */}
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[140px]">Username / NIM</th>
                  <th className="py-3 px-4 min-w-[180px]">Nama Lengkap</th>
                  <th className="py-3 px-4 min-w-[110px]">Peran Akun</th>
                  <th className="py-3 px-4 min-w-[100px]">Jenis Kelamin</th>
                  <th className="py-3 px-4 min-w-[160px]">Tempat, Tgl Lahir</th>
                  <th className="py-3 px-4 min-w-[180px]">Alamat & No. KTP</th>
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
                        {u.JenisKelamin === 1 ? 'Laki-laki' : 'Perempuan'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 align-top">
                        <div>{u.TempatLahir}</div>
                        <div className="text-[11px] text-slate-400">{u.TanggalLahir}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 align-top">
                        <div>{u.Alamat}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">KTP: {u.NoKTP}</div>
                      </td>
                      <td className="py-3 px-4 text-center align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 cursor-pointer"
                            title="Edit Pengguna"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus pengguna ${u.Nama}?`)) {
                                deleteUser(u.idUser);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
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
      )}

      {/* ======================================================== */}
      {/* TAB 3: PEJABAT PENANDATANGAN (`pelapor`)                 */}
      {/* ======================================================== */}
      {activeTab === 'pelapor' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pejabat Penandatangan Surat Tanda Terima Repositori</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pejabat berwenang UPA Perpustakaan yang tampil di lembar tanda terima serah berkas skripsi.
              </p>
            </div>

            <button
              onClick={() => setIsAddPelaporOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
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
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          p.active === 1
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {p.active === 1 ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingPelapor(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 cursor-pointer"
                          title="Edit Pejabat"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pejabat ${p.nama_pelapor}?`)) {
                              deletePelapor(p.id_pelapor);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                          title="Hapus Pejabat"
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
      {/* TAB 4: PENGUMUMAN & PANDUAN (`tulisan`)                   */}
      {/* ======================================================== */}
      {activeTab === 'tulisan' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Panduan & Pengumuman Repositori Skripsi</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola artikel panduan teknis penyerahan skripsi dan pengumuman layanan perpustakaan.
              </p>
            </div>

            <button
              onClick={() => setIsAddTulisanOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tulisan Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 min-w-[240px]">Judul Tulisan</th>
                  <th className="py-3 px-4 min-w-[130px]">Kategori</th>
                  <th className="py-3 px-4 min-w-[100px]">Tanggal</th>
                  <th className="py-3 px-4 min-w-[110px] text-center">Status Aktif (1-Klik)</th>
                  <th className="py-3 px-4 min-w-[100px] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tulisan.map((t) => (
                  <tr key={t.idTulisan} className="hover:bg-blue-50/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">{t.Judul}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.Isi}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          t.JenisTulisan === 1
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {t.JenisTulisan === 1 ? 'Pengumuman Layanan' : 'Standar Dokumen'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.TanggalDibuat}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleTulisanAktif(t.idTulisan)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          t.Aktif === 1
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {t.Aktif === 1 ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setEditingTulisan(t)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-700 cursor-pointer"
                          title="Edit Tulisan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tulisan "${t.Judul}"?`)) {
                              deleteTulisan(t.idTulisan);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                          title="Hapus Tulisan"
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
      {/* TAB 5: MASTER DATA (FAKULTAS, JURUSAN, JENIS DOKUMEN)    */}
      {/* ======================================================== */}
      {activeTab === 'master' && (
        <div className="rounded-3xl bg-white border border-slate-200 shadow-md shadow-slate-200/50 p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <button
              onClick={() => setMasterSubTab('fakultas')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterSubTab === 'fakultas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Fakultas ({fakultas.length})
            </button>
            <button
              onClick={() => setMasterSubTab('jurusan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterSubTab === 'jurusan'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Jurusan / Program Studi ({jurusan.length})
            </button>
            <button
              onClick={() => setMasterSubTab('jenis')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                masterSubTab === 'jenis'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Jenis Dokumen ({jenisDokumen.length})
            </button>
          </div>

          {/* Subtab: FAKULTAS */}
          {masterSubTab === 'fakultas' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Daftar Fakultas Universitas Riau
                </h4>
                <button
                  onClick={() => {
                    const name = prompt('Nama Fakultas:');
                    if (!name) return;
                    const ket = prompt('Keterangan / Singkatan:');
                    addFakultas({ fakultas: name, keterangan: ket || '' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Fakultas</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 w-16">ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Nama Fakultas</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Keterangan</th>
                      <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {fakultas.map((f) => (
                      <tr key={f.id_fakultas} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{f.id_fakultas}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{f.fakultas}</td>
                        <td className="py-2.5 px-3 text-slate-500">{f.keterangan}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus fakultas ${f.fakultas}?`)) {
                                deleteFakultas(f.id_fakultas);
                              }
                            }}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
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

          {/* Subtab: JURUSAN */}
          {masterSubTab === 'jurusan' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Daftar Program Studi / Jurusan
                </h4>
                <button
                  onClick={() => {
                    const name = prompt('Nama Program Studi:');
                    if (!name) return;
                    const fakId = Number(prompt('ID Fakultas (1-10):') || '1');
                    const ket = prompt('Keterangan:');
                    addJurusan({ id_fakultas: fakId, jurusan: name, keterangan: ket || '' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Jurusan</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 w-16">ID</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Nama Program Studi</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Fakultas</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Keterangan</th>
                      <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {jurusan.map((j) => {
                      const f = fakultas.find((fak) => fak.id_fakultas === j.id_fakultas);
                      return (
                        <tr key={j.id_jurusan} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{j.id_jurusan}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{j.jurusan}</td>
                          <td className="py-2.5 px-3 text-blue-700 font-semibold">{f?.fakultas || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-500">{j.keterangan}</td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              onClick={() => {
                                if (confirm(`Hapus jurusan ${j.jurusan}?`)) {
                                  deleteJurusan(j.id_jurusan);
                                }
                              }}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
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

          {/* Subtab: JENIS DOKUMEN */}
          {masterSubTab === 'jenis' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Daftar Jenis Dokumen Karya Ilmiah
                </h4>
                <button
                  onClick={() => {
                    const name = prompt('Jenis Dokumen (cth: Skripsi, Tesis):');
                    if (!name) return;
                    const ket = prompt('Keterangan Jenis Dokumen:');
                    addJenisDokumen({ jenis_dokumen: name, keterangan_jenis_dokumen: ket || '' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Jenis Dokumen</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3 w-16">ID</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Jenis Dokumen</th>
                      <th className="py-2.5 px-3 min-w-[260px]">Keterangan</th>
                      <th className="py-2.5 px-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {jenisDokumen.map((d) => (
                      <tr key={d.id_jenis_dokumen} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{d.id_jenis_dokumen}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{d.jenis_dokumen}</td>
                        <td className="py-2.5 px-3 text-slate-500">{d.keterangan_jenis_dokumen}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Hapus jenis dokumen ${d.jenis_dokumen}?`)) {
                                deleteJenisDokumen(d.id_jenis_dokumen);
                              }
                            }}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer"
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
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkripsi ? 'Edit Data Naskah Skripsi' : 'Tambah Berkas Skripsi Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingSkripsi(null);
                  setIsAddSkripsiOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
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
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Surat Resmi</label>
                  <input
                    name="no_surat"
                    defaultValue={editingSkripsi?.no_surat || `00${skripsi.length + 1}/SKR/FT/2026`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Penyerahan</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Judul Lengkap Naskah</label>
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
                    name="soft_copy"
                    defaultChecked={editingSkripsi ? editingSkripsi.soft_copy === 1 : true}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-slate-700 font-semibold">Naskah Softcopy PDF Divalidasi</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkripsi(null);
                    setIsAddSkripsiOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
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
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
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
                const JenisKelamin = Number(formData.get('JenisKelamin'));
                const TempatLahir = formData.get('TempatLahir') as string;
                const TanggalLahir = formData.get('TanggalLahir') as string;
                const NoKTP = formData.get('NoKTP') as string;
                const Alamat = formData.get('Alamat') as string;

                if (editingUser) {
                  updateUser(editingUser.idUser, {
                    UserName,
                    Nama,
                    JenisUser,
                    JenisKelamin,
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
                    JenisKelamin,
                    TempatLahir,
                    TanggalLahir,
                    NoKTP,
                    Alamat,
                    foto: 'default.png',
                    Pinjam: 0,
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
                  <label className="block text-slate-700 font-semibold mb-1">Peran Akun</label>
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
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    name="JenisKelamin"
                    defaultValue={editingUser?.JenisKelamin || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value={1}>Laki-laki</option>
                    <option value={2}>Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor KTP / NIK</label>
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
                <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap</label>
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
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT PELAPOR                                */}
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
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
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
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  name="nama_pelapor"
                  defaultValue={editingPelapor?.nama_pelapor || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">NIP (Nomor Induk Pegawai)</label>
                <input
                  name="nip_pelapor"
                  defaultValue={editingPelapor?.nip_pelapor || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Jabatan Resmi</label>
                <input
                  name="jabatan_pelapor"
                  defaultValue={editingPelapor?.jabatan_pelapor || 'Pustakawan Repositori'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="active_check"
                  name="active"
                  defaultChecked={editingPelapor ? editingPelapor.active === 1 : true}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="active_check" className="text-slate-700 font-semibold cursor-pointer">
                  Aktifkan sebagai Pejabat Penandatangan Sah
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPelapor(null);
                    setIsAddPelaporOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Pejabat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT TULISAN                                */}
      {/* ======================================================== */}
      {(editingTulisan || isAddTulisanOpen) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTulisan ? 'Edit Artikel / Panduan' : 'Tambah Tulisan Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingTulisan(null);
                  setIsAddTulisanOpen(false);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
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
                const TanggalDibuat =
                  (formData.get('TanggalDibuat') as string) || new Date().toISOString().split('T')[0];

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
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Artikel / Panduan</label>
                <input
                  name="Judul"
                  defaultValue={editingTulisan?.Judul || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Tulisan</label>
                  <select
                    name="JenisTulisan"
                    defaultValue={editingTulisan?.JenisTulisan || 1}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  >
                    <option value={1}>Pengumuman Layanan</option>
                    <option value={2}>Standar Format Dokumen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Dibuat</label>
                  <input
                    type="date"
                    name="TanggalDibuat"
                    defaultValue={editingTulisan?.TanggalDibuat || new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Isi Lengkap</label>
                <textarea
                  name="Isi"
                  rows={5}
                  defaultValue={editingTulisan?.Isi || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium leading-relaxed"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="aktif_tulisan_check"
                  name="Aktif"
                  defaultChecked={editingTulisan ? editingTulisan.Aktif === 1 : true}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="aktif_tulisan_check" className="text-slate-700 font-semibold cursor-pointer">
                  Tampilkan di Portal Publik
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTulisan(null);
                    setIsAddTulisanOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Simpan Tulisan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal Cetak A4 */}
      {previewSkripsiPrint && (
        <PrintCertificateModal
          skripsiItem={previewSkripsiPrint}
          onClose={() => setPreviewSkripsiPrint(null)}
        />
      )}
    </div>
  );
};
