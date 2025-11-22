// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises";

// ===================================================
// AMBIL SEMUA DATA JEMAAT + RELASI
// ===================================================
export const getAllJemaat = (req, res) => {
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
      pe.jabatan,


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

db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error getAllJemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat", err });
    }

    // Map untuk menampung data jemaat yang sudah dikelompokkan
    const jemaatMap = {};
    // Set untuk melacak ID yang sudah ditambahkan ke pendidikanList (mencegah duplikasi)
//     const addedPendidikanIds = new Map(); 
    // Set untuk melacak ID yang sudah ditambahkan ke riwayatPendetaList (mencegah duplikasi)
    // CATATAN: Pastikan Anda menambahkan drp.kodeRiwayatPendeta di SELECT query SQL!
    const addedRiwayatPendetaIds = new Map(); 

    results.forEach((row) => {
      if (!jemaatMap[row.kodeJemaat]) {
        jemaatMap[row.kodeJemaat] = {
          ...row,
//           pendidikanList: [],
          riwayatPendetaList: []
        };
        // Inisialisasi Set pelacak ID untuk jemaat ini
        // addedPendidikanIds.set(row.kodeJemaat, new Set());
        addedRiwayatPendetaIds.set(row.kodeJemaat, new Set());
      }

      const currentJemaat = jemaatMap[row.kodeJemaat];
      
//       // 1. De-duplikasi dan tambahkan Riwayat Pendidikan
//       // Gunakan kodeRiwayatPendidikan sebagai kunci unik
//       const pendidikanSet = addedPendidikanIds.get(row.kodeJemaat);
//       if (row.kodeRiwayatPendidikan && pendidikanSet.has(row.kodeRiwayatPendidikan) === false) {
//         currentJemaat.pendidikanList.push({
//           kodeRiwayatPendidikan: row.kodeRiwayatPendidikan,
//           jenjangPendidikan: row.jenjangPendidikan,
//           namaInstitusi: row.namaInstitusi,
//           tahunLulus: row.tahunLulus
//         });
//         // Tandai ID ini sudah dimasukkan
//         pendidikanSet.add(row.kodeRiwayatPendidikan);
//       }

      // 2. De-duplikasi dan tambahkan Riwayat Pendeta
      // Asumsi: Jika kodeRiwayatPendeta tidak ada di SELECT, ini tidak akan bekerja sempurna.
      // Kita asumsikan ada kolom unik `drp.kodeRiwayatPendeta`
      const riwayatPendetaSet = addedRiwayatPendetaIds.get(row.kodeJemaat);
      // Ganti `row.kodeRiwayatPendeta` dengan kunci unik yang Anda miliki di tabel dataRiwayatPendeta
      if (row.namaGereja) { // Menggunakan namaGereja sebagai proxy karena ID tidak terlihat di SELECT query
        const uniqueKey = `${row.namaGereja}-${row.tahunMulai}-${row.tahunSelesai}`; 
        
        if (riwayatPendetaSet.has(uniqueKey) === false) {
          currentJemaat.riwayatPendetaList.push({
            namaGereja: row.namaGereja,
            tahunMulai: row.tahunMulai,
            tahunSelesai: row.tahunSelesai
          });
          // Tandai kombinasi ini sudah dimasukkan
          riwayatPendetaSet.add(uniqueKey);
        }
      }
      
    });

    res.json(Object.values(jemaatMap));
  });
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
  const promisePool = db.promise();

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
      wargaNegara, nomorTelepon, alamat, namaPepanthan, namaPekerjaan, jabatan,
      namaPelayanan, statusBaptis, tanggalBaptis, tempatBaptis,
      statusSidi, tanggalSidi, tempatSidi,
      statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal
    } = req.body;

    // Format tanggal
    tanggalLahir = formatDate(tanggalLahir);
    tanggalBaptis = formatDate(tanggalBaptis);
    tanggalSidi = formatDate(tanggalSidi);
    tanggalNikah = formatDate(tanggalNikah);

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
    if (namaPekerjaan || jabatan) {
      const [job] = await promisePool.query(`SELECT * FROM dataPekerjaan WHERE kodeJemaat=?`, [kodeJemaat]);
      if (job.length) {
        await promisePool.query(
          `UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE kodeJemaat=?`,
          [namaPekerjaan || "", jabatan || "", kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
          [kodeJemaat, namaPekerjaan || "", jabatan || ""]
        );
      }
    }

    // =========================
    // UPDATE/INSERT/DELETE STATUS GEREJAWI LANGSUNG DI updateJemaat
    // =========================

    // Baptis
    if (statusBaptis === "Baptis") {
      const [bap] = await promisePool.query(`SELECT * FROM dataBaptis WHERE kodeJemaat=?`, [kodeJemaat]);
      if (bap.length) {
        await promisePool.query(
          `UPDATE dataBaptis SET statusBaptis=?, tanggalBaptis=?, tempatBaptis=? WHERE kodeJemaat=?`,
          [statusBaptis, tanggalBaptis || null, tempatBaptis || null, kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataBaptis (kodeJemaat, statusBaptis, tanggalBaptis, tempatBaptis) VALUES (?, ?, ?, ?)`,
          [kodeJemaat, statusBaptis, tanggalBaptis || null, tempatBaptis || null]
        );
      }
    } else {
      // Kalau diubah ke Belum Baptis → hapus record
      await promisePool.query(`DELETE FROM dataBaptis WHERE kodeJemaat=?`, [kodeJemaat]);
    }

    // Sidi
    if (statusSidi === "Sidi") {
      const [sidi] = await promisePool.query(`SELECT * FROM dataSidi WHERE kodeJemaat=?`, [kodeJemaat]);
      if (sidi.length) {
        await promisePool.query(
          `UPDATE dataSidi SET statusSidi=?, tanggalSidi=?, tempatSidi=? WHERE kodeJemaat=?`,
          [statusSidi, tanggalSidi || null, tempatSidi || null, kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataSidi (kodeJemaat, statusSidi, tanggalSidi, tempatSidi) VALUES (?, ?, ?, ?)`,
          [kodeJemaat, statusSidi, tanggalSidi || null, tempatSidi || null]
        );
      }
    } else {
      await promisePool.query(`DELETE FROM dataSidi WHERE kodeJemaat=?`, [kodeJemaat]);
    }

    // Nikah
    if (statusNikah === "Nikah") {
      const [nikah] = await promisePool.query(`SELECT * FROM dataNikah WHERE kodeJemaat=?`, [kodeJemaat]);
      if (nikah.length) {
        await promisePool.query(
          `UPDATE dataNikah SET statusNikah=?, tanggalNikah=?, tempatNikah=?, namaPasangan=?, gerejaAsal=? WHERE kodeJemaat=?`,
          [statusNikah, tanggalNikah || null, tempatNikah || null, namaPasangan || null, gerejaAsal || null, kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataNikah (kodeJemaat, statusNikah, tanggalNikah, tempatNikah, namaPasangan, gerejaAsal) VALUES (?, ?, ?, ?, ?, ?)`,
          [kodeJemaat, statusNikah, tanggalNikah || null, tempatNikah || null, namaPasangan || null, gerejaAsal || null]
        );
      }
    } else {
      await promisePool.query(`DELETE FROM dataNikah WHERE kodeJemaat=?`, [kodeJemaat]);
    }



    res.json({ message: "✅ Data jemaat berhasil diperbarui!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update jemaat", error: err });
  }
};





// ===================================================
// HAPUS JEMAAT TANPA SERTIFIKAT
// ===================================================
export const hapusJemaat = async (req, res) => {
  const { kodeJemaat } = req.params;
  if (!kodeJemaat) return res.status(400).json({ message: "kodeJemaat tidak diberikan" });

  const promisePool = db.promise();

  try {
    const [rows] = await promisePool.query(
      `SELECT foto FROM dataJemaat WHERE kodeJemaat=?`,
      [kodeJemaat]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });
    }

    const fotoPath = rows[0].foto;

    const tables = [
      "dataBaptis",
      "dataSidi",
      "dataNikah",
      "dataPekerjaan",
      "dataPelayanan",
      "dataPepanthan",
      // "dataRiwayatPendidikan",
      "dataRiwayatPendeta"
    ];

    for (const t of tables) {
      await promisePool.query(`DELETE FROM ${t} WHERE kodeJemaat=?`, [kodeJemaat]);
    }

    await promisePool.query(`DELETE FROM dataJemaat WHERE kodeJemaat=?`, [kodeJemaat]);

    if (fotoPath) {
      const absolute = path.join(process.cwd(), fotoPath);
      if (fs.existsSync(absolute)) await unlink(absolute);
    }

    res.json({ message: "✅ Jemaat berhasil dihapus tanpa sertifikat!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus jemaat", err });
  }
};

// ===================================================
// TAMBAH JEMAAT TANPA SERTIFIKAT
// ===================================================
export const tambahJemaat = async (req, res) => {
  try {
    const {
      kodeJemaat,
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
      statusSidi,
      statusBaptis,
      namaPekerjaan,
      jabatan
    } = req.body;

    const foto = req.files?.foto?.[0]
      ? `uploads/fotoProfil/${req.files.foto[0].filename}`
      : null;

    let pelayananStr = "";

    if (namaPelayanan) {
      if (Array.isArray(namaPelayanan)) pelayananStr = namaPelayanan[0];
      else pelayananStr = namaPelayanan;

      pelayananStr = pelayananStr.replace(/^["']?(.*?)["']?$/, "$1");
    }

    await db.promise().query(
      `
      INSERT INTO dataJemaat 
      (kodeJemaat, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        kodeJemaat,
        namaLengkap,
        tempatLahir,
        tanggalLahir,
        jenisKelamin,
        agama,
        golonganDarah,
        nomorTelepon,
        alamat,
        foto
      ]
    );

    if (statusNikah) {
      await db.promise().query(
        `INSERT INTO dataNikah (kodeJemaat, statusNikah) VALUES (?, ?)`,
        [kodeJemaat, statusNikah]
      );
    }

    if (statusSidi) {
      await db.promise().query(
        `INSERT INTO dataSidi (kodeJemaat, statusSidi) VALUES (?, ?)`,
        [kodeJemaat, statusSidi]
      );
    }

    if (statusBaptis) {
      await db.promise().query(
        `INSERT INTO dataBaptis (kodeJemaat, statusBaptis) VALUES (?, ?)`,
        [kodeJemaat, statusBaptis]
      );
    }

    if (pepanthan) {
      await db.promise().query(
        `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`,
        [kodeJemaat, pepanthan]
      );
    }

    if (namaPekerjaan || jabatan) {
      await db.promise().query(
        `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
        [kodeJemaat, namaPekerjaan || "", jabatan || ""]
      );
    }

    if (pelayananStr) {
      await db.promise().query(
        `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`,
        [kodeJemaat, pelayananStr]
      );
    }

    // // Pendidikan List
    // let pendidikanList = [];
    // if (req.body.pendidikan) {
    //   try {
    //     pendidikanList = JSON.parse(req.body.pendidikan);
    //   } catch {
    //     pendidikanList = [];
    //   }
    // }

    // for (const p of pendidikanList) {
    //   const { jenjangPendidikan, namaInstitusi, tahunLulus } = p;

    //   if (jenjangPendidikan || namaInstitusi) {
    //     await db.promise().query(
    //       `
    //       INSERT INTO dataRiwayatPendidikan 
    //       (kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus)
    //       VALUES (?, ?, ?, ?)
    //     `,
    //       [
    //         kodeJemaat,
    //         jenjangPendidikan || "",
    //         namaInstitusi || "",
    //         tahunLulus || null
    //       ]
    //     );
    //   }
    // }

    res.json({ message: "✅ Data jemaat berhasil ditambahkan tanpa sertifikat!" });
  } catch (err) {
    console.error("❌ Error tambah jemaat:", err);
    res.status(500).json({ message: "Gagal menambah jemaat", err });
  }
};


export const tambahPendeta = (req, res) => {
  try {
    const {
      namaLengkap,
      kodeJemaat,
      alamat,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      golonganDarah,
      nomorTelepon,
      pepanthan,        
      namaPelayanan,    
      namaPekerjaan,    
      jabatan: jabatanPekerjaan, 
      jabatanPendeta, 
    } = req.body;
    
    const finalJabatanPendeta = jabatanPendeta || req.body.jabatan; 

    const foto = req.files?.foto?.[0] ? `uploads/fotoProfil/${req.files.foto[0].filename}` : null;
    const sertifikatPendeta = req.files?.sertifikatPendeta?.[0]
      ? `uploads/sertifikat/pendeta/${req.files.sertifikatPendeta[0].filename}`
      : null;

    // const pendidikanList = req.body.pendidikan ? JSON.parse(req.body.pendidikan) : [];
    const pelayananList = req.body.dataPelayananList
      ? JSON.parse(req.body.dataPelayananList)
      : [];

    // 🔍 Debug: Log semua data yang diterima
    console.log("📥 Data diterima:");
    console.log("- kodeJemaat:", kodeJemaat);
    console.log("- Jabatan Pendeta:", finalJabatanPendeta);
    console.log("- Sertifikat Pendeta:", sertifikatPendeta);
    console.log("- Pelayanan List:", pelayananList);

    // 1️⃣ Insert data jemaat dasar (Wajib)
    const queryJemaat = `
      INSERT INTO dataJemaat
      (kodeJemaat, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        queryJemaat, 
        [kodeJemaat, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto], 
        async (err) => {
            if (err) {
                console.error("❌ Error INSERT dataJemaat (Pendeta):", err);
                return res.status(500).json({ message: "Gagal menambah data jemaat (kodeJemaat mungkin duplikat)", err });
            }

            console.log("✅ dataJemaat berhasil diinsert dengan kodeJemaat:", kodeJemaat);

            const promisePool = db.promise();
            const criticalInserts = [];

            // === INSERT DATA PENDUKUNG (Menggunakan Promise.all) ===
            
            // Pepanthan
            if (pepanthan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`, [kodeJemaat, pepanthan])
                );
            }
            
            // dataPelayanan
            if (namaPelayanan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`, [kodeJemaat, namaPelayanan])
                );
            }

            // Pekerjaan
            if (namaPekerjaan || jabatanPekerjaan) {
                criticalInserts.push(
                    promisePool.query(`INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?, ?, ?)`, 
                        [kodeJemaat, namaPekerjaan || null, jabatanPekerjaan || null])
                );
            }

            // // Pendidikan List
            // pendidikanList.forEach((p) => {
            //     criticalInserts.push(
            //         promisePool.query(
            //             `INSERT INTO dataRiwayatPendidikan (kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus) VALUES (?, ?, ?, ?)`,
            //             [kodeJemaat, p.jenjangPendidikan, p.namaInstitusi, p.tahunLulus]
            //         )
            //     );
            // });

            // 2️⃣ Detail Pendeta (dataPendeta) 
            // ✅ PERBAIKAN: kodePendeta AUTO_INCREMENT, nik sebagai FK
            console.log("🔄 Mencoba insert dataPendeta...");
            
            const [pendetaResult] = await promisePool.query(
                `INSERT INTO dataPendeta (kodeJemaat, jabatan, sertifikatPendeta) VALUES (?, ?, ?)`, 
                [kodeJemaat, finalJabatanPendeta || null, sertifikatPendeta || null]
            );
            
            // Ambil kodePendeta yang baru saja di-generate (AUTO_INCREMENT)
            const kodePendeta = pendetaResult.insertId;
            console.log("✅ dataPendeta berhasil diinsert dengan kodePendeta:", kodePendeta);

            // 3️⃣ Riwayat Pelayanan Pendeta (dataRiwayatPendeta) 
            // ✅ PERBAIKAN: Gunakan kodePendeta dari hasil insert sebelumnya
            if (pelayananList.length > 0) {
                console.log(`🔄 Mencoba insert ${pelayananList.length} riwayat pelayanan dengan kodePendeta: ${kodePendeta}...`);
                
                pelayananList.forEach((pel) => {
                    criticalInserts.push(
                        promisePool.query(
                            `INSERT INTO dataRiwayatPendeta (kodePendeta, namaGereja, tahunMulai, tahunSelesai) VALUES (?, ?, ?, ?)`,
                            [kodePendeta, pel.namaGereja || "", pel.tahunMulai || null, pel.tahunSelesai || null]
                        )
                    );
                });
            }
            
            try {
                // Tunggu semua operasi selesai
                const results = await Promise.all(criticalInserts);
                
                console.log("✅ Semua data berhasil diinsert:", results.length + 1, "operasi"); // +1 untuk dataPendeta
                
                res.json({ 
                    message: "✅ Pendeta berhasil ditambahkan!",
                    kodePendeta: kodePendeta,
                    kodeJemaat: kodeJemaat
                });
                
            } catch (subErr) {
                // 🔥 Tangkap error SQL dan laporkan detailnya
                console.error("❌ Error saat menjalankan INSERT Pendeta sekunder:", subErr);
                console.error("SQL Error Code:", subErr.code);
                console.error("SQL Message:", subErr.sqlMessage);
                
                res.status(500).json({ 
                    message: "Gagal menyimpan data Pendeta. Detail error ada di log server.", 
                    errorDetail: subErr.message,
                    sqlError: subErr.sqlMessage 
                });
            }
        }
    );
  } catch (error) {
    console.error("❌ Error tambahPendeta (Catch Luar):", error);
    res.status(500).json({ message: "❌ Terjadi kesalahan saat menambah pendeta" });
  }
};
