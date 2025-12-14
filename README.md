# 🌾 AgriSmart - Asisten Pertanian Cerdas

![AgriSmart Banner](public/img/logo2.png) 
**AgriSmart** adalah platform _Smart Farming_ berbasis AI yang dirancang untuk membantu petani padi mendeteksi penyakit tanaman secara dini, memantau kondisi cuaca, dan mengelola keuangan tani dalam satu aplikasi terintegrasi.

Dengan memanfaatkan teknologi **Deep Learning (EfficientNet)**, aplikasi ini dapat mengidentifikasi penyakit seperti *Leaf Blast*, *Brown Spot*, dan *Bacterial Leaf Blight* hanya dengan mengunggah foto daun.

---

## ✨ Fitur Unggulan

* **🤖 Deteksi Penyakit AI:** Diagnosa penyakit padi instan dengan akurasi tinggi dan rekomendasi penanganan yang tepat.
* **🌦️ Info Cuaca & Peta:** Pemantauan cuaca *real-time* berbasis lokasi untuk perencanaan tanam yang lebih baik.
* **💰 Manajemen Keuangan:** Pencatatan pemasukan dan pengeluaran tani untuk memantau keuntungan secara digital.
* **📊 Dashboard Terintegrasi:** Pusat kontrol untuk melihat ringkasan aktivitas, riwayat scan, dan laporan cuaca.
* **📱 Responsif & Modern:** Antarmuka pengguna yang bersih dan mudah digunakan di perangkat mobile maupun desktop.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Web App)
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **UI Components:** Shadcn UI, Lucide React
* **Maps:** Leaflet / React-Leaflet
* **Notifications:** Sonner

### Backend (AI Service)
* **Framework:** Python Flask
* **Machine Learning:** TensorFlow / Keras (EfficientNetB0)
* **Library Lain:** NumPy, Pillow, Requests

### Infrastructure & Data
* **Database & Storage:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Authentication:** NextAuth.js (via Supabase Adapter)
* **Deployment:** Vercel (Frontend) & Hugging Face Spaces (Backend Model)

---

## 🚀 Cara Menjalankan Project (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan AgriSmart di komputer Anda.

### Prasyarat
* Node.js (v18+)
* Python (v3.9+)
* Akun Supabase (untuk database)

### 1. Clone Repository
```bash
git clone [https://github.com/username-anda/agrismart.git](https://github.com/username-anda/agrismart.git)
cd agrismart
