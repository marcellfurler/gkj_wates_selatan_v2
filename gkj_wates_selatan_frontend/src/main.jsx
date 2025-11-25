import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HalamanUtama from './halaman_utama'
import HalamanLogin from './halaman_login'
import HalamanDaftar from './halaman_daftar'
import HalamanData from './halaman_data_utama'
import HalamanDetail from './crudProc_pages/halaman_detail'
import HalamanEdit from './crudProc_pages/halaman_edit'
import HalamanTambahDataBaru from './crudProc_pages/halaman_tambahDataBaru'
import HalamanStatistik from './halaman_statistik'


import HalamanSurat from './halaman_surat'

import BaptisAnak from './crudProc_pages/surat/baptisAnak'
import SuratTemplateBaptisAnak from './crudProc_pages/surat/hasil/suratTemplateBaptisAnak'

import BaptisDewasa from './crudProc_pages/surat/baptisDewasa'
import SuratTemplateBaptisDewasa from './crudProc_pages/surat/hasil/suratTemplateBaptisDewasa'

import PermohonanPertobatan from './crudProc_pages/surat/permohonanPertobatan'
import SuratPermohonanPertobatan from './crudProc_pages/surat/hasil/suratTemplatePermohonanPertobatan'

import PengakuanPercaya from './crudProc_pages/surat/pengakuanPercaya'
import SuratTemplatePengakuanPercaya from './crudProc_pages/surat/hasil/suratTemplatePengakuanPercaya.jsx'

import PemberitahuanKelahiran from './crudProc_pages/surat/pemberitahuanKelahiran.jsx'
import SuratTemplatePemberitahuanKelahiran from './crudProc_pages/surat/hasil/suratTemplatePemberitahuanKelahiran.jsx'

import Pertunangan from './crudProc_pages/surat/pertunangan'
import SuratTemplatePertunangan from './crudProc_pages/surat/hasil/suratTemplatePertunangan'

import Pernikahan from './crudProc_pages/surat/pernikahan'
import SuratTemplatePernikahan from './crudProc_pages/surat/hasil/suratTemplatePernikahan'

import BimbinganKatekesasi from './crudProc_pages/surat/bimbinganKatekesasi'
import SuratTemplateBimbinganKatekesasi from './crudProc_pages/surat/hasil/suratTemplateBimbinganKatekesasi'

import PencalonanMajelis from './crudProc_pages/surat/pencalonanMajelis'
import SuratTemplatePencalonanMajelis from './crudProc_pages/surat/hasil/suratTemplatePencalonanMajelis'

import BesukPerjamuan from './crudProc_pages/surat/besukPerjamuan.jsx'
import SuratTemplateBesukPerjamuan from './crudProc_pages/surat/hasil/suratTemplateBesukPerjamuan.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HalamanUtama />} />
        <Route path="/login" element={<HalamanLogin />} />
        <Route path="/daftar" element={<HalamanDaftar />} />
        <Route path="/data" element={<HalamanData />} />
        <Route path="/detail" element={<HalamanDetail />} />
        <Route path="/edit" element={<HalamanEdit />} />
        <Route path="/dataBaru" element={<HalamanTambahDataBaru />} />
        <Route path="/statistik" element={<HalamanStatistik />} />
        

        {/* Bagian Surat */}
        <Route path="/surat" element={<HalamanSurat />} />
        <Route path="/surat/baptis-anak" element={<BaptisAnak />} />
        <Route path="/surat/hasil/baptis-anak" element={<SuratTemplateBaptisAnak />} />

        <Route path="/surat/baptis-dewasa" element={<BaptisDewasa />} />
        <Route path="/surat/hasil/baptis-dewasa" element={<SuratTemplateBaptisDewasa />} />

        <Route path="/surat/pertobatan" element={<PermohonanPertobatan />} />
        <Route path="/surat/hasil/pertobatan" element={<SuratPermohonanPertobatan />} />

        <Route path="/surat/pengakuan-percaya" element={<PengakuanPercaya />} />
        <Route path="/surat/hasil/pengakuan-percaya" element={<SuratTemplatePengakuanPercaya />} />

        <Route path="/surat/pemberitahuan-kelahiran" element={<PemberitahuanKelahiran />} />
        <Route path="/surat/hasil/pemberitahuan-kelahiran" element={<SuratTemplatePemberitahuanKelahiran />} />

        <Route path="/surat/tunangan" element={<Pertunangan />} />
        <Route path="/surat/hasil/tunangan" element={<SuratTemplatePertunangan />} />

        <Route path="/surat/nikah" element={<Pernikahan />} />
        <Route path="/surat/hasil/nikah" element={<SuratTemplatePernikahan />} />

        <Route path="/surat/katekisasi" element={<BimbinganKatekesasi />} />
        <Route path="/surat/hasil/katekisasi" element={<SuratTemplateBimbinganKatekesasi />} />

        <Route path="/surat/calon-majelis" element={<PencalonanMajelis />} />
        <Route path="/surat/hasil/calon-majelis" element={<SuratTemplatePencalonanMajelis />} />

        <Route path="/surat/besuk-perjamuan" element={<BesukPerjamuan />} />
        <Route path="/surat/hasil/besuk-perjamuan" element={<SuratTemplateBesukPerjamuan />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
