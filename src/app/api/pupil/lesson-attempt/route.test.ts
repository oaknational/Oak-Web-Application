/**
 * @jest-environment node
 */
import { type NextRequest } from "next/server";

import { GET, POST } from "@/app/api/pupil/lesson-attempt/route";
import { createLessonAttemptPayloadSchema } from "@/node-lib/pupil-api/types";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";

jest.mock("@/node-lib/pupil-api/pupilDataStore", () => ({
  pupilDatastore: {
    getLessonAttempt: jest.fn(),
    logLessonAttempt: jest.fn(),
  },
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
      status: init?.status ?? 500,
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

jest.mock("@/node-lib/pupil-api/_types/lessonAttemptTypes", () => ({
  createLessonAttemptPayloadSchema: {
    parse: jest.fn(),
  },
}));

describe("GET /api/pupil/get-lesson-attempt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if attempt_id is missing", async () => {
    const request = {
      url: "http://localhost/api/pupil/lesson-attempt",
      nextUrl: new URL("http://localhost/api/pupil/lesson-attempt"),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toEqual({ error: "attempt_id is required" });
  });

  it("returns 404 if no attempt is found", async () => {
    (pupilDatastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      attempts: [],
      empty: true,
    });
    const request = {
      url: "http://localhost/api/pupil/lesson-attempt?attempt_id=notfound",
      nextUrl: new URL(
        "http://localhost/api/pupil/lesson-attempt?attempt_id=notfound",
      ),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(404);
    const json = await result.json();
    expect(json).toEqual({ error: "attempt not found" });
  });

  it("returns 200 and attempts if found, with cache-control header", async () => {
    const attempts = [{ id: "123", data: "test" }];
    (pupilDatastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      attempts,
      empty: false,
    });
    const request = {
      url: "http://localhost/api/pupil/lesson-attempt?attempt_id=123",
      nextUrl: new URL(
        "http://localhost/api/pupil/lesson-attempt?attempt_id=123",
      ),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json).toEqual(attempts);
    expect(result.headers.get("Cache-Control")).toBe("public, max-age=86400");
  });
});

describe("POST /api/pupil/log-lesson-attempt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if attempt_id is a duplicate", async () => {
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "dup-id",
    });
    (pupilDatastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      empty: false,
    });
    const request = {
      json: async () => ({ attempt_id: "dup-id" }),
    } as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toEqual({ error: "attempt_id is a duplicate" });
  });

  it("returns 201 and logs the attempt if not a duplicate", async () => {
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "new-id",
    });
    (pupilDatastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });
    (pupilDatastore.logLessonAttempt as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    const request = {
      json: async () => ({ attempt_id: "new-id" }),
    } as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(201);
    const json = await result.json();
    expect(json).toEqual({ success: true });
    expect(pupilDatastore.logLessonAttempt).toHaveBeenCalledWith({
      attempt_id: "new-id",
    });
  });

  it("returns 201 and logs the attempt if getLessonAttempt throws", async () => {
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "new-id",
    });
    (pupilDatastore.getLessonAttempt as jest.Mock).mockRejectedValueOnce(
      new Error("Firestore error"),
    );
    (pupilDatastore.logLessonAttempt as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    const request = {
      json: async () => ({ attempt_id: "new-id" }),
    } as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(500);
    const json = await result.json();
    expect(json).toEqual({ status: 500, error: "Internal Server Error" });
  });
});
