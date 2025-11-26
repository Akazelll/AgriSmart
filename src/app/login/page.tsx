import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-full max-w-md rounded-4xl drop-shadow-2xl shadow-[0_0_20px_rgba(6,78,59,0.4)]'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-medium '>
            Masuk
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          <form
            action={async (formData) => {
              "use server";
              await signIn("credentials", formData);
            }}
            className='space-y-6'
          >
            <div className='flex flex-col gap-4'>
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
              <div className='grid gap-2'>
                <Label htmlFor='password' className='px-4'>
                  Password
                </Label>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  className='rounded-3xl shadow-lg'
                />
                <div className='flex justify-start'>
                  <a
                    href='#'
                    className='text-xs font-medium  hover:underline px-4'
                  >
                    Lupa Password?
                  </a>
                </div>
              </div>
            </div>

            <div className='flex justify-center w-full'>
              <Button
                type='submit'
                className='w-24 rounded-full bg-[#3A6F43] hover:bg-emerald-800 font-semibold shadow-md transition-all hover:scale-105'
              >
                Masuk
              </Button>
            </div>
          </form>

          <div className='pt-2'>
            <div className='w-full border-t border-stone-200' />
            <div className='flex justify-center mt-1'>
              <span className='text-xs  text-dark font-medium bg-background px-2'>
                Atau
              </span>
            </div>
          </div>

          <form
            className='space-y-6'
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <div className='flex justify-center w-full'>
              <Button
                variant='outline'
                type='submit'
                className='w-56 rounded-full shadow-sm transition-all hover:scale-105'
              >
                {" "}
                <FcGoogle className='w-5 h-5' />
                Masuk dengan Google
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className='flex justify-center'>
          <div className='text-sm text-center text-dark'>
            Tidak punya akun?{" "}
            <a href='/register' className='font-medium hover:underline'>
              Daftar
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
