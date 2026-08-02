/**
 * Centralized owner identification logic.
 * This list defines who has absolute administrative bypass.
 * Use strict equality to prevent substring match vulnerabilities.
 */

const OWNER_EMAILS = [
  "oneshotmanufacturing@gmail.com",
  "swarajdangare2016@gmail.com",
] as const;

export function isOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return OWNER_EMAILS.includes(email.toLowerCase().trim() as any);
}
