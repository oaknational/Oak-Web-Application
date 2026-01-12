import { headers } from "next/headers";

/**
 * Gets the CSP nonce from request headers (App Router)
 * @returns The nonce string or undefined
 */
export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get("X-CSP-Nonce") || undefined;
}
