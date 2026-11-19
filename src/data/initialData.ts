import { Fakultas, Jurusan, JenisDokumen, Pelapor, Skripsi, Tulisan, User } from '../types/database';

export const INITIAL_FAKULTAS: Fakultas[] = [
  { id_fakultas: 1, fakultas: 'Fakultas Teknik', keterangan: 'FT Universitas Riau' },
  { id_fakultas: 2, fakultas: 'Fakultas Matematika dan IPA', keterangan: 'FMIPA Universitas Riau' },
  { id_fakultas: 3, fakultas: 'Fakultas Ekonomi dan Bisnis', keterangan: 'FEB Universitas Riau' },
  { id_fakultas: 4, fakultas: 'Fakultas Keguruan dan Ilmu Pendidikan', keterangan: 'FKIP Universitas Riau' },
  { id_fakultas: 5, fakultas: 'Fakultas Ilmu Sosial dan Ilmu Politik', keterangan: 'FISIP Universitas Riau' },
  { id_fakultas: 6, fakultas: 'Fakultas Pertanian', keterangan: 'FP Universitas Riau' },
  { id_fakultas: 7, fakultas: 'Fakultas Perikanan dan Kelautan', keterangan: 'FPK Universitas Riau' },
  { id_fakultas: 8, fakultas: 'Fakultas Hukum', keterangan: 'FH Universitas Riau' },
  { id_fakultas: 9, fakultas: 'Fakultas Kedokteran', keterangan: 'FK Universitas Riau' },
  { id_fakultas: 10, fakultas: 'Fakultas Keperawatan', keterangan: 'FKp Universitas Riau' },
];

export const INITIAL_JURUSAN: Jurusan[] = [
  { id_jurusan: 1, id_fakultas: 1, jurusan: 'Teknik Informatika', keterangan: 'Program Studi S1 Teknik Informatika FT' },
  { id_jurusan: 2, id_fakultas: 1, jurusan: 'Teknik Elektro', keterangan: 'Program Studi S1 Teknik Elektro FT' },
  { id_jurusan: 3, id_fakultas: 1, jurusan: 'Teknik Mesin', keterangan: 'Program Studi S1 Teknik Mesin FT' },
  { id_jurusan: 4, id_fakultas: 2, jurusan: 'Sistem Informasi', keterangan: 'Program Studi S1 Sistem Informasi FMIPA' },
  { id_jurusan: 5, id_fakultas: 2, jurusan: 'Ilmu Komputer', keterangan: 'Program Studi S1 Ilmu Komputer FMIPA' },
  { id_jurusan: 6, id_fakultas: 2, jurusan: 'Matematika', keterangan: 'Program Studi S1 Matematika FMIPA' },
  { id_jurusan: 7, id_fakultas: 3, jurusan: 'Manajemen', keterangan: 'Program Studi S1 Manajemen FEB' },
  { id_jurusan: 8, id_fakultas: 3, jurusan: 'Akuntansi', keterangan: 'Program Studi S1 Akuntansi FEB' },
  { id_jurusan: 9, id_fakultas: 4, jurusan: 'Pendidikan Bahasa Inggris', keterangan: 'Program Studi S1 Pend. Bhs Inggris FKIP' },
  { id_jurusan: 10, id_fakultas: 5, jurusan: 'Ilmu Komunikasi', keterangan: 'Program Studi S1 Ilmu Komunikasi FISIP' },
];

