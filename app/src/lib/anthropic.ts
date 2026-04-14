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
