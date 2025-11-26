// src/app/actions/register.ts
"use server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation"; // Tambahkan import ini

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string; // Pastikan ambil confirmPassword juga jika ada validasi

  if (!email || !password || !name) {
    // Pada server action murni, return error sulit ditangkap tanpa 'useFormState'
    // Untuk saat ini kita biarkan return object, tapi idealnya pakai redirect error page atau client component
    console.error("Validasi gagal");
    return { error: "Semua kolom harus diisi!" };
  }

  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return { error: "Email sudah terdaftar!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("users").insert({
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      image: null,
    });

    if (error) {
      console.error("Supabase Error:", error);
      return { error: "Gagal menyimpan ke database." };
    }
  } catch (err) {
    console.error("Register Error:", err);
    return { error: "Terjadi kesalahan server." };
  }

  // Redirect dilakukan DI LUAR blok try-catch untuk menghindari error NEXT_REDIRECT
  redirect("/login");
}
