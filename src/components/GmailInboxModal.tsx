import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Send
} from 'lucide-react';

export const GmailInboxModal: React.FC = () => {
  const { previewEmailModal, setPreviewEmailModal, setSelectedSkripsiForPrint, fakultas, jurusan } = useApp();

  if (!previewEmailModal) return null;

  const { skripsi, recipientEmail } = previewEmailModal;
  const fak = fakultas.find(f => f.id_fakultas === skripsi.id_fakultas);
  const jur = jurusan.find(j => j.id_jurusan === skripsi.id_jurusan);

  const handleOpenPrintA4 = () => {
    setSelectedSkripsiForPrint(skripsi);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Gmail App Styled Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shadow-sm shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Kotak Masuk Gmail</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Baru Masuk
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-1">
                Surat Keterangan Bebas Pustaka - {skripsi.nama} ({skripsi.nim})
              </h2>
            </div>
          </div>

          <button
            onClick={() => setPreviewEmailModal(null)}
            className="p-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
            title="Tutup Notifikasi Email"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sender & Recipient Meta Details */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                UNRI
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  UPA Perpustakaan Universitas Riau <span className="font-normal text-slate-500 text-xs">&lt;perpustakaan@unri.ac.id&gt;</span>
                </div>
                <div className="text-slate-500 text-xs mt-0.5">
                  Kepada: <strong className="text-blue-800 font-semibold">{recipientEmail}</strong>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-medium">
              {skripsi.email_sent_at || new Date().toLocaleString('id-ID')}
            </div>
          </div>

          {/* Email Body Message */}
          <div className="mt-5 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            <p>
              Yth. Mahasiswa <strong>{skripsi.nama}</strong> (NIM: <strong>{skripsi.nim}</strong>),
            </p>
            <p>
              Selamat! Penyerahan naskah karya ilmiah tugas akhir Anda telah berhasil diverifikasi oleh tim pengolahan repositori UPA Perpustakaan Universitas Riau.
            </p>

            {/* Document Details Box */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 text-xs">
              <div className="font-bold text-blue-950 uppercase tracking-wider text-[11px] mb-1">
                Rincian Surat Keterangan:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Nomor Surat:</span>{' '}
                  <strong className="text-blue-800 font-bold">{skripsi.no_surat || '002/SKR/FT/2024'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Fakultas / Prodi:</span>{' '}
                  <strong>{fak?.fakultas || 'Fakultas Teknik'}</strong> ({jur?.jurusan || 'Teknik Informatika'})
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Judul Karya:</span>{' '}
                  <span className="font-semibold italic text-slate-900">&ldquo;{skripsi.judul}&rdquo;</span>
                </div>
                <div className="sm:col-span-2 text-emerald-800 font-semibold flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Status Administrasi: BEBAS PINJAMAN & TERVERIFIKASI RESMI</span>
                </div>
              </div>
            </div>

            <p>
              Surat Keterangan Bebas Pustaka dan Penyerahan Karya Ilmiah ini berlaku resmi sebagai berkas persyaratan yudisium dan pendaftaran wisuda di lingkungan Universitas Riau.
            </p>

            {/* Attachment Card */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-2">1 Lampiran Berkas Dokumen PDF Resmi:</span>
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-blue-400 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    PDF
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Surat_Bebas_Pustaka_{skripsi.nim}.pdf
                    </div>
                    <div className="text-[11px] text-slate-500">
                      245 KB • Resmi Bertanda Tangan Digital & QR Code
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleOpenPrintA4}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Fisik A4</span>
                  </button>
                  <button
                    onClick={handleOpenPrintA4}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info on Production SMTP */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-slate-600">
            <Send className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Pemberitahuan otomatis terkirim melalui <strong>UNRI Mail Gateway (SMTP)</strong>.</span>
          </div>

          <button
            onClick={() => setPreviewEmailModal(null)}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors self-end sm:self-auto"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
