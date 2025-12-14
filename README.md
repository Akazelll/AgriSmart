🌾 AgriSmart - Solusi Pertanian Cerdas Berbasis AI

AgriSmart adalah platform Smart Farming terintegrasi yang dirancang untuk memberdayakan petani padi di Indonesia dengan teknologi modern. Aplikasi ini menggabungkan kecerdasan buatan (AI) untuk deteksi penyakit tanaman, pemantauan cuaca real-time, dan manajemen keuangan usaha tani dalam satu dashboard yang intuitif dan responsif.

Sobat Petani Masa Kini: Pantau lahan, cegah penyakit, dan kelola keuntungan dengan lebih cerdas.

✨ Fitur Unggulan

1. 🤖 Deteksi Penyakit Tanaman (AI)

Diagnosa Instan: Menggunakan Machine Learning untuk mengidentifikasi penyakit pada daun padi (seperti Hawar Daun, Blast, Bercak Coklat) hanya dari foto.

Tingkat Akurasi: Menampilkan confidence score (tingkat keyakinan) dari hasil prediksi.

Solusi & Penanganan: Memberikan deskripsi penyakit dan rekomendasi tindakan atau obat yang diperlukan.

Riwayat Scan: Semua hasil scan tersimpan otomatis di database untuk pemantauan jangka panjang.

2. 🌦️ Pemantauan Cuaca & Lahan

Cuaca Real-time: Integrasi dengan OpenWeatherMap untuk menampilkan suhu, kelembaban, kecepatan angin, dan kondisi langit saat ini.

Prakiraan Cuaca: Prediksi cuaca per 3 jam untuk membantu perencanaan waktu tanam atau penyemprotan.

Peta Interaktif: Visualisasi lokasi lahan menggunakan Leaflet maps.

3. 💰 Manajemen Keuangan Tani

Pencatatan Transaksi: Catat pemasukan (hasil panen) dan pengeluaran (pupuk, bibit, upah) dengan mudah.

Ringkasan Saldo: Kalkulasi otomatis total keuntungan dan arus kas.

Analisis Visual: Grafik tren pemasukan vs pengeluaran (direncanakan).

4. 📊 Dashboard Terintegrasi

Pusat kontrol yang menampilkan ringkasan aktivitas hari ini.

Statistik frekuensi penyakit yang terdeteksi di lahan.

Akses cepat ke fitur-fitur utama.

5. 🔐 Keamanan & Profil

Sistem autentikasi aman menggunakan NextAuth.js (Email/Password & Google OAuth).

Manajemen profil pengguna.

🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan tech stack modern untuk performa tinggi dan pengalaman pengembang yang baik.

Frontend

Framework: Next.js 16 (App Router)

Language: TypeScript

Styling: Tailwind CSS v4

UI Components: Shadcn UI (Radix UI)

Icons: Lucide React, React Icons

Charts: Recharts

Maps: React Leaflet

Notifications: Sonner

Backend & Services

Database: Supabase (PostgreSQL)

Auth: NextAuth.js v5 (Beta) / Auth.js

Storage: Supabase Storage (untuk menyimpan gambar hasil scan)

AI Service (External): Python Flask API (TensorFlow/Keras Model)

Weather API: OpenWeatherMap

🚀 Panduan Instalasi (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer Anda.

Prasyarat

Node.js (Versi 18 atau lebih baru)

npm atau yarn/pnpm

Akun Supabase (untuk Database & Auth)

API Key OpenWeatherMap

Backend Python (dijalankan terpisah, lihat folder backend jika ada)

1. Clone Repository

git clone [https://github.com/username-anda/agrismart.git](https://github.com/username-anda/agrismart.git)
cd agrismart


2. Install Dependencies

npm install
# atau
pnpm install


3. Konfigurasi Environment Variables

Buat file .env.local di root folder proyek dan salin konfigurasi berikut. Isi dengan kredensial Anda.

# --- Supabase Configuration ---
# Dapatkan di Project Settings > API
NEXT_PUBLIC_SUPABASE_URL="[https://your-project-id.supabase.co](https://your-project-id.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" # Hati-hati, jangan commit ini ke public repo!

# --- NextAuth Configuration ---
# Generate secret dengan: openssl rand -base64 32
AUTH_SECRET="your-generated-secret-string"
AUTH_URL="http://localhost:3000" # Atau domain production

# Google OAuth (Opsional, jika menggunakan login Google)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# --- External APIs ---
# URL Backend Python (Flask) untuk prediksi AI
NEXT_PUBLIC_API_URL="[http://127.0.0.1:5000](http://127.0.0.1:5000)" 

# OpenWeatherMap API Key
NEXT_PUBLIC_OPENWEATHER_API_KEY="your-openweathermap-api-key"


4. Setup Database (Supabase)

Pastikan Anda telah membuat tabel-tabel berikut di Supabase (SQL Editor):

users: Menyimpan data pengguna.

scan_history: Menyimpan riwayat scan (kolom: id, user_id, image_url, label, confidence, description, solution, created_at).

transactions: Menyimpan data keuangan (kolom: id, user_id, description, amount, type, date, created_at).

Catatan: Pastikan Row Level Security (RLS) diaktifkan dan policy diatur agar pengguna hanya bisa mengakses data mereka sendiri.

5. Jalankan Aplikasi

npm run dev


Buka browser dan akses http://localhost:3000.

📂 Struktur Proyek

Berikut adalah gambaran struktur folder utama proyek AgriSmart:

agrismart/
├── public/                 # Aset statis (gambar, icon, svg)
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── actions/        # Server Actions (Interaksi database server-side)
│   │   ├── api/            # API Routes (NextAuth handler)
│   │   ├── dashboard/      # Halaman Dashboard Utama
│   │   ├── keuangan/       # Halaman Manajemen Keuangan
│   │   ├── login/          # Halaman Login
│   │   ├── penyakit/       # Halaman Riwayat & Detail Penyakit
│   │   ├── prediction/     # Halaman Scan AI
│   │   ├── profile/        # Halaman Profil User
│   │   ├── register/       # Halaman Pendaftaran
│   │   └── weather/        # Halaman Cuaca
│   ├── components/         # Komponen UI Reusable
│   │   ├── dashboard/      # Komponen khusus dashboard
│   │   ├── ui/             # Komponen Shadcn UI (Button, Card, Input, dll)
│   │   ├── weather/        # Komponen khusus cuaca
│   │   └── ...             # Komponen global (Sidebar, Navbar)
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Utilitas (utils.ts)
│   ├── types/              # Definisi Tipe TypeScript
│   ├── auth.ts             # Konfigurasi NextAuth
│   └── middleware.ts       # Middleware proteksi rute
├── .env.local              # Environment variables (tidak dicommit)
├── next.config.ts          # Konfigurasi Next.js
├── tailwind.config.ts      # Konfigurasi Tailwind (jika tidak menggunakan v4 native)
└── package.json            # Daftar dependensi