export const INITIAL_JENIS_DOKUMEN: JenisDokumen[] = [
  { id_jenis_dokumen: 1, jenis_dokumen: 'Skripsi', keterangan_jenis_dokumen: 'Karya Tulis Ilmiah Sarjana (S1)' },
  { id_jenis_dokumen: 2, jenis_dokumen: 'Tugas Akhir', keterangan_jenis_dokumen: 'Tugas Akhir Program Diploma (D3)' },
  { id_jenis_dokumen: 3, jenis_dokumen: 'Tesis', keterangan_jenis_dokumen: 'Karya Tulis Ilmiah Magister (S2)' },
  { id_jenis_dokumen: 4, jenis_dokumen: 'Disertasi', keterangan_jenis_dokumen: 'Karya Tulis Ilmiah Doktoral (S3)' },
  { id_jenis_dokumen: 5, jenis_dokumen: 'Laporan PKL', keterangan_jenis_dokumen: 'Laporan Praktik Kerja Lapangan' },
  { id_jenis_dokumen: 6, jenis_dokumen: 'Artikel Jurnal', keterangan_jenis_dokumen: 'Publikasi Jurnal Ilmiah Mahasiswa' },
  { id_jenis_dokumen: 7, jenis_dokumen: 'Prosiding Seminar', keterangan_jenis_dokumen: 'Artikel Prosiding Konferensi Ilmiah' },
  { id_jenis_dokumen: 8, jenis_dokumen: 'Laporan Riset', keterangan_jenis_dokumen: 'Laporan Hasil Riset dan Penelitian' },
  { id_jenis_dokumen: 9, jenis_dokumen: 'Buku Monograf', keterangan_jenis_dokumen: 'Karya Tulis Ilmiah Buku Monograf' },
  { id_jenis_dokumen: 10, jenis_dokumen: 'Karya Inovasi Paten', keterangan_jenis_dokumen: 'Dokumen Paten & Hak Cipta Mahasiswa' },
];

export const INITIAL_PELAPOR: Pelapor[] = [
  { id_pelapor: 1, nama_pelapor: 'Hendra Wijaya, S.Sos., M.IP.', nip_pelapor: '197803152003121002', jabatan_pelapor: 'Koordinator Repositori', ttd_url: 'ttd_hendra.png', ttd_file_name: 'ttd_hendra.png', active: 1 },
  { id_pelapor: 2, nama_pelapor: 'Nurul Hidayati, S.I.Pust.', nip_pelapor: '198406202008012005', jabatan_pelapor: 'Pustakawan Verifikator', ttd_url: 'ttd_nurul.png', ttd_file_name: 'ttd_nurul.png', active: 1 },
  { id_pelapor: 3, nama_pelapor: 'Drs. Supriyanto, M.Si.', nip_pelapor: '196908121994031001', jabatan_pelapor: 'Kepala Bidang Layanan', ttd_url: 'ttd_supri.png', ttd_file_name: 'ttd_supri.png', active: 1 },
  { id_pelapor: 4, nama_pelapor: 'Rina Marlina, A.Md.Pust.', nip_pelapor: '198711222010012003', jabatan_pelapor: 'Staf Administrasi Skripsi', ttd_url: 'ttd_rina.png', ttd_file_name: 'ttd_rina.png', active: 1 },
  { id_pelapor: 5, nama_pelapor: 'Bambang Irawan, S.Kom.', nip_pelapor: '199001152015021004', jabatan_pelapor: 'Operator Data Repositori', ttd_url: 'ttd_bambang.png', ttd_file_name: 'ttd_bambang.png', active: 1 },
  { id_pelapor: 6, nama_pelapor: 'Dewi Sartika, S.Hum.', nip_pelapor: '198904102014032002', jabatan_pelapor: 'Pustakawan Pengolahan', ttd_url: 'ttd_dewi.png', ttd_file_name: 'ttd_dewi.png', active: 1 },
  { id_pelapor: 7, nama_pelapor: 'Faisal Akbar, S.T.', nip_pelapor: '199207082019031005', jabatan_pelapor: 'Teknisi Sistem Informasi', ttd_url: 'ttd_faisal.png', ttd_file_name: 'ttd_faisal.png', active: 1 },
  { id_pelapor: 8, nama_pelapor: 'Yuliana Sari, S.Pd.', nip_pelapor: '198603252009022004', jabatan_pelapor: 'Pustakawan Referensi', ttd_url: 'ttd_yuliana.png', ttd_file_name: 'ttd_yuliana.png', active: 1 },
  { id_pelapor: 9, nama_pelapor: 'Agus Setiawan, S.IP.', nip_pelapor: '198112052006041003', jabatan_pelapor: 'Pustakawan Verifikator Naskah', ttd_url: 'ttd_agus.png', ttd_file_name: 'ttd_agus.png', active: 1 },
  { id_pelapor: 10, nama_pelapor: 'Fitri Ramadhani, S.Sos.', nip_pelapor: '199302142020122006', jabatan_pelapor: 'Sekretariat Repositori', ttd_url: 'ttd_fitri.png', ttd_file_name: 'ttd_fitri.png', active: 1 },
];

