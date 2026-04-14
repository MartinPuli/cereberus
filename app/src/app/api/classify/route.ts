import { NextResponse } from "next/server";
import { classify } from "@/lib/classifier";
import { jsonError, parseJsonBody, requireTrimmedString } from "@/lib/http";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await parseJsonBody<{ description?: string }>(req);
    const description = requireTrimmedString(body.description, "description", {
      maxLength: 2000,
    });
    const classification = await classify(description);
    return NextResponse.json({ success: true, data: classification });
  } catch (e) {
    return jsonError(e, {
      status: 500,
      code: "classify_failed",
      message: "classify failed",
    });
  }
}
