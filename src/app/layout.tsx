import type { Metadata } from "next";
import { Kanit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/auth-provider";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgriSmart",
  description: "A smart agriculture application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${kanit.variable} ${geistMono.variable} antialiased font-sans relative min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900`}
      >
        <div className='fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[120px] -z-50 pointer-events-none translate-y-1/3 -translate-x-1/4' />

        <div className='fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-100/80 rounded-full blur-[100px] -z-50 pointer-events-none -translate-y-1/4 translate-x-1/4' />

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
