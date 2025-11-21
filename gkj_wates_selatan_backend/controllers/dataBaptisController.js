import { db } from "../config/db.js"; // pastikan file db.js ada dan tersambung ke MySQL

export const getSertifikatBaptisBykodeJemaat = (req, res) => {
  const { kodeJemaat } = req.params;
  console.log("📥 NIK diterima dari frontend (Baptis):", kodeJemaat);

  const query = `
    SELECT sertifikatBaptis
    FROM dataBaptis
    WHERE kodeJemaat = ?
    LIMIT 1
  `;

  db.query(query, [kodeJemaat], (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil sertifikat baptis:", err);
      return res.status(500).json({ message: "Gagal mengambil data sertifikat baptis" });
    }

    if (results.length === 0) {
      console.log("⚠️ Tidak ada sertifikat untuk NIK:", kodeJemaat);
      return res.status(404).json({ message: "Sertifikat baptis tidak ditemukan" });
    }

    const sertifikatPath = results[0].sertifikatBaptis;
    const fullUrl = `http://localhost:5000/${sertifikatPath.replace(/\\/g, "/")}`.toLowerCase();
    console.log("✅ URL sertifikat baptis dikirim ke frontend:", fullUrl);

    res.json({ sertifikatBaptis: fullUrl });
  });
};