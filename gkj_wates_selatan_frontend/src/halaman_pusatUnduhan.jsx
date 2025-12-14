import React from "react";
import { NavbarComponent } from "./components/NavbarComponent";
import Footer from "./components/footer";

export default function PusatUnduhan() {
  const files = [
    { id: 1, name: "Buku Panduan", file: "BukuPanduanMagang.pdf" },
    { id: 2, name: "Sejarah GKJ Wates Selatan", file: "BukuSejarah.pdf" },
    { id: 3, name: "Struktur Organisasi GKJ Wates Selatan 2025", file: "StrukturOrganisasi.pdf" },
  ];

  return (
    <>
      <NavbarComponent />

      <div className="container mt-5">
        <h2 className="mb-4 fw-bold">Pusat Unduhan</h2>

        <div className="list-group">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{index + 1}.</strong> {file.name}
              </span>

              <a
                href={`/${file.file}`}
                download
                className="btn btn-primary btn-sm"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
