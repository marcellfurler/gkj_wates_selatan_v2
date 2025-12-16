import { db } from "../config/db.js";
import path from "path";          // << tambahkan ini
import fs from "fs";
import { unlink } from "fs/promises";



export const getAllJemaat = async (req, res) => {
  const query = `
    SELECT 
      j.kodeJemaat,
      j.namaLengkap,
      j.tempatLahir,
      j.tanggalLahir,
      j.jenisKelamin,
      j.agama, 
      j.golonganDarah,
      j.wargaNegara,
      j.nomorTelepon,
      j.alamat,
      j.foto,

      b.statusBaptis,
      b.tanggalBaptis,
      b.tempatBaptis,

      s.statusSidi,
      s.tanggalSidi,
      s.tempatSidi,

      n.statusNikah,
      n.gerejaAsal,
      n.namaPasangan,
      n.tanggalNikah,
      n.tempatNikah,

      p.namaPepanthan,       
      l.namaPelayanan,

      pe.namaPekerjaan,
      pe.jabatanKerja,

      dp.jabatan,

      drp.namaGereja,
      drp.tahunMulai,
      drp.tahunSelesai
    FROM dataJemaat j
    LEFT JOIN dataBaptis b ON j.kodeJemaat = b.kodeJemaat
    LEFT JOIN dataSidi s ON j.kodeJemaat = s.kodeJemaat
    LEFT JOIN dataNikah n ON j.kodeJemaat = n.kodeJemaat
    LEFT JOIN dataPepanthan p ON j.kodeJemaat = p.kodeJemaat
    LEFT JOIN dataPelayanan l ON j.kodeJemaat = l.kodeJemaat
    LEFT JOIN dataPekerjaan pe ON j.kodeJemaat = pe.kodeJemaat
    LEFT JOIN dataPendeta dp ON j.kodeJemaat = dp.kodeJemaat
    LEFT JOIN dataRiwayatPendeta drp ON dp.kodePendeta = drp.kodePendeta
  `;

  try {
    // Gunakan await untuk query promise
    const [results] = await db.query(query);

    const jemaatMap = {};
    const addedRiwayatPendetaIds = new Map();

    results.forEach((row) => {
      if (!jemaatMap[row.kodeJemaat]) {
        jemaatMap[row.kodeJemaat] = {
          ...row,
          riwayatPendetaList: []
        };
        addedRiwayatPendetaIds.set(row.kodeJemaat, new Set());
      }

      const currentJemaat = jemaatMap[row.kodeJemaat];
      const riwayatPendetaSet = addedRiwayatPendetaIds.get(row.kodeJemaat);

      if (row.namaGereja) {
        const uniqueKey = `${row.namaGereja}-${row.tahunMulai}-${row.tahunSelesai}`; 
        if (!riwayatPendetaSet.has(uniqueKey)) {
          currentJemaat.riwayatPendetaList.push({
            namaGereja: row.namaGereja,
            tahunMulai: row.tahunMulai,
            tahunSelesai: row.tahunSelesai
          });
          riwayatPendetaSet.add(uniqueKey);
        }
      }
    });

    res.json(Object.values(jemaatMap));
  } catch (error) {
    console.error("❌ Error getAllJemaat:", error);
    res.status(500).json({ message: "Gagal mengambil data jemaat", err: error.message });
  }
};





// Pastikan folder ada
const ensureFolderExists = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};

// Helper format tanggal
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};



