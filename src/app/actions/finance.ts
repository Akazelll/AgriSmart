"use server";

import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getTransactions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}

export async function addTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;

  const date = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("transactions").insert({
    user_id: session.user.id,
    description,
    amount,
    type,
    date,
  });

  if (error) return { error: error.message };

  revalidatePath("/keuangan");
  return { success: true };
}

export async function deleteTransaction(id: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);

  if (error) return { error: error.message };

  revalidatePath("/keuangan");
  return { success: true };
}
