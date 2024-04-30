import { converter } from "js-cookie";

export function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${converter.write(JSON.stringify(val), key)}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  jest.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}
