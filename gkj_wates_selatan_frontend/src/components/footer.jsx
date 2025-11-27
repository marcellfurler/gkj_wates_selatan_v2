import React, { useEffect, useState } from "react";

const Footer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer
      className="text-center"
      style={{
        padding: "20px",
        marginTop: "30px",
        backgroundColor: "rgba(0,0,0,0.03)",
        borderRadius: "10px",
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
