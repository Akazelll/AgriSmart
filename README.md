# 🌾 AgriSmart Frontend — Smart Farming Dashboard (Next.js)

<p align="center">
  <b>Frontend</b> untuk platform smart farming berbasis AI: deteksi penyakit padi, monitoring cuaca & peta, manajemen keuangan tani, dan dashboard riwayat — semuanya dalam UI modern & responsif.
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
- Tampilkan hasil prediksi:
  - label penyakit
  - **confidence hingga 3 angka desimal**
  - rekomendasi solusi penanganan
- Riwayat scan tersimpan (foto + tanggal)

### 🌦️ Weather & Map
- Cuaca real-time: suhu, kelembaban, kecepatan angin
- Peta interaktif berbasis **Leaflet** (monitoring lokasi/lahan)

### 💰 Manajemen Keuangan Tani
- Input pemasukan & pengeluaran
- Perhitungan otomatis saldo & estimasi keuntungan
- Ringkasan di dashboard

### 📊 Dashboard & Analytics
- Grafik statistik aktivitas menggunakan **Recharts**
- Tampilan dashboard modern (Shadcn UI + Tailwind)

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
- AI Backend (Flask) via `NEXT_PUBLIC_API_URL`

---

## 🗂️ Struktur Folder (Ringkas)

```bash
src/
├─ app/            # routing utama (Dashboard, Keuangan, Prediksi, dll)
├─ actions/        # server actions (CRUD Supabase)
├─ components/     # UI reusable (charts, sidebar, weather, dsb)
└─ lib/            # helper, konfigurasi, utilitas

✅ Prasyarat

Node.js v18+

NPM / PNPM / Yarn (bebas, sesuaikan)

Project Supabase (URL + Keys)

AI Backend berjalan (lokal / HuggingFace Spaces)

🚀 Setup & Run (Local)
1) Clone Repo
git clone https://github.com/Akazelll/AgriSmart.git
cd AgriSmart

2) Install Dependencies
npm install

3) Buat .env.local

Buat file .env.local di root project:

NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# IMPORTANT: service role key hanya digunakan server-side
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
AUTH_SECRET="your-generated-secret"

# AI Backend URL (lokal atau Spaces)
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"

4) Jalankan Dev Server
npm run dev


Buka:

http://localhost:3000

🧪 Scripts
npm run dev       # start development
npm run build     # build production
npm run start     # start production server
npm run lint      # lint check

🔌 Konfigurasi Integrasi AI Backend

Frontend akan mengirim request ke AI backend melalui:

NEXT_PUBLIC_API_URL

Contoh (konsep):

upload foto → frontend mengirim ke backend (atau mengirim image_url tergantung implementasi)

backend balikin label, confidence, solution

frontend render hasil + simpan riwayat ke Supabase

Pastikan URL backend tidak salah (lokal vs Spaces). Kalau backend down, UI bisa menampilkan state “failed / retry”.

🔒 Security Notes (Penting)

Jangan commit .env.local

SUPABASE_SERVICE_ROLE_KEY itu super sensitif → pastikan hanya dipakai di server-side (Server Actions / route handler), jangan bocor ke client.

🌍 Deployment

Frontend direkomendasikan deploy di Vercel:

Set environment variables di dashboard Vercel:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

AUTH_SECRET

NEXT_PUBLIC_API_URL

🤝 Contributing

Fork repo

Buat branch: feat/nama-fitur

Commit: git commit -m "feat: add ..."

Push & buat Pull Request

📄 License

MIT License.

<p align="center"> Dibuat dengan ❤️ untuk <b>Petani Indonesia</b><br/> AgriSmart Team © 2024 </p> ```
