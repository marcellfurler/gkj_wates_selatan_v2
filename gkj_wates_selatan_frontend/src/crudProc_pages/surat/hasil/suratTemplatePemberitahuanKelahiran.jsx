import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";

const SuratTemplatePemberitahuanKelahiran = () => {
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

    }, [dataDariState]); // Dependency dataDariState untuk kasus surat baru (opsional)


    // ... (formatTanggalIndonesia dan handlePrint tetap sama) ...
    const formatTanggalIndonesia = (tanggal) => {
        if (!tanggal) return "..................";
        const date = new Date(tanggal);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("id-ID", options);
    };

    const handlePrint = () => {
        // Pastikan Anda mengimpor printSurat
        // import { printSurat } from "../../../components/printSurat"; 
        printSurat(
            "surat-kelahiran",
            `Surat-Pemberitahuan_Kelahiran_${data.namaAnak || "TanpaNama"}`
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
      {/* === Header Tombol === */}
      <div className="d-flex justify-content-between align-items-center px-4 mt-4 mb-3">
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
          id="surat-kelahiran"
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
          {/* === HEADER SURAT === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SP.Lahir
          </div>
          

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PEMBERITAHUAN KELAHIRAN
          </p>
          

          <p>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus,</p>

          <p>
            Dengan penuh ucapan syukur kepada Tuhan Yang Maha Kasih, melalui
            surat ini perkenankanlah kami:
          </p>

          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama Orang Tua</td>
              </tr>
              <tr>
                <td>    Ayah</td>
                <td>: {data.namaIbu || "................................................"}</td>
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

          <p style={{ marginTop: "10px" }}>
            Memberitahukan kepada Yang Terhormat Majelis GKJ Wates Selatan, bahwa
            Tuhan telah menganugerahkan anak kepada kami, yaitu:
          </p>

          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama Anak</td>
                <td>: {data.namaAnak || "................................................"}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>
                  : {data.jenisKelamin || "( Laki-laki / Perempuan )"}
                </td>
              </tr>
              <tr>
                <td>Anak Ke</td>
                <td>
                  : {data.anakKe || ".................."}{" "}
                  ({data.keteranganAnakKe || "......................................."})
                </td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "10px" }}>Yang lahir pada:</p>

          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Hari / Tanggal</td>
                <td>
                  : {data.hariLahir || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>Waktu / Pukul</td>
                <td>: {data.waktuLahir || ".................."}</td>
              </tr>
              <tr>
                <td>Tempat</td>
                <td>: {data.tempatLahir || ".................."}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Demikian surat pemberitahuan kelahiran kami, kiranya menjadi
            perhatian, dan semoga Tuhan selalu memberkati kita sekalian. Amin.
          </p>

          {/* === TANDA TANGAN === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
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

export default SuratTemplatePemberitahuanKelahiran;
