// src/middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Inisialisasi NextAuth dengan config ringan untuk middleware
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
