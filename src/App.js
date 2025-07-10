import React, { useState, useEffect } from "react";
import "./App.css";
import wilayahData from "./wilayah-data.json"; // Menggunakan file data lokal kita yang baru

// Aset visual tidak berubah
const weatherAssets = {
  Cerah: {
    video: "/videos/video-cerah.mp4",
    icon: "/icons/icon-cerah.png",
    sound: "/sounds/suara-cerah.mp3",
    color: "#FFC107",
  },
  "Cerah Berawan": {
    video: "/videos/video-cerah.mp4",
    icon: "/icons/icon-berawan.png",
    sound: "/sounds/suara-cerah.mp3",
    color: "#64B5F6",
  },
  Berawan: {
    video: "/videos/video-berangin.mp4",
    icon: "/icons/icon-berawan.png",
    sound: null,
    color: "#B0BEC5",
  },
  "Hujan Ringan": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "Hujan Petir": {
    video: "/videos/video-hujan-badai.mp4",
    icon: "/icons/icon-hujan-petir.png",
    sound: "/sounds/suara-badai.mp3",
    color: "#9C27B0",
  },
  Default: {
    video: "/videos/video-berangin.mp4",
    icon: "/icons/icon-berawan.png",
    sound: null,
    color: "#FFFFFF",
  },
};

// Data cuaca "dummy" sebagai pengganti panggilan API yang gagal
const dummyWeatherData = {
  weather_desc: "Cerah Berawan",
  t: "28", // suhu
  hu: "75", // kelembapan
  ws: "10", // kecepatan angin
};

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect sekarang hanya bertugas menetapkan lokasi awal, tanpa fetch
  useEffect(() => {
    // Set lokasi default ke Bandung saat pertama kali load
    const defaultLocation = wilayahData.find(
      (loc) => loc.kota === "KOTA BANDUNG"
    );
    setCurrentLocation(defaultLocation);
    setLoading(false);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let foundLocation = null;

    // Logika pencarian yang lebih pintar
    foundLocation = wilayahData.find(
      (loc) => loc.kota.toLowerCase() === lowerCaseSearchTerm
    );

    if (!foundLocation) {
      foundLocation = wilayahData.find(
        (loc) => loc.kecamatan.toLowerCase() === lowerCaseSearchTerm
      );
    }

    if (foundLocation) {
      setCurrentLocation(foundLocation);
    } else {
      alert(`Lokasi "${searchTerm}" tidak ditemukan di dalam data.`);
    }
  };

  // Logika pembacaan data sekarang menggunakan data dummy
  const weatherDescription = dummyWeatherData.weather_desc;
  const assets = weatherAssets[weatherDescription] || weatherAssets["Default"];

  return (
    <div className="App">
      <video
        key={assets.video}
        autoPlay
        loop
        muted
        className="background-video"
      >
        <source src={assets.video} type="video/mp4" />
      </video>
      {assets.sound && (
        <audio key={assets.sound} autoPlay loop>
          <source src={assets.sound} type="audio/mpeg" />
        </audio>
      )}
      <div className="overlay"></div>

      <main className="content">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Ketik nama kota atau kecamatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            Cari
          </button>
        </form>

        {loading ? (
          <div className="loading-text">Memuat...</div>
        ) : !currentLocation ? (
          <div className="loading-text">Pilih lokasi.</div>
        ) : (
          <div className="weather-content-container">
            <div className="location-info">
              <h1>{currentLocation.kecamatan}</h1>
              <p>
                {currentLocation.kota}, {currentLocation.propinsi}
              </p>
            </div>
            <div className="weather-display">
              <img
                src={assets.icon}
                alt={weatherDescription}
                className="weather-icon"
                key={assets.icon}
              />
              <div className="weather-details">
                <h2 style={{ color: assets.color }}>{dummyWeatherData.t}°C</h2>
                <p style={{ color: assets.color }}>{weatherDescription}</p>
              </div>
            </div>
            <div className="extra-info">
              <p>Kelembapan: {dummyWeatherData.hu}%</p>
              <p>Angin: {dummyWeatherData.ws} km/j</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
