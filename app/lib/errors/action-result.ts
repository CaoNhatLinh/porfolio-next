import { z } from "zod";

export type ActionErrorCode = "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: ActionErrorCode; message: string; fieldErrors?: Record<string, string[]> } };

export class ActionConflictError extends Error { readonly code = "CONFLICT" as const; }
export class ActionNotFoundError extends Error { readonly code = "NOT_FOUND" as const; }
export class ActionValidationError extends Error { readonly code = "VALIDATION_ERROR" as const; }

export function success<T>(data: T): ActionResult<T> { return { ok: true, data }; }

export function failure(error: unknown): ActionResult<never> {
  if (error instanceof ActionConflictError) return { ok: false, error: { code: "CONFLICT", message: "This content changed in another tab. Reload and try again." } };
  if (error instanceof ActionNotFoundError) return { ok: false, error: { code: "NOT_FOUND", message: "The requested record no longer exists." } };
  if (error instanceof ActionValidationError) return { ok: false, error: { code: "VALIDATION_ERROR", message: error.message } };
  if (error instanceof Error && error.message === "Unauthorized") return { ok: false, error: { code: "UNAUTHORIZED", message: "You are not authorized to perform this action." } };
  if (error instanceof z.ZodError) return { ok: false, error: { code: "VALIDATION_ERROR", message: "Please check the submitted fields.", fieldErrors: error.flatten().fieldErrors as Record<string, string[]> } };
  return { ok: false, error: { code: "INTERNAL_ERROR", message: "Unable to complete the action." } };
}

export async function runAction<T>(operation: () => Promise<T>): Promise<ActionResult<T>> {
  try { return success(await operation()); } catch (error) { return failure(error); }
}
