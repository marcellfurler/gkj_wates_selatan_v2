import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";
import { printSurat } from "../../../components/printSurat";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const SuratTemplatePencalonanMajelis = () => {
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
        // Pastikan Anda mengimpor printSurat
        // import { printSurat } from "../../../components/printSurat"; 
        printSurat(
            "surat-pencalonan-majelis",
            `Surat-Pencalonan_Majelis_${data.nama || "TanpaNama"}`
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

      {/* === HEADER BUTTON === */}
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
          id="surat-pencalonan-majelis"
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20mm 18mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.4",
            color: "#000",
            textAlign: "justify",
            boxSizing: "border-box",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
          }}
        >
          {/* === HEADER === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SP.CALON MAJELIS
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            KESANGGUPAN PENCALONAN MAJELIS <br />
            
          </p>

          <p style={{ textAlign: "center", fontStyle: "italic", marginTop: "-15px" }}>
            Dalam Jabatan Penatua/Diaken di GKJ Wates Selatan
          </p>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis GKJ Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Menanggapi utusan Majelis GKJ Wates Selatan, pada : <br />
            <table>
                <tbody>
                    <tr>
                        <td style={{ width: "30%" }}>Hari</td>
                        <td>: {data.hari || "..........................................."}</td>
                    </tr>
                    <tr>
                        <td>Tanggal</td>
                        <td>
                        : {formatTanggalIndonesia(data.tanggalLahir)}
                        </td>
                    </tr>
                </tbody>
            </table>
            Perihal Pencalonan Majelis GKJ Wates Selatan, maka dengan ini saya
            menyatakan:
          </p>

          <p>Dengan pertolongan Tuhan Yesus Kristus, yang bertanda tangan di bawah ini saya :</p>

          {/* === DATA CALON MAJELIS === */}
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama</td>
                <td>: {data.nama || "..........................................."}</td>
              </tr>
              <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>
                  : {data.tempatLahir || ".................."}, {formatTanggalIndonesia(data.tanggalLahir)}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamat || "..........................................."}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px", textAlign: "justify" }}>
            Menyatakan dengan sesungguhnya bahwa saya bersedia menerima panggilan pelayanan
            sebagai anggota Majelis Gereja dalam Jabatan Penatua/Diaken. <br />
            Saya berjanji akan berusaha dengan sungguh-sungguh untuk dapat melaksanakan
            tugas dan tanggung jawab pelayanan saya tersebut, dengan senantiasa berpedoman
            pada ketentuan-ketentuan seperti tertulis di dalam Alkitab, Pokok-Pokok Ajaran
            Gereja, serta Tata Gereja.
          </p>

          <p>
            Demikian surat pernyataan ini saya buat dengan sesungguhnya tanpa tekanan dan
            atau paksaan dari siapapun juga. <br />
            Semoga Tuhan Yesus Kristus Raja Gereja, memberi kemampuan kepada saya untuk
            dapat melaksanakan segala tugas yang seturut dengan maksud dan kehendakNya.
          </p>


          {/* === TANDA TANGAN === */}
          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Hormat kami
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "80px",
                marginTop: "40px",
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
                  {data.namaSuamiIstri || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Suami/Istri</div>
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
                <div style={{ marginTop: "5px" }}>Calon Majelis</div>
              </div>
            </div>
          </div>

          {/* === MENGETAHUI === */}
            <p style={{ textAlign: "center" }}>
              Mengetahui
            </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "80px",
              marginTop: "80px",
              textAlign: "center",
            }}
          >
            
            <div>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  minWidth: "150px",
                //   paddingBottom: "3px",
                }}
              >
                {data.majelisI || "........................"}
              </div>
              <div style={{ marginTop: "5px" }}>Majelis I</div>
            </div>

            <div>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  minWidth: "150px",
                //   paddingBottom: "3px",
                }}
              >
                {data.majelisII || "........................"}
              </div>
              <div style={{ marginTop: "5px" }}>Majelis II</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplatePencalonanMajelis;
