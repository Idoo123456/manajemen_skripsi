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
(1, 'Teknik', 'Fakultas Teknik Universitas Riau'),
(2, 'Matematika dan Ilmu Pengetahuan Alam', 'FMIPA Universitas Riau'),
(3, 'Ekonomi dan Bisnis', 'FEB Universitas Riau'),
(4, 'Ilmu Sosial dan Ilmu Politik', 'FISIP Universitas Riau'),
(5, 'Keguruan dan Ilmu Pendidikan', 'FKIP Universitas Riau'),
(6, 'Perikanan dan Kelautan', 'FPK Universitas Riau'),
(7, 'Pertanian', 'FP Universitas Riau'),
(8, 'Kedokteran', 'FK Universitas Riau'),
(9, 'Hukum', 'FH Universitas Riau'),
(10, 'Keperawatan', 'FKp Universitas Riau');

-- --------------------------------------------------------
-- Table structure for table `jenis_dokumen`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jenis_dokumen` (
  `id_jenis_dokumen` int(11) NOT NULL AUTO_INCREMENT,
  `jenis_dokumen` varchar(30) NOT NULL,
  `keterangan` varchar(50) NOT NULL,
  PRIMARY KEY (`id_jenis_dokumen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jenis_dokumen` (`id_jenis_dokumen`, `jenis_dokumen`, `keterangan`) VALUES
(1, 'Skripsi (S1)', 'Karya Ilmiah Program Sarjana S1'),
(2, 'Tesis (S2)', 'Karya Ilmiah Program Magister S2'),
(3, 'Disertasi (S3)', 'Karya Ilmiah Program Doktoral S3'),
(4, 'Tugas Akhir (D3)', 'Karya Akhir Program Diploma Tiga'),
(5, 'Laporan Magang / Praktik Kerja', 'Laporan Kerja Praktik Industri'),
(6, 'Artikel Jurnal Ilmiah', 'Publikasi Jurnal Terindeks'),
(7, 'Prosiding Seminar', 'Naskah Prosiding Konferensi Ilmiah'),
(8, 'Laporan Penelitian Dosen', 'Laporan Hibah Penelitian LPPM'),
(9, 'Buku Monograf', 'Koleksi Monograf Perpustakaan'),
(10, 'Karya Ilmiah Lainnya', 'Dokumen Akademik Lainnya');

-- --------------------------------------------------------
-- Table structure for table `jurusan`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jurusan` (
  `id_jurusan` int(11) NOT NULL AUTO_INCREMENT,
  `id_fakultas` int(11) NOT NULL,
  `jurusan` varchar(50) NOT NULL,
  `keterangan` varchar(100) NOT NULL,
  PRIMARY KEY (`id_jurusan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `jurusan` (`id_jurusan`, `id_fakultas`, `jurusan`, `keterangan`) VALUES
(1, 1, 'Teknik Informatika', 'Jurusan Teknik Informatika S1'),
(2, 1, 'Teknik Sipil', 'Jurusan Teknik Sipil S1'),
(3, 1, 'Teknik Elektro', 'Jurusan Teknik Elektro S1'),
(4, 1, 'Teknik Mesin', 'Jurusan Teknik Mesin S1'),
(5, 1, 'Teknik Kimia', 'Jurusan Teknik Kimia S1'),
(6, 2, 'Sistem Informasi', 'Jurusan Sistem Informasi S1 FMIPA'),
(7, 2, 'Matematika', 'Jurusan Matematika S1 FMIPA'),
(8, 2, 'Fisika', 'Jurusan Fisika S1 FMIPA'),
(9, 2, 'Kimia', 'Jurusan Kimia S1 FMIPA'),
(10, 2, 'Biologi', 'Jurusan Biologi S1 FMIPA');

-- --------------------------------------------------------
-- Table structure for table `pelapor`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pelapor` (
  `id_pelapor` int(11) NOT NULL AUTO_INCREMENT,
  `nama_pelapor` varchar(50) NOT NULL,
  `nip` varchar(30) NOT NULL,
  `keterangan` varchar(50) NOT NULL,
  `paraf` varchar(50) NOT NULL,
  `ttd` varchar(50) NOT NULL,
  `aktif` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_pelapor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pelapor` (`id_pelapor`, `nama_pelapor`, `nip`, `keterangan`, `paraf`, `ttd`, `aktif`) VALUES
(1, 'Dr. H. Hendro Prasetyo, M.Lib.', '197508122002121003', 'Kepala UPA Perpustakaan UNRI', 'paraf_kepala.png', 'ttd_kepala.png', 1),
(2, 'Nurhasanah, S.Sos., M.IP.', '198204152008122001', 'Koordinator Layanan Sirkulasi & Referensi', 'paraf_nur.png', 'ttd_nur.png', 1),
(3, 'Bambang Irawan, S.Kom.', '198809202014031002', 'Staf Pengolahan & Repositori Digital', 'paraf_bambang.png', 'ttd_bambang.png', 1),
(4, 'Siti Aminah, A.Md.', '199101052019032014', 'Petugas Verifikasi Bebas Pustaka', 'paraf_siti.png', 'ttd_siti.png', 1),
(5, 'Ahmad Fauzi, S.Hum.', '198906102015041001', 'Layanan Sirkulasi & Pengembalian Buku', 'paraf_fauzi.png', 'ttd_fauzi.png', 1),
(6, 'Rina Marlina, S.I.Pust.', '199003182018012003', 'Staf Otomasi & Sistem Informasi', 'paraf_rina.png', 'ttd_rina.png', 1),
(7, 'Eko Wahyudi, S.T.', '198711252012121004', 'Administrator Pangkalan Data Repositori', 'paraf_eko.png', 'ttd_eko.png', 1),
(8, 'Dewi Sartika, S.Sos.', '199208032020122009', 'Layanan Koleksi Khusus & Tandon', 'paraf_dewi.png', 'ttd_dewi.png', 1),
(9, 'Ir. M. Ridwan, M.T.', '197905142006041005', 'Wakil Dekan Bidang Akademik', 'paraf_ridwan.png', 'ttd_ridwan.png', 1),
(10, 'Fitri Ramadhani, S.Sos.', '199302142020122006', 'Sekretariat Repositori', 'ttd_fitri.png', 'ttd_fitri.png', 1);

-- --------------------------------------------------------
-- Table structure for table `skripsi` (Tabel Transaksi Utama)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `skripsi` (
  `id_skripsi` int(11) NOT NULL AUTO_INCREMENT,
  `id_jenis_dokumen` int(11) NOT NULL,
  `no_surat` varchar(50) DEFAULT NULL,
  `nama` varchar(50) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `email_sent_at` varchar(50) DEFAULT NULL,
  `id_fakultas` int(11) NOT NULL,
  `id_jurusan` int(11) NOT NULL,
  `judul` text NOT NULL,
  `hard_copy` int(11) NOT NULL DEFAULT 0,
  `soft_copy` int(11) NOT NULL DEFAULT 0,
  `tanggal` varchar(20) NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tulisan` (`idTulisan`, `TanggalDibuat`, `Judul`, `Isi`, `Aktif`, `JenisTulisan`) VALUES
(1, '2024-08-01', 'Alur Penyerahan Hardcopy & Softcopy Skripsi', 'Mahasiswa yang telah selesai ujian sidang wajib menyerahkan dokumen skripsi hardcopy dan softcopy PDF ke bagian pengolahan UPA Perpustakaan.', 1, 1),
(2, '2024-08-05', 'Panduan Bebas Pustaka Online Mahasiswa', 'Surat keterangan bebas pustaka dapat diproses secara daring setelah verifikasi kelengkapan berkas skripsi disetujui.', 1, 1),
(3, '2024-08-10', 'Format Unggah Berkas Lembar Pengesahan', 'Lembar pengesahan wajib diunggah dalam format PDF yang telah ditandatangani lengkap oleh dosen pembimbing dan dekan.', 1, 1),
(4, '2024-08-15', 'Jam Layanan Loket Perpustakaan Semester Ganjil', 'Pelayanan loket sirkulasi dan repositori buka setiap hari kerja Senin sampai Jumat mulai pukul 08.00 hingga 16.00 WIB.', 1, 2),
(5, '2024-08-20', 'Pemberitahuan Bebas Denda Keterlambatan Koleksi', 'Program pemutihan denda buku pinjaman dibuka hingga akhir bulan untuk mempermudah administrasi yudisium mahasiswa.', 1, 2),
(6, '2024-08-25', 'Penerbitan Surat Bebas Pustaka Terintegrasi Gmail', 'Kini surat bebas pustaka resmi yang terbit otomatis dikirimkan ke alamat Gmail mahasiswa dalam format PDF.', 1, 2),
(7, '2024-09-01', 'Tata Tertib Penggunaan Ruang Repositori & Skripsi', 'Pengunjung wajib menjaga ketenangan dan menjaga keutuhan koleksi cetak tugas akhir yang dibaca di ruang baca.', 1, 1),
(8, '2024-09-05', 'Pencarian Naskah Skripsi Online', 'Koleksi naskah skripsi digital dapat diakses melalui portal pencarian repositori perpustakaan.', 1, 1),
(9, '2024-09-10', 'Verifikasi Keaslian Surat Bebas Pustaka', 'Setiap surat bebas pustaka memiliki nomor surat dan QR-Code validasi yang dapat diverifikasi keabsahannya.', 1, 1),
(10, '2024-09-15', 'Informasi Kontak Bantuan Pengolahan Skripsi', 'Jika ada kendala unggah naskah skripsi silakan hubungi loket bantuan perpustakaan kampus Bina Widya.', 1, 2);

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `JenisUser` int(11) NOT NULL,
  `UserName` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Nama` varchar(50) NOT NULL,
  `JenisKelamin` int(11) NOT NULL,
  `TempatLahir` varchar(30) NOT NULL,
  `TanggalLahir` date NOT NULL,
  `Alamat` varchar(100) NOT NULL,
  `NoKTP` varchar(30) NOT NULL,
  `foto` varchar(500) NOT NULL,
  `Pinjam` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `skripsi`.`email` AS `email`,
  `skripsi`.`email_sent_at` AS `email_sent_at`,
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
