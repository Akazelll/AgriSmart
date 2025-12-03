import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

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
      <Card className='w-full max-w-sm bg-white/40 backdrop-blur-md shadow-xl border-white/20'>
        <CardHeader className='text-center'></CardHeader>

        <CardContent className='space-y-6'>
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
                <div className='w-full h-full bg-stone-200 flex items-center justify-center text-stone-400'>
                  <UserCircle className='w-16 h-16' />
                </div>
              )}
            </div>
          </div>

          <form>
            <div className='flex flex-col gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='text-dark'>
                  Nama Lengkap
                </Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  defaultValue={user?.name || ""}
                  className='bg-white/50'
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='text-stone-600'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  defaultValue={user?.email || ""}
                  disabled
                  className='bg-stone-100/50 text-stone-500'
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex-col gap-3'>
          <Button
            type='submit'
            className='w-full bg-[#3A6F43] hover:bg-emerald-800 rounded-full'
          >
            Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
