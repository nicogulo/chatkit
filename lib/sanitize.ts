/**
 * Sanitize user input to prevent XSS and injection attacks.
 * Used before storing messages and before rendering user content.
 */

/**
 * Strip HTML tags from a string to prevent XSS.
 * This is used on message content before it's stored in the database.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return input;

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    // Remove javascript: URLs
    .replace(/javascript\s*:/gi, "")
    // Remove data: URLs that could contain scripts
    .replace(/data\s*:\s*text\/html/gi, "")
    // Remove HTML tags but keep content
    .replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML entities for safe rendering.
 * Use this when rendering user content in HTML context.
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== "string") return input;

  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };

  return input.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Validate and truncate input to prevent oversized payloads.
 */
export function validateInput(input: string, maxLength: number = 10000): string {
  if (!input) return input;

  // Trim whitespace
  const trimmed = input.trim();

  // Truncate if too long
  if (trimmed.length > maxLength) {
    return trimmed.substring(0, maxLength);
  }

  return trimmed;
}