export const INITIAL_SKRIPSI: Skripsi[] = [
  {
    id_skripsi: 1,
    id_jenis_dokumen: 1,
    no_surat: '001/SKR/FT/2026',
    nama: 'Muhammad Rizki Pratama',
    nim: '2007111001',
    email: 'm.rizki.pratama@student.unri.ac.id',
    email_sent_at: '2026-02-10 10:15',
    id_fakultas: 1,
    id_jurusan: 1,
    judul: 'Rancang Bangun Sistem Informasi Repositori Skripsi Berbasis Web Menggunakan React dan Node.js',
    hard_copy: 1,
    soft_copy: 1,
    tanggal: '2026-02-10'
  },
  {
    id_skripsi: 2,
    id_jenis_dokumen: 1,
    no_surat: '002/SKR/FMIPA/2026',
    nama: 'Siti Nurhaliza',
    nim: '2007111002',
    email: 'siti.nurhaliza@student.unri.ac.id',
    email_sent_at: '2026-02-12 14:30',
    id_fakultas: 2,
    id_jurusan: 4,
    judul: 'Penerapan Algoritma K-Means Clustering dalam Pemetaan Minat Riset Tugas Akhir Mahasiswa',
    hard_copy: 1,
    soft_copy: 1,
    tanggal: '2026-02-12'
  },
  {
    id_skripsi: 3,
    id_jenis_dokumen: 1,
    no_surat: '003/SKR/FT/2026',
    nama: 'Ahmad Fadillah',
    nim: '2007122003',
    email: 'ahmad.fadillah@student.unri.ac.id',
    email_sent_at: null,
    id_fakultas: 1,
    id_jurusan: 2,
    judul: 'Implementasi Internet of Things (IoT) untuk Monitoring Kualitas Daya Listrik Berbasis Mikrokontroler',
    hard_copy: 1,
    soft_copy: 0,
    tanggal: '2026-02-15'
  }
];

