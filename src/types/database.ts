export interface Fakultas {
  id_fakultas: number;
  fakultas: string;
  keterangan: string;
}

export interface Jurusan {
  id_jurusan: number;
  id_fakultas: number;
  jurusan: string;
  keterangan: string;
}

export interface JenisDokumen {
  id_jenis_dokumen: number;
  jenis_dokumen: string;
  keterangan_jenis_dokumen: string;
}

export interface Pelapor {
  id_pelapor: number;
  nama_pelapor: string;
  nip_pelapor: string;
  jabatan_pelapor: string;
  ttd_url: string;
  ttd_file_name: string;
  active: number; // 1 = aktif, 0 = nonaktif
}

export interface Skripsi {
  id_skripsi: number;
  id_jenis_dokumen: number;
  no_surat: string | null;
  nama: string;
  nim: string;
  email?: string;
  email_sent_at?: string | null;
  id_fakultas: number;
  id_jurusan: number;
  judul: string;
  hard_copy: number; // 0 = belum, 1 = sudah
  soft_copy: number; // 0 = belum, 1 = sudah
  tanggal: string; // YYYY-MM-DD
}

export interface Tulisan {
  idTulisan: number;
  TanggalDibuat: string; // YYYY-MM-DD
  Judul: string;
  Isi: string;
  Aktif: number; // 1 = aktif, 0 = nonaktif
  JenisTulisan: number; // 1 = Pengumuman Layanan, 2 = Panduan & Standar Dokumen
}

export interface User {
  idUser: number;
  JenisUser: number; // 1 = Admin, 2 = Mahasiswa
  UserName: string;  // NIP / NIM / Username
  Password?: string;
  Nama: string;
  email?: string;
  JenisKelamin: number; // 1 = Laki-laki, 2 = Perempuan
  TempatLahir: string;
  TanggalLahir: string;
  Alamat: string;
  NoKTP: string;
  foto: string;
  Pinjam?: number;
}

// Helper views
export interface ViewFakjur {
  id_jurusan: number;
  jurusan: string;
  keterangan: string;
  id_fakultas: number;
  fakultas: string;
}

export interface ViewSkripsi {
  id_skripsi: number;
  id_jenis_dokumen: number;
  no_surat: string | null;
  nama: string;
  nim: string;
  email?: string;
  email_sent_at?: string | null;
  id_fakultas: number;
  id_jurusan: number;
  judul: string;
  hard_copy: number;
  soft_copy: number;
  tanggal: string;
  jurusan: string;
  ket_jurusan: string;
  fakultas: string;
  ket_fakultas: string;
  jenis_dokumen: string;
}
