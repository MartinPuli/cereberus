// TODO: temporary smoke test, delete after foundation verified
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        ok: false,
        can_query: false,
        profile_count: 0,
        error: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      can_query: true,
      profile_count: count ?? 0,
      error: null,
    });
  } catch (e) {
    return NextResponse.json({
      ok: false,
      can_query: false,
      profile_count: 0,
      error: e instanceof Error ? e.message : "unknown error",
    });
  }
}
