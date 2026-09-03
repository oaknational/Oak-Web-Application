import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";

import { getActiveCookieFlags } from "./getActiveCookieFlags";

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    getAll: () => [],
  })),
}));

describe("getActiveCookieFlags()", () => {
  test("returns only those prefixed with oak-flag", async () => {
    jest.mocked(cookies).mockResolvedValue({
      getAll: () => [
        { name: "oak-flag-key", value: "1" },
        { name: "oak-foo", value: "1" },
      ],
    } as unknown as ReadonlyRequestCookies);
    const flags = await getActiveCookieFlags();
    expect(flags).toEqual(["oak-flag-key"]);
  });
});
