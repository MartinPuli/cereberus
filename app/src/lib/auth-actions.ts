"use server";

import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase/server";

function origin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithGithub() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin()}/auth/callback?next=/`,
      scopes: "read:user user:email",
    },
  });
  if (error) throw new Error(error.message);
  if (data?.url) redirect(data.url);
}

export async function sendMagicLink(email: string): Promise<void> {
  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin()}/auth/callback?next=/` },
  });
  if (error) throw new Error(error.message);
}

export async function logout() {
  const supabase = await getSupabaseServer();
  await supabase.auth.signOut();
  redirect("/");
}
