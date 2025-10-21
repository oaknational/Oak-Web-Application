import { NextRequest } from "next/server";

import { POST } from "./route";

import { datastore } from "@/node-lib/firestore/services/datastore";
import { handleCors as handleCorsOriginal } from "@/app/api/_utils/cors";
import { createLessonAttemptPayloadSchema } from "@/app/api/types/pupil-api/types";

jest.mock("@/node-lib/firestore/services/datastore", () => ({
  datastore: {
    getLessonAttempt: jest.fn(),
    logLessonAttempt: jest.fn(),
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

jest.mock("@/app/api/types/pupil-api/types", () => ({
  createLessonAttemptPayloadSchema: {
    parse: jest.fn(),
  },
}));

const handleCors = handleCorsOriginal as jest.Mock;

describe("POST /api/pupil/log-lesson-attempt", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns CORS response if handleCors returns a response", async () => {
    handleCors.mockReturnValueOnce({ cors: true });
    const request = {} as NextRequest;
    const result = await POST(request);
    expect(result).toEqual({ cors: true });
    expect(handleCors).toHaveBeenCalledWith(request);
  });

  it("returns 400 if attempt_id is a duplicate", async () => {
    handleCors.mockReturnValueOnce(null);
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "dup-id",
    });
    (datastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
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
    handleCors.mockReturnValueOnce(null);
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "new-id",
    });
    (datastore.getLessonAttempt as jest.Mock).mockResolvedValueOnce({
      empty: true,
    });
    (datastore.logLessonAttempt as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    const request = {
      json: async () => ({ attempt_id: "new-id" }),
    } as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(201);
    const json = await result.json();
    expect(json).toEqual({ success: true });
    expect(datastore.logLessonAttempt).toHaveBeenCalledWith({
      attempt_id: "new-id",
    });
  });

  it("returns 201 and logs the attempt if getLessonAttempt throws", async () => {
    handleCors.mockReturnValueOnce(null);
    (createLessonAttemptPayloadSchema.parse as jest.Mock).mockReturnValueOnce({
      attempt_id: "new-id",
    });
    (datastore.getLessonAttempt as jest.Mock).mockRejectedValueOnce(
      new Error("Firestore error"),
    );
    (datastore.logLessonAttempt as jest.Mock).mockResolvedValueOnce({
      success: true,
    });
    const request = {
      json: async () => ({ attempt_id: "new-id" }),
    } as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(201);
    const json = await result.json();
    expect(json).toEqual({ success: true });
    expect(datastore.logLessonAttempt).toHaveBeenCalledWith({
      attempt_id: "new-id",
    });
  });
});
