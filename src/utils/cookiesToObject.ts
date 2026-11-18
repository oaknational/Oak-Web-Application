import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export function cookiesToObject(
  cookieStore: ReadonlyRequestCookies,
): Record<string, string> {
  return Object.fromEntries(
    cookieStore.getAll().map(({ name, value }) => [name, value]),
  );
}
