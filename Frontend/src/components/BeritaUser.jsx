import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const BeritaUser = () => {
  const { id } = useParams(); // id berita dari URL
  const location = useLocation();
  const { username } = location.state || {};
  const [user, setUser] = useState(null);
  const [berita, setBerita] = useState(null);
  const [jurnalis, setJurnalis] = useState(null);
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState("");

  // Ambil data user
  useEffect(() => {
    if (username) {
      axios
        .get(`https://portal-berita-winnicode.vercel.app/user/getUser/${username}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Gagal ambil user", err));
    }
  }, [username]);

  // Ambil berita dan jurnalis
  useEffect(() => {
    axios
      .get(`https://portal-berita-winnicode.vercel.app/berita/getById/${id}`)
      .then(async (res) => {
        const beritaData = res.data;
        setBerita(beritaData);
        const jurnalissID = beritaData.jurnalis_id;
        if (true) {
          const jurnalisRes = await axios.get(`https://portal-berita-winnicode.vercel.app/user/getJurnalisById/${jurnalissID}`);
          setJurnalis(jurnalisRes.data);
        }
      })
      .catch((err) => console.error("Gagal ambil berita", err));
  }, [id]);

  const enrichChatsWithUsernames = async (chats) => {
    const uniqueUserIds = [...new Set(chats.map((chat) => chat.user_id))];
    const userIdToUsername = {};

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const res = await axios.get(`https://portal-berita-winnicode.vercel.app/user/getUserById/${userId}`);
          userIdToUsername[userId] = res.data.username;
        } catch (err) {
          console.error(`Gagal mengambil username untuk user_id ${userId}`, err);
          userIdToUsername[userId] = "Unknown";
        }
      })
    );

    const enrichedChats = chats.map((chat) => ({
      ...chat,
      username: userIdToUsername[chat.user_id] || "Unknown",
    }));

    setChats(enrichedChats);
  };

  useEffect(() => {
    axios
      .get(`https://portal-berita-winnicode.vercel.app/berita/getChat/${id}`)
      .then((res) => enrichChatsWithUsernames(res.data))
      .catch((err) => console.error("Gagal ambil chat", err));
  }, [id]);

  // Tambahkan chat baru
  const handleAddChat = () => {
    if (!newChat || !user) return;
    axios
      .post(`https://portal-berita-winnicode.vercel.app/berita/addChat`, {
        user_id: user.id,
        berita_id: id,
        chat: newChat,
      })
      .then(() => {
        setNewChat("");
        return axios.get(`https://portal-berita-winnicode.vercel.app/berita/getChat/${id}`);
      })
      .then((res) => enrichChatsWithUsernames(res.data))
      .catch((err) => console.error("Gagal menambah chat", err));
  };

  // Copy link ke clipboard
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        Swal.fire({
          title: "Berhasil!",
          text: "Link berhasil disalin ke clipboard.",
          icon: "success",
          confirmButtonText: "OK",
        });
      })
      .catch((err) => {
        console.error("Gagal salin link", err);
        Swal.fire({
          title: "Gagal!",
          text: "Tidak dapat menyalin link.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  if (!berita) return <div className="text-center mt-20">Loading berita...</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Atas */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div>
            <p>Publish: {new Date(berita.created_at).toLocaleString()}</p>
            <p>Last Edit: {new Date(berita.updated_at).toLocaleString()}</p>
          </div>
          <div>
            <p>
              By: <strong>{jurnalis?.username || "Unknown"}</strong>
            </p>
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-3xl pt-10 font-bold text-center mb-4">{berita.judul_berita}</h1>

        {/* Gambar */}
        <img src={berita.image_url} alt={berita.judul_berita} className="w-full px-20 py-5 object-cover rounded-md mb-4" />

        {/* Isi berita */}
        <p className="text-gray-800 leading-relaxed mb-6 whitespace-pre-line text-justify">{berita["isi berita"]}</p>

        {/* Tombol Copy Link */}
        <div className="flex justify-end mb-4">
          <button onClick={handleCopyLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Share Berita
          </button>
        </div>

        {/* Chat Area */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Diskusi Berita</h2>
          <div className="h-48 overflow-y-auto bg-gray-100 border border-gray-300 rounded p-4 mb-4">
            {chats.length === 0 && <p className="text-gray-500">Belum ada chat.</p>}
            {chats.map((chat) => (
              <div key={chat.id} className="mb-2">
                <span className="font-semibold">{chat.username || "User"}: </span>
                <span>{chat.chat}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newChat} onChange={(e) => setNewChat(e.target.value)} className="flex-1 border border-gray-300 rounded px-4 py-2" placeholder="Tulis chat..." />
            <button onClick={handleAddChat} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeritaUser;
