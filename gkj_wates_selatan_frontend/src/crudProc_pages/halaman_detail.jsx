import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NavbarComponent } from '../components/NavbarComponent';
import axios from 'axios';
import { useEffect, useState } from "react";
import Footer from "../components/footer";


// Import default assets
import maleIcon from '../assets/laki.png';
import femaleIcon from '../assets/perempuan.png';

// -----------------------------
// 🌟 DETAIL ITEM COMPONENT
// -----------------------------
const DetailListItem = ({ label, value }) => (
  <li className="list-group-item d-flex align-items-start py-2 px-3 border-0 border-bottom">
    <div className="fw-semibold text-muted" style={{ width: '150px', minWidth: '150px' }}>
      {label}
    </div>
    <div className="text-dark flex-grow-1 ps-2">
      {Array.isArray(value) ? (
        value.map((v, i) => <div key={i}>{v}</div>)
      ) : (
        <div>{value}</div>
      )}
    </div>
  </li>
);

// -----------------------------
// Format tanggal
// -----------------------------
const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(tanggal).toLocaleDateString('id-ID', options);
};


const formatTanggalLahir = (tanggal) => {
  if (!tanggal) return "-";

  const date = new Date(tanggal);
  const today = new Date();

  // Format tanggal Indonesia
  const tanggalLokal = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Hitung umur
  let tahun = today.getFullYear() - date.getFullYear();
  let bulan = today.getMonth() - date.getMonth();
  let hari = today.getDate() - date.getDate();

  // Jika hari negatif → pinjam hari dari bulan sebelumnya
  if (hari < 0) {
    // Ambil jumlah hari dari bulan sebelumnya
    const bulanSebelumnya = new Date(today.getFullYear(), today.getMonth(), 0);
    const jumlahHariBulanSebelumnya = bulanSebelumnya.getDate();

    hari += jumlahHariBulanSebelumnya;
    bulan -= 1;
  }

  // Jika bulan negatif → pinjam dari tahun
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }

  return `${tanggalLokal} (Usia: ${tahun} tahun ${bulan} bulan ${hari} hari)`;
};




