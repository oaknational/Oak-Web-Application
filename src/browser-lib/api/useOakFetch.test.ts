import { createResponse } from "node-mocks-http";
import { z } from "zod";

import useOakFetch from "./useOakFetch";

const TOKEN_VALUE = "value";
jest.mock("../../auth/useAccessToken", () => ({
  __esModule: true,
  default: () => [TOKEN_VALUE],
}));
const fetchSpy = jest.fn(async () => {
  const response = createResponse();
  return {
    ...response,
    ok: true,
    json: async () => ({ foo: "bar" }),
  };
});
global.fetch = fetchSpy;

describe("useOakFetch", () => {
  it("should add the accessToken to the headers", async () => {
    const responseDataSchema = z.object({ foo: z.string() });
    const oakFetch = useOakFetch();
    await oakFetch({
      url: "/test/url",
      method: "POST",
      responseDataSchema,
    });

    expect(fetchSpy).toHaveBeenCalledWith("/test/url", {
      method: "POST",
      headers: { token: TOKEN_VALUE },
    });
  });
  it.todo("should throw an error if unexpected data is returned");
  it.todo("should return the response data in the correct format");
});