export const updateJemaat = async (req, res) => {
  const { kodeJemaat } = req.params;
  const promisePool = db;

  function safeDate(v) {
    if (!v) return null;

    // Jika hasil parse dari multer/express berupa ISO lengkap (ada "T")
    if (typeof v === "string" && v.includes("T")) {
      return v.split("T")[0]; // ambil YYYY-MM-DD
    }

    return v; // jika sudah YYYY-MM-DD
  }


  try {
    // Ambil data lama
    const [rows] = await promisePool.query(
      `SELECT * FROM dataJemaat WHERE kodeJemaat=?`,
      [kodeJemaat]
    );
    if (!rows.length) return res.status(404).json({ message: "Data jemaat tidak ditemukan" });
    const old = rows[0];

    // Ambil body
    let {
      namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah,
      wargaNegara, nomorTelepon, alamat, namaPepanthan, namaPekerjaan, jabatanKerja,
      namaPelayanan, statusBaptis, tanggalBaptis, tempatBaptis,
      statusSidi, tanggalSidi, tempatSidi,
      statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal
    } = req.body;

    // Format tanggal
    // === FIX FORMAT TANGGAL ===
    tanggalLahir = safeDate(tanggalLahir) || old.tanggalLahir;
    tanggalBaptis = safeDate(tanggalBaptis);
    tanggalSidi = safeDate(tanggalSidi);
    tanggalNikah = safeDate(tanggalNikah);



    nomorTelepon = nomorTelepon?.trim() || old.nomorTelepon;

    // =========================
    // FOTO
    // =========================
    let finalFoto = old.foto;
    if (req.file) {
      finalFoto = path.relative(process.cwd(), req.file.path).replace(/\\/g, "/");
    }

    // =========================
    // UPDATE dataJemaat
    // =========================
    await promisePool.query(
      `UPDATE dataJemaat SET
        namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?,
        agama=?, golonganDarah=?, wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
       WHERE kodeJemaat=?`,
      [
        namaLengkap || old.namaLengkap,
        tempatLahir || old.tempatLahir,
        tanggalLahir || old.tanggalLahir,
        jenisKelamin || old.jenisKelamin,
        agama || old.agama,
        golonganDarah || old.golonganDarah,
        wargaNegara || old.wargaNegara,
        nomorTelepon,
        alamat || old.alamat,
        finalFoto,
        kodeJemaat
      ]
    );

    // =========================
    // UPDATE/INSERT Pepanthan
    // =========================
    if (namaPepanthan) {
      const [pep] = await promisePool.query(`SELECT * FROM dataPepanthan WHERE kodeJemaat=?`, [kodeJemaat]);
      if (pep.length) {
        await promisePool.query(`UPDATE dataPepanthan SET namaPepanthan=? WHERE kodeJemaat=?`, [namaPepanthan, kodeJemaat]);
      } else {
        await promisePool.query(`INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`, [kodeJemaat, namaPepanthan]);
      }
    }

    // =========================
    // UPDATE/INSERT Pelayanan
    // =========================
    if (namaPelayanan) {
      const pelayananStr = Array.isArray(namaPelayanan) ? namaPelayanan.join(", ") : namaPelayanan;
      const [pel] = await promisePool.query(`SELECT * FROM dataPelayanan WHERE kodeJemaat=?`, [kodeJemaat]);
      if (pel.length) {
        await promisePool.query(`UPDATE dataPelayanan SET namaPelayanan=? WHERE kodeJemaat=?`, [pelayananStr, kodeJemaat]);
      } else if (pelayananStr?.trim()) {
        await promisePool.query(`INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`, [kodeJemaat, pelayananStr]);
      }
    }

    // =========================
    // UPDATE/INSERT Pekerjaan
    // =========================
    if (namaPekerjaan || jabatanKerja) {
      const [job] = await promisePool.query(`SELECT * FROM dataPekerjaan WHERE kodeJemaat=?`, [kodeJemaat]);
      if (job.length) {
        await promisePool.query(
          `UPDATE dataPekerjaan SET namaPekerjaan=?, jabatanKerja=? WHERE kodeJemaat=?`,
          [namaPekerjaan || "", jabatanKerja || "", kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatanKerja) VALUES (?, ?, ?)`,
          [kodeJemaat, namaPekerjaan || "", jabatanKerja || ""]
        );
      }
    }

    // =========================
    // UPDATE/INSERT/DELETE STATUS GEREJAWI LANGSUNG DI updateJemaat
    // =========================

    // Baptis
    // Baptis
    if (statusBaptis === "Baptis") {
      const [bap] = await promisePool.query(
        `SELECT * FROM dataBaptis WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (bap.length) {
        await promisePool.query(
          `UPDATE dataBaptis 
          SET statusBaptis=?, tanggalBaptis=?, tempatBaptis=? 
          WHERE kodeJemaat=?`,
          [
            statusBaptis,
            tanggalBaptis || null,
            tempatBaptis || null,
            kodeJemaat
          ]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataBaptis 
          (kodeJemaat, statusBaptis, tanggalBaptis, tempatBaptis) 
          VALUES (?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusBaptis,
            tanggalBaptis || null,
            tempatBaptis || null
          ]
        );
      }
    } else {
      // Jika berubah menjadi Belum Baptis
      await promisePool.query(
        `UPDATE dataBaptis 
        SET statusBaptis=?, tanggalBaptis=NULL, tempatBaptis=NULL 
        WHERE kodeJemaat=?`,
        ["Belum Baptis", kodeJemaat]
      );
    }


    // Sidi
    // Sidi
    if (statusSidi === "Sidi") {
      const [sidi] = await promisePool.query(
        `SELECT * FROM dataSidi WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (sidi.length) {
        await promisePool.query(
          `UPDATE dataSidi 
          SET statusSidi=?, tanggalSidi=?, tempatSidi=? 
          WHERE kodeJemaat=?`,
          [
            statusSidi,
            tanggalSidi || null,
            tempatSidi || null,
            kodeJemaat
          ]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataSidi 
          (kodeJemaat, statusSidi, tanggalSidi, tempatSidi) 
          VALUES (?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusSidi,
            tanggalSidi || null,
            tempatSidi || null
          ]
        );
      }
    } else {
      // Jika berubah menjadi Belum Sidi
      await promisePool.query(
        `UPDATE dataSidi 
        SET statusSidi=?, tanggalSidi=NULL, tempatSidi=NULL 
        WHERE kodeJemaat=?`,
        ["Belum Sidi", kodeJemaat]
      );
    }


    // Nikah
    // Nikah
    if (statusNikah === "Nikah") {
      const [nikah] = await promisePool.query(
        `SELECT * FROM dataNikah WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (nikah.length) {
        await promisePool.query(
          `UPDATE dataNikah 
          SET statusNikah=?, tanggalNikah=?, tempatNikah=?, namaPasangan=?, gerejaAsal=? 
          WHERE kodeJemaat=?`,
          [
            statusNikah,
            tanggalNikah || null,
            tempatNikah || null,
            namaPasangan || null,
            gerejaAsal || null,
            kodeJemaat
          ]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataNikah 
          (kodeJemaat, statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusNikah,
            tanggalNikah || null,
            tempatNikah || null,
            namaPasangan || null,
            gerejaAsal || null
          ]
        );
      }
    } else {
      // Jika berubah menjadi belum nikah
      await promisePool.query(
        `UPDATE dataNikah 
        SET statusNikah=?, tanggalNikah=NULL, tempatNikah=NULL, namaPasangan=NULL, gerejaAsal=NULL 
        WHERE kodeJemaat=?`,
        ["Belum Nikah", kodeJemaat]
      );
    }




    res.json({ message: "✅ Data jemaat berhasil diperbarui!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update jemaat", error: err });
  }
};





// ===================================================
// HAPUS JEMAAT BESERTA DATA TERKAIT
// ===================================================
export const hapusJemaat = async (req, res) => {
  const { kodeJemaat } = req.params;
  if (!kodeJemaat) return res.status(400).json({ message: "kodeJemaat tidak diberikan" });

  try {
    // Ambil foto dari dataJemaat
    const [rows] = await db.query(
      `SELECT foto FROM dataJemaat WHERE kodeJemaat=?`,
      [kodeJemaat]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });
    }

    const fotoPath = rows[0].foto;

    // Hapus tabel yang menggunakan kodeJemaat
    const tablesWithKodeJemaat = [
      "dataBaptis",
      "dataSidi",
      "dataNikah",
      "dataPekerjaan",
      "dataPelayanan",
      "dataPepanthan",
    ];

    for (const t of tablesWithKodeJemaat) {
      await db.query(`DELETE FROM ${t} WHERE kodeJemaat=?`, [kodeJemaat]);
    }

    // Cek apakah jemaat ini pendeta
    const [pendetaRows] = await db.query(
      `SELECT kodePendeta FROM dataPendeta WHERE kodeJemaat=?`,
      [kodeJemaat]
    );

    if (pendetaRows.length) {
      const kodePendeta = pendetaRows[0].kodePendeta;

      // Hapus dataRiwayatPendeta
      await db.query(`DELETE FROM dataRiwayatPendeta WHERE kodePendeta=?`, [kodePendeta]);

      // Hapus dataPendeta
      await db.query(`DELETE FROM dataPendeta WHERE kodePendeta=?`, [kodePendeta]);
    }

    // Hapus data utama jemaat
    await db.query(`DELETE FROM dataJemaat WHERE kodeJemaat=?`, [kodeJemaat]);

    // Hapus file foto jika ada
    if (fotoPath) {
      const absolutePath = path.join(process.cwd(), fotoPath);
      if (fs.existsSync(absolutePath)) {
        await unlink(absolutePath);
      }
    }

    res.json({ message: "✅ Jemaat berhasil dihapus!" });

  } catch (err) {
    console.error("❌ Error hapusJemaat:", err);
    res.status(500).json({ message: "Gagal menghapus jemaat", err: err.message });
  }
};




export const tambahJemaat = async (req, res) => {
  try {
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
      statusNikah,
      tanggalNikah,
      tempatNikah,
      namaPasangan,
      gerejaAsal,
      statusSidi,
      tanggalSidi,
      tempatSidi,
      statusBaptis,
      tanggalBaptis,
      tempatBaptis,
      namaPekerjaan,
      jabatanKerja
    } = req.body;

    // Foto: pakai file multer atau default
    const foto = req.file
      ? `uploads/fotoProfil/${req.file.filename}`
      : "uploads/fotoProfil/undefined/undefined.png";

    const promisePool = db;

    // 1️⃣ Insert data utama, ambil kodeJemaat auto increment
    const [result] = await promisePool.query(
      `INSERT INTO dataJemaat
      (namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [namaLengkap, tempatLahir, tanggalLahir || null, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto]
    );

    const kodeJemaat = result.insertId;

    // 2️⃣ Insert relasi tambahan hanya jika ada data
    const inserts = [];

    // Nikah
    if (statusNikah && statusNikah !== "") {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataNikah (kodeJemaat, statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusNikah,
            tanggalNikah && tanggalNikah !== "" ? tanggalNikah : null,
            tempatNikah && tempatNikah !== "" ? tempatNikah : null,
            namaPasangan && namaPasangan !== "" ? namaPasangan : null,
            gerejaAsal && gerejaAsal !== "" ? gerejaAsal : null
          ]
        )
      );
    }

    // Sidi
    if (statusSidi && statusSidi !== "") {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataSidi (kodeJemaat, statusSidi, tanggalSidi, tempatSidi) 
           VALUES (?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusSidi,
            tanggalSidi && tanggalSidi !== "" ? tanggalSidi : null,
            tempatSidi && tempatSidi !== "" ? tempatSidi : null
          ]
        )
      );
    }

    // Baptis
    if (statusBaptis && statusBaptis !== "") {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataBaptis (kodeJemaat, statusBaptis, tanggalBaptis, tempatBaptis)
           VALUES (?, ?, ?, ?)`,
          [
            kodeJemaat,
            statusBaptis,
            tanggalBaptis && tanggalBaptis !== "" ? tanggalBaptis : null,
            tempatBaptis && tempatBaptis !== "" ? tempatBaptis : null
          ]
        )
      );
    }

    // Pepanthan
    if (pepanthan && pepanthan !== "") {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`,
          [kodeJemaat, pepanthan]
        )
      );
    }

    // Pekerjaan
    if ((namaPekerjaan && namaPekerjaan !== "") || (jabatanKerja && jabatanKerja !== "")) {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatanKerja) VALUES (?, ?, ?)`,
          [kodeJemaat, namaPekerjaan || null, jabatanKerja || null]
        )
      );
    }

    // Pelayanan
    if (namaPelayanan && namaPelayanan !== "") {
      inserts.push(
        promisePool.query(
          `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`,
          [kodeJemaat, namaPelayanan]
        )
      );
    }

    await Promise.all(inserts);

    res.json({ message: "✅ Data jemaat berhasil ditambahkan!", kodeJemaat });

  } catch (err) {
    console.error("❌ Error tambahJemaat:", err);
    res.status(500).json({ message: "Gagal menambah jemaat", err: err.message });
  }
};



