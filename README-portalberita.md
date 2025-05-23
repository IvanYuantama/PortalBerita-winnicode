# 📰 Portal Berita

**Portal Berita** adalah platform web yang menyediakan informasi terkini dari berbagai kategori seperti **politik**, **teknologi**, **hiburan**, dan **olahraga**. Portal ini memungkinkan **jurnalis** untuk mengelola berita secara mandiri melalui sistem yang terintegrasi.

- Frontend: [https://portal-berita-dusky.vercel.app](https://portal-berita-dusky.vercel.app)
- Backend: [https://portal-berita-winnicode.vercel.app](https://portal-berita-winnicode.vercel.app)



# Fitur Utama

- Registrasi & login untuk pengguna dan jurnalis
- Pengelolaan berita oleh jurnalis
- Tampilan berita publik untuk pengguna
- Komentar/chat pengguna pada berita
- Manajemen profil pengguna & jurnalis



# Backend API Endpoints

### 🔐 Autentikasi & Pengguna

| Endpoint | Method | Deskripsi |
|---------|--------|-----------|
| `/user/signupUser` | POST | Registrasi user |
| `/user/loginUser` | POST | Login user |
| `/user/signupJurnalis` | POST | Registrasi jurnalis |
| `/user/loginJurnalis` | POST | Login jurnalis |
| `/user/getAllUser` | GET | Ambil semua user |
| `/user/getAllJurnalis` | GET | Ambil semua jurnalis |
| `/user/getUser/:username` | GET | Dapatkan user berdasarkan username |
| `/user/getJurnalis/:username` | GET | Dapatkan jurnalis berdasarkan username |
| `/user/getUserById/:id` | GET | Dapatkan user berdasarkan ID |
| `/user/getJurnalisById/:id` | GET | Dapatkan jurnalis berdasarkan ID |
| `/user/profileUser/:id` | PUT | Perbarui profil user |
| `/user/profileJurnalis/:id` | PUT | Perbarui profil jurnalis |

### 📰 Berita

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/berita/getAll` | GET | Ambil semua berita |
| `/berita/getAllKategori` | GET | Ambil semua kategori berita |
| `/berita/getBeritaById/:id` | GET | Ambil berita berdasarkan ID |
| `/berita/getById/:id` | GET | (Duplikat) Ambil berita berdasarkan ID |
| `/berita/getByJurnalis/:jurnalis_id` | GET | Ambil berita dari jurnalis |
| `/berita/add` | POST | Tambah berita baru |
| `/berita/edit/:id` | PUT | Edit berita berdasarkan ID |
| `/berita/delete/:id` | DELETE | Hapus berita berdasarkan ID |

### 💬 Komentar/Chat

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/berita/getChat/:berita_id` | GET | Ambil komentar pada berita |
| `/berita/addChat` | POST | Tambahkan komentar pada berita |



# Frontend Routes

| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/` | Redirect | Arahkan ke `/login` |
| `/login` | `Login.jsx` | Login user |
| `/register` | `Register.jsx` | Registrasi user |
| `/loginJurnalis` | `LoginJurnalis.jsx` | Login jurnalis |
| `/registerJurnalis` | `RegisterJurnalis.jsx` | Registrasi jurnalis |
| `/dashboardUser` | `DashboardUser.jsx` | Dashboard pengguna umum |
| `/dashboardJurnalis` | `DashboardJurnalis.jsx` | Dashboard jurnalis |
| `/berita/:id` | `BeritaUser.jsx` | Lihat detail berita |
| `/addBerita` | `AddBerita.jsx` | Tambah berita (jurnalis) |
| `/editBerita/:id` | `EditBerita.jsx` | Edit berita (jurnalis) |
| `/error` | `ErrorBoundary.jsx` | Halaman error fallback |



## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: (sesuai implementasi)
- **File upload**: Cloudinary
- **Hosting**: Vercel



## 📦 Instalasi

### Backend

```bash
cd Backend
npm install
npm run start
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```