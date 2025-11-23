// controllers/dataPendetaController.js
import { db } from "../config/db.js";

// ===================================================
// TAMBAH PENDETA
// ===================================================
export const tambahPendeta = async (req, res) => {
  try {
    console.log("FILES:", req.files);
    console.log("BODY:", req.body);

    const promisePool = db.promise();

    // ============================
    // 1. Ambil Foto Dari Multer
    // ============================
    const fotoFile = req.files?.foto ? req.files.foto[0] : null;

    if (!fotoFile) {
      return res.status(400).json({
        message: "Foto wajib diupload."
      });
    }

    // Path lengkap dengan forward slash
    const fotoPath = fotoFile.path.replace(/\\/g, "/");
    // Contoh hasil:
    // uploads/fotoProfil/1763821205628-344538099.png

    // ============================
    // 2. Ambil Data Body
    // ============================
    const {
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      golonganDarah,
      nomorTelepon,
      alamat,
      pepanthan,
      namaPelayanan,
      namaPekerjaan,
      jabatanKerja,
      dataPendeta,
      dataPelayananList
    } = req.body;

    // ============================
    // 3. Parse dataPendeta (jabatan)
    // ============================
    let jabatan = null;
    try {
      jabatan = JSON.parse(dataPendeta)?.jabatan || null;
    } catch {}

    // ============================
    // 4. Parse Riwayat Pelayanan
    // ============================
    let pelayananList = [];
    try {
      pelayananList = JSON.parse(dataPelayananList) || [];
    } catch {}

    // ============================
    // 5. INSERT DATA JEMAAT
    // ============================
    const [jemaatResult] = await promisePool.query(
      `INSERT INTO dataJemaat
      (namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        golonganDarah,
        nomorTelepon,
        alamat,
        fotoPath // <-- Path foto lengkap
      ]
    );

    // Ambil kode Jemaat baru
    const kodeJemaatBaru = jemaatResult.insertId;

    // ============================
    // 6. INSERT PEPPANTHAN
    // ============================
    if (pepanthan) {
      await promisePool.query(
        `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan)
         VALUES (?, ?)`,
        [kodeJemaatBaru, pepanthan]
      );
    }

    // ============================
    // 7. INSERT PELAYANAN
    // ============================
    if (namaPelayanan) {
      await promisePool.query(
        `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan)
         VALUES (?, ?)`,
        [kodeJemaatBaru, namaPelayanan]
      );
    }

    // ============================
    // 8. INSERT PEKERJAAN
    // ============================
    if (namaPekerjaan || jabatanKerja) {
      await promisePool.query(
        `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatanKerja)
         VALUES (?, ?, ?)`,
        [kodeJemaatBaru, namaPekerjaan, jabatanKerja]
      );
    }

    // ============================
    // 9. INSERT DATA PENDETA
    // ============================
    const [pendetaResult] = await promisePool.query(
      `INSERT INTO dataPendeta (kodeJemaat, jabatan)
       VALUES (?, ?)`,
      [kodeJemaatBaru, jabatan]
    );

    const kodePendeta = pendetaResult.insertId;

    // ============================
    // 10. INSERT RIWAYAT PELAYANAN
    // ============================
    for (let p of pelayananList) {
      await promisePool.query(
        `INSERT INTO dataRiwayatPendeta
         (kodePendeta, namaGereja, tahunMulai, tahunSelesai)
         VALUES (?, ?, ?, ?)`,
        [
          kodePendeta,
          p.namaGereja || "",
          p.tahunMulai || null,
          p.tahunSelesai || null
        ]
      );
    }

    // ============================
    // 11. Response
    // ============================
    res.json({
      message: "Pendeta berhasil ditambahkan!",
      kodePendeta,
      kodeJemaat: kodeJemaatBaru,
      foto: fotoPath
    });

  } catch (err) {
    console.error("❌ Error tambahPendeta:", err);
    res.status(500).json({
      message: "Gagal menambah pendeta",
      error: err.message
    });
  }
};
