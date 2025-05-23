const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Mendapatkan semua berita
async function getAllBerita(req, res) {
  try {
    const result = await pool.query("SELECT * FROM berita ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllKategori(req, res) {
  try {
    const result = await pool.query("SELECT * FROM kategori;");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Mendapatkan berita berdasarkan ID
async function getBeritaById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM berita WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Berita tidak ditemukan" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Mendapatkan berita berdasarkan ID jurnalis
async function getBeritaByJurnalisId(req, res) {
  const { jurnalis_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM berita WHERE jurnalis_id = $1 ORDER BY created_at DESC", [jurnalis_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Mendapatkan chat berita berdasarkan ID berita
async function getChatBeritaById(req, res) {
  const { berita_id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM chat_berita WHERE berita_id = $1 ORDER BY created_at ASC", [berita_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Menambahkan berita baru
async function addBerita(req, res) {
  const { jurnalis_id, kategori_id, judul_berita, isi_berita, image_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO berita (jurnalis_id, kategori_id, judul_berita, "isi berita", image_url, total_likes) 
       VALUES ($1, $2, $3, $4, $5, 0) RETURNING *`,
      [jurnalis_id, kategori_id, judul_berita, isi_berita, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Menghapus berita berdasarkan ID
async function deleteBerita(req, res) {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM chat_berita WHERE berita_id = $1", [id]); // hapus chat terkait dulu
    const result = await pool.query("DELETE FROM berita WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Berita tidak ditemukan" });
    res.status(200).json({ message: "Berita berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Mengedit berita berdasarkan ID
async function editBerita(req, res) {
  const { id } = req.params;
  const { judul_berita, isi_berita, image_url, kategori_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE berita SET 
        judul_berita = $1, 
        "isi berita" = $2, 
        image_url = $3, 
        kategori_id = $4, 
        updated_at = now()
       WHERE id = $5 RETURNING *`,
      [judul_berita, isi_berita, image_url, kategori_id, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: "Berita tidak ditemukan" });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Menambahkan chat untuk berita
async function addChatBerita(req, res) {
  const { user_id, berita_id, chat } = req.body;
  try {
    // Menyisipkan chat baru ke dalam tabel chat_berita
    const result = await pool.query(
      `INSERT INTO chat_berita (user_id, berita_id, chat) 
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, berita_id, chat]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllBerita,
  getBeritaById,
  getBeritaByJurnalisId,
  getChatBeritaById,
  addBerita,
  deleteBerita,
  editBerita,
  addChatBerita,
  getAllKategori,
};
