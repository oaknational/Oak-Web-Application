import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Find a users `distinct_id` from cookies, if it exists
 */
export function getPosthogIdFromCookie(
  cookies: Partial<Record<string, string>> | ReadonlyRequestCookies,
  posthogApiKey: string,
): string | null {
  const posthogCookieName = `ph_${posthogApiKey}_posthog`;
  const posthogCookie = (cookies as Partial<Record<string, string>>)[
    posthogCookieName
  ];

  if (posthogCookie) {
    try {
      // Casting here instead of some zod parsing, as
      // we quickly fallback to null otherwise
      const parsedCookie = JSON.parse(posthogCookie) as {
        distinct_id?: string;
      };

      return parsedCookie?.distinct_id ?? null;
    } catch (err) {
      // Fall back to returning null if we can't
      // parse the cookie
      console.error(err);
    }
  }

  return null;
}