export const INITIAL_TULISAN: Tulisan[] = [
  {
    idTulisan: 1,
    TanggalDibuat: '2024-08-01',
    Judul: 'Alur Penyerahan Hardcopy & Softcopy Skripsi',
    Isi: 'Mahasiswa yang telah selesai ujian sidang dan revisi wajib menyerahkan dokumen skripsi hardcopy jilid resmi dan softcopy PDF naskah lengkap ke bagian pengolahan UPA Perpustakaan Universitas Riau. Pastikan lembar pengesahan telah ditandatangani lengkap oleh dewan pembimbing dan penguji.',
    Aktif: 1,
    JenisTulisan: 1
  },
  {
    idTulisan: 2,
    TanggalDibuat: '2024-08-05',
    Judul: 'Pedoman Validasi Naskah & Penerbitan Tanda Terima Repositori',
    Isi: 'Surat tanda terima penyerahan naskah skripsi diterbitkan secara resmi setelah verifikasi kelengkapan berkas softcopy PDF dan naskah fisik disetujui pustakawan. Surat ini dilengkapi dengan QR Code otentikasi digital sebagai syarat pendaftaran yudisium.',
    Aktif: 1,
    JenisTulisan: 1
  },
  {
    idTulisan: 3,
    TanggalDibuat: '2024-08-10',
    Judul: 'Standar Format Dokumen Skripsi & Tugas Akhir',
    Isi: 'Format berkas softcopy harus memuat halaman cover, abstrak bahasa Indonesia dan Inggris, bab 1 pendahuluan sampai penutup serta daftar pustaka dalam berkas PDF utuh dan file terpisah sesuai petunjuk teknis repositori institusi.',
    Aktif: 1,
    JenisTulisan: 2
  },
  {
    idTulisan: 4,
    TanggalDibuat: '2024-08-15',
    Judul: 'Jam Layanan Verifikasi Skripsi Semester Berjalan',
    Isi: 'Layanan verifikasi berkas tugas akhir dibuka setiap hari kerja Senin sampai Jumat pukul 08.30 - 15.30 WIB di Ruang Repositori Digital Lantai 2 Gedung UPA Perpustakaan Universitas Riau.',
    Aktif: 1,
    JenisTulisan: 1
  },
  {
    idTulisan: 5,
    TanggalDibuat: '2024-08-20',
    Judul: 'Sosialisasi Pengecekan Similaritas Turnitin Naskah Skripsi',
    Isi: 'Perpustakaan memfasilitasi uji similaritas karya ilmiah mahasiswa dengan ambang batas kemiripan maksimal 25% sesuai standar regulasi akademik kampus. Bukti cek similarity wajib disertakan dalam berkas lampiran penyerahan skripsi.',
    Aktif: 1,
    JenisTulisan: 2
  },
  {
    idTulisan: 6,
    TanggalDibuat: '2024-08-25',
    Judul: 'Integrasi Data E-Repository Tugas Akhir Mahasiswa',
    Isi: 'Sistem penyerahan skripsi kini terkoneksi langsung secara daring dengan E-Repository UPA Perpustakaan untuk memudahkan pengindeksan metadata dan penerbitan bukti serah terima karya ilmiah mahasiswa.',
    Aktif: 1,
    JenisTulisan: 1
  },
  {
    idTulisan: 7,
    TanggalDibuat: '2024-09-01',
    Judul: 'Batas Akhir Penyerahan Berkas Skripsi Periode Yudisium',
    Isi: 'Batas akhir unggah mandiri dan pengesahan berkas penyerahan skripsi untuk periode yudisium terdekat adalah tanggal 25 bulan berjalan. Mohon segera menyelesaikan sebelum batas waktu penutupan loket layanan.',
    Aktif: 1,
    JenisTulisan: 1
  },
  {
    idTulisan: 8,
    TanggalDibuat: '2024-09-05',
    Judul: 'Akses Referensi E-Journal & E-Book Pendukung Skripsi',
    Isi: 'Mahasiswa aktif tingkat akhir dapat mengakses ribuan jurnal ilmiah bereputasi nasional dan internasional melalui portal e-resources UPA Perpustakaan menggunakan akun Single Sign-On (SSO).',
    Aktif: 1,
    JenisTulisan: 2
  },
  {
    idTulisan: 9,
    TanggalDibuat: '2024-09-10',
    Judul: 'Layanan Bimbingan Sitasi dan Reference Manager Mendeley',
    Isi: 'Pustakawan menyediakan sesi konsultasi penggunaan Mendeley, Zotero, dan EndNote untuk penulisan sitasi serta konsistensi format daftar pustaka karya ilmiah mahasiswa.',
    Aktif: 1,
    JenisTulisan: 2
  },
  {
    idTulisan: 10,
    TanggalDibuat: '2024-09-15',
    Judul: 'Apresiasi Pengumpulan Karya Ilmiah Mahasiswa Berprestasi',
    Isi: 'UPA Perpustakaan mengapresiasi mahasiswa yang mengumpulkan dokumen skripsi secara lengkap dan tepat waktu guna mendukung pemeringkatan repository institusi.',
    Aktif: 1,
    JenisTulisan: 1
  }
];

