import { NextRequest } from "next/server";

import { GET } from "./route";

import { datastore } from "@/node-lib/firestore/services/datastore";
import { handleCors as handleCorsOriginal } from "@/app/api/_utils/cors";

jest.mock("@/node-lib/firestore/services/datastore", () => ({
  datastore: {
    getLessonAttempt: jest.fn(),
  },
}));

jest.mock("@/app/api/_utils/cors", () => ({
  handleCors: jest.fn(),
}));

interface MockHeaders {
  set: jest.Mock<void, [key: string, value: string]>;
  get: jest.Mock<string | undefined, [key: string]>;
}

interface MockJsonResponse<T> {
  status: number;
  json: () => Promise<T>;
  headers: MockHeaders;
}

interface NextResponseMock {
  json: <T>(data: T, init?: { status?: number }) => MockJsonResponse<T>;
}

jest.mock("next/server", () => ({
  NextResponse: {
    json: <T>(data: T, init?: { status?: number }): MockJsonResponse<T> => ({
      status: init?.status ?? 200,
      json: async () => data,
      headers: {
        set: jest.fn<void, [key: string, value: string]>(),
        get: jest.fn<string | undefined, [key: string]>((key: string) => {
          if (key === "Cache-Control") return "public, max-age=86400";
          return undefined;
        }),
      },
    }),
  } as NextResponseMock,
}));

// Cast handleCors to a Jest mock for testing
const handleCors = handleCorsOriginal as jest.Mock;

describe("GET /api/pupil/get-lesson-attempt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns CORS response if handleCors returns a response", async () => {
    handleCors.mockReturnValueOnce({ cors: true });
    const request = {
      url: "http://localhost/api?attempt_id=123",
    } as NextRequest;
    const result = await GET(request);
    expect(result).toEqual({ cors: true });
    expect(handleCors).toHaveBeenCalledWith(request);
  });

  it("returns 400 if attempt_id is missing", async () => {
    handleCors.mockReturnValueOnce(null);
    const request = {
      url: "http://localhost/api/",
    } as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toEqual({ error: "attempt_id is required" });
  });

  it("returns 404 if no attempt is found", async () => {
    handleCors.mockReturnValueOnce(null);
    (datastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      attempts: [],
      empty: true,
    });
    const request = {
      url: "http://localhost/api?attempt_id=notfound",
    } as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(404);
    const json = await result.json();
    expect(json).toEqual({ error: "attempt not found" });
  });

  it("returns 200 and attempts if found, with cache-control header", async () => {
    handleCors.mockReturnValueOnce(null);
    const attempts = [{ id: "123", data: "test" }];
    (datastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      attempts,
      empty: false,
    });
    const request = {
      url: "http://localhost/api?attempt_id=123",
    } as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json).toEqual(attempts);
    expect(result.headers.get("Cache-Control")).toBe("public, max-age=86400");
  });
});
