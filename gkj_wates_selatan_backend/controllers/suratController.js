import { db } from "../config/db.js";

// ==============================
// CREATE - Buat Surat Baru
// ==============================
export const buatSuratBaru = (req, res) => {
  const { kodeTipeSurat, judul_surat, data_input_json } = req.body;

  if (!kodeTipeSurat || !data_input_json) {
    return res.status(400).json({ message: "Kolom wajib kosong!" });
  }

  const dataString = JSON.stringify(data_input_json);
  const judul = judul_surat || "Surat Tanpa Judul";

  const query = `
    INSERT INTO dataSurat (kodeTipeSurat, judul_surat, data_input_json)
    VALUES (?, ?, ?)`;

  db.query(query, [kodeTipeSurat, judul, dataString], (err, result) => {
    if (err) {
      console.error("❌ Error Insert:", err);
      return res.status(500).json({ message: "Gagal membuat surat", error: err.message });
    }

    res.status(201).json({
      message: "Surat berhasil ditambahkan",
      kodeDataSurat: result.insertId
    });
  });
};


// ==============================
// READ - Ambil Semua Surat
// ==============================
export const getSemuaSurat = (req, res) => {
  db.query("SELECT * FROM dataSurat ORDER BY kodeDataSurat DESC", (err, result) => {
    if (err) {
      console.error("❌ Error GET:", err);
      return res.status(500).json({ message: "Gagal mengambil data" });
    }

    res.json(result);
  });
};


// ==============================
// READ - Ambil Surat berdasarkan ID
// ==============================
// suratController.js

export const getSuratById = (req, res) => {
  const { kodeDataSurat } = req.params; 
  const id = kodeDataSurat; 

  db.query("SELECT * FROM dataSurat WHERE kodeDataSurat = ?", [id], (err, result) => { 
    if (err) {
        console.error("❌ Error GET by ID:", err);
        return res.status(500).json({ error: err.message });
    }

    if (result.length === 0)
      return res.status(404).json({ message: "Surat tidak ditemukan" });

    // 🛑 HAPUS BLOK TRY...CATCH (yang berisi JSON.parse)
    // Driver MySQL Anda sudah melakukan parsing!
    const surat = result[0];
    
    // Ganti dengan console log untuk memastikan data sudah berupa objek:
    console.log("✅ Data surat berhasil diambil dan sudah berbentuk Objek JS.");

    res.json(surat); // Sekarang 'surat.data_input_json' adalah objek
  });
};



// ==============================
// UPDATE - Edit Surat
// ==============================
export const updateSurat = (req, res) => {
  const { kodeDataSurat } = req.params;
  const { judul_surat, data_input_json } = req.body;

  const dataString = JSON.stringify(data_input_json);

  const query = `
    UPDATE dataSurat 
    SET judul_surat = ?, data_input_json = ?
    WHERE kodeDataSurat = ?
  `;

  db.query(query, [judul_surat, dataString, kodeDataSurat], (err, result) => {
    if (err) {
      console.error("❌ Error Update:", err);
      return res.status(500).json({ message: "Gagal update surat" });
    }

    res.json({ message: "Surat berhasil diperbarui" });
  });
};


// ==============================
// DELETE - Hapus Surat
// ==============================
export const deleteSurat = (req, res) => {
  const { kodeDataSurat } = req.params;

  const query = "DELETE FROM dataSurat WHERE kodeDataSurat = ?";

  db.query(query, [kodeDataSurat], (err, result) => {
    if (err) {
      console.error("❌ Error saat menghapus surat:", err);
      return res.status(500).json({ message: "Gagal menghapus surat." });
    }

    res.json({ message: "Surat berhasil dihapus." });
  });
};



export const getDetailSurat = (req, res) => {
    const { id } = req.params;

    const query = "SELECT * FROM dataSurat WHERE kodeDataSurat = ?";
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0)
            return res.status(404).json({ message: "Surat tidak ditemukan" });

        // Parse kolom JSON
        const surat = result[0];
        surat.data_input_json = JSON.parse(surat.data_input_json);

        res.json(surat);
    });
};

