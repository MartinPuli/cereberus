import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function toApiError(
  error: unknown,
  fallback: { status: number; code: string; message: string } = {
    status: 500,
    code: "internal_error",
    message: "request failed",
  },
): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof SyntaxError) {
    return new ApiError(400, "invalid_json", "request body must be valid JSON");
  }
  if (error instanceof Error && /ANTHROPIC_API_KEY/.test(error.message)) {
    return new ApiError(
      503,
      "anthropic_not_configured",
      "ANTHROPIC_API_KEY is not configured",
    );
  }
  return new ApiError(fallback.status, fallback.code, fallback.message);
}

export function jsonError(
  error: unknown,
  fallback?: { status: number; code: string; message: string },
) {
  const apiError = toApiError(error, fallback);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: apiError.code,
        message: apiError.message,
      },
    },
    { status: apiError.status },
  );
}

export async function parseJsonBody<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch (error) {
    throw toApiError(error);
  }
}

export function requireTrimmedString(
  value: unknown,
  field: string,
  options: { maxLength?: number } = {},
): string {
  if (typeof value !== "string") {
    throw new ApiError(400, "invalid_request", `${field} is required`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new ApiError(400, "invalid_request", `${field} is required`);
  }
  if (options.maxLength && trimmed.length > options.maxLength) {
    throw new ApiError(
      400,
      "invalid_request",
      `${field} must be ${options.maxLength} characters or fewer`,
    );
  }
  return trimmed;
}

export function optionalTrimmedString(
  value: unknown,
  field: string,
  options: { maxLength?: number } = {},
): string | undefined {
  if (value == null) return undefined;
  return requireTrimmedString(value, field, options);
}