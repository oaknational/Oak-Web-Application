import { NextRequest } from "next/server";

import { GET, POST, PUT } from "./route";

import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";
import { teacherNoteSchema } from "@/node-lib/pupil-api/types";
import { identifyPiiFromString } from "@/node-lib/dlp";

jest.mock("@/node-lib/pupil-api/pupilDataStore", () => ({
  pupilDatastore: {
    getTeacherNote: jest.fn(),
    upsertTeacherNote: jest.fn(),
    batchUpdateTeacherNotes: jest.fn(),
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

jest.mock("@/node-lib/pupil-api/types", () => ({
  teacherNoteSchema: {
    parse: jest.fn(),
  },
}));

jest.mock("@/node-lib/dlp", () => ({
  identifyPiiFromString: jest.fn(() => ({ matches: [] })),
  PiiCheckResponse: jest.fn(() => ({ matches: [] })),
}));

describe("GET /api/teacher/note", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if note_id is missing", async () => {
    const request = {
      url: "http://localhost/api/note",
      nextUrl: new URL("http://localhost/api/note"),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toEqual({ error: "note_id is required" });
  });
  it("returns 400 if sid_key is missing", async () => {
    const request = {
      url: "http://localhost/api/note?note_id=noteId",
      nextUrl: new URL("http://localhost/api/note?note_id=noteId"),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toEqual({ error: "sid_key is required" });
  });
  it("returns 404 if note not found", async () => {
    const request = {
      url: "http://localhost/api/note?note_id=noteId&sid_key=sidKey",
      nextUrl: new URL(
        "http://localhost/api/note?note_id=noteId&sid_key=sidKey",
      ),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(404);
    const json = await result.json();
    expect(json).toEqual({ error: "note not found" });
  });
  it("returns 200 with note data if found", async () => {
    const teacherNote = {
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note.",
      note_html: "<p>This is a teacher note.</p>",
    };
    (pupilDatastore.getTeacherNote as jest.Mock).mockResolvedValueOnce(
      teacherNote,
    );
    const request = {
      url: "http://localhost/api/note?note_id=noteId&sid_key=sidKey",
      nextUrl: new URL(
        "http://localhost/api/note?note_id=noteId&sid_key=sidKey",
      ),
    } as unknown as NextRequest;
    const result = await GET(request);
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json).toEqual({
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note.",
      note_html: "<p>This is a teacher note.</p>",
    });
  });
});
describe("POST /api/teacher/note", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if request data is invalid", async () => {
    (teacherNoteSchema.parse as jest.Mock).mockReturnValueOnce({
      note_id: "noteId",
    });

    const request = {
      url: "http://localhost/api/note",
      nextUrl: new URL("http://localhost/api/note"),
    } as unknown as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toHaveProperty("error");
    expect(json.error).toBe("Invalid request data");
  });
  it("returns 200 and upserts note when valid data is provided without existing note", async () => {
    const validData = {
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note.",
      note_html: "<p>This is a teacher note.</p>",
    };
    (teacherNoteSchema.parse as jest.Mock).mockReturnValueOnce(validData);
    (pupilDatastore.getTeacherNote as jest.Mock).mockResolvedValueOnce(null);
    (pupilDatastore.upsertTeacherNote as jest.Mock).mockResolvedValueOnce(
      validData,
    );
    const request = {
      url: "http://localhost/api/note",
      nextUrl: new URL("http://localhost/api/note"),
      json: async () => validData,
    } as unknown as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(201);
    const json = await result.json();
    expect(json).toEqual(validData);
  });
  it("returns 200 and updates note when valid data is provided with existing note", async () => {
    const validData = {
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is an updated teacher note.",
      note_html: "<p>This is an updated teacher note.</p>",
    };
    (teacherNoteSchema.parse as jest.Mock).mockReturnValueOnce(validData);
    (pupilDatastore.getTeacherNote as jest.Mock).mockResolvedValueOnce({
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note.",
      note_html: "<p>This is a teacher note.</p>",
    });
    (pupilDatastore.upsertTeacherNote as jest.Mock).mockResolvedValueOnce(
      validData,
    );
    const request = {
      url: "http://localhost/api/note",
      nextUrl: new URL("http://localhost/api/note"),
      json: async () => validData,
    } as unknown as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json).toEqual(validData);
  });
  it("returns 400 if PII is detected in note_text or note_html", async () => {
    const invalidData = {
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note with PII: 123-45-6789.",
      note_html: "<p>This is a teacher note.</p>",
    };
    (teacherNoteSchema.parse as jest.Mock).mockReturnValueOnce(invalidData);
    (pupilDatastore.getTeacherNote as jest.Mock).mockResolvedValueOnce(null);
    (identifyPiiFromString as jest.Mock)
      .mockImplementationOnce(() => ({
        matches: [{ type: "SSN", value: "123-45-6789" }],
        redactedText: "This is a teacher note with PII: [REDACTED].",
      }))
      .mockImplementationOnce(() => ({ matches: [] }));
    const request = {
      url: "http://localhost/api/note",
      nextUrl: new URL("http://localhost/api/note"),
      json: async () => invalidData,
    } as unknown as NextRequest;
    const result = await POST(request);
    expect(result.status).toBe(400);
    const json = await result.json();
    expect(json).toHaveProperty("type", "PII_ERROR");
    expect(json.pii).toHaveProperty(
      "fullRedactedString",
      "This is a teacher note with PII: [REDACTED].",
    );
    expect(json.pii.piiMatches).toEqual([
      { type: "SSN", value: "123-45-6789" },
    ]);
  });
});

describe("PUT /api/teacher/note", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("calls batchUpdateTeacherNotes", async () => {
    (identifyPiiFromString as jest.Mock).mockImplementation(() => ({
      matches: [],
    }));
    const result = await PUT();
    expect(pupilDatastore.batchUpdateTeacherNotes).toHaveBeenCalled();
    expect(result.status).toBe(200);
    const json = await result.json();
    expect(json).toEqual({
      message: "Redaction on stored teacher notes started successfully",
    });
  });
  it("redacts PII in notes during batch update", async () => {
    const mockDoc = {
      note_id: "noteId",
      sid_key: "sidKey",
      note_text: "This is a teacher note with PII: 123-45-6789.",
      note_html: "<p>This is a teacher note with PII: 123-45-6789.</p>",
      checkedForPii: false,
    };
    (identifyPiiFromString as jest.Mock)
      .mockImplementationOnce(() => ({
        matches: [{ type: "SSN", value: "123-45-6789" }],
        redactedText: "This is a teacher note with PII: [REDACTED].",
      }))
      .mockImplementationOnce(() => ({
        matches: [{ type: "SSN", value: "123-45-6789" }],
        redactedText: "<p>This is a teacher note with PII: [REDACTED].</p>",
      }));
    (
      pupilDatastore.batchUpdateTeacherNotes as jest.Mock
    ).mockImplementationOnce(
      async (callback: (doc: typeof mockDoc) => Promise<typeof mockDoc>) => {
        const updatedDoc = await callback(mockDoc);
        expect(updatedDoc.note_text).toBe(
          "This is a teacher note with PII: [REDACTED].",
        );
        expect(updatedDoc.note_html).toBe(
          "<p>This is a teacher note with PII: [REDACTED].</p>",
        );
        expect(updatedDoc.checkedForPii).toBe(true);
      },
    );
  });
});
