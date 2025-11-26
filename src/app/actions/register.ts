"use server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Inisialisasi Supabase (Pastikan Env Variable sudah ada di .env.local)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validasi sederhana
  if (!email || !password || !name) {
    return { error: "Semua kolom harus diisi!" };
  }

  try {
    // 1. Cek apakah email sudah terdaftar
    const { data: existingUser } = await supabase
      .from("users") // Pastikan nama tabel di Supabase adalah 'users' atau 'next_auth.users'
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return { error: "Email sudah terdaftar!" };
    }

    // 2. Hash Password (Enkripsi)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan ke Database
    // Note: Sesuaikan nama tabel ('users') dengan schema NextAuth Anda.
    // Jika pakai schema default NextAuth adapter, tabelnya biasanya 'users' (di schema public atau next_auth)
    const { error } = await supabase.from("users").insert({
      name,
      email,
      password: hashedPassword, // Kolom password harus ada di tabel users
      emailVerified: null,
      image: null,
    });

    if (error) {
      console.error("Supabase Error:", error);
      return { error: "Gagal menyimpan ke database." };
    }

    return { success: true };
  } catch (err) {
    console.error("Register Error:", err);
    return { error: "Terjadi kesalahan server." };
  }
}
