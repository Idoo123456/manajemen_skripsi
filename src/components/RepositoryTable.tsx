import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from './ScrollReveal';
import {
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  ArrowUpDown,
  FileCheck,
  FileCheck2
} from 'lucide-react';

interface RepositoryTableProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const RepositoryTable: React.FC<RepositoryTableProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const {
    viewSkripsi,
    fakultas,
    jenisDokumen,
    getJurusanByFakultas,
    setSelectedSkripsiForPrint,
    skripsi,
    setActiveTab
  } = useApp();

  // Filters
  const [selectedFakultas, setSelectedFakultas] = useState<number | 'all'>('all');
  const [selectedJurusan, setSelectedJurusan] = useState<number | 'all'>('all');
  const [selectedJenisDokumen, setSelectedJenisDokumen] = useState<number | 'all'>('all');
  const [filterVerification, setFilterVerification] = useState<'all' | 'verified' | 'pending'>('all');
  const [sortField, setSortField] = useState<'tanggal' | 'nama' | 'judul'>('tanggal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Cascading dropdown: options for Jurusan dependent on selected Fakultas
  const availableJurusan = useMemo(() => {
    if (selectedFakultas === 'all') {
      return [];
    }
    return getJurusanByFakultas(Number(selectedFakultas));
  }, [selectedFakultas, getJurusanByFakultas]);

  // Handle fakultas change
  const handleFakultasChange = (fakId: number | 'all') => {
    setSelectedFakultas(fakId);
    setSelectedJurusan('all'); // Reset jurusan cascade
  };

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    return viewSkripsi
      .filter((item) => {
        // Text search (NIM, Nama, Judul)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNim = item.nim.toLowerCase().includes(q);
          const matchNama = item.nama.toLowerCase().includes(q);
          const matchJudul = item.judul.toLowerCase().includes(q);
          const matchNoSurat = (item.no_surat || '').toLowerCase().includes(q);
          if (!matchNim && !matchNama && !matchJudul && !matchNoSurat) {
            return false;
          }
        }

        // Fakultas filter
        if (selectedFakultas !== 'all' && item.id_fakultas !== Number(selectedFakultas)) {
          return false;
        }

        // Jurusan filter
        if (selectedJurusan !== 'all' && item.id_jurusan !== Number(selectedJurusan)) {
          return false;
        }

        // Jenis dokumen filter
        if (selectedJenisDokumen !== 'all' && item.id_jenis_dokumen !== Number(selectedJenisDokumen)) {
          return false;
        }

        // Verification status filter
        if (filterVerification === 'verified') {
          if (item.hard_copy !== 1 || item.soft_copy !== 1) return false;
        } else if (filterVerification === 'pending') {
          if (item.hard_copy === 1 && item.soft_copy === 1) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [viewSkripsi, searchQuery, selectedFakultas, selectedJurusan, selectedJenisDokumen, filterVerification, sortField, sortOrder]);

  const toggleSort = (field: 'tanggal' | 'nama' | 'judul') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <section id="repository-section" className="py-6 sm:py-10 pb-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Filter Controls */}
      <ScrollReveal delay={0} direction="up">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-blue-50 border border-blue-200 text-blue-900 mb-2">
                <FileCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Katalog Repositori Terbuka</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Daftar Penyerahan Karya Ilmiah Mahasiswa
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Data terverifikasi penyerahan berkas fisik (hardcopy) & naskah digital (softcopy) UPA Perpustakaan UNRI.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <span className="text-xs text-slate-500 font-medium">Total Dokumen:</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                {filteredData.length} Dokumen
              </span>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Filter 1: Fakultas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Filter Fakultas
              </label>
              <div className="relative">
                <select
                  value={selectedFakultas}
                  onChange={(e) =>
                    handleFakultasChange(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white appearance-none pr-8 cursor-pointer font-medium"
                >
                  <option value="all">Semua Fakultas ({fakultas.length})</option>
                  {fakultas.map((f) => (
                    <option key={f.id_fakultas} value={f.id_fakultas}>
                      {f.fakultas}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter 2: Jurusan (Cascading!) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                Filter Program Studi / Jurusan
              </label>
              <div className="relative">
                <select
                  value={selectedJurusan}
                  disabled={selectedFakultas === 'all'}
                  onChange={(e) =>
                    setSelectedJurusan(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white appearance-none pr-8 cursor-pointer font-medium ${
                    selectedFakultas === 'all' ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
                  }`}
                >
                  <option value="all">
                    {selectedFakultas === 'all'
                      ? 'Pilih Fakultas Dahulu'
                      : `Semua Jurusan (${availableJurusan.length})`}
                  </option>
                  {availableJurusan.map((j) => (
                    <option key={j.id_jurusan} value={j.id_jurusan}>
                      {j.jurusan}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter 3: Jenis Dokumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Jenis Dokumen
              </label>
              <div className="relative">
                <select
                  value={selectedJenisDokumen}
                  onChange={(e) =>
                    setSelectedJenisDokumen(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white appearance-none pr-8 cursor-pointer font-medium"
                >
                  <option value="all">Semua Jenis Dokumen ({jenisDokumen.length})</option>
                  {jenisDokumen.map((d) => (
                    <option key={d.id_jenis_dokumen} value={d.id_jenis_dokumen}>
                      {d.jenis_dokumen}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter 4: Status Verifikasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                Status Verifikasi
              </label>
              <div className="relative">
                <select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white appearance-none pr-8 cursor-pointer font-medium"
                >
                  <option value="all">Semua Status</option>
                  <option value="verified">Lengkap (Hard & Softcopy)</option>
                  <option value="pending">Belum Lengkap</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Reset filter pill if any active */}
          {(selectedFakultas !== 'all' || selectedJurusan !== 'all' || selectedJenisDokumen !== 'all' || filterVerification !== 'all' || searchQuery) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filter Aktif:</span>
              <button
                onClick={() => {
                  setSelectedFakultas('all');
                  setSelectedJurusan('all');
                  setSelectedJenisDokumen('all');
                  setFilterVerification('all');
                  setSearchQuery('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Main Table Card */}
      <ScrollReveal delay={150} direction="up">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
          {/* Mobile scroll hint */}
          <div className="lg:hidden px-4 py-2.5 bg-blue-50/60 border-b border-blue-100/80 flex items-center justify-between text-[11px] text-blue-800 font-medium">
            <span>← Geser ke kanan untuk melihat status & tombol aksi</span>
            <span className="font-bold text-blue-600">Scrollable →</span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[960px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-4 px-4 sm:px-5 w-[15%]">No / Dokumen</th>
                <th className="py-4 px-3 sm:px-4 w-[16%] cursor-pointer hover:text-blue-700" onClick={() => toggleSort('nama')}>
                  <div className="flex items-center gap-1.5">
                    <span>Mahasiswa & NIM</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-3 sm:px-4 w-[31%] cursor-pointer hover:text-blue-700" onClick={() => toggleSort('judul')}>
                  <div className="flex items-center gap-1.5">
                    <span>Judul Karya Ilmiah</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-3 sm:px-4 w-[16%]">Fakultas & Prodi</th>
                <th className="py-4 px-2 sm:px-3 w-[7%] text-center">Hardcopy</th>
                <th className="py-4 px-2 sm:px-3 w-[7%] text-center">Softcopy</th>
                <th className="py-4 px-4 sm:px-5 w-[8%] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-slate-500">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-base font-bold text-slate-800">
                      {skripsi.length === 0
                        ? 'Repositori Belum Memiliki Data'
                        : 'Tidak ada karya ilmiah yang sesuai filter.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      {skripsi.length === 0
                        ? 'Belum ada karya ilmiah yang terdaftar di repositori. Ajukan berkas tugas akhir Anda melalui Formulir Penyerahan Skripsi untuk mulai mengisi repositori.'
                        : 'Coba ubah kata kunci pencarian atau sesuaikan filter fakultas/jurusan.'}
                    </p>
                    {skripsi.length === 0 && (
                      <button
                        onClick={() => setActiveTab('student')}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Ajukan Karya Ilmiah Sekarang</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const isFullyVerified = item.hard_copy === 1 && item.soft_copy === 1;
                  // Find original skripsi object for modal
                  const rawSkripsi = skripsi.find(s => s.id_skripsi === item.id_skripsi);

                  return (
                    <tr
                      key={item.id_skripsi}
                      className="hover:bg-blue-50/40 transition-colors duration-150 group"
                    >
                      {/* Dokumen & No Surat */}
                      <td className="py-4 px-4 sm:px-5 align-top">
                        <div className="flex flex-col">
                          <span className="text-xs text-blue-800 font-bold whitespace-normal leading-tight">
                            {item.no_surat || 'NOMOR BELUM TERBIT'}
                          </span>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 w-fit">
                            {item.jenis_dokumen}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            {item.tanggal}
                          </span>
                        </div>
                      </td>

                      {/* Mahasiswa & NIM */}
                      <td className="py-4 px-3 sm:px-4 align-top">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors text-sm leading-snug">
                          {item.nama}
                        </div>
                        <div className="text-xs text-slate-600 mt-1 font-semibold">
                          NIM: {item.nim}
                        </div>
                      </td>

                      {/* Judul Karya (Tanpa line-clamp agar tidak terpotong!) */}
                      <td className="py-4 px-3 sm:px-4 align-top">
                        <p className="text-xs text-slate-900 font-medium leading-relaxed break-words">
                          {item.judul}
                        </p>
                      </td>

                      {/* Fakultas & Jurusan */}
                      <td className="py-4 px-3 sm:px-4 align-top">
                        <div className="font-bold text-slate-900 text-xs leading-snug">{item.fakultas}</div>
                        <div className="text-xs text-slate-600 mt-1 font-medium leading-snug">{item.jurusan}</div>
                      </td>

                      {/* Hardcopy Status */}
                      <td className="py-4 px-2 sm:px-3 text-center align-top">
                        {item.hard_copy === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Diserahkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Softcopy Status */}
                      <td className="py-4 px-2 sm:px-3 text-center align-top">
                        {item.soft_copy === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Diserahkan
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            Belum
                          </span>
                        )}
                      </td>

                      {/* Aksi Print */}
                      <td className="py-4 px-4 sm:px-5 text-center align-top">
                        <button
                          onClick={() => {
                            if (rawSkripsi) setSelectedSkripsiForPrint(rawSkripsi);
                          }}
                          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                            isFullyVerified
                              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                          title="Lihat Pratinjau Tanda Terima Penyerahan Skripsi"
                        >
                          <Printer className="w-3.5 h-3.5 shrink-0" />
                          <span>Lihat</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  </section>
);
};
