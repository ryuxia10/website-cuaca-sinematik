import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// Peta aset kita sesuaikan dengan deskripsi dari Weatherstack
const weatherAssets = {
  sunny: {
    video: "/videos/video-cerah.mp4",
    icon: "/icons/icon-cerah.png",
    sound: "/sounds/suara-cerah.mp3",
    color: "#FFC107",
  },
  clear: {
    video: "/videos/video-cerah.mp4",
    icon: "/icons/icon-cerah.png",
    sound: "/sounds/suara-cerah.mp3",
    color: "#FFC107",
  },
  "partly cloudy": {
    video: "/videos/video-cerah.mp4",
    icon: "/icons/icon-berawan.png",
    sound: "/sounds/suara-cerah.mp3",
    color: "#64B5F6",
  },
  cloudy: {
    video: "/videos/video-berangin.mp4",
    icon: "/icons/icon-berawan.png",
    sound: null,
    color: "#B0BEC5",
  },
  overcast: {
    video: "/videos/video-berangin.mp4",
    icon: "/icons/icon-berawan.png",
    sound: null,
    color: "#78909C",
  },
  "patchy rain possible": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "light rain": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "moderate rain": {
    video: "/videos/video-hujan-ringan.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-hujan.mp3",
    color: "#4DD0E1",
  },
  "heavy rain": {
    video: "/videos/video-hujan-badai.mp4",
    icon: "/icons/icon-hujan.png",
    sound: "/sounds/suara-badai.mp3",
    color: "#29B6F6",
  },
  thunderstorm: {
    video: "/videos/video-hujan-badai.mp4",
    icon: "/icons/icon-hujan-petir.png",
    sound: "/sounds/suara-badai.mp3",
    color: "#9C27B0",
  },
  mist: {
    video: "/videos/video-kabut.mp4",
    icon: "/icons/icon-kabut.png",
    sound: null,
    color: "#78909C",
  },
  fog: {
    video: "/videos/video-kabut.mp4",
    icon: "/icons/icon-kabut.png",
    sound: null,
    color: "#78909C",
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
  const [searchTerm, setSearchTerm] = useState("Bandung"); // Langsung cari Bandung saat awal

  const fetchWeatherData = useCallback(async (kota) => {
    if (!kota) return;
    setLoading(true);

    // Panggilan ke "kurir" Vercel tidak berubah
    const API_URL = `/api/getWeather?kota=${kota}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success === false || data.error) {
        throw new Error(data.error.info || "Gagal mengambil data.");
      }
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(searchTerm);
  }, []); // Dijalankan hanya sekali di awal

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData(searchTerm);
  };

  // Logika pembacaan data disesuaikan untuk Weatherstack
  const locationInfo = weatherData?.location;
  const currentForecast = weatherData?.current;
  // weather_descriptions adalah array, kita ambil yang pertama
  const weatherDescription =
    currentForecast?.weather_descriptions?.[0] || "Default";
  // Kita cari deskripsi dalam format lowercase di aset kita
  const assets =
    weatherAssets[weatherDescription.toLowerCase()] || weatherAssets["Default"];

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
            placeholder="Ketik nama kota..."
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
          <div className="loading-text">Lokasi tidak ditemukan.</div>
        ) : (
          <div className="weather-content-container">
            <div className="location-info">
              <h1>{locationInfo.name}</h1>
              <p>{locationInfo.country}</p>
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
                  {currentForecast.temperature}°C
                </h2>
                <p style={{ color: assets.color, textTransform: "capitalize" }}>
                  {weatherDescription}
                </p>
              </div>
            </div>
            <div className="extra-info">
              <p>Kelembapan: {currentForecast.humidity}%</p>
              <p>Angin: {currentForecast.wind_speed} km/j</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
