import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const AddBerita = () => {
  const location = useLocation();
  const jurnalisIdFromState = location.state.jurnalisID;
  const [kategoriList, setKategoriList] = useState([]);
  console.log(jurnalisIdFromState);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get("https://portal-berita-winnicode.vercel.app/berita/getAllKategori");
        if (response.status === 200) {
          setKategoriList(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  const [formData, setFormData] = useState({
    jurnalis_id: jurnalisIdFromState,
    kategori_id: "",
    judul_berita: "",
    isi_berita: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Silakan upload gambar terlebih dahulu!",
      });
      return;
    }

    try {
      // Upload ke Cloudinary via backend
      const imageData = new FormData();
      imageData.append("image", imageFile);

      const uploadResponse = await axios.post("https://portal-berita-winnicode.vercel.app/cloudinary/upload", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status === 200) {
        const image_url = uploadResponse.data;

        const updatedFormData = { ...formData, image_url };

        // Submit berita
        const response = await axios.post("https://portal-berita-winnicode.vercel.app/berita/add", updatedFormData);

        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Berita Ditambahkan",
            text: "Berita berhasil ditambahkan ke database.",
          });

          // Reset form
          setFormData({
            jurnalis_id: "",
            kategori_id: "",
            judul_berita: "",
            isi_berita: "",
            image_url: "",
          });
          setImageFile(null);
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal Tambah Berita",
            text: "Terjadi kesalahan saat menambahkan berita.",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Upload Gagal",
          text: "Gagal mengunggah gambar. Silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Server",
        text: "Terjadi kesalahan. Silakan coba lagi nanti.",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Tambah Berita</h2>

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
          <label className="block mb-1 text-black">Upload Gambar</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" required />
        </div>

        <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
          Tambah Berita
        </button>
      </form>
    </div>
  );
};

export default AddBerita;
