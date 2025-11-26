import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/app/actions/register";

export default function RegisterPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-full max-w-md rounded-4xl max-h-xl drop-shadow-2xl shadow-[0_0_20px_rgba(6,78,59,0.4)]'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-medium'>
            Daftar Akun
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form action={registerUser} className='space-y-6'>
            <div className='flex flex-col gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='px-4'>
                  Nama Lengkap
                </Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  className='rounded-3xl'
                  required
                />
              </div>

              {/* Email */}
              <div className='grid gap-2'>
                <Label htmlFor='email' className='px-4'>
                  E-mail
                </Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  className='rounded-3xl'
                  required
                />
              </div>

              {/* Password */}
              <div className='grid gap-2'>
                <Label htmlFor='password' className='px-4'>
                  Password Baru
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='rounded-3xl shadow-lg'
                />
                <div className='flex justify-start px-4'>
                  <span className='text-xs font-small text-dark'>
                    Ketentuan : 8 - 100 karakter. Mengandung huruf (a-z), angka
                    (0-9), huruf besar, huruf kecil, dan simbol (*&^%$#@!, dan
                    lain-lain)
                  </span>
                </div>
              </div>

              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword' className='px-4'>
                  Konfirmasi Password
                </Label>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  className='rounded-3xl'
                  required
                />
              </div>
            </div>

            <div className='flex justify-center w-full pt-4'>
              <Button
                type='submit'
                className='w-32 rounded-full bg-[#3A6F43] hover:bg-emerald-800 font-semibold shadow-md transition-all hover:scale-105'
              >
                Daftar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
