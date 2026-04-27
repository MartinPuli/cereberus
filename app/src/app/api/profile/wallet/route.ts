import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ApiError, jsonError, parseJsonBody } from "@/lib/http";

export const runtime = "nodejs";

const ETH_RE = /^0x[a-fA-F0-9]{40}$/;

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "unauthorized", "Must be logged in");

    const body = await parseJsonBody<{ wallet_address?: string }>(req);
    if (!body.wallet_address || !ETH_RE.test(body.wallet_address)) {
      throw new ApiError(
        400,
        "invalid_wallet",
        "wallet_address must be a 0x-prefixed 40-hex-char address",
      );
    }

    const supabase = await getSupabaseServer();
    const { error } = await supabase
      .from("profiles")
      .update({ wallet_address: body.wallet_address })
      .eq("id", user.id);

    if (error?.code === "23505") {
      throw new ApiError(
        409,
        "wallet_taken",
        "This wallet address is already linked to another account",
      );
    }
    if (error) throw new ApiError(500, "update_failed", error.message);

    return NextResponse.json({ success: true });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "unauthorized", "Must be logged in");

    const supabase = await getSupabaseServer();
    const { error } = await supabase
      .from("profiles")
      .update({ wallet_address: null })
      .eq("id", user.id);

    if (error) throw new ApiError(500, "update_failed", error.message);

    return NextResponse.json({ success: true });
  } catch (e) {
    return jsonError(e);
  }
}