// // ===================================================
// // TAMBAH PENDETA TANPA SERTIFIKAT
// // ===================================================
// export const tambahPendeta = async (req, res) => {
//   try {
//     const {
//       kodeJemaat,
//       namaLengkap,
//       tempatLahir,
//       tanggalLahir,
//       jenisKelamin,
//       agama,
//       golonganDarah,
//       nomorTelepon,
//       alamat,
//       pepanthan,
//       namaPelayanan,
//       namaPekerjaan,
//       jabatan: jabatanPekerjaan,
//       jabatanPendeta,
//       dataPelayananList // JSON string dari frontend
//     } = req.body;

//     const finalJabatanPendeta = jabatanPendeta || null;

//     const foto = req.files?.foto?.[0]
//       ? `uploads/fotoProfil/${req.files.foto[0].filename}`
//       : null;

//     const promisePool = db.promise();

//     // Parse list riwayat pelayanan pendeta
//     let pelayananList = [];
//     if (dataPelayananList) {
//       try {
//         pelayananList = JSON.parse(dataPelayananList);
//       } catch {
//         pelayananList = [];
//       }
//     }

//     // 1️⃣ Insert data jemaat utama
//     await promisePool.query(
//       `INSERT INTO dataJemaat
//       ( namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto]
//     );

