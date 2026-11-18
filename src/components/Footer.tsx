import React from 'react';
import { MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600 text-xs py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: University & App */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo-unri.png"
                alt="Logo Resmi Universitas Riau"
                className="h-10 sm:h-12 w-auto object-contain"
              />
              <div className="border-l border-slate-200 pl-3">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight block">
                  UPA PERPUSTAKAAN
                </span>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Sistem Informasi Manajemen Skripsi & Bebas Pustaka
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Mewujudkan layanan repositori institusi yang terpercaya, akuntabel, dan transparan dalam mendukung Tri Dharma Perguruan Tinggi serta kelancaran proses verifikasi yudisium dan kelulusan mahasiswa.
            </p>
          </div>

          {/* Col 2: Alamat */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Lokasi Layanan</h4>
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Gedung UPA Perpustakaan UNRI, Kampus Bina Widya Km. 12.5 Simpang Baru, Pekanbaru 28293, Riau</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="w-4 h-4 text-sky-600 shrink-0" />
              <span>https://perpustakaan.unri.ac.id</span>
            </div>
          </div>

          {/* Col 3: Jam Layanan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Jam Operasional Loket</h4>
            <p className="text-slate-600 leading-relaxed">
              Senin - Kamis: 08.00 - 16.00 WIB
              <br />
              Jumat: 08.00 - 16.30 WIB
              <br />
              Sabtu & Minggu: Tutup (Layanan Daring Aktif)
            </p>
            <div className="pt-1 text-[11px] text-blue-800 font-bold">
              Pelayanan Penyerahan Naskah & Bebas Pustaka Online Aktif 24 Jam
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} UPA Perpustakaan Universitas Riau. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex flex-wrap items-center gap-3 font-medium text-slate-500">
            <a href="https://unri.ac.id" target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
              Portal UNRI
            </a>
            <span>•</span>
            <a href="https://perpustakaan.unri.ac.id" target="_blank" rel="noreferrer" className="hover:text-blue-700 transition-colors">
              Laman Resmi Perpustakaan
            </a>
            <span>•</span>
            <span>Kementerian Pendidikan Tinggi, Sains, dan Teknologi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
