export default async function handler(request, response) {
  const { kota } = request.query;
  // Kita akan gunakan nama variabel yang lebih sederhana di Vercel
  const apiKey = process.env.WEATHER_API_KEY;

  if (!kota) {
    return response.status(400).json({ error: "Nama kota tidak ditemukan" });
  }
  if (!apiKey) {
    return response
      .status(500)
      .json({ error: "Kunci API tidak diatur di server" });
  }

  const API_URL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${kota}`;

  try {
    const fetchResponse = await fetch(API_URL);
    const data = await fetchResponse.json();

    if (data.success === false) {
      throw new Error(data.error.info);
    }

    // Mengizinkan akses dari semua sumber (Penting untuk CORS)
    response.setHeader("Access-Control-Allow-Origin", "*");
    return response.status(200).json(data);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
