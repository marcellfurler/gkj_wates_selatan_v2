import { db } from "../config/db.js"; 

/**
 * Mengambil detail LENGKAP Pendeta (gabungan dataJemaat + dataPendeta + dataRiwayatPendeta) berdasarkan NIK.
 */
export const getPendetaDetailBykodeJemaat = (req, res) => {
    // ✅ Ambil NIK dari query parameter ATAU route parameter
    const kodeJemaat = req.query.kodeJemaat || req.params.kodeJemaat;

    if (!kodeJemaat) {
        return res.status(400).json({ 
            message: "NIK tidak ditemukan. Gunakan ?kodeJemaat=xxx atau /:kodeJemaat" 
        });
    }

    console.log("🔍 Mengambil detail Pendeta dengan kodeJemaat:", kodeJemaat);

    // Query menggunakan INNER JOIN ke dataPendeta (wajib Pendeta) dan LEFT JOIN ke dataRiwayatPendeta (opsional riwayat)
    const query = `
    SELECT
        dj.kodeJemaat,
        dj.namaLengkap,
        dj.tempatLahir,
        dj.tanggalLahir,
        dj.jenisKelamin,
        dj.agama,
        dj.golonganDarah,
        dj.nomorTelepon,
        dj.alamat,
        dj.foto,
        dp.jabatan AS jabatanPendeta,
        dp.sertifikatPendeta,
        drp.namaGereja,
        drp.tahunMulai,
        drp.tahunSelesai
    FROM dataJemaat dj
    INNER JOIN dataPendeta dp ON dj.kodeJemaat = dp.kodeJemaat
    LEFT JOIN dataRiwayatPendeta drp ON dp.kodePendeta = drp.kodePendeta
    WHERE dj.kodeJemaat = ?
    ORDER BY drp.tahunMulai DESC
    `;

    db.query(query, [kodeJemaat], (err, results) => {
        if (err) {
            console.error("❌ Error getPendetaDetailBykodeJemaat:", err);
            return res.status(500).json({ 
                message: "Gagal mengambil data Pendeta", 
                error: err.message 
            });
        }

        if (results.length === 0 || !results[0].jabatanPendeta) {
            console.log("⚠️ Data Pendeta tidak ditemukan untuk kodeJemaat:", kodeJemaat);
            return res.status(404).json({ 
                message: "Data Pendeta tidak ditemukan untuk kodeJemaat: " + kodeJemaat
            });
        }

        console.log("✅ Data ditemukan:", results.length, "row(s)");

        // 1. Ambil data dasar dari baris pertama
        const firstRow = results[0];
        const pendetaData = {
            kodeJemaat: firstRow.kodeJemaat,
            namaLengkap: firstRow.namaLengkap,
            tempatLahir: firstRow.tempatLahir,
            tanggalLahir: firstRow.tanggalLahir,
            jenisKelamin: firstRow.jenisKelamin,
            agama: firstRow.agama,
            golonganDarah: firstRow.golonganDarah,
            nomorTelepon: firstRow.nomorTelepon,
            alamat: firstRow.alamat,
            foto: firstRow.foto,
            jabatanPendeta: firstRow.jabatanPendeta,
            sertifikatPendeta: firstRow.sertifikatPendeta,
            riwayatPendetaList: [], // Selalu diinisialisasi sebagai array kosong
        };

        // 2. Iterasi melalui hasil untuk mengisi riwayatPendetaList
        results.forEach((row) => {
            // Hanya tambahkan jika ada riwayat (namaGereja tidak NULL dari LEFT JOIN)
            if (row.namaGereja) {
                pendetaData.riwayatPendetaList.push({
                    namaGereja: row.namaGereja,
                    tahunMulai: row.tahunMulai,
                    tahunSelesai: row.tahunSelesai,
                });
            }
        });

        console.log("📤 Mengirim data Pendeta ke frontend");
        res.json(pendetaData);
    });
};