/**
 * Lazy singleton around the Anthropic SDK client.
 *
 * We instantiate on first call so the process can boot without the env var
 * set (useful for `next build` and for non-LLM routes like `/api/teams`).
 * If `ANTHROPIC_API_KEY` is missing when an LLM call happens, we surface a
 * 503 `anthropic_not_configured` through `ApiError` instead of letting the
 * SDK throw a generic error downstream.
 */
import Anthropic from "@anthropic-ai/sdk";
import { ApiError } from "./http";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new ApiError(
        503,
        "anthropic_not_configured",
        "ANTHROPIC_API_KEY is not set",
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}
