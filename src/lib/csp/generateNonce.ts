import { randomBytes } from "crypto";

/**
 * Generates a cryptographically secure random nonce for CSP
 * @returns A base64-encoded nonce string
 */
export function generateNonce(): string {
  return randomBytes(16).toString("base64");
}
