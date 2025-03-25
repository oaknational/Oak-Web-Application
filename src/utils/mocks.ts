import Cookies from "js-cookie";

export function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${Cookies.converter.write(JSON.stringify(val), key)}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  jest.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}

export function mockPrerelease(key: string) {
  mockCookieGet({ [`prerelease.${key}.enabled`]: true });
}
