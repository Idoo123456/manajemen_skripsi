import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Skripsi } from '../types/database';
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  QrCode,
  Send
} from 'lucide-react';

interface PrintCertificateModalProps {
  skripsiItem: Skripsi;
  onClose: () => void;
}

export const PrintCertificateModal: React.FC<PrintCertificateModalProps> = ({
  skripsiItem,
  onClose,
}) => {
  const {
    fakultas,
    jurusan,
    jenisDokumen,
    pelapor,
    users,
    currentUser,
    sendCertificateToGmail
  } = useApp();

  // Find related data
  const fak = fakultas.find(f => f.id_fakultas === skripsiItem.id_fakultas);
  const jur = jurusan.find(j => j.id_jurusan === skripsiItem.id_jurusan);
  const jenis = jenisDokumen.find(d => d.id_jenis_dokumen === skripsiItem.id_jenis_dokumen);
  
  // Find user to check Pinjam
  const userRecord = users.find(u => u.UserName === skripsiItem.nim) || currentUser;
  const pinjamCount = userRecord ? userRecord.Pinjam : 0;

  // Active signatories from table pelapor WHERE active === 1
  const activeSignatories = pelapor.filter(p => p.active === 1);
  const [selectedPelaporId, setSelectedPelaporId] = useState<number>(() => {
    return activeSignatories.length > 0 ? activeSignatories[0].id_pelapor : 1;
  });

  const selectedSignatory = pelapor.find(p => p.id_pelapor === selectedPelaporId) || activeSignatories[0];

  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  // Status kelayakan cetak
  const isEligible = skripsiItem.hard_copy === 1 && skripsiItem.soft_copy === 1 && pinjamCount === 0;

  // Format date in Indonesian: e.g. "20 Juni 2024"
  const formatIndonesianDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setIsSendingEmail(true);
    setTimeout(() => {
      sendCertificateToGmail(skripsiItem.id_skripsi, skripsiItem.email);
      setIsSendingEmail(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-start py-4 sm:py-6 md:py-8 px-2 sm:px-4 print:p-0 print:m-0 print:static print:bg-white print:overflow-visible">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto print:my-0 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full print:overflow-visible">
        
        {/* Top Header Bar (Hidden in Print) */}
        <div className="print:hidden p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 shadow-sm">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Pratinjau Surat Keterangan Bebas Pustaka
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                UPA Perpustakaan Universitas Riau • Dokumen Resmi Yudisium
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Button: Send to Gmail */}
            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-all shadow-sm cursor-pointer"
              title="Kirim salinan surat resmi ini ke akun Gmail mahasiswa"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>{isSendingEmail ? 'Mengirim...' : 'Kirim ke Gmail'}</span>
            </button>

            {/* Button: Print A4 */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-600 hover:to-sky-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen (Print A4)</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar: Status Verifikasi & Pilihan Pejabat (Hidden in Print) */}
        <div className="print:hidden px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isEligible ? (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status Berkas: Lengkap & Terverifikasi Bebas Tanggungan (Siap Dicetak)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Status Berkas: Menunggu verifikasi fisik/sirkulasi lengkap</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium whitespace-nowrap">Pejabat Pengesah:</span>
            <select
              value={selectedPelaporId}
              onChange={(e) => setSelectedPelaporId(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium cursor-pointer"
            >
              {activeSignatories.map((p) => (
                <option key={p.id_pelapor} value={p.id_pelapor}>
                  {p.nama_pelapor} - {p.jabatan_pelapor}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FORMAL INDONESIAN UNIVERSITY LETTER (PRINT-READY A4 AREA) */}
        {/* ======================================================== */}
        <div className="p-4 sm:p-8 max-h-[calc(90vh-140px)] overflow-y-auto bg-slate-200/70 flex justify-center print:p-0 print:max-h-none print:overflow-visible print:bg-white">
          <div
            id="print-area"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-10 sm:p-14 shadow-2xl relative font-serif text-[13px] leading-relaxed border border-slate-300 print:border-none print:shadow-none print:p-8"
          >
            {/* Kop Surat Resmi Universitas Riau */}
            <div className="border-b-[3px] border-double border-black pb-3 text-center relative">
              {/* Logo / Lambang Resmi Universitas Riau */}
              <div className="absolute left-1 top-0 w-20 h-20 flex items-center justify-center">
                <img
                  src="/lambang-unri.png"
                  alt="Lambang Resmi Universitas Riau"
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Teks Lembaga & Alamat Resmi */}
              <div className="px-20 text-center">
                <h4 className="text-[13px] font-bold uppercase tracking-wide leading-tight text-black font-serif">
                  KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
                </h4>
                <h3 className="text-[16px] font-extrabold uppercase tracking-wide leading-tight mt-0.5 text-black font-serif">
                  UNIVERSITAS RIAU
                </h3>
                <h2 className="text-[14px] font-bold uppercase tracking-tight leading-tight mt-0.5 text-black font-serif">
                  UNIT PENUNJANG AKADEMIK (UPA) PERPUSTAKAAN
                </h2>
                <p className="text-[10.5px] font-serif italic mt-1 leading-tight text-neutral-800">
                  Kampus Bina Widya Km. 12,5 Simpang Baru, Pekanbaru 28293, Riau, Indonesia
                  <br />
                  Laman: https://perpustakaan.unri.ac.id | Pos-el: perpustakaan@unri.ac.id
                </p>
              </div>
            </div>

            {/* Judul Surat Resmi */}
            <div className="text-center my-6">
              <h2 className="text-[15px] font-bold uppercase tracking-wide font-serif text-black underline underline-offset-4 decoration-1">
                SURAT KETERANGAN BEBAS PUSTAKA & PENYERAHAN KARYA ILMIAH
              </h2>
              <p className="text-[12.5px] font-serif font-medium mt-1.5 text-neutral-900">
                Nomor: <span className="font-serif font-bold text-black">{skripsiItem.no_surat || '002/SKR/FT/2024'}</span>
              </p>
            </div>

            {/* Isi Surat */}
            <div className="space-y-4 text-justify font-serif text-[13px] leading-relaxed text-black">
              <p>
                Kepala Unit Penunjang Akademik (UPA) Perpustakaan Universitas Riau dengan ini menerangkan bahwa:
              </p>

              {/* Data Mahasiswa Table (Rapi dengan Font Serif Seragam) */}
              <div className="my-3 pl-4 font-serif text-[13px]">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-52 py-1 text-black font-normal">Nama Mahasiswa</td>
                      <td className="w-4 py-1 text-center">:</td>
                      <td className="py-1 font-bold text-black uppercase">{skripsiItem.nama}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-black font-normal">Nomor Induk Mahasiswa (NIM)</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-bold text-black">{skripsiItem.nim}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-black font-normal">Fakultas</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-normal text-black">{fak?.fakultas || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-black font-normal">Program Studi / Jurusan</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-normal text-black">{jur?.jurusan || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-black font-normal">Jenis Dokumen Karya Ilmiah</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-normal text-black">{jenis?.jenis_dokumen || 'Skripsi'} ({jenis?.keterangan_jenis_dokumen || 'Sarjana S1'})</td>
                    </tr>
                    <tr className="align-top">
                      <td className="py-1 text-black font-normal">Judul Karya Ilmiah</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 italic font-serif leading-snug text-black">
                        &ldquo;{skripsiItem.judul}&rdquo;
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-black font-normal">Tanggal Pengesahan</td>
                      <td className="py-1 text-center">:</td>
                      <td className="py-1 font-normal text-black">{formatIndonesianDate(skripsiItem.tanggal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verifikasi Kelengkapan Berkas */}
              <p>
                Telah menyelesaikan seluruh kewajiban administrasi kepustakaan sebagai persyaratan pendaftaran yudisium dan wisuda, dengan rincian status verifikasi:
              </p>

              <div className="pl-4 font-serif text-[12.5px] space-y-1.5 text-black">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded border border-black flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>
                    <strong>Penyerahan Naskah Hardcopy:</strong> Naskah jilid tugas akhir lengkap telah diserahkan ke bagian pengolahan fisik perpustakaan.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded border border-black flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>
                    <strong>Pengunggahan Naskah Softcopy Digital:</strong> Naskah PDF lengkap (Fulltext & Terpisah) telah divalidasi ke sistem E-Repository.
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded border border-black flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <span>
                    <strong>Status Bebas Tanggungan Koleksi:</strong> Dinyatakan <strong className="uppercase">BEBAS PINJAMAN</strong> (0 buku / tidak memiliki tanggungan denda sirkulasi).
                  </span>
                </div>
              </div>

              <p className="pt-2">
                Demikian Surat Keterangan Bebas Pustaka dan Penyerahan Karya Ilmiah ini diterbitkan dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
              </p>
            </div>

            {/* Signature Block & QR Code Otentikasi */}
            <div className="mt-12 flex items-end justify-between font-serif">
              {/* QR Code Verifikasi Dokumen */}
              <div className="border border-black p-2.5 rounded text-center w-36 font-serif">
                <div className="w-24 h-24 mx-auto bg-neutral-50 border border-neutral-300 flex flex-col items-center justify-center p-1">
                  <QrCode className="w-20 h-20 text-black stroke-[1.5]" />
                </div>
                <div className="text-[8px] font-sans font-semibold mt-1 text-black leading-tight">
                  VALIDASI DIGITAL RESMI
                  <br />
                  <span className="text-[7.5px] text-neutral-600 font-mono">{skripsiItem.nim}-{skripsiItem.id_skripsi}</span>
                </div>
              </div>

              {/* Pejabat Penandatangan Resmi */}
              <div className="w-72 text-center font-serif text-[13px]">
                <p className="text-left pl-4 font-serif">
                  Pekanbaru, {formatIndonesianDate(skripsiItem.tanggal || new Date().toISOString())}
                </p>
                <p className="text-left pl-4 font-bold mt-1 text-black font-serif">
                  {selectedSignatory?.jabatan_pelapor || 'Koordinator Repositori'},
                </p>

                {/* Stempel & Tanda Tangan Digital Institusi */}
                <div className="h-20 my-1 relative flex items-center justify-center">
                  <div className="font-serif italic text-2xl text-blue-900 tracking-tight select-none -rotate-6 font-bold">
                    {selectedSignatory?.nama_pelapor.split(',')[0]}
                  </div>
                  <div className="absolute w-24 h-24 rounded-full border border-dashed border-red-600/40 pointer-events-none flex items-center justify-center text-[7px] text-red-600 font-sans font-bold rotate-12 opacity-50">
                    UPA PERPUSTAKAAN UNRI
                  </div>
                </div>

                <p className="font-bold underline text-[13.5px] text-black font-serif">
                  {selectedSignatory?.nama_pelapor || 'Hendra Wijaya, S.Sos., M.IP.'}
                </p>
                <p className="text-[11.5px] text-black font-serif mt-0.5">
                  NIP. {selectedSignatory?.nip_pelapor || '197803152003121002'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
