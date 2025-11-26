import { db } from "../config/db.js";

/* ============================
   TOTAL JEMAAT
============================ */
export const getTotalJemaat = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS total FROM dataJemaat
    `);

    res.json({ total: rows[0].total });
  } catch (err) {
    console.error("Error total jemaat:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   STATISTIK PEPANTHAN
============================ */
export const getStatistikPepanthan = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.namaPepanthan,
        COUNT(p.kodeJemaat) AS jumlah
      FROM dataPepanthan p
      GROUP BY p.namaPepanthan
      ORDER BY jumlah DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error statistik pepanthan:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   STATISTIK BAPTIS
============================ */
export const getStatistikBaptis = async (req, res) => {
  try {
    const [[sudah]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataBaptis 
      WHERE statusBaptis = 'Baptis'
    `);

    const [[belum]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataBaptis 
      WHERE statusBaptis = 'Belum Baptis'
    `);

    const [rincian] = await db.query(`
      SELECT p.namaPepanthan, COUNT(b.kodeJemaat) AS jumlah
      FROM dataBaptis b
      JOIN dataPepanthan p ON b.kodeJemaat = p.kodeJemaat
      WHERE b.statusBaptis = 'Baptis'
      GROUP BY p.namaPepanthan
    `);

    res.json({
      sudah: sudah.jumlah,
      belum: belum.jumlah,
      rincianPepanthan: rincian
    });

  } catch (err) {
    console.error("Error getStatistikBaptis:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   STATISTIK SIDI
============================ */
export const getStatistikSidi = async (req, res) => {
  try {
    const [[sudah]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataSidi 
      WHERE statusSidi = 'Sidi'
    `);

    const [[belum]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataSidi 
      WHERE statusSidi = 'Belum Sidi'
    `);

    const [rincian] = await db.query(`
      SELECT p.namaPepanthan, COUNT(s.kodeJemaat) AS jumlah
      FROM dataSidi s
      JOIN dataPepanthan p ON s.kodeJemaat = p.kodeJemaat
      WHERE s.statusSidi = 'Sidi'
      GROUP BY p.namaPepanthan
    `);

    res.json({
      sudah: sudah.jumlah,
      belum: belum.jumlah,
      rincianPepanthan: rincian
    });

  } catch (err) {
    console.error("Error getStatistikSidi:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================
   STATISTIK NIKAH
============================ */
export const getStatistikNikah = async (req, res) => {
  try {
    const [[nikah]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataNikah 
      WHERE statusNikah = 'Nikah'
    `);

    const [[belumNikah]] = await db.query(`
      SELECT COUNT(*) AS jumlah 
      FROM dataNikah 
      WHERE statusNikah = 'Belum Nikah'
    `);

    const [rincian] = await db.query(`
      SELECT p.namaPepanthan, COUNT(n.kodeJemaat) AS jumlah
      FROM dataNikah n
      JOIN dataPepanthan p ON n.kodeJemaat = p.kodeJemaat
      WHERE n.statusNikah = 'Nikah'
      GROUP BY p.namaPepanthan
    `);

    res.json({
      nikah: nikah.jumlah,
      belumNikah: belumNikah.jumlah,
      rincianPepanthan: rincian
    });

  } catch (err) {
    console.error("Error getStatistikNikah:", err);
    res.status(500).json({ message: "Server error" });
  }
};
