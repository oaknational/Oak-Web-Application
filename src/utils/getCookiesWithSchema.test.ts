import { z } from "zod";

import { getCookiesWithSchema } from "./getCookiesWithSchema";

const BOOLEAN_SCHEMA = z.boolean();
const NUMBER_SCHEMA = z.number();
const OBJECT_SCHEMA = z.object({
  foo: z.number(),
  bar: z.string(),
});

function mockCookieGet(input: Record<string, unknown>) {
  const cookieStringPartial = Object.entries(input)
    .map(([key, val]) => {
      return `${key}=${JSON.stringify(val)}`;
    })
    .join("; ");
  const cookieString = `${cookieStringPartial}; `;
  jest.spyOn(document, "cookie", "get").mockReturnValue(cookieString);
}

const DISABLE_LOGGING = true;

describe("useCookieWithSchema()", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("boolean / true", async () => {
    const cookies = { "foo.bar": true };

    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", BOOLEAN_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["foo.bar"]);
  });

  test("boolean / false", async () => {
    const cookies = { "foo.bar": false };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", BOOLEAN_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["foo.bar"]);
  });

  test("boolean / invalid", async () => {
    const cookies = { "foo.bar": "testing" };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", BOOLEAN_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(undefined);
  });

  test("boolean / invalid / default", async () => {
    const cookies = { "foo.bar": "testing" };
    const dflt = true;
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", BOOLEAN_SCHEMA, {
      dflt,
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(dflt);
  });

  test("number / valid", async () => {
    const cookies = { "foo.bar": 23 };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", NUMBER_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["foo.bar"]);
  });

  test("number / invalid", async () => {
    const cookies = { "foo.bar": "testing" };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", NUMBER_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(undefined);
  });

  test("number / invalid / default", async () => {
    const cookies = { "foo.bar": "testing" };
    const dflt = 40;
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", NUMBER_SCHEMA, {
      dflt,
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(dflt);
  });

  test("object / valid", async () => {
    const cookies = { "foo.bar": { foo: 2, bar: "hello" } };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", OBJECT_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(cookies["foo.bar"]);
  });

  test("object / invalid", async () => {
    const cookies = { "foo.bar": { foo: "23", bar: "hello" } };
    mockCookieGet(cookies);

    const current = getCookiesWithSchema("foo.bar", OBJECT_SCHEMA, {
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(undefined);
  });

  test("object / invalid / default", async () => {
    const dflt = { foo: 101, bar: "TEST" };
    mockCookieGet({ "foo.bar": "testing" });

    const current = getCookiesWithSchema("foo.bar", OBJECT_SCHEMA, {
      dflt,
      disableLogging: DISABLE_LOGGING,
    });
    expect(current).toEqual(dflt);
  });
});
