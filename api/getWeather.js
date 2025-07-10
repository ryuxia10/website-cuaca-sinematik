export default async function handler(request, response) {
  // Mengambil 'kota' dari URL, contoh: /api/getWeather?kota=Bandung
  const { kota } = request.query;
  // Mengambil kunci API yang sudah kita perbarui di Vercel
  const apiKey = process.env.VITE_WEATHER_API_KEY;

  if (!kota) {
    return response.status(400).json({ error: "Nama kota tidak ditemukan" });
  }
  if (!apiKey) {
    return response
      .status(500)
      .json({ error: "Kunci API tidak diatur di server" });
  }

  // URL API Weatherstack (Paket gratis menggunakan HTTP)
  const API_URL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${kota}`;

  try {
    const fetchResponse = await fetch(API_URL);
    const data = await fetchResponse.json();

    // Weatherstack mengirimkan 'success: false' jika ada error
    if (data.success === false) {
      throw new Error(data.error.info);
    }

    // Mengirim kembali data dari Weatherstack dengan sukses
    return response.status(200).json(data);
  } catch (error) {
    // Mengirim pesan error jika terjadi masalah
    return response.status(500).json({ error: error.message });
  }
}
