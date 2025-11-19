import { PupilApiClient } from "./PupilApiClient";

import { CreateLessonAttemptPayload } from "@/node-lib/pupil-api/types";

describe("PupilApiClient", () => {
  const client = PupilApiClient;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("logAttempt returns parsed JSON", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ attempt_id: "abc123" }),
    });

    const result = await client.logAttempt({
      attempt_id: "abc123",
    } as CreateLessonAttemptPayload);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/pupil/lesson-attempt",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(result).toEqual({ attempt_id: "abc123" });
  });

  it("getAttempt warns on non-ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    const result = await client.getAttempt("abc123");
    expect(result).toEqual({});
  });

  it("getTeacherNote builds URL and fetches", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ note_id: "n1", sid_key: "s1" }),
    });

    const note = await client.getTeacherNote({ note_id: "n1", sid_key: "s1" });
    expect(note).toEqual({ note_id: "n1", sid_key: "s1" });
  });
});
