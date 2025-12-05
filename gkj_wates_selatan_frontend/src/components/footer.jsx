import React, { useEffect, useState } from "react";

const Footer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // --- MAGIC: ubah parent agar layout jadi sticky-footer ---
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.minHeight = "100vh";
    document.getElementById("root").style.display = "flex";
    document.getElementById("root").style.flexDirection = "column";
    document.getElementById("root").style.flexGrow = "1";
    // ----------------------------------------------------------

    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      className="text-center"
      style={{
        padding: "20px",
        marginTop: "auto",   // ⬅ KUNCI UTAMA FOOTER SELALU DI BAWAH
        backgroundColor: "rgba(0,0,0,0.03)",
      }}
    >
      <p className="text-muted small m-0">
        <strong>Nama Website:</strong> Sistem Informasi GKJ Wates Selatan <br />
        <strong>Tanggal:</strong>{" "}
        {time.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        <br />
        <strong>Jam:</strong> {time.toLocaleTimeString("id-ID")}
        <br /><br />

        © {time.getFullYear()} – Dibuat oleh Jimm  
        <br />
        Universitas Kristen Duta Wacana – Fakultas Teknologi Informasi  
        <br />
        Program Studi Informatika
      </p>
    </footer>
  );
};

export default Footer;
