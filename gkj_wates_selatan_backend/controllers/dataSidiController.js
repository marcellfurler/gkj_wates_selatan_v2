import { db } from "../config/db.js"; // ✅ pastikan ini ada

export const getSertifikatSidiBykodeJemaat = (req, res) => {
  const { kodeJemaat } = req.params; // ✅ param huruf kecil
  console.log("📥 NIK diterima dari frontend (Sidi):", kodeJemaat);

  const query = `
    SELECT sertifikatSidi
    FROM dataSidi
    WHERE kodeJemaat = ?
    LIMIT 1
  `;

  db.query(query, [kodeJemaat], (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil sertifikat sidi:", err);
      return res.status(500).json({ message: "Gagal mengambil data sertifikat sidi" });
    }

    if (results.length === 0) {
      console.log("⚠️ Tidak ada sertifikat untuk kodeJemaat:", kodeJemaat);
      return res.status(404).json({ message: "Sertifikat sidi tidak ditemukan" });
    }

    const sertifikatPath = results[0].sertifikatSidi;
    const fullUrl = `http://localhost:5000/${sertifikatPath.replace(/\\/g, "/")}`;
    console.log("✅ URL sertifikat dikirim ke frontend:", fullUrl);

    res.json({ sertifikatSidi: fullUrl });
  });
};