// -----------------------------
// 🌟 DETAIL PAGE COMPONENT
// -----------------------------
const DetailJemaat = ({ data }) => {
  const navigate = useNavigate();

  const dataPribadi = [
    { label: 'Nama Lengkap', value: data.namaLengkap || '-' },
    {
      label: 'Tempat, tanggal Lahir',
      value: (() => {
        const ttl = formatTanggalLahir(data.tanggalLahir);

        // Pisahkan bagian sebelum dan dalam kurung
        const [tanggal, usiaDalamKurung] = ttl.split(" (");

        return (
          <>
            {data.tempatLahir || "-"}, {tanggal}
            {" "}
            <span style={{ fontStyle: "italic" }}>
              ({usiaDalamKurung}
            </span>
          </>
        );
      })()
    },
    { label: 'Jenis Kelamin', value: data.jenisKelamin || '-' },
    { label: 'Agama', value: data.agama || '-' },
    { label: 'Golongan Darah', value: data.golonganDarah || '-' },
    { label: 'Warga Negara', value: data.wargaNegara || '-' },
    { label: 'Nama Pekerjaan', value: data.namaPekerjaan || '-' },
    { label: 'Jabatan', value: data.jabatanKerja || '-' }
  ];

  const dataKontak = [
    { label: 'No. Telepon', value: data.nomorTelepon || '-' },
    { label: 'Alamat', value: data.alamat || '-' },
  ];

  // -----------------------------
  // Status Gerejawi & Pelayanan
  // -----------------------------
  const dataGerejawi = [
    {
      label: 'Baptis',
      value: data.statusBaptis && data.statusBaptis !== '-' 
        ? [data.statusBaptis, `${data.tempatBaptis || '-'}, ${formatTanggal(data.tanggalBaptis)}`]
        : ['Belum Baptis', ''],
    },
    {
      label: 'Sidi',
      value: data.statusSidi && data.statusSidi !== '-' 
        ? [data.statusSidi, `${data.tempatSidi || '-'}, ${formatTanggal(data.tanggalSidi)}`]
        : ['Belum Sidi', ''],
    },
    {
      label: 'Nikah',
      value: data.statusNikah && data.statusNikah !== '-' 
        ? [
            data.statusNikah,
            `${data.tempatNikah || '-'}, ${formatTanggal(data.tanggalNikah)}`,
            data.namaPasangan ? `Nama Pasangan: ${data.namaPasangan} (${data.gerejaAsal || '-'})` : ''
          ]
        : ['Belum Nikah', ''],
    },
    {
      label: "Pelayanan",
      value:
        data.namaPelayanan === "Pendeta"
          ? [
              `Jabatan: ${data.dataPendeta?.jabatan || "-"}`,
              ...(data.dataRiwayatPendeta?.length > 0
                ? data.dataRiwayatPendeta.map(
                    (r) =>
                      `${r.namaGereja || "-"} | ${r.tahunMulai || "-"} - ${r.tahunSelesai || "-"}`
                  )
                : ["Belum ada riwayat pelayanan"]),
            ]
          : [data.namaPelayanan || "-"],
    },
    { label: 'Pepanthan', value: data.namaPepanthan || '-' },
  ];

  // -----------------------------
  // Hapus Jemaat
  // -----------------------------
  const handleHapus = async (kodeJemaat) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus jemaat ini?")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/jemaat/hapus/${kodeJemaat}`);
      alert(response.data.message);
      navigate("/data");
    } catch (error) {
      console.error("Error hapus jemaat:", error);
      alert("Gagal menghapus jemaat!");
    }
  };

  // -----------------------------
  // Pilih foto default berdasarkan jenis kelamin
  // -----------------------------
  const fotoSrc = data.foto
    ? `http://localhost:5000/${data.foto}`
    : data.jenisKelamin === "Perempuan"
      ? femaleIcon
      : maleIcon;

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm border-0 overflow-hidden">

        {/* HEADER CARD */}
        <div
          className="card-header text-white d-flex align-items-center justify-content-center position-relative"
          style={{
            backgroundColor: '#004d97',
            borderBottom: 'none',
            height: '60px',
            padding: '0 1rem',
          }}
        >
          <Link
            to="/data"
            className="btn btn-light btn-sm fw-bold position-absolute start-0 ms-3"
            style={{ color: "#004d97" }}
            title="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Kembali
          </Link>

          <h5 className="mb-0 fw-bold text-center flex-grow-1">BIODATA JEMAAT</h5>

          <div className="position-absolute end-0 me-3 d-flex gap-2">
            <Link
              to="/edit"
              state={{ data }}
              className="btn btn-light btn-sm fw-bold" 
              style={{ color: "#004d97" }}
              title="Edit Data"
            >
              <FontAwesomeIcon icon={faPencilAlt} className="me-1" /> Edit
            </Link>

            <button
              onClick={() => handleHapus(data.kodeJemaat)}
              className="btn btn-danger btn-sm fw-bold" 
              title="Hapus Data"
            >
              Hapus
            </button>
          </div>
        </div>

        {/* BODY CARD */}
        <div className="card-body p-0">
          <div className="row g-0">

            {/* FOTO */}
            <div className="col-12 col-lg-4 p-4 border-end d-flex flex-column align-items-center bg-light">
              <img
                src={fotoSrc}
                alt="Foto Profil Jemaat"
                className="img-fluid rounded-circle shadow mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />

              <h5 className="fw-bold mb-1" style={{ color: "#004d97" }}>{data.namaLengkap || 'Nama Jemaat'}</h5>
              <p className="text-muted small mb-0">{data.namaPelayanan || '-'}</p>
              <p className="text-muted small">Pepanthan: {data.namaPepanthan || '-'}</p>
            </div>

            {/* DATA DETAIL */}
            <div className="col-12 col-lg-8">
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-light fw-bold py-2 border-top-0">Data Pribadi</li>
                {dataPribadi.map((item, index) => (
                  <DetailListItem key={`pribadi-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Kontak & Alamat</li>
                {dataKontak.map((item, index) => (
                  <DetailListItem key={`kontak-${index}`} label={item.label} value={item.value} />
                ))}

                <li className="list-group-item bg-light fw-bold py-2">Status Gerejawi</li>
                {dataGerejawi.map((item, index) => (
                  <DetailListItem key={`gereja-${index}`} label={item.label} value={item.value} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

// -----------------------------
// 🌟 MAIN PAGE
// -----------------------------
const HalamanDetail = () => {
  const location = useLocation();
  const initialData = location.state?.data;
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchPendeta = async () => {
      if (initialData?.namaPelayanan === "Pendeta" && initialData?.kodePendeta) {
        try {
          const { data: pendetaData } = await axios.get(
            `http://localhost:5000/api/pendeta/${initialData.kodePendeta}`
          );
          setData(prevData => ({
            ...prevData,
            dataPendeta: pendetaData.dataPendeta,
            dataRiwayatPendeta: pendetaData.dataRiwayatPendeta,
          }));
        } catch (err) {
          console.error("Gagal fetch detail pendeta:", err);
        }
      }
    };
    fetchPendeta();
  }, [initialData]);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <NavbarComponent />
      <DetailJemaat data={data} />
      <Footer/>
    </div>
  );
};

export default HalamanDetail;
