export default async function handler(request, response) {
  // Mengambil 'kode' dari URL, contoh: /api/getWeather?kode=32.73
  const { kode } = request.query;

  if (!kode) {
    return response.status(400).json({ error: "Kode wilayah tidak ditemukan" });
  }

  const BMKG_API_URL = `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${kode}`;

  try {
    const fetchResponse = await fetch(BMKG_API_URL);

    if (!fetchResponse.ok) {
      throw new Error(
        `Gagal mengambil data dari BMKG, status: ${fetchResponse.status}`
      );
    }

    const data = await fetchResponse.json();

    // Mengirim kembali data dari BMKG dengan sukses
    return response.status(200).json(data);
  } catch (error) {
    // Mengirim pesan error jika terjadi masalah
    return response.status(500).json({ error: error.message });
  }
}
