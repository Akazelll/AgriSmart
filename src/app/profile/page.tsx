import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  // CardFooter dihapus karena isinya dipindah ke dalam form
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { updateProfile } from "../actions/update-profile";

export default async function ProfilePage() {
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
    .select("*")
    .eq("email", session.user.email)
    .single();

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-start pt-20 p-4'>
      <Card className='w-full max-w-sm bg-white/60 backdrop-blur-md shadow-xl border-white/20'>
        <CardHeader className='text-center'></CardHeader>

        <CardContent className='space-y-6'>
          {/* Foto Profil */}
          <div className='flex justify-center'>
            <div className='relative w-24 h-24 rounded-full overflow-hidden'>
              {user?.image ? (
                <Image
                  src={user.image}
                  alt='Profile'
                  fill
                  className='object-cover'
                />
              ) : (
                <div className='w-full h-full bg-stone-200 flex items-center justify-center text-dark'>
                  <UserCircle className='w-16 h-16' />
                </div>
              )}
            </div>
          </div>

          <form action={updateProfile} className='space-y-6'>
            <div className='flex flex-col gap-4'>
              <div className='grid gap-2'>
                <Label
                  htmlFor='name'
                  className='text-dark text-center font-semibold'
                >
                  Nama
                </Label>
                <Input
                  id='name'
                  name='name' 
                  type='text'
                  defaultValue={user?.name || ""}
                  className='text-center border-none shadow-none focus-visible:ring-0 bg-transparent font-medium text-lg'
                />
                <hr className='border-black' />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='email'
                  className='text-dark text-center font-semibold'
                >
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  defaultValue={user?.email || ""}
                  disabled
                  className='text-center border-none shadow-none focus-visible:ring-0 bg-transparent font-medium text-lg text-stone-500'
                />
                <hr className='border-black' />
              </div>

              <div className='grid gap-2'>
                <Label
                  htmlFor='status'
                  className='text-dark text-center font-semibold'
                >
                  Status Pekerjaan
                </Label>
                <Input
                  id='status'
                  name='status'
                  type='text'
                  placeholder='Status'
                  defaultValue={user?.status || ""}
                  className='text-center border-none shadow-none focus-visible:ring-0 bg-transparent font-medium text-lg placeholder:text-dark'
                />
                <hr className='border-black' />
              </div>
            </div>

            <div className='pt-4'>
              <Button
                type='submit'
                className='w-full bg-[#3A6F43] hover:bg-emerald-800 rounded-full transition-all hover:scale-105'
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
