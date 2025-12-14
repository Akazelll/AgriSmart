# 🌾 AgriSmart - Solusi Pertanian Cerdas Berbasis AI

![AgriSmart Banner](public/img/logo2.png)

**AgriSmart** adalah platform _Smart Farming_ terintegrasi yang memberdayakan petani padi dengan teknologi Kecerdasan Buatan (AI). Aplikasi ini membantu petani mendeteksi penyakit tanaman secara dini, memantau kondisi cuaca lokal, dan mengelola keuangan usaha tani dalam satu _dashboard_ yang mudah digunakan.

Proyek ini menggabungkan kekuatan **Deep Learning** untuk analisis citra dan **Web Development Modern** untuk pengalaman pengguna yang responsif.

---

## ✨ Fitur Unggulan

### 1. 🤖 Deteksi Penyakit Tanaman (AI)
* Menggunakan model **EfficientNet** yang dilatih untuk mengenali penyakit padi seperti:
    * *Bacterial Leaf Blight* (Hawar Daun Bakteri)
    * *Brown Spot* (Bercak Coklat)
    * *Leaf Blast* (Blast Daun)
    * *Leaf Smut* (Gosong Daun)
* Menampilkan tingkat akurasi (Confidence Score) hingga **3 angka desimal**.
* Memberikan solusi penanganan dan rekomendasi obat sesuai penyakit yang terdeteksi.

### 2. 🌦️ Pemantauan Cuaca & Peta
* Integrasi data cuaca *real-time* (Suhu, Kelembaban, Angin).
* Peta interaktif untuk melihat kondisi lahan dan cuaca sekitar.

### 3. 💰 Manajemen Keuangan Tani
* Pencatatan arus kas (Pemasukan & Pengeluaran).
* Kalkulasi otomatis total saldo dan keuntungan.
* Riwayat transaksi yang tersimpan aman di database.

### 4. 📊 Dashboard & Riwayat
* Pusat kontrol untuk melihat ringkasan aktivitas pertanian.
* Penyimpanan riwayat *scan* penyakit lengkap dengan foto dan tanggal.

---

## 🛠️ Tech Stack

### Frontend (Web Application)
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **UI Library:** Shadcn UI, Lucide React
* **Mapping:** Leaflet / React-Leaflet
* **Charts:** Recharts
* **Notifications:** Sonner

### Backend (AI Service)
* **Framework:** Python Flask
* **Machine Learning:** TensorFlow / Keras (EfficientNetB0)
* **Utilities:** NumPy, Pillow (PIL), Requests

### Infrastructure & Data
* **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Storage:** Supabase Storage (untuk menyimpan gambar hasil scan)
* **Auth:** NextAuth.js (via Supabase Adapter)
* **Deployment:** Vercel (Frontend) & Hugging Face Spaces (Backend AI)

---

## 🚀 Panduan Instalasi (Lokal)

Ikuti langkah ini untuk menjalankan proyek di komputer Anda.

### Prasyarat
* Node.js (versi 18 atau terbaru)
* Python (versi 3.9 atau terbaru)
* Akun Supabase (untuk database & storage)

### Langkah 1: Clone Repository
```bash
git clone [https://github.com/username-anda/agrismart.git](https://github.com/username-anda/agrismart.git)
cd agrismart

```

###Langkah 2: Setup Backend (Python)Buka terminal baru, masuk ke folder backend.

```bash
cd backend

# (Opsional) Buat virtual environment
python -m venv venv
# Aktifkan venv (Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate)

# Install dependensi
pip install flask flask-cors tensorflow numpy pillow requests

# Jalankan Server Flask
python app.py

```

*Server AI akan berjalan di `http://127.0.0.1:8000*`

###Langkah 3: Setup Frontend (Next.js)Kembali ke root folder proyek di terminal terpisah.

```bash
# Install dependensi Node modules
npm install

```

Buat file `.env.local` di root folder dan isi konfigurasi berikut:

```env
# --- Supabase Config ---
NEXT_PUBLIC_SUPABASE_URL="[https://project-id.supabase.co](https://project-id.supabase.co)"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"

# --- NextAuth Config ---
AUTH_SECRET="random-string-generate-via-openssl" 
# (Generate via terminal: openssl rand -base64 32)

# --- API Config ---
# Gunakan localhost jika menjalankan python lokal, atau URL Hugging Face jika sudah deploy
NEXT_PUBLIC_API_URL="[http://127.0.0.1:8000](http://127.0.0.1:8000)"

```

###Langkah 4: Jalankan Aplikasi```bash
npm run dev

```

Buka browser dan akses **[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)**.

---

##📂 Struktur Proyek```
agrismart/
├── public/                   # Aset Statis (Gambar, Icon)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── actions/          # Server Actions (Simpan History, dll)
│   │   ├── dashboard/        # Halaman Dashboard Utama
│   │   ├── keuangan/         # Fitur Keuangan
│   │   ├── prediction/       # Fitur Scan & Upload Gambar
│   │   ├── penyakit/         # Halaman Riwayat & Detail Penyakit
│   │   └── weather/          # Halaman Cuaca
│   ├── components/           # Komponen UI Reusable
│   ├── lib/                  # Utilitas (utils.ts)
│   └── types/                # Definisi Tipe TypeScript
├── next.config.ts            # Konfigurasi Next.js
└── package.json              # Dependensi Project

```

---

##🤝 KontribusiKami sangat terbuka untuk kontribusi! Jika Anda ingin menambahkan fitur atau memperbaiki bug:

1. **Fork** repositori ini.
2. Buat **Branch** baru (`git checkout -b fitur-baru`).
3. **Commit** perubahan Anda (`git commit -m 'Menambahkan fitur X'`).
4. **Push** ke branch (`git push origin fitur-baru`).
5. Buat **Pull Request** di GitHub.

---

##📄 LisensiProyek ini dilisensikan di bawah [MIT License](https://www.google.com/search?q=LICENSE). Bebas digunakan dan dimodifikasi untuk tujuan pendidikan dan pengembangan.

---

<p align="center">
Dibuat dengan ❤️ untuk <b>Petani Indonesia</b>.




AgriSmart Team © 2024
</p>

```

```
