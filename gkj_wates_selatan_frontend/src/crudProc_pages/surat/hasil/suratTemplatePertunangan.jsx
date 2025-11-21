import React, { useEffect, useState } from "react"; // Tambahkan import ini
import { useLocation, useNavigate } from "react-router-dom"; 
// Pastikan Hapus: import { useParams } from "react-router-dom"; jika tidak digunakan
import { NavbarComponent } from "../../../components/NavbarComponent";

const SuratTemplatePertunangan = () => {
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
            "surat-tunangan",
            `Surat-Tunangan_${data.namaLaki || "TanpaNama"} dan ${data.namaPerempuan || "TanpaNama"}`
        );
    };
  return (
    <div>
      <NavbarComponent />

      {/* Header Tombol */}
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
          id="surat-pertunangan"
          style={{
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "20mm 20mm",
            fontFamily: "Times New Roman, serif",
            fontSize: "12pt",
            lineHeight: "1.4",
            color: "#000",
            boxShadow: "0 0 6px rgba(0,0,0,0.25)",
            textAlign: "justify",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "11pt" }}>
            KODE : SBA.TUNANGAN
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
          </p><br />

          <p style={{ textAlign: "justify" }}>
            Salam Damai Dalam Kasih Tuhan Yesus Kristus, <br />
            Dengan penuh pengharapan dan percaya akan anugerah keselamatan dari
            Tuhan Yesus Kristus, maka pada hari ini{" "}
            {data.tanggal || "................"} bulan{" "}
            {data.bulan || "................"} tahun{" "}
            {data.tahun || "................"} dilaksanakanlah pertunangan menurut
            tata cara gerejawi antara :
          </p>

          {/* === PIHAK PEREMPUAN === */}
          <table style={{ width: "100%", marginBottom: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama</td>
                <td>: {data.namaPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat / Tgl Lahir</td>
                <td>
                  : {data.tempatLahirPerempuan || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahirPerempuan)}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamatPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Nama Ayah</td>
                <td>: {data.namaAyahPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Nama Ibu</td>
                <td>: {data.namaIbuPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat Baptis</td>
                <td>: {data.tempatBaptisPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat Sidi</td>
                <td>: {data.tempatSidiPerempuan || "........................................"}</td>
              </tr>
              <tr>
                <td>Warga Gereja</td>
                <td>: {data.wargaGerejaPerempuan || "........................................"}</td>
              </tr>
            </tbody>
          </table>

          <p>
            <b>Bertunangan dengan:</b>
          </p>

          {/* === PIHAK LAKI-LAKI === */}
          <table style={{ width: "100%", marginBottom: "10px" }}>
            <tbody>
              <tr>
                <td style={{ width: "30%" }}>Nama</td>
                <td>: {data.namaLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat / Tgl Lahir</td>
                <td>
                  : {data.tempatLahirLaki || ".................."},{" "}
                  {formatTanggalIndonesia(data.tanggalLahirLaki)}
                </td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>: {data.alamatLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Nama Ayah</td>
                <td>: {data.namaAyahLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Nama Ibu</td>
                <td>: {data.namaIbuLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat Baptis</td>
                <td>: {data.tempatBaptisLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Tempat Sidi</td>
                <td>: {data.tempatSidiLaki || "........................................"}</td>
              </tr>
              <tr>
                <td>Warga Gereja</td>
                <td>: {data.wargaGerejaLaki || "........................................"}</td>
              </tr>
            </tbody>
          </table>

          <p style={{ textAlign: "justify", marginTop: "10px" }}>
            Selanjutnya atas terlaksananya pertunangan ini, kiranya menjadi maklum
            bagi gereja dan warga jemaat bahwa kedua belah pihak telah dinyatakan
            resmi bertunangan menurut adat gerejawi. <br />
            Demikian surat berita acara pertunangan ini, dan kiranya surat ini
            dapat digunakan sebagaimana mestinya. Semoga Tuhan selalu memberkati
            kita sekalian. Amin.
          </p>

          {/* === TANDA TANGAN === */}
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p>
              Kulon Progo, {formatTanggalIndonesia(new Date())}
              <br />
              Teriring Salam dan Hormat
            </p>
            <p style={{ fontWeight: "bold" }}>Pihak Perempuan</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "100px",
                marginTop: "60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.orangTuaPerempuan || "....................."}
                </div>
                <small>Orang Tua</small>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.namaPerempuan || "....................."}
                </div>
                <small>Yang Bertunangan</small>
              </div>
            </div>
            <br />
            <p style={{ fontWeight: "bold" }}>Pihak Laki-Laki</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "100px",
                marginTop: "60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.orangTuaLaki || "....................."}
                </div>
                <small>Orang Tua</small>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.namaLaki || "....................."}
                </div>
                <small>Yang Bertunangan</small>
              </div>
            </div>
            <br />
            <p style={{ fontWeight: "bold" }}>Para Saksi</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "80px",
                marginTop: "60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.saksi1 || "....................."}
                </div>
                <small>Saksi I</small>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    borderBottom: "1px solid black",
                    minWidth: "150px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.saksi2 || "....................."}
                </div>
                <small>Saksi II</small>
              </div>
            </div>
            <br />
            <p style={{ fontWeight: "bold" }}>Yang Melayangkan Pertunangan</p>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <div
                  style={{
                    // borderBottom: "1px solid black",
                    minWidth: "140px",
                    paddingBottom: "2px",
                  }}
                >
                  {data.yangMelayankan || "....................."}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuratTemplatePertunangan;
