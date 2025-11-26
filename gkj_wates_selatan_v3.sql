-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20251105.b3c3f5e025
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2025 at 03:25 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gkj_wates_selatan_v3`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminsignups`
--

CREATE TABLE `adminsignups` (
  `username` varchar(50) NOT NULL,
  `namaLengkapUser` varchar(255) NOT NULL,
  `nomorHP` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `adminsignups`
--

INSERT INTO `adminsignups` (`username`, `namaLengkapUser`, `nomorHP`, `password`) VALUES
('admin', 'Marcell Jureinwi Manuhutu', '081248890655', 'admin'),
('jimm', 'Jimm', '081248890655', 'jimm123');

-- --------------------------------------------------------

--
-- Table structure for table `databaptis`
--

CREATE TABLE `databaptis` (
  `kodeBaptis` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `statusBaptis` enum('Baptis','Belum Baptis') NOT NULL,
  `tanggalBaptis` date DEFAULT NULL,
  `tempatBaptis` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `databaptis`
--

INSERT INTO `databaptis` (`kodeBaptis`, `kodeJemaat`, `statusBaptis`, `tanggalBaptis`, `tempatBaptis`) VALUES
(51, 28, 'Baptis', '2005-12-21', 'Jemaat Awaya, Gereja Protestan Maluku'),
(55, 32, 'Baptis', '1975-12-26', 'Gereja Kristen Australia, Jemaat Adelaide Selatan'),
(56, 33, 'Baptis', '1975-12-26', 'Gereja Kristen Inggris, Jemaat Mulia Holy Land Bukit Tinggi London');

-- --------------------------------------------------------

--
-- Table structure for table `datajemaat`
--

CREATE TABLE `datajemaat` (
  `kodeJemaat` int NOT NULL,
  `namaLengkap` varchar(100) NOT NULL,
  `tempatLahir` varchar(50) DEFAULT NULL,
  `tanggalLahir` date DEFAULT NULL,
  `jenisKelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `agama` varchar(30) DEFAULT 'Kristen',
  `golonganDarah` enum('A','B','AB','O') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `wargaNegara` varchar(50) DEFAULT 'Indonesia',
  `nomorTelepon` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alamat` text,
  `foto` varchar(255) NOT NULL,
  `tanggalDaftar` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datajemaat`
--

INSERT INTO `datajemaat` (`kodeJemaat`, `namaLengkap`, `tempatLahir`, `tanggalLahir`, `jenisKelamin`, `agama`, `golonganDarah`, `wargaNegara`, `nomorTelepon`, `alamat`, `foto`, `tanggalDaftar`) VALUES
(28, 'Marcell Jureinwi Manuhutu', 'Surabaya', '2005-06-25', 'Laki-laki', 'Kristen', 'B', 'Indonesia', '081248890654', 'Jl. Trans Seram, Desa Liang, Kecamatan Teluk Elpaputih, Kabupaten Maluku Tengah Provinsi Maluku ', 'uploads/fotoProfil/1763916725122-569113135.png', '2025-11-23 16:52:05'),
(32, 'Sia Kate Isobelle Furler', 'Adelaide', '1975-12-18', 'Perempuan', 'Kristen', 'AB', 'Indonesia', '081234567890', 'Jl. Diponegoro, Desa Condong Pipa, Kecamatan Adelaide Pusat, Kabupaten/Kota Adelaide, Provinsi  Australia Selatan, Australia', 'uploads/fotoProfil/1764056058699-662349857.jpg', '2025-11-25 07:34:18'),
(33, 'Jessie J', 'Inggris', '1975-07-25', 'Perempuan', 'Kristen', 'AB', 'Indonesia', '08124', 'Inggris Raya', 'uploads/fotoProfil/1764166534808-374705308.jpg', '2025-11-26 14:15:34');

-- --------------------------------------------------------

--
-- Table structure for table `datameninggal`
--

CREATE TABLE `datameninggal` (
  `kodeMeninggal` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `tanggalMeninggal` date NOT NULL,
  `tempatMeninggal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `datanikah`
--

CREATE TABLE `datanikah` (
  `kodeNikah` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `statusNikah` enum('Nikah','Belum Nikah','Cerai Hidup','Cerai Mati','Duda','Janda') NOT NULL,
  `tanggalNikah` date DEFAULT NULL,
  `tempatNikah` varchar(255) DEFAULT NULL,
  `namaPasangan` varchar(255) DEFAULT NULL,
  `gerejaAsal` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datanikah`
--

INSERT INTO `datanikah` (`kodeNikah`, `kodeJemaat`, `statusNikah`, `tanggalNikah`, `tempatNikah`, `namaPasangan`, `gerejaAsal`) VALUES
(31, 32, 'Nikah', '2022-08-15', 'Gereja Kristen Australia, Jemaat Adelaide Selatan', 'Dan Bernard', 'Gereja Kristen Australia, Jemaat Adelaide Pusat'),
(32, 33, 'Belum Nikah', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `datapekerjaan`
--

CREATE TABLE `datapekerjaan` (
  `kodePekerjaan` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `namaPekerjaan` varchar(100) NOT NULL,
  `jabatanKerja` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datapekerjaan`
--

INSERT INTO `datapekerjaan` (`kodePekerjaan`, `kodeJemaat`, `namaPekerjaan`, `jabatanKerja`, `createdAt`, `updatedAt`) VALUES
(116, 28, 'Belum Bekerja', 'Mahasiswa Strata 1', '2025-11-23 16:52:05', '2025-11-24 14:42:20'),
(120, 32, 'Artist', 'Penyanyi dan Penulis Lagu, Aktor', '2025-11-25 07:34:18', '2025-11-25 07:34:18'),
(121, 33, 'Artis', 'Penulis Lagu, Penyanyi', '2025-11-26 14:15:34', '2025-11-26 14:15:34');

-- --------------------------------------------------------

--
-- Table structure for table `datapelayanan`
--

CREATE TABLE `datapelayanan` (
  `kodePelayanan` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `namaPelayanan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datapelayanan`
--

INSERT INTO `datapelayanan` (`kodePelayanan`, `kodeJemaat`, `namaPelayanan`) VALUES
(119, 28, 'Majelis'),
(123, 32, 'Jemaat'),
(124, 33, 'Jemaat');

-- --------------------------------------------------------

--
-- Table structure for table `datapendeta`
--

CREATE TABLE `datapendeta` (
  `kodePendeta` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `jabatan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `datapepanthan`
--

CREATE TABLE `datapepanthan` (
  `kodePepanthan` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `namaPepanthan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datapepanthan`
--

INSERT INTO `datapepanthan` (`kodePepanthan`, `kodeJemaat`, `namaPepanthan`) VALUES
(120, 28, 'Triharjo'),
(124, 32, 'Induk Depok'),
(125, 33, 'Induk Depok');

-- --------------------------------------------------------

--
-- Table structure for table `datariwayatpendeta`
--

CREATE TABLE `datariwayatpendeta` (
  `kodeRiwayatPendeta` int NOT NULL,
  `kodePendeta` int NOT NULL,
  `namaGereja` varchar(100) NOT NULL,
  `tahunMulai` year NOT NULL,
  `tahunSelesai` year DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `datariwayatpendidikan`
--

CREATE TABLE `datariwayatpendidikan` (
  `kodeRiwayatPendidikan` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `jenjangPendidikan` varchar(50) DEFAULT NULL,
  `namaInstitusi` varchar(100) DEFAULT NULL,
  `tahunLulus` year DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `datasidi`
--

CREATE TABLE `datasidi` (
  `kodeSidi` int NOT NULL,
  `kodeJemaat` int NOT NULL,
  `statusSidi` enum('Sidi','Belum Sidi') NOT NULL,
  `tanggalSidi` date DEFAULT NULL,
  `tempatSidi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datasidi`
--

INSERT INTO `datasidi` (`kodeSidi`, `kodeJemaat`, `statusSidi`, `tanggalSidi`, `tempatSidi`) VALUES
(52, 28, 'Sidi', '2021-03-23', 'Jemaat Layeni, Gereja Protestan Maluku'),
(56, 32, 'Sidi', '1993-04-04', 'Gereja Kristen Australia, Jemaat Adelaide Selatan'),
(57, 33, 'Sidi', '1975-12-26', 'Gereja Kristen Inggris, Jemaat Mulia Holy Land Bukit Tinggi London');

-- --------------------------------------------------------

--
-- Table structure for table `datasurat`
--

CREATE TABLE `datasurat` (
  `kodeDataSurat` int NOT NULL,
  `kodeTipeSurat` varchar(50) NOT NULL,
  `judul_surat` varchar(255) DEFAULT NULL COMMENT 'Judul yang diinput atau dibuat otomatis',
  `data_input_json` json NOT NULL COMMENT 'Semua input form disimpan di sini',
  `tanggal_input` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Tanggal pembuatan surat',
  `tanggal_edit` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Tanggal terakhir diubah'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `datasurat`
--

INSERT INTO `datasurat` (`kodeDataSurat`, `kodeTipeSurat`, `judul_surat`, `data_input_json`, `tanggal_input`, `tanggal_edit`) VALUES
(3, 'TOBAT', 'Permohonan Pertobatan: asd', '{\"nama\": \"asd\", \"alamat\": \"asd\", \"pekerjaan\": \"asd\", \"tempatSidi\": \"asd\", \"tanggalSidi\": \"2015-06-25\", \"tempatLahir\": \"asd\", \"wargaGereja\": \"asd\", \"tanggalLahir\": \"2005-06-25\", \"tempatBaptis\": \"asd\", \"hariPelayanan\": \"asd\", \"tanggalBaptis\": \"2010-06-25\", \"waktuPelayanan\": \"09:00\", \"tempatPelayanan\": \"asd\", \"tanggalPelayanan\": \"2025-06-25\"}', '2025-11-16 14:01:38', '2025-11-16 14:01:38'),
(5, 'CALON_MAJELIS', 'Permohonan Pencalonan Majelis: Anonim', '{\"majelisII\": \"asd\"}', '2025-11-16 14:16:04', '2025-11-16 14:16:04'),
(6, 'CALON_MAJELIS', 'Permohonan Pencalonan Majelis: 2005-06-25', '{\"hari\": \"asd\", \"nama\": \"asd\", \"alamat\": \"asd\", \"tanggal\": \"2005-06-25\", \"majelisI\": \"asd\", \"majelisII\": \"asd\", \"tempatLahir\": \"asd\", \"tanggalLahir\": \"2005-06-25\", \"namaSuamiIstri\": \"asd\"}', '2025-11-16 14:17:55', '2025-11-16 14:17:55'),
(13, 'BESUK_PERJAMUAN', 'Laporan Perjamuan Pepanthan Depok Tgl: 2005-06-25', '{\"tanggal\": \"2005-06-25\", \"titipan\": 1, \"wilayah\": \"Pepanthan Depok\", \"keliling\": 2, \"mengetahui\": [{\"nama\": \"asd\", \"keterangan\": \"asd\", \"tandaTangan\": \"\"}, {\"nama\": \"asd\", \"keterangan\": \"asd\", \"tandaTangan\": \"\"}], \"tamuGereja\": [{\"nama\": \"asd\", \"keterangan\": \"asd\"}], \"tempatLain\": 1, \"tidakHadir\": [{\"nama\": \"asd\", \"keterangan\": \"asd\"}], \"daftarHadir\": [{\"nama\": \"asd\", \"keterangan\": \"asd\"}, {\"nama\": \"asd\", \"keterangan\": \"asd\"}], \"wargaDewasa\": 1, \"wilayahLain\": [{\"nama\": \"asd\", \"keterangan\": \"asd\"}], \"belumDibesuk\": 1, \"telahDibesuk\": 1, \"ikutPerjamuan\": 6, \"jumlahKeseluruhan\": 10}', '2025-11-16 14:59:44', '2025-11-16 14:59:44'),
(14, 'BAP_ANAK', 'Permohonan Baptis Anak: asd', '{\"alamat\": \"asd\", \"namaIbu\": \"asd\", \"namaAnak\": \"asd\", \"namaAyah\": \"asd\", \"tempatLahir\": \"as\", \"jenisKelamin\": \"Laki-laki\", \"tanggalLahir\": \"2005-06-25\", \"hariPelayanan\": \"asd\", \"waktuPelayanan\": \"09:00\", \"tempatPelayanan\": \"asd\", \"tanggalPelayanan\": \"2005-06-25\"}', '2025-11-16 15:05:59', '2025-11-16 15:05:59'),
(20, 'BAP_ANAK', 'Permohonan Baptis Anak: Marcello Jimm', '{\"alamat\": \"Liang\", \"namaIbu\": \"Dwiana\", \"namaAnak\": \"Marcello Jimm\", \"namaAyah\": \"Reinold\", \"tempatLahir\": \"Soerabaya\", \"jenisKelamin\": \"Laki-laki\", \"tanggalLahir\": \"2005-06-25\", \"hariPelayanan\": \"Minggu\", \"waktuPelayanan\": \"18:18\", \"tempatPelayanan\": \"GKJ Gondokusuman\", \"tanggalPelayanan\": \"2025-11-16\"}', '2025-11-16 16:48:06', '2025-11-16 16:48:06'),
(21, 'BAP_DEWASA', 'Permohonan Baptis Dewasa: marcell', '{\"nama\": \"marcell\", \"alamat\": \"asd\", \"namaIbu\": \"dwiwi\", \"namaAyah\": \"rein\", \"pembimbing\": \"asd\", \"tempatLahir\": \"jakarta\", \"tempatNikah\": \"\", \"namaPasangan\": \"\", \"tanggalLahir\": \"2005-06-25\", \"tanggalNikah\": \"\", \"hariPelayanan\": \"minggu\", \"waktuPelayanan\": \"21:00\", \"tempatPelayanan\": \"asd\", \"tanggalPelayanan\": \"2025-11-16\"}', '2025-11-16 17:59:25', '2025-11-16 17:59:25'),
(23, 'TUNANGAN', 'Permohonan Pertunangan: asd dan Anonim', '{\"bulan\": \"Juni\", \"tahun\": \"2025\", \"saksi1\": \"asd\", \"saksi2\": \"asd\", \"tanggal\": \"25\", \"namaLaki\": \"asd\", \"alamatLaki\": \"asd\", \"namaIbuLaki\": \"asd\", \"namaAyahLaki\": \"asd\", \"orangTuaLaki\": \"asd\", \"namaPerempuan\": \"asd\", \"tempatSidiLaki\": \"\", \"yangMelayankan\": \"asd\", \"alamatPerempuan\": \"asd\", \"tanggalSidiLaki\": \"\", \"tempatLahirLaki\": \"asd\", \"wargaGerejaLaki\": \"\", \"alamatGerejaLaki\": \"\", \"namaIbuPerempuan\": \"asd\", \"tanggalLahirLaki\": \"0005-06-25\", \"tempatBaptisLaki\": \"\", \"namaAyahPerempuan\": \"asd\", \"orangTuaPerempuan\": \"asd\", \"tanggalBaptisLaki\": \"\", \"tempatPertunangan\": \"awaya\", \"tempatSidiPerempuan\": \"asd\", \"tanggalSidiPerempuan\": \"2005-06-05\", \"tempatLahirPerempuan\": \"asd\", \"wargaGerejaPerempuan\": \"asd\", \"alamatGerejaPerempuan\": \"asd\", \"tanggalLahirPerempuan\": \"2005-06-25\", \"tempatBaptisPerempuan\": \"asd\", \"tanggalBaptisPerempuan\": \"2005-06-25\"}', '2025-11-16 18:02:25', '2025-11-16 18:02:25'),
(24, 'KELAHIRAN', 'Permohonan Kelahiran: asd', '{\"alamat\": \"asd\", \"anakKe\": \"6\", \"namaIbu\": \"asd\", \"namaAnak\": \"asd\", \"namaAyah\": \"asd\", \"hariLahir\": \"aasd\", \"waktuLahir\": \"18:05\", \"tempatLahir\": \"asd\", \"jenisKelamin\": \"Laki-laki\", \"tanggalLahir\": \"2025-11-16\", \"keteranganAnakKe\": \"5 bersaudara\"}', '2025-11-16 18:05:49', '2025-11-16 18:05:49'),
(25, 'PENG_PERCAYA', 'Permohonan Pengakuan Percaya: asd', '{\"nama\": \"asd\", \"alamat\": \"asd\", \"namaIbu\": \"asd\", \"namaAyah\": \"asd\", \"pembimbing\": \"asd\", \"tempatLahir\": \"asd\", \"tanggalLahir\": \"2005-06-25\", \"tempatBaptis\": \"asd\", \"hariPelayanan\": \"asd\", \"tanggalBaptis\": \"2010-06-25\", \"waktuPelayanan\": \"09:00\", \"tempatPelayanan\": \"asd\", \"durasiKatekisasi\": \"3\", \"tanggalPelayanan\": \"2026-06-25\"}', '2025-11-16 18:06:27', '2025-11-16 18:06:27'),
(27, 'PENG_PERCAYA', 'Permohonan Pengakuan Percaya: asde', '{\"nama\": \"asde\", \"alamat\": \"asd\", \"namaIbu\": \"asd\", \"namaAyah\": \"asd\", \"pembimbing\": \"asd\", \"tempatLahir\": \"wrrt\", \"tanggalLahir\": \"2003-02-23\", \"tempatBaptis\": \"asd\", \"hariPelayanan\": \"asd\", \"tanggalBaptis\": \"2005-05-25\", \"waktuPelayanan\": \"10:10\", \"tempatPelayanan\": \"asd\", \"durasiKatekisasi\": \"e buln\", \"tanggalPelayanan\": \"2012-12-12\"}', '2025-11-25 01:13:38', '2025-11-25 01:13:38');

-- --------------------------------------------------------

--
-- Table structure for table `tipesurat`
--

CREATE TABLE `tipesurat` (
  `kodeTipeSurat` varchar(50) NOT NULL,
  `namaSurat` varchar(255) NOT NULL,
  `kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tipesurat`
--

INSERT INTO `tipesurat` (`kodeTipeSurat`, `namaSurat`, `kategori`) VALUES
('BAP_ANAK', 'Surat Permohonan Baptis Anak', 'Pelayanan Sakramen dan Pertobatan'),
('BAP_DEWASA', 'Surat Permohonan Baptis Dewasa', 'Pelayanan Sakramen dan Pertobatan'),
('BESUK_PERJAMUAN', 'Laporan Besuk Perjamuan Kudus', 'Pelayanan Sakramen dan Pertobatan'),
('CALON_MAJELIS', 'Surat Kesanggupan Pencalonan Majelis', 'Kepengurusan dan Administrasi Gereja'),
('KATEKISASI', 'Surat Permohonan Bimbingan Katekisasi', 'Pembinaan dan Pendidikan Iman'),
('KELAHIRAN', 'Surat Pemberitahuan Kelahiran', 'Peristiwa Kehidupan Jemaat'),
('NIKAH', 'Surat Permohonan Pemberkatan Nikah', 'Peristiwa Kehidupan Jemaat'),
('PENG_PERCAYA', 'Surat Pengakuan Percaya (Sidi)', 'Pelayanan Sakramen dan Pertobatan'),
('PINDAH_GEREJA', 'Surat Atestasi Pindah Gereja', 'Kepengurusan dan Administrasi Gereja'),
('TOBAT', 'Surat Permohonan Pertobatan', 'Pelayanan Sakramen dan Pertobatan'),
('TUNANGAN', 'Surat Berita Acara Pertunangan', 'Peristiwa Kehidupan Jemaat');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminsignups`
--
ALTER TABLE `adminsignups`
  ADD PRIMARY KEY (`username`);

--
-- Indexes for table `databaptis`
--
ALTER TABLE `databaptis`
  ADD PRIMARY KEY (`kodeBaptis`),
  ADD KEY `fk_dataBaptis` (`kodeJemaat`);

--
-- Indexes for table `datajemaat`
--
ALTER TABLE `datajemaat`
  ADD PRIMARY KEY (`kodeJemaat`);

--
-- Indexes for table `datameninggal`
--
ALTER TABLE `datameninggal`
  ADD PRIMARY KEY (`kodeMeninggal`),
  ADD KEY `fk_datameninggal` (`kodeJemaat`);

--
-- Indexes for table `datanikah`
--
ALTER TABLE `datanikah`
  ADD PRIMARY KEY (`kodeNikah`),
  ADD KEY `fk_datanikah` (`kodeJemaat`);

--
-- Indexes for table `datapekerjaan`
--
ALTER TABLE `datapekerjaan`
  ADD PRIMARY KEY (`kodePekerjaan`),
  ADD KEY `fk_datapekerjaan` (`kodeJemaat`);

--
-- Indexes for table `datapelayanan`
--
ALTER TABLE `datapelayanan`
  ADD PRIMARY KEY (`kodePelayanan`),
  ADD KEY `fk_datapelayanan` (`kodeJemaat`);

--
-- Indexes for table `datapendeta`
--
ALTER TABLE `datapendeta`
  ADD PRIMARY KEY (`kodePendeta`),
  ADD KEY `fk_datapendeta` (`kodeJemaat`);

--
-- Indexes for table `datapepanthan`
--
ALTER TABLE `datapepanthan`
  ADD PRIMARY KEY (`kodePepanthan`),
  ADD KEY `fk_pepanthan_jemaat` (`kodeJemaat`);

--
-- Indexes for table `datariwayatpendeta`
--
ALTER TABLE `datariwayatpendeta`
  ADD PRIMARY KEY (`kodeRiwayatPendeta`),
  ADD KEY `fk_riwayat_pendeta` (`kodePendeta`);

--
-- Indexes for table `datariwayatpendidikan`
--
ALTER TABLE `datariwayatpendidikan`
  ADD PRIMARY KEY (`kodeRiwayatPendidikan`),
  ADD KEY `fk_pendidikan_jemaat` (`kodeJemaat`);

--
-- Indexes for table `datasidi`
--
ALTER TABLE `datasidi`
  ADD PRIMARY KEY (`kodeSidi`),
  ADD KEY `fk_sidi_jemaat` (`kodeJemaat`);

--
-- Indexes for table `datasurat`
--
ALTER TABLE `datasurat`
  ADD PRIMARY KEY (`kodeDataSurat`),
  ADD KEY `datasurat_ibfk_1` (`kodeTipeSurat`);

--
-- Indexes for table `tipesurat`
--
ALTER TABLE `tipesurat`
  ADD PRIMARY KEY (`kodeTipeSurat`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `databaptis`
--
ALTER TABLE `databaptis`
  MODIFY `kodeBaptis` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `datajemaat`
--
ALTER TABLE `datajemaat`
  MODIFY `kodeJemaat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `datameninggal`
--
ALTER TABLE `datameninggal`
  MODIFY `kodeMeninggal` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `datanikah`
--
ALTER TABLE `datanikah`
  MODIFY `kodeNikah` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `datapekerjaan`
--
ALTER TABLE `datapekerjaan`
  MODIFY `kodePekerjaan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `datapelayanan`
--
ALTER TABLE `datapelayanan`
  MODIFY `kodePelayanan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `datapendeta`
--
ALTER TABLE `datapendeta`
  MODIFY `kodePendeta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `datapepanthan`
--
ALTER TABLE `datapepanthan`
  MODIFY `kodePepanthan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `datariwayatpendeta`
--
ALTER TABLE `datariwayatpendeta`
  MODIFY `kodeRiwayatPendeta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `datariwayatpendidikan`
--
ALTER TABLE `datariwayatpendidikan`
  MODIFY `kodeRiwayatPendidikan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `datasidi`
--
ALTER TABLE `datasidi`
  MODIFY `kodeSidi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `datasurat`
--
ALTER TABLE `datasurat`
  MODIFY `kodeDataSurat` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `databaptis`
--
ALTER TABLE `databaptis`
  ADD CONSTRAINT `fk_dataBaptis` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datameninggal`
--
ALTER TABLE `datameninggal`
  ADD CONSTRAINT `fk_datameninggal` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datanikah`
--
ALTER TABLE `datanikah`
  ADD CONSTRAINT `fk_datanikah` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datapekerjaan`
--
ALTER TABLE `datapekerjaan`
  ADD CONSTRAINT `fk_datapekerjaan` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datapelayanan`
--
ALTER TABLE `datapelayanan`
  ADD CONSTRAINT `fk_datapelayanan` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datapendeta`
--
ALTER TABLE `datapendeta`
  ADD CONSTRAINT `fk_datapendeta` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datapepanthan`
--
ALTER TABLE `datapepanthan`
  ADD CONSTRAINT `fk_pepanthan_jemaat` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datariwayatpendeta`
--
ALTER TABLE `datariwayatpendeta`
  ADD CONSTRAINT `fk_riwayat_pendeta` FOREIGN KEY (`kodePendeta`) REFERENCES `datapendeta` (`kodePendeta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datariwayatpendidikan`
--
ALTER TABLE `datariwayatpendidikan`
  ADD CONSTRAINT `fk_pendidikan_jemaat` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datasidi`
--
ALTER TABLE `datasidi`
  ADD CONSTRAINT `fk_sidi_jemaat` FOREIGN KEY (`kodeJemaat`) REFERENCES `datajemaat` (`kodeJemaat`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `datasurat`
--
ALTER TABLE `datasurat`
  ADD CONSTRAINT `datasurat_ibfk_1` FOREIGN KEY (`kodeTipeSurat`) REFERENCES `tipesurat` (`kodeTipeSurat`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
