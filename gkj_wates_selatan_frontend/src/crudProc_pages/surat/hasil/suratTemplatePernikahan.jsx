import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";
import { printSurat } from "../../../components/printSurat";

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const SuratTemplatePeneguhanPernikahan = () => {
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
            "surat-peneguhan-pernikahan",
            `Surat-Pernikahan_${data.namaLaki || "TanpaNama"} dan ${data.namaWanita || "TanpaNama"}`
        );
    };

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
          id="surat-peneguhan-pernikahan"
          style={{
            width: "210mm",
            height: "297mm",
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
          {/* === Header Surat === */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SPP.PP NIKAH
          </div>

          <p
            style={{
              textAlign: "center",
              textDecoration: "underline",
              fontWeight: "bold",
            //   fontSize: "12pt",
            //   marginTop: "5px",
            }}
          >
            SURAT PERMOHONAN PELAYANAN PENEGUHAN DAN PEMBERKATAN PERNIKAHAN
          </p>

          <p style={{ marginTop: "15px" }}>
            Kepada : <br />
            Yth. Majelis Gereja Kristen Jawa Wates Selatan <br />
            Di Dusun II, Depok, Panjatan, Kulon Progo, Yogyakarta.
          </p>

          <p>Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari
            Tuhan Yesus Kristus, maka melalui surat ini perkenankanlah saya :

          </p>


          {/* === DATA PRIA === */}
          <table style={{ width: "100%", marginTop: "10px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Nama</td><td>: {data.namaPria || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Lahir</td><td>: {data.tempatLahirPria || ".................."}, {formatTanggalIndonesia(data.tanggalLahirPria)}</td></tr>
              <tr><td>Alamat</td><td>: {data.alamatPria || "................................................"}</td></tr>
              <tr><td>Pekerjaan</td><td>: {data.pekerjaanPria || "................................................"}</td></tr>
              <tr><td>Nama Ayah</td><td>: {data.namaAyahPria || "................................................"}</td></tr>
              <tr><td>Nama Ibu</td><td>: {data.namaIbuPria || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Baptis</td><td>: {data.tempatBaptisPria || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Sidi</td><td>: {data.tempatSidiPria || "................................................"}</td></tr>
              <tr><td>Warga Gereja</td><td>: {data.wargaGerejaPria || "................................................"}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Bermaksud melaksanakan Pernikahan Kudus dengan :
          </p>

          {/* === DATA WANITA === */}
          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Nama</td><td>: {data.namaWanita || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Lahir</td><td>: {data.tempatLahirWanita || ".................."}, {formatTanggalIndonesia(data.tanggalLahirWanita)}</td></tr>
              <tr><td>Alamat</td><td>: {data.alamatWanita || "................................................"}</td></tr>
              <tr><td>Pekerjaan</td><td>: {data.pekerjaanWanita || "................................................"}</td></tr>
              <tr><td>Nama Ayah</td><td>: {data.namaAyahWanita || "................................................"}</td></tr>
              <tr><td>Nama Ibu</td><td>: {data.namaIbuWanita || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Baptis</td><td>: {data.tempatBaptisWanita || "................................................"}</td></tr>
              <tr><td>Tempat Tgl Sidi</td><td>: {data.tempatSidiWanita || "................................................"}</td></tr>
              <tr><td>Warga Gereja</td><td>: {data.wargaGerejaWanita || "................................................"}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Sehubungan dengan rencana tersebut, saya memohon kepada Yang Terhormat
            Majelis GKJ Wates Selatan agar berkenan memberikan pelayanan Peneguhan
            dan Pemberkatan Pernikahan Kudus, yang diharapkan dapat terlaksana pada:
          </p>

          {/* === Jadwal === */}
          <table style={{ width: "100%", marginTop: "5px" }}>
            <tbody>
              <tr><td style={{ width: "35%" }}>Hari / Tanggal</td><td>: {data.hariPelayanan || ".................."}, {formatTanggalIndonesia(data.tanggalPelayanan)}</td></tr>
              <tr><td>Waktu / Pukul</td><td>: {data.waktuPelayanan || ".................."}</td></tr>
              <tr><td>Tempat</td><td>: {data.tempatPelayanan || ".................."}</td></tr>
            </tbody>
          </table>

          <p style={{ marginTop: "15px" }}>
            Selanjutnya perlu Majelis GKJ Wates Selatan ketahui bahwa untuk
            keperluan tersebut saya telah menyelesaikan program katekisasi pra
            nikah di bawah bimbingan {data.pembimbing || "................................................"},
            yang telah berlangsung selama {data.durasiKatekisasi || ".................."}.
          </p>

          <p>
            Demikian surat permohonan pelayanan Peneguhan dan Pemberkatan
            Pernikahan Kudus ini, atas perkenannya permohonan ini saya ucapkan
            terima kasih, dan semoga Tuhan selalu memberkati kita sekalian. Amin.
          </p>

          {/* === TANDA TANGAN === */}
          {/* Perempuan */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())} <br />
              Teriring Salam dan Hormat <br />
              <strong>Pihak Perempuan,</strong>
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
                  {data.namaWanita || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Orang Tua</div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
                  {data.namaPria || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Pemohon</div>
              </div>
            </div>
        
            {/* Laki-laki */}
            <strong>Pihak Laki-laki,</strong>
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
                  {data.namaWanita || "........................"}
                </div>
                <div style={{ marginTop: "5px" }}>Orang Tua</div>
              </div>

              <div>
                <div
                  style={{
                    borderBottom: "1px solid #000",
                    minWidth: "150px",
                    paddingBottom: "3px",
                  }}
                >
                  {data.namaPria || "........................"}
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

export default SuratTemplatePeneguhanPernikahan;
