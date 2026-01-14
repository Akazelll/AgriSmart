
# 🌾 AgriSmart Frontend — Smart Farming Dashboard (Next.js)

<p align="center">
  <b>Frontend</b> untuk platform smart farming berbasis AI: deteksi penyakit padi, pemantauan cuaca & peta, manajemen keuangan tani, dan riwayat aktivitas — dalam UI yang modern, cepat, dan responsif.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black">
  <img alt="Tailwind" src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green.svg">
</p>

---

## ✨ Fitur Utama (Frontend)

### 🤖 AI Disease Detection UI
- Upload/scan foto daun padi
- Menampilkan hasil prediksi:
  - label penyakit
  - **confidence hingga 3 angka desimal**
  - rekomendasi solusi penanganan
- Riwayat scan tersimpan (foto + tanggal)

### 🌦️ Weather & Map
- Cuaca real-time: suhu, kelembaban, kecepatan angin
- Peta interaktif berbasis **Leaflet** untuk monitoring lokasi/lahan

### 💰 Manajemen Keuangan Tani
- Pencatatan pemasukan & pengeluaran
- Perhitungan otomatis saldo & estimasi keuntungan
- Ringkasan keuangan di dashboard

### 📊 Dashboard & Analytics
- Grafik statistik aktivitas menggunakan **Recharts**
- UI modern dengan **Shadcn UI + Tailwind**

---

## 🧱 Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Shadcn UI, Lucide React
- Recharts

**Auth & Database**
- Supabase (PostgreSQL)
- NextAuth.js
- Server Actions untuk operasi data

**Integrasi API**
- AI Backend (Flask) melalui `NEXT_PUBLIC_API_URL`

---

## 🗂️ Struktur Folder (Ringkas)

```bash
src/
├─ app/            # routing utama aplikasi (Dashboard, Keuangan, Prediksi, dll)
├─ actions/        # Server Actions (CRUD Supabase)
├─ components/     # UI reusable (charts, sidebar, weather, dll)
└─ lib/            # helper, konfigurasi, utilitas
````

---

## ✅ Prasyarat

* Node.js **v18+**
* NPM / PNPM / Yarn (bebas)
* Project **Supabase** (URL + Keys)
* AI Backend berjalan (lokal / Hugging Face Spaces)

---

## 🚀 Setup & Run (Local)

### 1) Clone Repo

```bash
git clone https://github.com/Akazelll/AgriSmart.git
cd AgriSmart
```

### 2) Install Dependencies

```bash
npm install
```

### 3) Buat `.env.local`

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# IMPORTANT: service role key hanya digunakan server-side
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
AUTH_SECRET="your-generated-secret"

# AI Backend URL (lokal atau Spaces)
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
```

### 4) Jalankan Dev Server

```bash
npm run dev
```

Buka:

* `http://localhost:3000`

---

## 🧪 Scripts

```bash
npm run dev       # start development
npm run build     # build production
npm run start     # start production server
npm run lint      # lint check
```

---

## 🔌 Integrasi AI Backend

Frontend akan mengirim request ke AI backend melalui:

* `NEXT_PUBLIC_API_URL`

Alur singkat:

1. User upload foto daun padi
2. Frontend mengirim request ke backend (file / `image_url` sesuai implementasi)
3. Backend mengembalikan `label`, `confidence`, `solution`
4. Frontend menampilkan hasil + menyimpan riwayat ke Supabase

> Pastikan `NEXT_PUBLIC_API_URL` sesuai environment (lokal vs Spaces). Jika backend tidak tersedia, UI sebaiknya menampilkan state “failed / retry”.

---

## 🔒 Security Notes

* Jangan commit file `.env.local`
* `SUPABASE_SERVICE_ROLE_KEY` **sangat sensitif** → gunakan hanya di server-side (Server Actions / route handler), jangan pernah dipakai di client.

---

## 🌍 Deployment (Vercel)

Deploy direkomendasikan menggunakan **Vercel**.

Set environment variables di Vercel:

* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`
* `AUTH_SECRET`
* `NEXT_PUBLIC_API_URL`

---

## 🤝 Contributing

1. Fork repo
2. Buat branch: `feat/nama-fitur`
3. Commit: `git commit -m "feat: add ..."`
4. Push & buat Pull Request

---

## 📄 License

MIT License.

---

<p align="center">
  Dibuat dengan ❤️ untuk <b>Petani Indonesia</b><br/>
  AgriSmart Team © 2025
</p>
