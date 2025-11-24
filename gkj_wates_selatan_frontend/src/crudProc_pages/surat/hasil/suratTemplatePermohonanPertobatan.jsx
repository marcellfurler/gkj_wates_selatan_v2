import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";
import { printSurat } from "../../../components/printSurat";


const SuratTemplatePertobatan = () => {
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
            "surat-pertobatan",
            `Surat-Pertobatan_${data.nama || "TanpaNama"}`
        );
    };

  return (
    <div>
      <NavbarComponent />
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
          id="surat-pertobatan"
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
            KODE : SPP.PERTOBATAN
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PERTOBATAN
          </p>
          
          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan segala kerendahan di hadapan Tuhan Yesus Kristus Sang Juru
            Selamat, maka melalui surat ini perkenankanlah saya:
          </p>


          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "35%" }}>Nama</td>
                <td>: {data.nama || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Lahir</td>
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
                <td>Pekerjaan</td>
                <td>: {data.pekerjaan || "................................................"}</td>
              </tr>
              <tr>
                <td>Tempat, Tgl Baptis</td>
                <td>
                  : {data.tempatBaptis || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalBaptis)}
                </td>
              </tr>
              <tr>
                <td>Tempat, Tgl Sidi</td>
                <td>
                  : {data.tempatSidi || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalSidi)}
                </td>
              </tr>
              <tr>
                <td>Warga Gereja</td>
                <td>: {data.wargaGereja || "................................................"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px", textAlign: "justify" }}>
            Saya menyadari dengan sesungguhnya, bahwa saya telah berdosa di
            hadapan Tuhan. Saya menyesali segala dosa dan menyatakan pertobatan
            di hadapan Tuhan dan Majelis serta Jemaat di sini.
            Saya berjanji akan berusaha sekuat tenaga dengan tetap percaya,
            berserah, dan berharap pada pertolongan Roh Kudus untuk dapat
            melakukan semua yang baik dan berkenan di hadapan Tuhan. <br /><br />
            Sehubungan dengan hal tersebut perkenankan saya memohon kepada Yang
            Terhormat Majelis GKJ Wates Selatan, agar berkenan memberikan
            pelayanan Pertobatan atas diri saya, yang diharapkan dapat
            terlaksana pada:
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

          <p style={{ marginTop: "20px", textAlign: "justify" }}>
            Demikian surat permohonan pelayanan Pertobatan ini, atas
            perkenannya permohonan ini saya ucapkan terima kasih, dan semoga
            Tuhan selalu memberkati kita sekalian. Amin
          </p>

          {/* === Tanda Tangan === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat
            </p>
            <br /><br />
            <table
              style={{
                width: "60%",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              <tbody>
                <tr>
                  <td>......................................</td>
                </tr>
                <tr>
                  <td>{data.nama || "Pemohon"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplatePertobatan;
