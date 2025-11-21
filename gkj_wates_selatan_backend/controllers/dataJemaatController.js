// controllers/dataJemaatController.js
import { db } from "../config/db.js";
import path from "path";
import fs from "fs";
import { unlink } from "fs/promises"; 

// ===================================================
// AMBIL SEMUA DATA JEMAAT + RELASI
// ===================================================
// controllers/dataJemaatController.js
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

      pd.kodeRiwayatPendidikan,
      pd.jenjangPendidikan,
      pd.namaInstitusi,
      pd.tahunLulus,

      dp.jabatan AS jabatanPendeta,
      dp.sertifikatPendeta,
      
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
    LEFT JOIN dataRiwayatPendidikan pd ON j.kodeJemaat = pd.kodeJemaat
    LEFT JOIN dataPendeta dp ON j.kodeJemaat = dp.kodeJemaat
    LEFT JOIN dataRiwayatPendeta drp ON dp.kodePendeta = drp.kodePendeta
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error getAllJemaat:", err);
      return res.status(500).json({ message: "Gagal mengambil data jemaat", err });
    }

    // Mapping jemaat + pendidikanList
    const jemaatMap = {};
    results.forEach((row) => {
      if (!jemaatMap[row.kodeJemaat]) {
        jemaatMap[row.kodeJemaat] = {
          ...row,
          pendidikanList: [],
          riwayatPendetaList: [],
        };
      }

      // Pendidikan
      if (row.jenjangPendidikan) {
        jemaatMap[row.kodeJemaat].pendidikanList.push({
          kodeRiwayatPendidikan: row.kodeRiwayatPendidikan,
          jenjangPendidikan: row.jenjangPendidikan,
          namaInstitusi: row.namaInstitusi,
          tahunLulus: row.tahunLulus,
        });
      }

      // Riwayat Pendeta
      if (row.namaGereja) {
        jemaatMap[row.kodeJemaat].riwayatPendetaList.push({
          namaGereja: row.namaGereja,
          tahunMulai: row.tahunMulai,
          tahunSelesai: row.tahunSelesai,
        });
      }

      // Hapus field sementara
      delete jemaatMap[row.kodeJemaat].jenjangPendidikan;
      delete jemaatMap[row.kodeJemaat].namaInstitusi;
      delete jemaatMap[row.kodeJemaat].tahunLulus;
      delete jemaatMap[row.kodeJemaat].kodeRiwayatPendidikan;
      delete jemaatMap[row.kodeJemaat].namaGereja;
      delete jemaatMap[row.kodeJemaat].tahunMulai;
      delete jemaatMap[row.kodeJemaat].tahunSelesai;
    });

    res.json(Object.values(jemaatMap));
  });
};

