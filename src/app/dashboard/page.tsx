import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: user } = await supabase
    .from("users")
    .select("name")
    .eq("email", session.user.email)
    .single();

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <div className='flex flex-col gap-2'>
        <div className='w-fit flex flex-col gap-1'>
          <h1 className='text-3xl font-normal text-dark'>
            Selamat Datang, {user?.name || "Pengguna"}
          </h1>
          <hr className='border-black border-t-2 w-full' />
        </div>

        <p className='text-stone-500'>
          Ini adalah dashboard monitoring pertanian Anda.
        </p>
      </div>
    </div>
  );
}
