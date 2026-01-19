import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";
import { printSurat } from "../../../components/printSurat";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const SuratTemplateBaptisAnak = () => {
    // 💡 SEMUA HOOK HARUS DI SINI (TOP LEVEL)
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Pindah ke sini!
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Ambil data state dari useLocation
    const dataDariState = location.state;

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

    }, [dataDariState]); // Dependency dataDariState untuk kasus surat baru (opsional)


    // ... (formatTanggalIndonesia dan handlePrint tetap sama) ...
    const formatTanggalIndonesia = (tanggal) => {
        if (!tanggal) return "..................";
        const date = new Date(tanggal);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
    };



    const handlePrint = () => {
      printSurat(
          "surat-baptis-anak",
          `Surat-Permohonan-Baptis-Anak_${data.namaAnak || "TanpaNama"}`
      );
  };


    if (isLoading) {
        return (
            // ... (Tampilan Loading) ...
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

      {/* ======= Tombol Navigasi ======= */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3 no-print">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
        <div>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Print / Download
          </button>
        </div>
      </div>

      {/* ======= Halaman Surat (Ukuran A4) ======= */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#eaeaea",
          padding: "10px 0",
        }}
      >
        <div
          id="surat-baptis-anak"
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "25mm 20mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.4",
            color: "#000",
            boxSizing: "border-box",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
            textAlign: "justify",
          }}
        >
          {/* ======= Header Surat ======= */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.Bts ANAK
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN BAPTIS ANAK
          </p>

          {/* ======= Isi Surat ======= */}
          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>
            Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan akan kasih dan anugerah dari Tuhan Yesus
            Kristus, melalui surat ini perkenankanlah kami :
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Nama Orang Tua</td>
              </tr>
              <tr>
                <td>    Ayah</td>
                <td>: {data.namaAyah || "................................................"}</td>
              </tr>
              <tr>
                <td>    Ibu</td>
                <td>: {data.namaIbu || "................................................"}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamat || "................................................"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Memohon kepada Yang Terhormat Majelis GKJ Wates Selatan, agar berkenan
            memberikan pelayanan Baptis Anak, untuk anak kami :
          </p>

          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Nama Anak</td>
                <td>: {data.namaAnak || "................................................"}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>: {data.jenisKelamin || "( Laki-laki / Perempuan )"}</td>
              </tr>
              <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>
                  : {data.tempatLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Pelayanan Baptis Anak diharapkan dapat dilayankan pada:
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

          <p style={{ marginTop: "20px" }}>
            Demikian surat permohonan pelayanan baptis anak kami, atas
            perkenannya permohonan ini, kami ucapkan terima kasih, dan kiranya
            Tuhan selalu memberkati kita sekalian. Amin.
          </p>

          {/* ======= Tanda Tangan ======= */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat,
            </p>
            <br /><br /><br />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: "100px",
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
                  {data.namaAyah || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Suami</div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
                  {data.namaIbu || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Istri</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplateBaptisAnak;
