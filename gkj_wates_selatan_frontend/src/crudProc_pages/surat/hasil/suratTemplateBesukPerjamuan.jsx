import React, { useEffect, useState } from "react"; // ✅ DITAMBAH: useEffect & useState
import { useLocation, useNavigate } from "react-router-dom";
import { NavbarComponent } from "../../../components/NavbarComponent";
import html2pdf from "html2pdf.js";
import { printSurat } from "../../../components/printSurat";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const SuratTemplateBesukPerjamuan = () => { 
    // 💡 SEMUA HOOK HARUS DI SINI (TOP LEVEL)
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Ambil data state dari useLocation
    const dataDariState = location.state;
    
    // ✅ DEKLARASI VARIABEL DARI STATE UNTUK DIGUNAKAN DI RETURN
    // Logika untuk Besuk Perjamuan biasanya berfokus pada daftar array dalam data
    const daftarHadir = data.daftarHadir || []; // Diambil dari data_input_json
    const tidakHadir = data.tidakHadir || [];
    const wilayahLain = data.wilayahLain || [];
    const tamuGereja = data.tamuGereja || [];
    const mengetahui = data.mengetahui || [];
    const jumlahKeseluruhan = data.jumlahKeseluruhan || (daftarHadir.length + wilayahLain.length + tamuGereja.length);
    // Note: Logika adaPasangan (dari contoh sebelumnya) dihapus karena tidak relevan di sini.


    // Fetch data surat dari backend
    useEffect(() => {
        const idSuratDariDaftar = localStorage.getItem("idSuratPrint");
        
        if (idSuratDariDaftar) {
            console.log("Mendeteksi ID Print dari localStorage:", idSuratDariDaftar);
            
            fetch(`${API_BASE}/api/surat/${idSuratDariDaftar}`) 
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal mengambil data surat dari DB");
                    return res.json();
                })
                .then((result) => {
                    // result.data_input_json seharusnya sudah berupa objek karena driver MySQL
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


    // ✅ Fungsi format tanggal ke Indonesia
    const formatTanggalIndonesia = (tanggal) => {
        if (!tanggal) return "..................";
        const date = new Date(tanggal);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
    };

    // ✅ Fungsi Print
    const handlePrint = () => {
        printSurat(
            "laporan-besuk-perjamuan", // ID elemen div yang akan dicetak
            `Laporan-Besuk-Perjamuan_${data.wilayah || "TanpaWilayah"}`
        );
    };

    // === Komponen Tabel Dinamis ===
    const renderTable = (title, list) => (
        <>
            <p style={{ fontWeight: "bold", marginTop: "15px" }}>{title}</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #000", width: "5%" }}>No</th>
                        <th style={{ border: "1px solid #000", width: "45%" }}>Nama</th>
                        <th style={{ border: "1px solid #000" }}>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
                    {list.length > 0 ? (
                        list.map((item, i) => (
                            <tr key={i}>
                                <td style={{ border: "1px solid #000", textAlign: "center" }}>{i + 1}</td>
                                <td style={{ border: "1px solid #000" }}>{item.nama || ".................."}</td>
                                <td style={{ border: "1px solid #000" }}>{item.keterangan || ".................."}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ border: "1px solid #000", textAlign: "center" }}>
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );

    if (isLoading) {
        return (
            <div>
                <NavbarComponent />
                <div className="container mt-5 text-center">
                    <p>Memuat data laporan dari database...</p>
                </div>
            </div>
        );
    }

  return (
    <div>
      <NavbarComponent />

      {/* Tombol Aksi */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      {/* Halaman Preview */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eee",
          padding: "20px 0",
        }}
      >
        <div
          id="laporan-besuk-perjamuan"
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            padding: "20mm",
            border: "1px solid #ccc",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            color: "#000",
            lineHeight: "1.4",
            textAlign: "justify",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}>
            <div>LAPORAN BESUK / PENDADARAN PERJAMUAN KUDUS</div>
            <div>GEREJA KRISTEN JAWA WATES SELATAN</div>
          </div>

          {/* DATA DASAR */}
          <table style={{ width: "100%", marginBottom: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Wilayah / Pepanthan</td>
                <td>: {data.wilayah || ".................."}</td>
              </tr>
              <tr>
                <td>Hari / Tanggal</td>
                <td>: {formatTanggalIndonesia(data.tanggal)}</td>
              </tr>
            </tbody>
          </table>

          {/* STATISTIK */}
          <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
            STATISTIK WARGA PERJAMUAN
          </p>
          <table style={{ width: "100%", marginBottom: "10px" }}>
            <tbody>
              <tr><td>Jumlah Warga Dewasa</td><td>: {data.wargaDewasa || "...."} orang</td></tr>
              <tr><td>Telah di Besuk</td><td>: {data.telahDibesuk || "...."} orang</td></tr>
              <tr><td>Belum di Besuk</td><td>: {data.belumDibesuk || "...."} orang</td></tr>
              <tr><td>Belajar ke lain tempat</td><td>: {data.tempatLain || "...."} orang</td></tr>
              <tr><td>Titipan ke Gereja lain</td><td>: {data.titipan || "...."} orang</td></tr>
            </tbody>
          </table>

          {/* PELAKSANAAN */}
          <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
            PELAKSANAAN PERJAMUAN KUDUS
          </p>
          <table style={{ width: "100%", marginBottom: "10px" }}>
            <tbody>
              <tr><td>Warga yang ikut perjamuan di gereja</td><td>: {data.ikutPerjamuan || "...."} orang</td></tr>
              <tr><td>Pelayanan keliling (warga sakit/jompo)</td><td>: {data.keliling || "...."} orang</td></tr>
            </tbody>
          </table>

          {/* TABEL-TABEL NAMA */}
          {renderTable("Warga yang siap / hadir perjamuan :", daftarHadir)}
          {renderTable("Warga berhalangan / tidak bersedia :", tidakHadir)}
          {renderTable("Dari Wilayah / Pepanthan lain :", wilayahLain)}
          {renderTable("Warga tamu dari gereja lain :", tamuGereja)}

          {/* TOTAL */}
          <p style={{ marginTop: "10px" }}>
            Jumlah pengikut Perjamuan Kudus seluruhnya :
            <b> {jumlahKeseluruhan || "...."} orang</b>
          </p>

          {/* TANDA TANGAN */}
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Mengetahui,<br />Majelis GKJ Wates Selatan
          </p>

          <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", width: "5%" }}>No</th>
                <th style={{ border: "1px solid #000" }}>Nama</th>
                <th style={{ border: "1px solid #000" }}>Tanda Tangan</th>
              </tr>
            </thead>
            <tbody>
              {mengetahui.map((item, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #000", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #000" }}>{item.nama || ".................."}</td>
                  <td style={{ border: "1px solid #000" }}>{item.tandaTangan || ".................."}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplateBesukPerjamuan;
