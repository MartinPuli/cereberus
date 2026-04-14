import { NextResponse } from "next/server";
import { registerFromGithub } from "@/lib/github";
import { ensureSeeded } from "@/lib/seed";
import { upsertAgent } from "@/lib/store";
import { MOCK_MODE } from "@/lib/config";
import { ApiError, jsonError, parseJsonBody, requireTrimmedString } from "@/lib/http";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  ensureSeeded();
  try {
    if (MOCK_MODE) {
      throw new ApiError(
        403,
        "mock_mode_disabled",
        "registration disabled in MOCK_MODE",
      );
    }
    const body = await parseJsonBody<{ github_url?: string }>(req);
    const githubUrl = requireTrimmedString(body.github_url, "github_url", {
      maxLength: 500,
    });
    const agent = await registerFromGithub(githubUrl);
    upsertAgent(agent);
    return NextResponse.json({ success: true, data: agent });
  } catch (e) {
    return jsonError(e, {
      status: 500,
      code: "register_failed",
      message: "register failed",
    });
  }
}