// ===================================================
// UPDATE DATA JEMAAT LENGKAP
// ===================================================
// Pastikan folder sertifikat/foto ada
const ensureFolderExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// ===================================================
// UPDATE DATA JEMAAT — FINAL VERSION (DB BARU)
// ===================================================
export const updateJemaat = async (req, res) => {
  const { kodeJemaat } = req.params;

  if (!kodeJemaat) {
    return res.status(400).json({ message: "kodeJemaat tidak diberikan" });
  }

  const promisePool = db.promise();

  try {
    // ==============================
    // 1. Ambil data lama jemaat
    // ==============================
    const [rows] = await promisePool.query(
      `SELECT * FROM dataJemaat WHERE kodeJemaat=?`,
      [kodeJemaat]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data jemaat tidak ditemukan" });
    }

    const old = rows[0];

    // ==============================
    // 2. Persiapan data baru
    // ==============================
    let {
      namaLengkap,
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      agama,
      golonganDarah,
      wargaNegara,
      nomorTelepon,
      alamat,
      namaPepanthan,
      namaPekerjaan,
      jabatan,
      namaPelayanan,
    } = req.body;

    // format tanggal
    if (tanggalLahir?.includes("T")) {
      tanggalLahir = tanggalLahir.split("T")[0];
    }

    nomorTelepon = nomorTelepon?.trim() || old.nomorTelepon;

    // ==============================
    // 3. FOTO jemaat
    // ==============================
    let finalFoto = old.foto;
    if (req.files?.foto?.[0]) {
      finalFoto = path
        .relative(process.cwd(), req.files.foto[0].path)
        .replace(/\\/g, "/");
    }

    // ==============================
    // 4. UPDATE dataJemaat
    // ==============================
    await promisePool.query(
      `
      UPDATE dataJemaat SET
        namaLengkap=?, tempatLahir=?, tanggalLahir=?, jenisKelamin=?,
        agama=?, golonganDarah=?, wargaNegara=?, nomorTelepon=?, alamat=?, foto=?
      WHERE kodeJemaat=?
    `,
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
        kodeJemaat,
      ]
    );

    // ==============================
    // 5. UPDATE/INSERT Pepanthan
    // ==============================
    if (namaPepanthan?.trim()) {
      const [p] = await promisePool.query(
        `SELECT * FROM dataPepanthan WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (p.length) {
        await promisePool.query(
          `UPDATE dataPepanthan SET namaPepanthan=? WHERE kodeJemaat=?`,
          [namaPepanthan, kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?,?)`,
          [kodeJemaat, namaPepanthan]
        );
      }
    }

    // ==============================
    // 6. Pelayanan — array / string / json
    // ==============================
    if (namaPelayanan) {
      let pelayananStr = "";

      if (Array.isArray(namaPelayanan)) pelayananStr = namaPelayanan.join(", ");
      else {
        try {
          const parsed = JSON.parse(namaPelayanan);
          pelayananStr = Array.isArray(parsed)
            ? parsed.join(", ")
            : parsed.toString();
        } catch {
          pelayananStr = namaPelayanan;
        }
      }

      const [pel] = await promisePool.query(
        `SELECT * FROM dataPelayanan WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (pel.length) {
        await promisePool.query(
          `UPDATE dataPelayanan SET namaPelayanan=? WHERE kodeJemaat=?`,
          [pelayananStr, kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?,?)`,
          [kodeJemaat, pelayananStr]
        );
      }
    }

    // ==============================
    // 7. Pekerjaan
    // ==============================
    if (namaPekerjaan || jabatan) {
      const [pk] = await promisePool.query(
        `SELECT * FROM dataPekerjaan WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      if (pk.length) {
        await promisePool.query(
          `UPDATE dataPekerjaan SET namaPekerjaan=?, jabatan=? WHERE kodeJemaat=?`,
          [namaPekerjaan || "", jabatan || "", kodeJemaat]
        );
      } else {
        await promisePool.query(
          `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?,?,?)`,
          [kodeJemaat, namaPekerjaan || "", jabatan || ""]
        );
      }
    }

    // ==============================
    // 8. PENDIDIKAN
    // ==============================
    let pendidikanList = [];

    if (req.body.pendidikanList) {
      let raw = req.body.pendidikanList;

      try {
        if (typeof raw === "string") raw = JSON.parse(raw);
      } catch {}

      if (Array.isArray(raw)) pendidikanList = raw;
      else if (typeof raw === "object") pendidikanList = [raw];
    }

    // Hapus pendidikan lama yang tidak ada di list baru
    const [existingPend] = await promisePool.query(
      `SELECT kodeRiwayatPendidikan FROM dataRiwayatPendidikan WHERE kodeJemaat=?`,
      [kodeJemaat]
    );

    const oldIds = existingPend.map((r) => r.kodeRiwayatPendidikan);
    const newIds = pendidikanList
      .filter((p) => p.kodeRiwayatPendidikan)
      .map((p) => p.kodeRiwayatPendidikan);

    const toDelete = oldIds.filter((id) => !newIds.includes(id));

    if (toDelete.length) {
      await promisePool.query(
        `DELETE FROM dataRiwayatPendidikan WHERE kodeRiwayatPendidikan IN (?) AND kodeJemaat=?`,
        [toDelete, kodeJemaat]
      );
    }

    // Insert/update pendidikan baru
    for (const p of pendidikanList) {
      const { kodeRiwayatPendidikan, jenjangPendidikan, namaInstitusi, tahunLulus } = p;

      if (kodeRiwayatPendidikan) {
        await promisePool.query(
          `UPDATE dataRiwayatPendidikan 
           SET jenjangPendidikan=?, namaInstitusi=?, tahunLulus=?
           WHERE kodeRiwayatPendidikan=? AND kodeJemaat=?`,
          [
            jenjangPendidikan || "",
            namaInstitusi || "",
            tahunLulus || null,
            kodeRiwayatPendidikan,
            kodeJemaat,
          ]
        );
      } else if (jenjangPendidikan?.trim() || namaInstitusi?.trim()) {
        await promisePool.query(
          `INSERT INTO dataRiwayatPendidikan 
           (kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus)
           VALUES (?,?,?,?)`,
          [kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus || null]
        );
      }
    }

    // ==============================
    // 9. SERTIFIKAT (Baptis, Sidi, Nikah)
    // ==============================
    let deleteStatus = req.body.deleteStatus;

    try {
      if (typeof deleteStatus === "string")
        deleteStatus = JSON.parse(deleteStatus);
    } catch {}

    if (!Array.isArray(deleteStatus)) deleteStatus = [];

    const sertifikatMap = {
      baptis: {
        table: "dataBaptis",
        status: "statusBaptis",
        sertifikat: "sertifikatBaptis",
        value: "Baptis",
        defaultValue: "Belum Baptis",
        file: req.files?.sertifikatBaptis?.[0],
      },
      sidi: {
        table: "dataSidi",
        status: "statusSidi",
        sertifikat: "sertifikatSidi",
        value: "Sidi",
        defaultValue: "Belum Sidi",
        file: req.files?.sertifikatSidi?.[0],
      },
      nikah: {
        table: "dataNikah",
        status: "statusNikah",
        sertifikat: "sertifikatNikah",
        value: "Nikah",
        defaultValue: "Belum Nikah",
        file: req.files?.sertifikatNikah?.[0],
      },
    };

    for (const key of Object.keys(sertifikatMap)) {
      const item = sertifikatMap[key];
      const filePath = item.file
        ? path.relative(process.cwd(), item.file.path).replace(/\\/g, "/")
        : null;

      const [ex] = await promisePool.query(
        `SELECT ${item.status}, ${item.sertifikat} FROM ${item.table} WHERE kodeJemaat=?`,
        [kodeJemaat]
      );

      let newStatus = ex.length ? ex[0][item.status] : item.defaultValue;
      let newFile = ex.length ? ex[0][item.sertifikat] : null;

      if (deleteStatus.includes(key)) {
        newStatus = item.defaultValue;
        newFile = null;
      } else if (filePath) {
        newStatus = item.value;
        newFile = filePath;
      }

      if (filePath || deleteStatus.includes(key)) {
        await promisePool.query(
          `
          INSERT INTO ${item.table} 
          (kodeJemaat, ${item.status}, ${item.sertifikat})
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            ${item.status}=VALUES(${item.status}),
            ${item.sertifikat}=VALUES(${item.sertifikat})
        `,
          [kodeJemaat, newStatus, newFile]
        );
      }
    }

    res.json({
      message: "✅ Data jemaat berhasil diperbarui (Full, DB Baru)!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update jemaat", error: err });
  }
};


// ===================================================
// DELETE DATA JEMAAT (Versi FINAL dan BENAR)
// ===================================================
export const hapusJemaat = async (req, res) => {
    const { kodeJemaat } = req.params;
    if (!kodeJemaat) return res.status(400).json({ message: "kodeJemaat tidak diberikan" });

    const promisePool = db.promise();

    try {
        // ===================================================
        // 1. Ambil Data Jemaat + Semua File untuk Dihapus
        // ===================================================
        const [jemaatRows] = await promisePool.query(`
            SELECT 
                j.NIK,
                j.foto,
                b.sertifikatBaptis,
                s.sertifikatSidi,
                n.sertifikatNikah,
                p.sertifikatPendeta,
                p.kodePendeta
            FROM dataJemaat j
            LEFT JOIN dataBaptis b ON j.NIK = b.NIK
            LEFT JOIN dataSidi s ON j.NIK = s.NIK
            LEFT JOIN dataNikah n ON j.NIK = n.NIK
            LEFT JOIN dataPendeta p ON j.NIK = p.NIK
            WHERE j.kodeJemaat = ?
        `, [kodeJemaat]);

        if (jemaatRows.length === 0) {
            return res.status(404).json({ message: "Data jemaat tidak ditemukan." });
        }

        const row = jemaatRows[0];
        const NIK = row.NIK;
        const kodePendeta = row.kodePendeta;

        const pathsToDelete = [];
        if (row.foto) pathsToDelete.push(row.foto);
        if (row.sertifikatBaptis) pathsToDelete.push(row.sertifikatBaptis);
        if (row.sertifikatSidi) pathsToDelete.push(row.sertifikatSidi);
        if (row.sertifikatNikah) pathsToDelete.push(row.sertifikatNikah);
        if (row.sertifikatPendeta) pathsToDelete.push(row.sertifikatPendeta);

        // ===================================================
        // 2. Semua tabel yang menggunakan NIK
        // ===================================================
        const tablesUsingNIK = [
            "dataBaptis",
            "dataSidi",
            "dataNikah",
            "dataPekerjaan",
            "dataPelayanan",
            "dataPepanthan",
            "dataRiwayatPendidikan",
            "dataPendeta"
        ];

        for (const table of tablesUsingNIK) {
            await promisePool.query(`DELETE FROM ${table} WHERE NIK=?`, [NIK]);
        }

        // ===================================================
        // 3. Hapus riwayat pendeta yang memakai kodePendeta
        // ===================================================
        if (kodePendeta) {
            await promisePool.query(`DELETE FROM dataRiwayatPendeta WHERE kodePendeta=?`, [kodePendeta]);
        }

        // ===================================================
        // 4. Hapus data jemaat (TERAKHIR)
        // ===================================================
        await promisePool.query(`DELETE FROM dataJemaat WHERE kodeJemaat=?`, [kodeJemaat]);

        // ===================================================
        // 5. Hapus file fisik
        // ===================================================
        const deleteFilePromises = pathsToDelete.map(async (filePath) => {
            try {
                const absolutePath = path.join(process.cwd(), filePath);
                if (fs.existsSync(absolutePath)) {
                    await unlink(absolutePath);
                }
            } catch (err) {
                console.warn(`⚠️ Gagal menghapus file ${filePath}:`, err.message);
            }
        });
        await Promise.all(deleteFilePromises);

        res.json({ message: "✅ Jemaat berhasil dihapus beserta semua relasi & file!" });

    } catch (err) {
        console.error("❌ Error hapus jemaat:", err);
        res.status(500).json({
            message: "Gagal menghapus jemaat. Cek relasi atau struktur tabel.",
            err
        });
    }
};




// ===================================================
// TAMBAH JEMAAT (FULL VERSION)
// ===================================================
export const tambahJemaat = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

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

    // ============================
    // FILE UPLOAD HANDLING
    // ============================
    const foto = req.files?.foto?.[0]
      ? `uploads/fotoProfil/${req.files.foto[0].filename}`
      : null;

    const sertifikatNikah = req.files?.sertifikatNikah?.[0]
      ? `uploads/sertifikat/nikah/${req.files.sertifikatNikah[0].filename}`
      : null;

    const sertifikatSidi = req.files?.sertifikatSidi?.[0]
      ? `uploads/sertifikat/sidi/${req.files.sertifikatSidi[0].filename}`
      : null;

    const sertifikatBaptis = req.files?.sertifikatBaptis?.[0]
      ? `uploads/sertifikat/baptis/${req.files.sertifikatBaptis[0].filename}`
      : null;

    // ============================
    // PARSE pendidikanList
    // ============================
    let pendidikanList = [];
    if (req.body.pendidikan) {
      try {
        pendidikanList = JSON.parse(req.body.pendidikan);
      } catch {
        pendidikanList = [];
      }
    }

    // ============================
    // PARSE namaPelayanan
    // (ambil hanya elemen pertama)
    // ============================
    let pelayananStr = "";
    if (namaPelayanan) {
      if (Array.isArray(namaPelayanan)) {
        pelayananStr = namaPelayanan[0];
      } else {
        try {
          const parsed = JSON.parse(namaPelayanan);
          pelayananStr = Array.isArray(parsed) ? parsed[0] : parsed;
        } catch {
          pelayananStr = namaPelayanan;
        }
      }

      // hapus tanda kutip
      pelayananStr = pelayananStr.replace(/^["']?(.*?)["']?$/, "$1");
    }

    // ============================
    // INSERT dataJemaat
    // ============================
    const queryJemaat = `
      INSERT INTO dataJemaat 
      (kodeJemaat, namaLengkap, tempatLahir, tanggalLahir, jenisKelamin, agama, golonganDarah, nomorTelepon, alamat, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.promise().query(queryJemaat, [
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
    ]);

    // ============================
    // INSERT status NIKAH
    // ============================
    if (statusNikah) {
      await db.promise().query(
        `INSERT INTO dataNikah (kodeJemaat, statusNikah, sertifikatNikah) VALUES (?, ?, ?)`,
        [kodeJemaat, statusNikah, sertifikatNikah]
      );
    }

    // ============================
    // INSERT status SIDI
    // ============================
    if (statusSidi) {
      await db.promise().query(
        `INSERT INTO dataSidi (kodeJemaat, statusSidi, sertifikatSidi) VALUES (?, ?, ?)`,
        [kodeJemaat, statusSidi, sertifikatSidi]
      );
    }

    // ============================
    // INSERT status BAPTIS
    // ============================
    if (statusBaptis) {
      await db.promise().query(
        `INSERT INTO dataBaptis (kodeJemaat, statusBaptis, sertifikatBaptis) VALUES (?, ?, ?)`,
        [kodeJemaat, statusBaptis, sertifikatBaptis]
      );
    }

    // ============================
    // INSERT PEPANTHAN
    // ============================
    if (pepanthan) {
      await db.promise().query(
        `INSERT INTO dataPepanthan (kodeJemaat, namaPepanthan) VALUES (?, ?)`,
        [kodeJemaat, pepanthan]
      );
    }

    // ============================
    // INSERT PEKERJAAN
    // ============================
    if (namaPekerjaan || jabatan) {
      await db.promise().query(
        `INSERT INTO dataPekerjaan (kodeJemaat, namaPekerjaan, jabatan) VALUES (?, ?, ?)`,
        [kodeJemaat, namaPekerjaan || "", jabatan || ""]
      );
    }

    // ============================
    // INSERT PELAYANAN
    // ============================
    if (pelayananStr) {
      await db.promise().query(
        `INSERT INTO dataPelayanan (kodeJemaat, namaPelayanan) VALUES (?, ?)`,
        [kodeJemaat, pelayananStr]
      );
    }

    // ============================
    // INSERT PENDIDIKAN LIST
    // ============================
    for (const p of pendidikanList) {
      const { jenjangPendidikan, namaInstitusi, tahunLulus } = p;

      if (jenjangPendidikan?.trim() || namaInstitusi?.trim()) {
        await db.promise().query(
          `
          INSERT INTO dataRiwayatPendidikan 
          (kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus)
          VALUES (?, ?, ?, ?)
        `,
          [
            kodeJemaat,
            jenjangPendidikan || "",
            namaInstitusi || "",
            tahunLulus || null
          ]
        );
      }
    }

    res.json({ message: "✅ Data jemaat berhasil ditambahkan!" });
  } catch (err) {
    console.error("❌ ERROR TAMBAH JEMAAT:", err);
    res.status(500).json({ message: "Gagal menambah data jemaat", err });
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

    const pendidikanList = req.body.pendidikan ? JSON.parse(req.body.pendidikan) : [];
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

            // Pendidikan List
            pendidikanList.forEach((p) => {
                criticalInserts.push(
                    promisePool.query(
                        `INSERT INTO dataRiwayatPendidikan (kodeJemaat, jenjangPendidikan, namaInstitusi, tahunLulus) VALUES (?, ?, ?, ?)`,
                        [kodeJemaat, p.jenjangPendidikan, p.namaInstitusi, p.tahunLulus]
                    )
                );
            });

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