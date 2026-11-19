-- ==============================================================
-- Inisialisasi Database Resmi Sistem Manajemen Skripsi UNRI
-- Untuk Container Docker MySQL / MariaDB
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `manajemen_skripsi` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `manajemen_skripsi`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- --------------------------------------------------------
-- Table structure for table `ci_sessions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ci_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `user_agent` varchar(120) NOT NULL,
  `last_activity` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `user_data` mediumtext NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `last_activity_idx` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ci_sessions` (`session_id`, `ip_address`, `user_agent`, `last_activity`, `user_data`) VALUES
('a1b2c3d4e5f60001000100010001000100010001', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000001, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:5:\"admin\";}'),
('a1b2c3d4e5f60002000200020002000200020002', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000002, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007111001\";}'),
('a1b2c3d4e5f60003000300030003000300030003', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000003, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007111002\";}'),
('a1b2c3d4e5f60004000400040004000400040004', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000004, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007122003\";}'),
('a1b2c3d4e5f60005000500050005000500050005', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000005, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007122004\";}'),
('a1b2c3d4e5f60006000600060006000600060006', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000006, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007133005\";}'),
('a1b2c3d4e5f60007000700070007000700070007', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000007, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007133006\";}'),
('a1b2c3d4e5f60008000800080008000800080008', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000008, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007144007\";}'),
('a1b2c3d4e5f60009000900090009000900090009', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000009, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2007155008\";}'),
('a1b2c3d4e5f60010001000100010001000100010', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', 1724000010, 'a:2:{s:9:\"user_data\";s:0:\"\";s:8:\"username\";s:10:\"2107111009\";}');

-- --------------------------------------------------------
-- Table structure for table `fakultas`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fakultas` (
  `id_fakultas` int(11) NOT NULL AUTO_INCREMENT,
  `fakultas` varchar(50) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  PRIMARY KEY (`id_fakultas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fakultas` (`id_fakultas`, `fakultas`, `keterangan`) VALUES
(1, 'Fakultas Teknik', 'FT Universitas Riau'),
(2, 'Fakultas Matematika dan IPA', 'FMIPA Universitas Riau'),
(3, 'Fakultas Ekonomi dan Bisnis', 'FEB Universitas Riau'),
(4, 'Fakultas Keguruan dan Ilmu Pendidikan', 'FKIP Universitas Riau'),
(5, 'Fakultas Ilmu Sosial dan Ilmu Politik', 'FISIP Universitas Riau'),
(6, 'Fakultas Pertanian', 'FP Universitas Riau'),
(7, 'Fakultas Perikanan dan Kelautan', 'FPK Universitas Riau'),
(8, 'Fakultas Hukum', 'FH Universitas Riau'),
(9, 'Fakultas Kedokteran', 'FK Universitas Riau'),
(10, 'Fakultas Keperawatan', 'FKp Universitas Riau');

-- --------------------------------------------------------
-- Table structure for table `jenis_dokumen`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jenis_dokumen` (
  `id_jenis_dokumen` int(11) NOT NULL AUTO_INCREMENT,
  `jenis_dokumen` varchar(30) NOT NULL,
  `keterangan_jenis_dokumen` varchar(150) NOT NULL,
  PRIMARY KEY (`id_jenis_dokumen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jenis_dokumen` (`id_jenis_dokumen`, `jenis_dokumen`, `keterangan_jenis_dokumen`) VALUES
(1, 'Skripsi', 'Karya Tulis Ilmiah Sarjana (S1)'),
(2, 'Tugas Akhir', 'Tugas Akhir Program Diploma (D3)'),
(3, 'Tesis', 'Karya Tulis Ilmiah Magister (S2)'),
(4, 'Disertasi', 'Karya Tulis Ilmiah Doktoral (S3)'),
(5, 'Laporan PKL', 'Laporan Praktik Kerja Lapangan'),
(6, 'Artikel Jurnal', 'Publikasi Jurnal Ilmiah Mahasiswa'),
(7, 'Prosiding Seminar', 'Artikel Prosiding Konferensi Ilmiah'),
(8, 'Laporan Riset', 'Laporan Hasil Riset dan Penelitian'),
(9, 'Buku Monograf', 'Karya Tulis Ilmiah Buku Monograf'),
(10, 'Karya Inovasi Paten', 'Dokumen Paten & Hak Cipta Mahasiswa');

-- --------------------------------------------------------
-- Table structure for table `jurusan`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jurusan` (
  `id_jurusan` int(11) NOT NULL AUTO_INCREMENT,
  `id_fakultas` int(11) NOT NULL,
  `jurusan` varchar(150) NOT NULL,
  `keterangan` varchar(150) NOT NULL,
  PRIMARY KEY (`id_jurusan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jurusan` (`id_jurusan`, `id_fakultas`, `jurusan`, `keterangan`) VALUES
(1, 1, 'Teknik Informatika', 'Program Studi S1 Teknik Informatika FT'),
(2, 1, 'Teknik Elektro', 'Program Studi S1 Teknik Elektro FT'),
(3, 1, 'Teknik Mesin', 'Program Studi S1 Teknik Mesin FT'),
(4, 2, 'Sistem Informasi', 'Program Studi S1 Sistem Informasi FMIPA'),
(5, 2, 'Ilmu Komputer', 'Program Studi S1 Ilmu Komputer FMIPA'),
(6, 2, 'Matematika', 'Program Studi S1 Matematika FMIPA'),
(7, 3, 'Manajemen', 'Program Studi S1 Manajemen FEB'),
(8, 3, 'Akuntansi', 'Program Studi S1 Akuntansi FEB'),
(9, 4, 'Pendidikan Bahasa Inggris', 'Program Studi S1 Pend. Bhs Inggris FKIP'),
(10, 5, 'Ilmu Komunikasi', 'Program Studi S1 Ilmu Komunikasi FISIP');

-- --------------------------------------------------------
-- Table structure for table `pelapor`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pelapor` (
  `id_pelapor` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pelapor` varchar(30) NOT NULL,
  `nip_pelapor` varchar(20) NOT NULL,
  `jabatan_pelapor` varchar(30) NOT NULL,
  `ttd_url` text DEFAULT NULL,
  `ttd_file_name` varchar(200) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_pelapor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pelapor` (`id_pelapor`, `nama_pelapor`, `nip_pelapor`, `jabatan_pelapor`, `ttd_url`, `ttd_file_name`, `active`) VALUES
(1, 'Hendra Wijaya, S.Sos., M.IP.', '197803152003121002', 'Koordinator Repositori', 'ttd_hendra.png', 'ttd_hendra.png', 1),
(2, 'Nurul Hidayati, S.I.Pust.', '198406202008012005', 'Pustakawan Verifikator', 'ttd_nurul.png', 'ttd_nurul.png', 1),
(3, 'Drs. Supriyanto, M.Si.', '196908121994031001', 'Kepala Bidang Layanan', 'ttd_supri.png', 'ttd_supri.png', 1),
(4, 'Rina Marlina, A.Md.Pust.', '198711222010012003', 'Staf Administrasi Skripsi', 'ttd_rina.png', 'ttd_rina.png', 1),
(5, 'Bambang Irawan, S.Kom.', '199001152015021004', 'Operator Data Repositori', 'ttd_bambang.png', 'ttd_bambang.png', 1),
(6, 'Dewi Sartika, S.Hum.', '198904102014032002', 'Pustakawan Pengolahan', 'ttd_dewi.png', 'ttd_dewi.png', 1),
(7, 'Faisal Akbar, S.T.', '199207082019031005', 'Teknisi Sistem Informasi', 'ttd_faisal.png', 'ttd_faisal.png', 1),
(8, 'Yuliana Sari, S.Pd.', '198603252009022004', 'Pustakawan Referensi', 'ttd_yuliana.png', 'ttd_yuliana.png', 1),
(9, 'Agus Setiawan, S.IP.', '198112052006041003', 'Verifikator Bebas Pustaka', 'ttd_agus.png', 'ttd_agus.png', 1),
(10, 'Fitri Ramadhani, S.Sos.', '199302142020122006', 'Sekretariat Repositori', 'ttd_fitri.png', 'ttd_fitri.png', 1);

-- --------------------------------------------------------
-- Table structure for table `skripsi` (Tabel Transaksi Utama - 0 Rows)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `skripsi` (
  `id_skripsi` int(11) NOT NULL AUTO_INCREMENT,
  `id_jenis_dokumen` int(11) NOT NULL,
  `no_surat` varchar(50) DEFAULT NULL,
  `nama` varchar(50) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `id_fakultas` int(11) NOT NULL,
  `id_jurusan` int(11) NOT NULL,
  `judul` text NOT NULL,
  `hard_copy` int(11) NOT NULL DEFAULT 0,
  `soft_copy` int(11) NOT NULL DEFAULT 0,
  `tanggal` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `email_sent_at` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_skripsi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `tulisan`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tulisan` (
  `idTulisan` int(11) NOT NULL AUTO_INCREMENT,
  `TanggalDibuat` date NOT NULL,
  `Judul` varchar(100) NOT NULL,
  `Isi` mediumtext NOT NULL,
  `Aktif` int(11) NOT NULL DEFAULT 1,
  `JenisTulisan` int(11) NOT NULL,
  PRIMARY KEY (`idTulisan`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tulisan` (`idTulisan`, `TanggalDibuat`, `Judul`, `Isi`, `Aktif`, `JenisTulisan`) VALUES
(1, '2024-08-01', 'Alur Penyerahan Hardcopy & Softcopy Skripsi', 'Mahasiswa yang telah selesai ujian sidang wajib menyerahkan dokumen skripsi hardcopy dan softcopy PDF ke bagian pengolahan UPA Perpustakaan.', 1, 1),
(2, '2024-08-05', 'Panduan Bebas Pustaka Online Mahasiswa', 'Surat keterangan bebas pustaka dapat diproses secara daring setelah verifikasi kelengkapan berkas skripsi disetujui.', 1, 1),
(3, '2024-08-10', 'Standar Format Dokumen Skripsi & Tugas Akhir', 'Format berkas softcopy harus memuat cover, abstrak, bab 1 sampai penutup serta daftar pustaka dalam berkas PDF utuh dan terpisah.', 1, 2),
(4, '2024-08-15', 'Jam Layanan Verifikasi Skripsi Semester Genap', 'Layanan verifikasi berkas tugas akhir dibuka setiap hari Senin sampai Jumat pukul 08.30 - 15.30 WIB di Ruang Repositori.', 1, 1),
(5, '2024-08-20', 'Sosialisasi Pengecekan Similaritas Turnitin', 'Perpustakaan memfasilitasi uji similaritas karya ilmiah mahasiswa maksimal 25% sesuai standar regulasi akademik kampus.', 1, 2),
(6, '2024-08-25', 'Integrasi Data Repository dan Dashboard Digital', 'Sistem pelaporan skripsi kini terkoneksi langsung secara realtime dengan Dashboard Informasi Publik UPA Perpustakaan.', 1, 1),
(7, '2024-09-01', 'Batas Akhir Penyerahan Dokumen Wisuda Periode Ini', 'Batas akhir unggah mandiri dan pengesahan bebas pustaka untuk periode wisuda adalah akhir bulan berjalan.', 1, 1),
(8, '2024-09-05', 'Akses Referensi E-Journal & E-Book Kampus', 'Mahasiswa dapat mengakses ribuan jurnal ilmiah nasional dan internasional melalui portal resmi e-resources UPA Perpustakaan.', 1, 2),
(9, '2024-09-10', 'Layanan Bimbingan Sitasi dan Reference Manager', 'Pustakawan menyediakan sesi konsultasi penggunaan Mendeley dan Zotero untuk penulisan sitasi daftar pustaka karya ilmiah.', 1, 2),
(10, '2024-09-15', 'Apresiasi Pengumpulan Karya Ilmiah Mahasiswa', 'UPA Perpustakaan mengapresiasi mahasiswa yang mengumpulkan dokumen skripsi secara lengkap dan tepat waktu.', 1, 1);

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `JenisUser` int(11) NOT NULL,
  `UserName` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Nama` varchar(30) NOT NULL,
  `JenisKelamin` int(11) NOT NULL,
  `TempatLahir` varchar(30) NOT NULL,
  `TanggalLahir` date NOT NULL,
  `Alamat` varchar(100) NOT NULL,
  `NoKTP` varchar(30) NOT NULL,
  `foto` varchar(500) NOT NULL,
  `Pinjam` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idUser`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`idUser`, `JenisUser`, `UserName`, `Password`, `Nama`, `JenisKelamin`, `TempatLahir`, `TanggalLahir`, `Alamat`, `NoKTP`, `foto`, `Pinjam`) VALUES
(1, 1, 'admin', 'admin123', 'Administrator Perpustakaan', 1, 'Pekanbaru', '1985-05-12', 'Jl. HR Soebrantas Km 12.5 Pekanbaru', '1471010101850001', 'default.png', 0),
(2, 2, '2007111001', 'mhs123', 'Muhammad Rizki Pratama', 1, 'Pekanbaru', '2002-01-15', 'Jl. Bina Widya Simpang Baru Pekanbaru', '1471021501020002', 'default.png', 1),
(3, 2, '2007111002', 'mhs123', 'Siti Nurhaliza', 2, 'Dumai', '2002-04-10', 'Jl. Manyar Sakti No 15 Pekanbaru', '1472015004020003', 'default.png', 0),
(4, 2, '2007122003', 'mhs123', 'Ahmad Fadillah', 1, 'Bangkinang', '2001-08-20', 'Jl. Garuda Sakti Km 2 Pekanbaru', '1401032008010004', 'default.png', 2),
(5, 2, '2007122004', 'mhs123', 'Dewi Anggraini', 2, 'Rengat', '2002-11-05', 'Jl. Delima Tampan Pekanbaru', '1402024511020005', 'default.png', 0),
(6, 2, '2007133005', 'mhs123', 'Budi Santoso', 1, 'Duri', '2001-03-30', 'Jl. Kertama Marpoyan Damai', '1403043003010006', 'default.png', 1),
(7, 2, '2007133006', 'mhs123', 'Putri Ayu Wandira', 2, 'Siak', '2002-07-14', 'Jl. Rajawali Sukajadi Pekanbaru', '1408015407020007', 'default.png', 0),
(8, 2, '2007144007', 'mhs123', 'Rian Hidayat', 1, 'Tembilahan', '2001-12-25', 'Jl. Swakarya Panam Pekanbaru', '1404052512010008', 'default.png', 0),
(9, 2, '2007155008', 'mhs123', 'Nabila Maharani', 2, 'Bengkalis', '2002-09-09', 'Jl. Melati Panam Pekanbaru', '1403014909020009', 'default.png', 1),
(10, 2, '2107111009', 'mhs123', 'Fajar Ramadhan', 1, 'Pekanbaru', '2003-02-18', 'Jl. HR Soebrantas Panam', '1471011802030010', 'default.png', 0);

-- --------------------------------------------------------
-- Views for Reporting
-- --------------------------------------------------------
CREATE OR REPLACE VIEW `view_fakjur` AS 
SELECT 
  `jurusan`.`id_jurusan` AS `id_jurusan`, 
  `jurusan`.`jurusan` AS `jurusan`, 
  `jurusan`.`keterangan` AS `keterangan`, 
  `fakultas`.`id_fakultas` AS `id_fakultas`, 
  `fakultas`.`fakultas` AS `fakultas` 
FROM (`jurusan` JOIN `fakultas`) 
WHERE `jurusan`.`id_fakultas` = `fakultas`.`id_fakultas`;

CREATE OR REPLACE VIEW `view_skripsi` AS 
SELECT 
  `skripsi`.`id_skripsi` AS `id_skripsi`, 
  `skripsi`.`id_jenis_dokumen` AS `id_jenis_dokumen`, 
  `skripsi`.`nama` AS `nama`, 
  `skripsi`.`nim` AS `nim`, 
  `skripsi`.`id_fakultas` AS `id_fakultas`, 
  `skripsi`.`id_jurusan` AS `id_jurusan`, 
  `skripsi`.`judul` AS `judul`, 
  `skripsi`.`hard_copy` AS `hard_copy`, 
  `skripsi`.`soft_copy` AS `soft_copy`, 
  `skripsi`.`tanggal` AS `tanggal`, 
  `jurusan`.`jurusan` AS `jurusan`, 
  `jurusan`.`keterangan` AS `ket_jurusan`, 
  `fakultas`.`fakultas` AS `fakultas`, 
  `fakultas`.`keterangan` AS `ket_fakultas`, 
  `jenis_dokumen`.`jenis_dokumen` AS `jenis_dokumen` 
FROM (((`jurusan` JOIN `fakultas`) JOIN `skripsi`) JOIN `jenis_dokumen`) 
WHERE `skripsi`.`id_fakultas` = `fakultas`.`id_fakultas` 
  AND `skripsi`.`id_jurusan` = `jurusan`.`id_jurusan` 
  AND `skripsi`.`id_jenis_dokumen` = `jenis_dokumen`.`id_jenis_dokumen`;
