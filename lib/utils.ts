import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract a safe error message from unknown thrown values
 */
export function getErrorMessage(err: unknown): string {
  try {
    if (!err) return 'An unknown error occurred';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message || 'An error occurred';
    // API error shape
    const anyErr = err as any;
    if (typeof anyErr?.message === 'string') return anyErr.message;
    if (typeof anyErr?.status === 'number' && anyErr?.message) return String(anyErr.message);
    // Fallback to JSON
    return JSON.stringify(err, Object.getOwnPropertyNames(err));
  } catch {
    return 'An error occurred while processing the error message';
  }
}
