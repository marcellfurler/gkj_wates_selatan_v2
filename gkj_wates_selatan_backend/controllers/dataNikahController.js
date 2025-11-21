// controllers/dataNikahController.js
import { db } from "../config/db.js"; // ✅ tambahkan ini di paling atas

export const getSertifikatNikahBykodeJemaat = (req, res) => {
  const { kodeJemaat } = req.params; // huruf kecil sesuai di routes
  console.log("📥 kodeJemaat diterima dari frontend:", kodeJemaat);

  const query = `
    SELECT sertifikatNikah
    FROM dataNikah
    WHERE kodeJemaat = ?
    LIMIT 1
  `;

  db.query(query, [kodeJemaat], (err, results) => {
    if (err) {
      console.error("❌ Gagal mengambil sertifikat nikah:", err);
      return res.status(500).json({ message: "Gagal mengambil data sertifikat nikah" });
    }

    if (results.length === 0) {
      console.log("⚠️ Tidak ada sertifikat untuk kodeJemaat:", kodeJemaat);
      return res.status(404).json({ message: "Sertifikat nikah tidak ditemukan" });
    }

    const sertifikatPath = results[0].sertifikatNikah;
    const fullUrl = `http://localhost:5000/${sertifikatPath.replace(/\\/g, "/")}`;
    console.log("✅ URL sertifikat dikirim ke frontend:", fullUrl);

    res.json({ sertifikatNikah: fullUrl });
  });
};
