export class AppError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = "UNKNOWN_ERROR", status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function isLimitError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("LIMIT_EXCEEDED");
}

export function parseLimitError(error: Error): { key: string; limit: number; used: number } | null {
  const parts = error.message.split(":");
  if (parts.length !== 4) return null;
  return {
    key: parts[1],
    limit: Number(parts[2]),
    used: Number(parts[3]),
  };
}

export function handleActionError(error: unknown): { success: false; error: string; code?: string } {
  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code };
  }
  if (isLimitError(error as Error)) {
    const parsed = parseLimitError(error as Error);
    return {
      success: false,
      error: `You have reached your ${parsed?.key} limit (${parsed?.used}/${parsed?.limit}). Upgrade your plan to continue.`,
      code: "LIMIT_EXCEEDED",
    };
  }
  console.error("[action error]", error);
  return { success: false, error: "Something went wrong. Please try again.", code: "UNKNOWN" };
}
