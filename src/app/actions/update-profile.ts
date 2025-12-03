"use server";

import {auth} from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();

    if(!session?.user?.email) return;

    const name = formData.get("name") as string;
    const status = formData.get("status") as string;

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {error} = await supabase
        .from("users")
        .update({
            name: name,
            status: status
        })
        .eq("email", session.user.email);

        if(error){
            console.error("Gagal Update Profile", error);
            return;
        }

    revalidatePath("/profile");
}