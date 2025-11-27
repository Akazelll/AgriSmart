// src/app/actions/register.ts
"use server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

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
      emailVerified: null, // Changed back to camelCase to match DB
      image: null,
    });

    if (error) {
      console.error("Register Error:", error);
      return { error: "Gagal mendaftar." };
    }
  } catch (err) {
    return { error: "Terjadi kesalahan server" };
  }

  redirect("/login");
}
