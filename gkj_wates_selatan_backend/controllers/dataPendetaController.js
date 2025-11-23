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

    // ======================================
    // 1. FOTO
    // ======================================
    const fotoFile = req.files?.foto ? req.files.foto[0] : null;

    if (!fotoFile) {
      return res.status(400).json({ message: "Foto wajib diupload." });
    }

    const fotoPath = fotoFile.path.replace(/\\/g, "/");

    // ======================================
    // 2. Ambil Data Body
    // ======================================
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

      // pekerjaan
      namaPekerjaan,
      jabatanKerja,

      // nikah
      statusNikah,
      tanggalNikah,
      tempatNikah,
      namaPasangan,
      gerejaAsal,

      // sidi
      statusSidi,
      tanggalSidi,
      tempatSidi,

      // baptis
      statusBaptis,
      tanggalBaptis,
      tempatBaptis,

      // meninggal
      statusMeninggal,
      tanggalMeninggal,
      tempatMeninggal,

      // pendeta
      dataPendeta,
      dataPelayananList
    } = req.body;

    // ======================================
    // 3. Parse JSON
    // ======================================
    let jabatan = null;
    try {
      jabatan = JSON.parse(dataPendeta)?.jabatan || null;
    } catch {}

    let pelayananList = [];
    try {
      pelayananList = JSON.parse(dataPelayananList) || [];
    } catch {}

    // ======================================
    // 4. INSERT dataJemaat
    // ======================================
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
        fotoPath
      ]
    );

    const kodeJemaatBaru = jemaatResult.insertId;

    // ======================================
    // 5. INSERT dataPepanthan
    // ======================================
    if (pepanthan) {
      await promisePool.query(
        `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan)
         VALUES (?, ?)`,
        [kodeJemaatBaru, pepanthan]
      );
    }

    // ======================================
    // 6. INSERT dataPelayanan
    // ======================================
    if (namaPelayanan) {
      await promisePool.query(
        `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan)
         VALUES (?, ?)`,
        [kodeJemaatBaru, namaPelayanan]
      );
    }

    // ======================================
    // 7. INSERT dataPekerjaan
    // ======================================
    if (namaPekerjaan || jabatanKerja) {
      await promisePool.query(
        `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatanKerja)
         VALUES (?, ?, ?)`,
        [kodeJemaatBaru, namaPekerjaan, jabatanKerja]
      );
    }

    // ======================================
    // 8. INSERT dataNikah
    // ======================================
    if (statusNikah && statusNikah !== "Belum Nikah") {
      await promisePool.query(
        `INSERT INTO dataNikah (kodeJemaat, statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          kodeJemaatBaru,
          statusNikah,
          tanggalNikah || null,
          tempatNikah || null,
          namaPasangan || null,
          gerejaAsal || null
        ]
      );
    }

    // ======================================
    // 9. INSERT dataSidi
    // ======================================
    if (statusSidi && statusSidi !== "Belum Sidi") {
      await promisePool.query(
        `INSERT INTO dataSidi (kodeJemaat, statusSidi, tanggalSidi, tempatSidi)
         VALUES (?, ?, ?, ?)`,
        [
          kodeJemaatBaru,
          statusSidi,
          tanggalSidi || null,
          tempatSidi || null
        ]
      );
    }

    // ======================================
    // 10. INSERT dataBaptis
    // ======================================
    if (statusBaptis && statusBaptis !== "Belum Baptis") {
      await promisePool.query(
        `INSERT INTO dataBaptis (kodeJemaat, statusBaptis, tanggalBaptis, tempatBaptis)
         VALUES (?, ?, ?, ?)`,
        [
          kodeJemaatBaru,
          statusBaptis,
          tanggalBaptis || null,
          tempatBaptis || null
        ]
      );
    }

    // ======================================
    // 11. INSERT dataKematian
    // ======================================
    if (statusMeninggal === "Meninggal") {
      await promisePool.query(
        `INSERT INTO dataKematian (kodeJemaat, tanggalMeninggal, tempatMeninggal)
         VALUES (?, ?, ?)`,
        [
          kodeJemaatBaru,
          tanggalMeninggal || null,
          tempatMeninggal || null
        ]
      );
    }

    // ======================================
    // 12. INSERT dataPendeta
    // ======================================
    const [pendetaResult] = await promisePool.query(
      `INSERT INTO dataPendeta (kodeJemaat, jabatan)
       VALUES (?, ?)`,
      [kodeJemaatBaru, jabatan]
    );

    const kodePendeta = pendetaResult.insertId;

    // ======================================
    // 13. INSERT Riwayat Pelayanan
    // ======================================
    for (let p of pelayananList) {
      await promisePool.query(
        `INSERT INTO dataRiwayatPendeta (kodePendeta, namaGereja, tahunMulai, tahunSelesai)
         VALUES (?, ?, ?, ?)`,
        [
          kodePendeta,
          p.namaGereja || "",
          p.tahunMulai || null,
          p.tahunSelesai || null
        ]
      );
    }

    // ======================================
    // 14. RESPONSE
    // ======================================
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


export const getDetailPendeta = (req, res) => {
  const { kodePendeta } = req.params;

  const query = `
    SELECT
      dp.kodePendeta,
      dp.jabatan,

      j.kodeJemaat,
      j.namaLengkap,
      j.tempatLahir,
      j.tanggalLahir,
      j.jenisKelamin,
      j.agama,
      j.nomorTelepon,
      j.alamat,
      j.foto,

      drp.kodeRiwayatPendeta,
      drp.namaGereja,
      drp.tahunMulai,
      drp.tahunSelesai

    FROM dataPendeta dp
    INNER JOIN dataJemaat j ON dp.kodeJemaat = j.kodeJemaat
    LEFT JOIN dataRiwayatPendeta drp ON dp.kodePendeta = drp.kodePendeta
    WHERE dp.kodePendeta = ?
  `;

  db.query(query, [kodePendeta], (err, results) => {
    if (err) {
      console.error("❌ Error getDetailPendeta:", err);
      return res.status(500).json({ message: "Gagal mengambil data pendeta", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pendeta tidak ditemukan" });
    }

    // ambil data row pertama
    const r0 = results[0];

    // struktur FINAL yang React butuhkan
    const response = {
      // data utama jemaat
      kodeJemaat: r0.kodeJemaat,
      namaLengkap: r0.namaLengkap,
      tempatLahir: r0.tempatLahir,
      tanggalLahir: r0.tanggalLahir,
      jenisKelamin: r0.jenisKelamin,
      agama: r0.agama,
      nomorTelepon: r0.nomorTelepon,
      alamat: r0.alamat,
      foto: r0.foto,

      // supaya bagian:
      // data.namaPelayanan === "Pendeta"
      namaPelayanan: "Pendeta",

      // === DATA PENDETA ===
      dataPendeta: {
        kodePendeta: r0.kodePendeta,
        jabatan: r0.jabatan
      },

      // === RIWAYAT PELAYANAN ===
      dataRiwayatPendeta: results
        .filter(r => r.kodeRiwayatPendeta)
        .map(r => ({
          kodeRiwayatPendeta: r.kodeRiwayatPendeta,
          namaGereja: r.namaGereja,
          tahunMulai: r.tahunMulai,
          tahunSelesai: r.tahunSelesai
        }))
    };

    res.json(response);
  });
};
