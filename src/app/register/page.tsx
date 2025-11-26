import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";
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

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password) {
    return { error: "Mohon isi semua kolom" };
  }

  if (password !== confirmPassword) {
    return { error: "Password dan konfirmasi tidak cocok" };
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
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { error: "Gagal mendaftar ke database" };
    }

    return { success: true };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Terjadi kesalahan server" };
  }
}

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
          <form className='space-y-6'>
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
                  <span className='text-xs font-small text-muted-foreground'>
                    Ketentuan: Minimal 8 karakter.
                  </span>
                </div>
              </div>

              {/* Konfirmasi Password (Opsional tapi disarankan) */}
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

        <CardFooter className='flex justify-center pb-6'>
          <p className='text-sm text-muted-foreground'>
            Sudah punya akun?{" "}
            <a
              href='/login'
              className='text-emerald-600 font-medium hover:underline'
            >
              Masuk
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
