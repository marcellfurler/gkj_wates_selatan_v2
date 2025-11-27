import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NavbarComponent } from "./components/NavbarComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Import marker warna berbeda
import blueMarker from "leaflet-color-markers/img/marker-icon-blue.png";
import greenMarker from "leaflet-color-markers/img/marker-icon-green.png";
import redMarker from "leaflet-color-markers/img/marker-icon-red.png";
import orangeMarker from "leaflet-color-markers/img/marker-icon-orange.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Buat objek icon warna
const colorIcons = {
  blue: new L.Icon({ iconUrl: blueMarker, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  green: new L.Icon({ iconUrl: greenMarker, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  red: new L.Icon({ iconUrl: redMarker, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
  orange: new L.Icon({ iconUrl: orangeMarker, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
};

// Data pepanthan / gereja
const gerejaData = [
  { 
    nama: "GKJ Wates Selatan Induk Depok", 
    lat: -7.910435, 
    lng: 110.161520,
    alamat: "Depok, Panjatan, Pandjatan, Panjatan, Kec. Panjatan, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta 55655",
    warna: "blue"
  },
  { 
    nama: "GKJ Wates Selatan Pepanthan Galur", 
    lat: -7.948630, 
    lng: 110.222001,
    alamat: "Dukuh Kilung, Kranggan, Kec. Galur, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta 55661",
    warna: "green"
  },
  { 
    nama: "GKJ Wates Selatan Pepanthan Wonogiri", 
    lat: -7.921278, 
    lng: 110.219675,
    alamat: "Wonogiri, Jatisari, Tegalsari, Jatirejo, Kec. Lendah, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta 55663",
    warna: "red"
  },
  { 
    nama: "GKJ Wates Selatan Triharjo",  
    lat: -7.886425691696392, 
    lng: 110.13346921691945,
    alamat: "Triharjo, Kec. Wates, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta",
    warna: "orange"
  },
];

const HalamanPeta = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavbarComponent />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90vh",
          padding: "10px",
        }}
        className="container mt-5 mb-3"
      >
        <button
          className="btn btn-light btn-sm mb-2"
          style={{ alignSelf: "flex-start", backgroundColor: "#004d97", color: "white" }}
          onClick={() => navigate("/data")}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali
        </button>

        <h3 className="text-center mb-4">
          Peta Persebaran Pelayanan GKJ Wates Selatan
        </h3>

        <div style={{ width: "80%", height: "70vh" }}>
          <MapContainer
            center={[-7.925, 110.190]} // Pusat map di tengah semua marker
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {gerejaData.map((g, i) => (
              <Marker key={i} position={[g.lat, g.lng]} icon={colorIcons[g.warna]}>
                <Popup>
                  <strong>{g.nama}</strong>
                  <br />
                  Alamat: {g.alamat}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default HalamanPeta;
