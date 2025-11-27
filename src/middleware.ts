import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { auth } from "./auth";

export const { auth: middleware } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
