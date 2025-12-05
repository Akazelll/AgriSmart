import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { updateProfile } from "../actions/update-profile";

import { IoPerson, IoBagSharp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaUserLock } from "react-icons/fa6";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", session.user.email)
    .single();

  const underlineInputClass =
    "flex-1 bg-transparent border-0 border-b border-stone-400 focus-visible:border-emerald-600 focus-visible:ring-0 rounded-none px-1 py-2 text-stone-800 font-medium placeholder:text-stone-300 transition-all";

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Card className='w-full max-w-md bg-[#3A6F43] border-none shadow-2xl rounded-[2.5rem] flex flex-col items-center overflow-hidden pb-6 -mt-30'>
        <div className='mt-4 mb-4'>
          <div className='relative w-25 h-25 rounded-full overflow-hidden border-4 border-[#E8E0FF] bg-[#E8E0FF] shadow-lg flex items-center justify-center'>
            {user?.image ? (
              <Image
                src={user.image}
                alt='Profile'
                fill
                className='object-cover'
              />
            ) : (
              <UserCircle className='w-20 h-20 text-[#583878]' />
            )}
          </div>
        </div>
        <Card className='w-[80%] bg-white rounded-[2rem] border-none shadow-md mb-8'>
          <CardContent className='p-5 sm:p-6'>
            <form action={updateProfile} className='flex flex-col gap-2'>
              <div className='flex items-end gap-4'>
                <Label htmlFor='name' className='pb-1 w-6 flex justify-center'>
                  <IoPerson className='text-black text-xl' />
                </Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  defaultValue={user?.name || ""}
                  className={underlineInputClass}
                  placeholder='Nama Lengkap'
                />
              </div>

              <div className='flex items-end gap-4'>
                <Label htmlFor='email' className='pb-1 w-6 flex justify-center'>
                  <IoIosMail className='text-black text-xl' />
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  defaultValue={user?.email || ""}
                  disabled
                  className={`${underlineInputClass} text-stone-500 cursor-not-allowed`}
                />
              </div>

              <div className='flex items-end gap-4'>
                <Label
                  htmlFor='password'
                  className='pb-1 w-6 flex justify-center'
                >
                  <FaUserLock className='text-black text-lg' />
                </Label>
                <Input
                  id='password'
                  type='password'
                  value='********'
                  disabled
                  className={`${underlineInputClass} text-stone-500 cursor-not-allowed`}
                />
              </div>

              <div className='flex items-end gap-4'>
                <Label
                  htmlFor='status'
                  className='pb-1 w-6 flex justify-center'
                >
                  <IoBagSharp className='text-black text-lg' />
                </Label>
                <Input
                  id='status'
                  name='status'
                  type='text'
                  placeholder='Status Pekerjaan'
                  defaultValue={user?.status || ""}
                  className={underlineInputClass}
                />
              </div>

              <div className='pt-2 flex justify-center'>
                <Button
                  type='submit'
                  className='w-full bg-[#3A6F43] hover:bg-emerald-800 text-white font-bold py-2 h-10 rounded-xl shadow-md transition-transform hover:scale-[1.02]'
                >
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}
