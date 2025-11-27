import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: true, 
  session: { strategy: "jwt" },


  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        if (!email || !password) return null;

        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (!user || !user.password) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      if (account?.provider === "google") {
        const { email, name, image } = user;

        try {
          const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

          if (!existingUser) {
            console.log("[Auth] User Google baru, mendaftarkan...");
            const { error } = await supabase.from("users").insert({
              email,
              name,
              image,
              "emailVerified": new Date().toISOString(),
            });

            if (error) {
              console.error("[Auth] Gagal membuat user Google:", error);
              return false;
            }
          }
          return true;
        } catch (err) {
          console.error("[Auth] Error di callback signIn:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const { data: dbUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", token.email)
          .single();

        if (dbUser) {
          token.sub = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
