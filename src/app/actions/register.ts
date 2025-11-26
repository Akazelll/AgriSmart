"use server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
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

    return { success: true };
  } catch (err) {
    console.error("Register Error:", err);
    return { error: "Terjadi kesalahan server." };
  }
}
