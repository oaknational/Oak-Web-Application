import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { cookiesToObject } from "./cookiesToObject";

describe("cookiesToObject", () => {
  it("maps cookie names to values", () => {
    const cookieStore = {
      getAll: () => [
        { name: "foo", value: "1" },
        { name: "bar", value: "two" },
      ],
    } as unknown as ReadonlyRequestCookies;

    expect(cookiesToObject(cookieStore)).toEqual({ foo: "1", bar: "two" });
  });

  it("returns an empty object when there are no cookies", () => {
    const cookieStore = {
      getAll: () => [],
    } as unknown as ReadonlyRequestCookies;

    expect(cookiesToObject(cookieStore)).toEqual({});
  });
});
