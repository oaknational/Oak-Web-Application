import { createNextApiMocks } from "@/__tests__/__helpers__/createNextApiMocks";
import handler from "@/pages/api/video/signed-url";

const signPlaybackId = jest.fn().mockReturnValue("some-token");
jest.mock("@mux/mux-node", () => ({
  __esModule: true,
  default: {
    JWT: {
      signPlaybackId: (...args: []) => signPlaybackId(...args),
    },
  },
}));

describe("/api/video/signed-url", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return a signed url", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        id: "some-id",
        type: "some-type",
        legacy: "true",
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(JSON.stringify({ token: "some-token" }));
  });
  it("should call signPlaybackId with the correct args for new content", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        id: "some-id",
        type: "some-type",
      },
    });

    await handler(req, res);
    expect(signPlaybackId).toHaveBeenCalledWith(
      "some-id",
      expect.objectContaining({
        keyId: "123",
        keySecret: "super secret",
        type: "some-type",
      }),
    );
  });
  it("should call signPlaybackId with the correct args for legacy content", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        id: "some-id",
        type: "some-type",
        legacy: "true",
      },
    });

    await handler(req, res);
    expect(signPlaybackId).toHaveBeenCalledWith(
      "some-id",
      expect.objectContaining({
        keyId: "123-2020",
        keySecret: "super secret-2020",
        type: "some-type",
      }),
    );
  });
  it("should fail if no 'id' passed in query", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        type: "some-type",
        legacy: "true",
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual(
      JSON.stringify({
        message: "Must provide an 'id' and a 'type' query parameter",
      }),
    );
  });
  it("should fail if no 'type' passed in query", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        id: "some-id",
        legacy: "true",
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual(
      JSON.stringify({
        message: "Must provide an 'id' and a 'type' query parameter",
      }),
    );
  });
  it("should fail 'legacy' if exists but not 'true'", async () => {
    const { req, res } = createNextApiMocks({
      query: {
        id: "some-id",
        type: "some-type",
        legacy: "false",
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual(
      JSON.stringify({
        message: "Query parameter 'legacy' must be true or not present",
      }),
    );
  });
});
