export function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${JSON.stringify(val)}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  jest.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}
