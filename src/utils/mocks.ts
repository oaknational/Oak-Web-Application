import { vi } from "vitest";

export function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${encodeURIComponent(JSON.stringify(val))}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  vi.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}

export function mockPrerelease(key: string) {
  mockCookieGet({ [`prerelease.${key}.enabled`]: true });
}
