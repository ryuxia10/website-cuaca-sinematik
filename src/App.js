import React, { useState, useEffect, useCallback, useRef} from "react";
import "./App.css";

// Peta aset tidak berubah
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
  const [searchTerm, setSearchTerm] = useState("Bandung");
  // --- PENAMBAHAN BARU ---
  // ref untuk menunjuk ke elemen <audio>
  const audioRef = useRef(null);
  // state untuk melacak apakah pengguna sudah berinteraksi
  const [userInteracted, setUserInteracted] = useState(false);

  const fetchWeatherData = useCallback(async (kota) => {
    if (!kota) return;
    setLoading(true);

    // Mengambil kunci API dari environment variable yang sudah kita buat
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    // URL API Weatherstack yang akan dipanggil LANGSUNG dari browser
    // (Paket gratis Weatherstack menggunakan http)
    const API_URL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${kota}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success === false) {
        // Jika Weatherstack memberi error (cth: kota tidak ada), tampilkan pesannya
        throw new Error(data.error.info);
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
    // Otomatis mencari Bandung saat aplikasi pertama kali dimuat
    fetchWeatherData("Bandung");
  }, [fetchWeatherData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!userInteracted) setUserInteracted(true);
    fetchWeatherData(searchTerm);
  };

  // Bagian ini tidak berubah...
  const locationInfo = weatherData?.location;
  const currentForecast = weatherData?.current;
  const weatherDescription =
    currentForecast?.weather_descriptions?.[0] || "Default";
  const assets =
    weatherAssets[weatherDescription.toLowerCase()] || weatherAssets["Default"];
  // --- PENAMBAHAN BARU ---
  // useEffect ini khusus untuk mengurus audio
  useEffect(() => {
    // Jika ada elemen audio dan ada file suara yang harus diputar...
    if (audioRef.current && assets.sound) {
      // Ganti sumber suara dan muat ulang
      audioRef.current.src = assets.sound;
      audioRef.current.load();
      // Jika pengguna sudah berinteraksi, coba putar suaranya
      if (userInteracted) {
        audioRef.current.play().catch((error) => {
          // Menangkap error jika browser tetap memblokir, tapi biasanya tidak setelah interaksi pertama
          console.log("Autoplay diblokir oleh browser:", error);
        });
      }
    } else if (audioRef.current) {
      // Jika tidak ada suara (misal: cuaca berawan), hentikan dan kosongkan sumber
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [assets.sound, userInteracted]); // Dijalankan setiap kali sumber suara atau status interaksi berubah

  return (
    <div className="App">
      {/* ... seluruh JSX Anda dari <video> sampai </main> tidak berubah ... */}
      <video
        key={assets.video}
        autoPlay
        loop
        muted
        className="background-video"
      >
        <source src={assets.video} type="video/mp4" />
      </video>
      {/* --- PERUBAHAN DI SINI --- */}
      {/* Kita hapus `autoPlay` dan `key`, lalu tambahkan `ref` */}
      <audio ref={audioRef} loop />
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
