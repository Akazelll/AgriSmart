"use server";

import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function saveScanHistory(data: {
  imageUrl: string;
  label: string;
  confidence: number;
  description: string;
  solution: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("scan_history").insert({
    user_id: session.user.id,
    image_url: data.imageUrl,
    label: data.label,
    confidence: data.confidence,
    description: data.description,
    solution: data.solution,
  });

  if (error) {
    console.error("Gagal menyimpan history:", error);
    return { error: "Gagal menyimpan riwayat" };
  }

  revalidatePath("/penyakit"); // Refresh halaman penyakit
  return { success: true };
}
