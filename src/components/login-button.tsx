"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button onClick={() => signIn("github", { redirectTo: "/dashboard" })}>
      Login with GitHub
    </Button>
  );
}
