import { db } from "../config/db.js";

// ==============================
// CREATE - Buat Surat Baru
// ==============================
export const buatSuratBaru = async (req, res) => {
  try {
    const { kodeTipeSurat, judul_surat, data_input_json } = req.body;

    if (!kodeTipeSurat || !data_input_json) {
      return res.status(400).json({ message: "Kolom wajib diisi!" });
    }

    const dataString = JSON.stringify(data_input_json);
    const judul = judul_surat || "Surat Tanpa Judul";

    const [result] = await db.query(
      "INSERT INTO dataSurat (kodeTipeSurat, judul_surat, data_input_json) VALUES (?, ?, ?)",
      [kodeTipeSurat, judul, dataString]
    );

    res.status(201).json({
      message: "Surat berhasil ditambahkan",
      kodeDataSurat: result.insertId
    });

  } catch (err) {
    console.error("❌ Error Insert Surat:", err);
    res.status(500).json({ message: "Gagal membuat surat", error: err.message });
  }
};

// ==============================
// READ - Ambil Semua Surat
// ==============================
export const getSemuaSurat = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM dataSurat ORDER BY kodeDataSurat DESC"
    );

    const parsedResult = result.map(r => ({
      ...r,
      data_input_json: typeof r.data_input_json === "string" 
                         ? JSON.parse(r.data_input_json) 
                         : r.data_input_json
    }));

    res.json(parsedResult);

  } catch (err) {
    console.error("❌ Error GET Semua Surat:", err);
    res.status(500).json({ message: "Gagal mengambil data", error: err.message });
  }
};


// ==============================
// READ - Ambil Surat berdasarkan ID
// ==============================
export const getSuratById = async (req, res) => {
  try {
    const { kodeDataSurat } = req.params;

    const [result] = await db.query(
      "SELECT * FROM dataSurat WHERE kodeDataSurat = ?",
      [kodeDataSurat]
    );

    if (result.length === 0)
      return res.status(404).json({ message: "Surat tidak ditemukan" });

    const surat = result[0];

    // ✅ Hanya parse jika data_input_json masih string
    surat.data_input_json = typeof surat.data_input_json === "string"
                            ? JSON.parse(surat.data_input_json)
                            : surat.data_input_json;

    res.json(surat);

  } catch (err) {
    console.error("❌ Error GET Surat By ID:", err);
    res.status(500).json({ message: "Gagal mengambil data surat", error: err.message });
  }
};


// ==============================
// UPDATE - Edit Surat
// ==============================
export const updateSurat = async (req, res) => {
  try {
    const { kodeDataSurat } = req.params;
    const { judul_surat, data_input_json } = req.body;

    const dataString = JSON.stringify(data_input_json);

    const [result] = await db.query(
      "UPDATE dataSurat SET judul_surat = ?, data_input_json = ? WHERE kodeDataSurat = ?",
      [judul_surat, dataString, kodeDataSurat]
    );

    res.json({ message: "Surat berhasil diperbarui" });

  } catch (err) {
    console.error("❌ Error Update Surat:", err);
    res.status(500).json({ message: "Gagal update surat", error: err.message });
  }
};

// ==============================
// DELETE - Hapus Surat
// ==============================
export const deleteSurat = async (req, res) => {
  try {
    const { kodeDataSurat } = req.params;

    await db.query(
      "DELETE FROM dataSurat WHERE kodeDataSurat = ?",
      [kodeDataSurat]
    );

    res.json({ message: "Surat berhasil dihapus" });

  } catch (err) {
    console.error("❌ Error Delete Surat:", err);
    res.status(500).json({ message: "Gagal menghapus surat", error: err.message });
  }
};
