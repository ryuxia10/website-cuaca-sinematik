import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
// Pastikan nama file ini sesuai dengan file JSON yang sudah saya rapikan untuk Anda
import wilayahData from "./wilayah-indonesia.json";

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
  "Berawan Tebal": {
    video: "/videos/video-berangin.mp4",
    icon: "/icons/icon-berawan.png",
    sound: null,
    color: "#78909C",
  },
  "Udara Kabur": {
    video: "/videos/video-kabut.mp4",
    icon: "/icons/icon-kabut.png",
    sound: null,
    color: "#78909C",
  },
  Kabut: {
    video: "/videos/video-kabut.mp4",
    icon: "/icons/icon-kabut.png",
    sound: null,
    color: "#78909C",
  },
  Asap: {
    video: "/videos/video-kabut.mp4",
    icon: "/icons/icon-kabut.png",
    sound: null,
    color: "#78909C",
  },
  "Hujan Ringan": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "Hujan Sedang": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "Hujan Lokal": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "Hujan Lebat": {
    video: "/videos/video-hujan-badai.mp4",
    icon: "/icons/icon-hujan-petir.png",
    sound: "/sounds/suara-badai.mp3",
    color: "#29B6F6",
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

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWeatherData = useCallback(async (kodeWilayah) => {
    if (!kodeWilayah) return;
    setLoading(true);

    // INI BAGIAN YANG ANDA CARI: Memanggil "kurir" di Vercel
    const API_URL = `/api/getWeather?kode=${kodeWilayah}`;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari kurir Vercel.");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Kode default untuk Kota Bandung saat pertama kali memuat
    fetchWeatherData("32.73");
  }, [fetchWeatherData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    let foundLocation = null;

    // Logika Pencarian: Cari nama kota dulu, baru kecamatan
    foundLocation = wilayahData.find(
      (loc) => loc.kota.toLowerCase() === lowerCaseSearchTerm
    );

    if (!foundLocation) {
      foundLocation = wilayahData.find(
        (loc) => loc.kecamatan.toLowerCase() === lowerCaseSearchTerm
      );
    }

    if (foundLocation) {
      fetchWeatherData(foundLocation.kode);
    } else {
      alert(`Lokasi "${searchTerm}" tidak ditemukan di dalam data.`);
    }
  };

  // Logika Pembacaan Data yang Aman
  const locationInfo = weatherData?.lokasi;
  const currentForecast = weatherData?.data?.[0]?.cuaca?.[0] || {}; // Default ke objek kosong
  const weatherDescription = currentForecast.weather_desc || "Berawan";
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
          <div className="loading-text">Memuat Kanvas Cuaca...</div>
        ) : !weatherData || !currentForecast ? (
          <div className="loading-text">
            Data tidak tersedia. Coba cari lokasi lain.
          </div>
        ) : (
          <div className="weather-content-container">
            <div className="location-info">
              <h1>{locationInfo?.kecamatan || "Lokasi"}</h1>
              <p>{locationInfo?.kotkab || "Tidak Ditemukan"}</p>
            </div>
            <div className="weather-display">
              <img
                src={assets.icon}
                alt={weatherDescription}
                className="weather-icon"
                key={assets.icon}
              />
              <div className="weather-details">
                <h2 style={{ color: assets.color }}>
                  {currentForecast.t || "--"}°C
                </h2>
                <p style={{ color: assets.color }}>{weatherDescription}</p>
              </div>
            </div>
            <div className="extra-info">
              <p>Kelembapan: {currentForecast.hu || "--"}%</p>
              <p>Angin: {currentForecast.ws || "--"} km/j</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
