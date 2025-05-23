import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";
import axios from "axios";

const DashboardJurnalis = () => {
  const [beritaList, setBeritaList] = useState([]);
  const [filteredBerita, setFilteredBerita] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jurnalisId, setJurnalisId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate(); // <--- Tambahkan ini
  const { username } = location.state || {};

  // Ambil ID Jurnalis berdasarkan username
  useEffect(() => {
    if (!username) return;
    axios
      .get(`https://portal-berita-winnicode.vercel.app/user/getJurnalis/${username}`)
      .then((res) => {
        const jurnalisID = res.data.id;
        setJurnalisId(jurnalisID);
      })
      .catch((err) => console.error(err));
  }, [username]);

  // Ambil berita berdasarkan jurnalisId
  useEffect(() => {
    if (!jurnalisId) return;
    console.log(jurnalisId);
    axios
      .get(`https://portal-berita-winnicode.vercel.app/berita/getByJurnalis/${jurnalisId}`)
      .then((res) => {
        setBeritaList(res.data);
        setFilteredBerita(res.data);
      })
      .catch((err) => console.error(err));
  }, [jurnalisId]);

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Berita akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://portal-berita-winnicode.vercel.app/berita/delete/${id}`)
          .then(() => {
            Swal.fire("Dihapus!", "Berita berhasil dihapus.", "success");
            setBeritaList((prev) => prev.filter((item) => item.id !== id));
            setFilteredBerita((prev) => prev.filter((item) => item.id !== id));
          })
          .catch((err) => {
            Swal.fire("Error", "Gagal menghapus berita.", "error");
            console.error(err);
          });
      }
    });
  };

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = beritaList.filter((item) => item.judul_berita.toLowerCase().includes(query));
    setFilteredBerita(filtered);
  };

  const handleAdd = (e) => {
    navigate(`/addBerita`, {
      state: {
        jurnalisID: jurnalisId, // Mengirim jurnalis id
      },
    });
  };

  const handleEdit = (beritaID) => {
    navigate(`/editBerita/${beritaID}`, {
      state: {
        jurnalisID: jurnalisId, // Mengirim jurnalis id
      },
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700">
          + Tambah Berita
        </button>
        <input type="text" placeholder="Cari judul berita..." value={searchQuery} onChange={handleSearch} className="w-1/2 px-4 py-2 rounded-lg border shadow" />
        <div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBerita.map((berita) => (
          <div key={berita.id} className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
            <img src={berita.image_url} alt={berita.judul_berita} className="rounded-xl mb-3 h-40 object-cover" />
            <h2 className="text-xl font-semibold mb-2">{berita.judul_berita}</h2>
            <p className="text-sm text-gray-500 mb-2">{new Date(berita.created_at).toLocaleDateString()}</p>
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleEdit(berita.id)} className="flex-1 bg-yellow-400 text-white py-1 rounded-lg hover:bg-yellow-500">
                Edit
              </button>
              <button onClick={() => handleDelete(berita.id)} className="flex-1 bg-red-500 text-white py-1 rounded-lg hover:bg-red-600">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardJurnalis;
