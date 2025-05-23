import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditBerita = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const beritaId = useParams();
  const jurnalisID = location.state.jurnalisID;

  const [formData, setFormData] = useState({
    jurnalis_id: jurnalisID,
    kategori_id: "",
    judul_berita: "",
    isi_berita: "",
    image_url: "",
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  // Fetch kategori
  useEffect(() => {
    axios
      .get("https://portal-berita-winnicode.vercel.app/berita/getAllKategori")
      .then((res) => setKategoriList(res.data))
      .catch((err) => console.error("Gagal fetch kategori:", err));
  }, []);

  // Fetch data berita yang akan diedit
  useEffect(() => {
    if (!beritaId) return;

    axios
      .get(`https://portal-berita-winnicode.vercel.app/berita/getBeritaById/${beritaId.id}`)
      .then((res) => {
        setFormData({
          jurnalis_id: res.data.jurnalis_id,
          kategori_id: res.data.kategori_id,
          judul_berita: res.data.judul_berita,
          isi_berita: res.data.isiberita,
          image_url: res.data.image_url,
        });
      })
      .catch((err) => {
        console.error("Gagal fetch berita:", err);
        Swal.fire("Gagal", "Tidak dapat memuat data berita", "error");
      });
  }, [beritaId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let image_url = formData.image_url;

    if (imageFile) {
      try {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        const uploadResponse = await axios.post("https://portal-berita-winnicode.vercel.app/cloudinary/upload", imageData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadResponse.status === 200) {
          image_url = uploadResponse.data;
        } else {
          throw new Error("Gagal upload gambar");
        }
      } catch (err) {
        Swal.fire("Gagal", "Upload gambar gagal", "error");
        return;
      }
    }

    try {
      const updatedData = { ...formData, image_url };

      const response = await axios.put(`https://portal-berita-winnicode.vercel.app/berita/edit/${beritaId.id}`, updatedData);

      if (response.status === 200) {
        Swal.fire("Sukses", "Berita berhasil diperbarui", "success");
      } else {
        throw new Error("Gagal update");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate berita", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Edit Berita</h2>

        <div className="mb-4">
          <label className="block mb-1 text-black">ID Jurnalis</label>
          <input type="text" name="jurnalis_id" value={formData.jurnalis_id} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Kategori</label>
          <select name="kategori_id" value={formData.kategori_id} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required>
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Judul Berita</label>
          <input type="text" name="judul_berita" value={formData.judul_berita} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" required />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Isi Berita</label>
          <textarea name="isi_berita" value={formData.isi_berita} onChange={handleChange} className="w-full p-2 border-2 border-black rounded" rows="5" required></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-black">Gambar (opsional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
          {formData.image_url && (
            <div className="mt-2">
              <img src={formData.image_url} alt="preview" className="max-h-40 rounded" />
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-blue-900 transition duration-300">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditBerita;
