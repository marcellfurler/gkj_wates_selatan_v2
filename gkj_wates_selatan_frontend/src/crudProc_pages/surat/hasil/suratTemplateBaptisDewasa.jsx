import React, { useEffect, useState } from "react"; // ✅ PERBAIKAN: Tambahkan useEffect & useState
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";
import { printSurat } from "../../../components/printSurat";

const SuratTemplateBaptisDewasa = () => { // 💡 Pastikan nama komponen konsisten
    // 💡 SEMUA HOOK HARUS DI SINI (TOP LEVEL)
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Ambil data state dari useLocation
    const dataDariState = location.state;
    
    // ✅ Tambahkan logika untuk adaPasangan
    const adaPasangan = !!data.namaPasangan; // Akan bernilai true jika namaPasangan memiliki string

    // Fetch data surat dari backend
    useEffect(() => {
        const idSuratDariDaftar = localStorage.getItem("idSuratPrint");
        
        if (idSuratDariDaftar) {
            console.log("Mendeteksi ID Print dari localStorage:", idSuratDariDaftar);
            
            fetch(`http://localhost:5000/api/surat/${idSuratDariDaftar}`) 
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data surat dari DB");
                    return res.json();
                })
                .then((result) => {
                    setData(result.data_input_json); 
                })
                .catch((err) => {
                    console.error("Gagal load detail surat:", err);
                    alert("Gagal memuat data surat: " + err.message);
                })
                .finally(() => {
                    setIsLoading(false);
                    localStorage.removeItem("idSuratPrint"); 
                });

        } else if (dataDariState) {
            // Jika datang dari tombol "Kirim Permohonan" (surat baru)
            console.log("Mendeteksi data dari state (surat baru)");
            setData(dataDariState);
            setIsLoading(false);

        } else {
            // Default jika tidak ada ID dan tidak ada state
            console.log("Mode pratinjau kosong/default");
            setData({});
            setIsLoading(false);
        }

    }, [dataDariState]);


    // ... (formatTanggalIndonesia) ...
    const formatTanggalIndonesia = (tanggal) => {
        if (!tanggal) return "..................";
        const date = new Date(tanggal);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
    };

    const handlePrint = () => {
        // PERHATIAN: Pastikan ID elemen dan nama file konsisten
        printSurat(
            "surat-baptis-dewasa", // ID elemen yang akan dicetak
            `Surat-Permohonan-Baptis-Dewasa_${data.nama || "TanpaNama"}`
        );
    };

    if (isLoading) {
        return (
            <div>
                <NavbarComponent />
                <div className="container mt-5 text-center">
                    <p>Memuat data surat...</p>
                </div>
            </div>
        );
    }

  return (
    <div>
      <NavbarComponent />

      {/* Tombol Navigasi & Aksi */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3 no-print">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <div>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* === SURAT === */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eaeaea",
          padding: "10px 0",
        }}
      >
        <div
          id="surat-baptis-dewasa"
          style={{
            width: "210mm",
            height: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20mm 18mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.3",
            color: "#000",
            boxSizing: "border-box",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
            textAlign: "justify",
          }}
        >
          {/* === Header === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.Bts DEWASA
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PENGAKUAN PERCAYA DAN BAPTIS DEWASA
          </p>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>
            Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari
            Tuhan Yesus Kristus, maka melalui surat ini perkenankanlah saya :
          </p>

          {/* === Data Jemaat === */}
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Nama</td>
                <td>: {data.nama || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>
                  : {data.tempatLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamat || "................................................"}</td>
              </tr>
              <tr>
                <td>Nama Orang Tua</td>
              </tr>
              <tr>
                <td>    Ayah</td>
                <td>: {data.namaAyah || "................................................"}</td>
              </tr>
              <tr>
                <td>    Ibu</td>
                <td>: {data.namaIbu || "................................................"}</td>
              </tr>

              {/* Tampilkan bagian pasangan hanya jika ada */}
              {adaPasangan && (
                <>
                  <tr>
                    <td>Nama Istri / Suami</td>
                    <td>: {data.namaPasangan}</td>
                  </tr>
                  <tr>
                    <td>Tempat, Tanggal Nikah</td>
                    <td>
                      : {data.tempatNikah || ".................."},{" "}
                      {formatTanggalIndonesia(data.tanggalNikah)}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar
            berkenan memberikan pelayanan Pengakuan Percaya dan Baptis Dewasa.
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Hari / Tanggal</td>
                <td>
                  : {data.hariPelayanan || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalPelayanan)}
                </td>
              </tr>
              <tr>
                <td>Waktu / Pukul</td>
                <td>: {data.waktuPelayanan || ".................."}</td>
              </tr>
              <tr>
                <td>Tempat</td>
                <td>: {data.tempatPelayanan || ".................."}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Selanjutnya perlu Yang Terhormat Majelis GKJ Wates Selatan ketahui,
            bahwa untuk keperluan tersebut saya telah menyelesaikan program
            katekisasi di bawah bimbingan {data.pembimbing || "................................................"}.
            <br />
            Demikian surat permohonan pelayanan Pengakuan Percaya dan Baptis Dewasa
            saya, atas perkenannya permohonan ini, saya ucapkan terima kasih.
            Kiranya Tuhan memberkati kita sekalian. Amin.
          </p>

          {/* === Tanda Tangan === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "100px",
                marginTop: "60px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
                  {data.pembimbing || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Pembimbing Katekisasi</div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
                  {data.nama || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Pemohon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplateBaptisDewasa;
