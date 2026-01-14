## 🤖 AI Backend — Hugging Face Spaces (Flask + EfficientNet)

Backend AI AgriSmart di-deploy menggunakan **Hugging Face Spaces** (SDK: **Docker**) dan menjalankan API **Flask** untuk inference model EfficientNet. :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

### 📁 Struktur File (Hugging Face Spaces)

```bash
.
├── app.py                    # Flask API (endpoint / dan /predict)
├── requirements.txt          # Dependency Python untuk runtime
├── Dockerfile                # Config Spaces (sdk: docker)
├── efficientnetb0_model.keras# Model hasil training (Keras)
├── class_indices.json        # Mapping index -> nama kelas penyakit
└── train_model.py            # Script training (opsional / lokal)
app.py adalah entry utama API inference. 
app


class_indices.json dipakai agar output model jadi label penyakit yang benar. 
class_indices


🔌 Endpoint API
1) Health Check
GET /

Mengembalikan status server + apakah model berhasil ke-load (berguna buat debugging). 
app


Contoh respons:

model_ready

tf_version

model_file_size_mb

ERROR_MESSAGE

2) Prediksi Penyakit
POST /predict

Body (JSON):

json
Salin kode
{
  "image_url": "https://....jpg"
}
Response (JSON):

label (nama penyakit)

confidence (persen)

description

solution

Endpoint ini melakukan download gambar dari image_url, resize ke 224x224, lalu inference dan mengembalikan rekomendasi solusi. 
app


🧪 Dependency (requirements.txt)
Backend membutuhkan library berikut (Flask, TensorFlow CPU, Keras, Pillow, requests, dll). 
requirements


⚙️ Catatan Deployment Spaces
Aplikasi Flask berjalan pada port 7860 (default Spaces). 
app


app.py punya pengecekan ukuran file model untuk menghindari kasus Git LFS pointer (model palsu/rusak). 
app


🧠 Kelas Penyakit yang Didukung
Model mengenali beberapa kelas berikut (sesuai mapping). 
class_indices


Bacterial Leaf Blight

Brown Spot

Healthy Rice Leaf

Leaf Blast

Leaf scald

Narrow Brown Leaf Spot

Neck_Blast

Rice Hispa

Sheath Blight

markdown
Salin kode

Kalau kamu mau, aku juga bisa **benerin README utama kamu** biar ada:
- link demo Spaces + badge “Hugging Face Spaces”
- contoh request `curl` untuk `/predict`
- diagram arsitektur (Next.js → API Spaces → response)  
Tinggal bilang aja mau gaya yang “simple” atau “lebih showcase buat lomba/portfolio”.

Sumber






Anda bilang:
buatkan saya readme untuk project front end terlebih dahulu yang baik dan benar


ChatGPT bilang:
md
Salin kode
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
bash
Salin kode
git clone https://github.com/Akazelll/AgriSmart.git
cd AgriSmart
2) Install Dependencies
bash
Salin kode
npm install
3) Buat .env.local
Buat file .env.local di root project:

env
Salin kode
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# IMPORTANT: service role key hanya digunakan server-side
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# NextAuth
AUTH_SECRET="your-generated-secret"

# AI Backend URL (lokal atau Spaces)
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
4) Jalankan Dev Server
bash
Salin kode
npm run dev
Buka:

http://localhost:3000

🧪 Scripts
bash
Salin kode
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