//     // 2️⃣ Insert data pendukung jemaat
//     const inserts = [];
//     if (pepanthan) inserts.push(promisePool.query(`INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`, [kodeJemaat, pepanthan]));
//     if (namaPelayanan) inserts.push(promisePool.query(`INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`, [kodeJemaat, namaPelayanan]));
//     if (namaPekerjaan || jabatanPekerjaan) inserts.push(promisePool.query(`INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?, ?, ?)`, [kodeJemaat, namaPekerjaan || null, jabatanPekerjaan || null]));

//     // 3️⃣ Insert dataPendeta
//     const [pendetaResult] = await promisePool.query(
//       `INSERT INTO dataPendeta (kodeJemaat, jabatan) VALUES (?, ?)`,
//       [kodeJemaat, finalJabatanPendeta]
//     );
//     const kodePendeta = pendetaResult.insertId;

//     // 4️⃣ Insert riwayat pelayanan pendeta
//     if (pelayananList.length > 0) {
//       const pelayananPromises = pelayananList.map(p =>
//         promisePool.query(
//           `INSERT INTO dataRiwayatPendeta (kodePendeta, namaGereja, tahunMulai, tahunSelesai) VALUES (?, ?, ?, ?)`,
//           [kodePendeta, p.namaGereja || "", p.tahunMulai || null, p.tahunSelesai || null]
//         )
//       );
//       await Promise.all(pelayananPromises);
//     }

//     // Tunggu semua inserts selesai
//     await Promise.all(inserts);

//     res.json({
//       message: "✅ Pendeta berhasil ditambahkan!",
//       kodePendeta,
//       kodeJemaat
//     });

//   } catch (err) {
//     console.error("❌ Error tambahPendeta:", err);
//     res.status(500).json({ message: "Gagal menambah pendeta", error: err.message });
//   }
// };