export const INITIAL_USERS: User[] = [
  {
    idUser: 1,
    JenisUser: 1,
    UserName: 'admin',
    Password: 'admin123',
    Nama: 'Administrator Perpustakaan',
    JenisKelamin: 1,
    TempatLahir: 'Pekanbaru',
    TanggalLahir: '1985-05-12',
    Alamat: 'Jl. HR Soebrantas Km 12.5 Pekanbaru',
    NoKTP: '1471010101850001',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 2,
    JenisUser: 2,
    UserName: '2007111001',
    Password: 'mhs123',
    Nama: 'Muhammad Rizki Pratama',
    email: 'm.rizki.pratama@student.unri.ac.id',
    JenisKelamin: 1,
    TempatLahir: 'Pekanbaru',
    TanggalLahir: '2002-01-15',
    Alamat: 'Jl. Bina Widya Simpang Baru Pekanbaru',
    NoKTP: '1471021501020002',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 3,
    JenisUser: 2,
    UserName: '2007111002',
    Password: 'mhs123',
    Nama: 'Siti Nurhaliza',
    email: 'siti.nurhaliza@student.unri.ac.id',
    JenisKelamin: 2,
    TempatLahir: 'Dumai',
    TanggalLahir: '2002-04-10',
    Alamat: 'Jl. Manyar Sakti No 15 Pekanbaru',
    NoKTP: '1472015004020003',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 4,
    JenisUser: 2,
    UserName: '2007122003',
    Password: 'mhs123',
    Nama: 'Ahmad Fadillah',
    email: 'ahmad.fadillah@student.unri.ac.id',
    JenisKelamin: 1,
    TempatLahir: 'Bangkinang',
    TanggalLahir: '2001-08-20',
    Alamat: 'Jl. Garuda Sakti Km 2 Pekanbaru',
    NoKTP: '1401032008010004',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 5,
    JenisUser: 2,
    UserName: '2007122004',
    Password: 'mhs123',
    Nama: 'Dewi Anggraini',
    email: 'dewi.anggraini@student.unri.ac.id',
    JenisKelamin: 2,
    TempatLahir: 'Rengat',
    TanggalLahir: '2002-11-05',
    Alamat: 'Jl. Delima Tampan Pekanbaru',
    NoKTP: '1402024511020005',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 6,
    JenisUser: 2,
    UserName: '2007133005',
    Password: 'mhs123',
    Nama: 'Budi Santoso',
    email: 'budi.santoso@student.unri.ac.id',
    JenisKelamin: 1,
    TempatLahir: 'Duri',
    TanggalLahir: '2001-03-30',
    Alamat: 'Jl. Kertama Marpoyan Damai',
    NoKTP: '1403043003010006',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 7,
    JenisUser: 2,
    UserName: '2007133006',
    Password: 'mhs123',
    Nama: 'Putri Ayu Wandira',
    email: 'putri.wandira@student.unri.ac.id',
    JenisKelamin: 2,
    TempatLahir: 'Siak',
    TanggalLahir: '2002-07-14',
    Alamat: 'Jl. Rajawali Sukajadi Pekanbaru',
    NoKTP: '1408015407020007',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 8,
    JenisUser: 2,
    UserName: '2007144007',
    Password: 'mhs123',
    Nama: 'Rian Hidayat',
    email: 'rian.hidayat@student.unri.ac.id',
    JenisKelamin: 1,
    TempatLahir: 'Tembilahan',
    TanggalLahir: '2001-12-25',
    Alamat: 'Jl. Swakarya Panam Pekanbaru',
    NoKTP: '1404052512010008',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 9,
    JenisUser: 2,
    UserName: '2007155008',
    Password: 'mhs123',
    Nama: 'Nabila Maharani',
    email: 'nabila.maharani@student.unri.ac.id',
    JenisKelamin: 2,
    TempatLahir: 'Bengkalis',
    TanggalLahir: '2002-09-09',
    Alamat: 'Jl. Melati Panam Pekanbaru',
    NoKTP: '1403014909020009',
    foto: 'default.png',
    Pinjam: 0
  },
  {
    idUser: 10,
    JenisUser: 2,
    UserName: '2107111009',
    Password: 'mhs123',
    Nama: 'Fajar Ramadhan',
    email: 'fajar.ramadhan@student.unri.ac.id',
    JenisKelamin: 1,
    TempatLahir: 'Pekanbaru',
    TanggalLahir: '2003-02-18',
    Alamat: 'Jl. HR Soebrantas Panam',
    NoKTP: '1471011802030010',
    foto: 'default.png',
    Pinjam: 0
  }
];
