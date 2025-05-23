import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const DashboardUser = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { username } = location.state || {};
  const [user, setUser] = useState(null);
  const [berita, setBerita] = useState([]);
  const [filteredBerita, setFilteredBerita] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user data
  useEffect(() => {
    if (username) {
      axios
        .get(`https://portal-berita-winnicode.vercel.app/user/getUser/${username}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Gagal mengambil data user:", error);
        });
    }
  }, [username]);

  // Fetch berita
  useEffect(() => {
    axios
      .get("https://portal-berita-winnicode.vercel.app/berita/getAll")
      .then((response) => {
        setBerita(response.data);
        setFilteredBerita(response.data); // Initialize filteredBerita with all berita
      })
      .catch((error) => {
        console.error("Gagal mengambil data berita:", error);
      });
  }, []);

  // Filter berita berdasarkan judul
  const handleSearch = () => {
    const filtered = berita.filter((item) => item.judul_berita.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredBerita(filtered);
  };

  // Sort berita berdasarkan waktu (New News)
  const handleFilterNewNews = () => {
    const sorted = [...berita].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setFilteredBerita(sorted);
  };

  // Sort berita berdasarkan waktu (Old News)
  const handleFilterOldNews = () => {
    const sorted = [...berita].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    setFilteredBerita(sorted);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  // Navigate to BeritaUser page when Read More is clicked
  const handleReadMore = (newsId) => {
    navigate(`/berita/${newsId}`, {
      state: {
        username: username, // Mengirim username
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Judul Dashboard */}
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard User</h1>

      {/* Top Bar: Filter Buttons, Welcome, and Logout */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button onClick={handleFilterNewNews} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 shadow">
            New News
          </button>
          <button onClick={handleFilterOldNews} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 shadow">
            Old News
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
              <img
                src={user.image_url} // fallback jika tidak ada foto
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <span>
                Welcome! <strong>{user.username}</strong>
              </span>
            </div>
          )}

          <button
            onClick={() => navigate("/")} // Ganti "/" dengan route login kamu
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 shadow"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input type="text" placeholder="Search by title..." className="w-full max-w-2xl px-4 py-2 border border-gray-300 rounded-md shadow" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* Berita Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBerita.map((news) => (
          <div key={news.id} className="bg-white rounded-lg shadow-xl overflow-hidden">
            <img src={news.image_url} alt={news.judul_berita} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{news.judul_berita}</h2>
              <p className="text-gray-700 line-clamp-3 mb-4">{news["isi berita"]}</p>
              <button
                onClick={() => handleReadMore(news.id)} // Add onClick to navigate
                className="bg-black text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardUser;
