import { GET, POST } from "./route";

const mockHub = jest.fn();
const mockSubjectBySlug = jest.fn();
const mockGenerateDocx = jest.fn();
const mockZipFromFiles = jest.fn();

jest.mock(
  "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/getNationalCurriculumInsightsData",
  () => ({
    getNationalCurriculumInsightsReader: () => ({
      nationalCurriculumInsightsHub: mockHub,
      nationalCurriculumInsightsSubjectBySlug: mockSubjectBySlug,
    }),
  }),
);

jest.mock("@/pages-helpers/national-curriculum-insights/docx", () => ({
  generateNationalCurriculumInsightsDocx: (...args: unknown[]) =>
    mockGenerateDocx(...args),
  nationalCurriculumInsightsDownloadFilename: ({
    phase,
    subjectTitle,
  }: {
    phase: string;
    subjectTitle: string;
  }) => `${subjectTitle} - ${phase}.docx`,
}));

jest.mock("@/utils/curriculum/zip", () => ({
  zipFromFiles: (...args: unknown[]) => mockZipFromFiles(...args),
}));

const hub = {
  subjects: [
    {
      slug: "science",
      tabs: [{ kind: "primary" }, { kind: "secondary" }],
    },
    { slug: "maths", tabs: [{ kind: "primary" }] },
  ],
};

const postRequest = (selections: unknown) =>
  ({ json: async () => ({ selections }) }) as Request;

describe("national curriculum insights downloads", () => {
  beforeAll(() => {
    if (typeof Response.json !== "function") {
      Object.defineProperty(Response, "json", {
        configurable: true,
        value: (body: unknown, init?: ResponseInit) =>
          new Response(JSON.stringify(body), {
            ...init,
            headers: {
              "Content-Type": "application/json",
              ...init?.headers,
            },
          }),
      });
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockHub.mockResolvedValue(hub);
    mockSubjectBySlug.mockImplementation(async (slug: string) => ({
      slug: { current: slug },
      title: slug === "science" ? "Science" : "Maths",
    }));
    mockGenerateDocx.mockResolvedValue(Buffer.from("docx"));
    mockZipFromFiles.mockResolvedValue(Buffer.from("zip"));
  });

  it("rejects an invalid or empty selection", async () => {
    const response = await POST(postRequest([]));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Select at least one valid subject.",
    });
  });

  it("rejects malformed JSON", async () => {
    const response = await POST({
      json: async () => Promise.reject(new Error("invalid")),
    } as unknown as Request);

    expect(response.status).toBe(400);
  });

  it("returns a single Word document", async () => {
    const response = await POST(
      postRequest([{ subjectSlug: "science", phase: "primary" }]),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(response.headers.get("x-filename")).toBe("Science - primary.docx");
    expect(mockGenerateDocx).toHaveBeenCalledWith(
      expect.objectContaining({ phase: "primary" }),
    );
    expect(mockZipFromFiles).not.toHaveBeenCalled();
  });

  it("deduplicates selections and returns a zip for multiple documents", async () => {
    const response = await POST(
      postRequest([
        { subjectSlug: "science", phase: "primary" },
        { subjectSlug: "science", phase: "primary" },
        { subjectSlug: "maths", phase: "primary" },
      ]),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/zip");
    expect(response.headers.get("x-filename")).toMatch(
      /^National curriculum insights - \d{2}-\d{2}-\d{4}\.zip$/,
    );
    expect(mockGenerateDocx).toHaveBeenCalledTimes(2);
    expect(mockZipFromFiles).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ filename: "Science - primary.docx" }),
        expect.objectContaining({ filename: "Maths - primary.docx" }),
      ]),
    );
  });

  it("accepts valid GET selections", async () => {
    const response = await GET({
      url: "https://example.com/api/download?selection=science%3Asecondary",
    } as Request);

    expect(response.status).toBe(200);
    expect(mockGenerateDocx).toHaveBeenCalledWith(
      expect.objectContaining({ phase: "secondary" }),
    );
  });

  it("rejects malformed GET selections", async () => {
    const response = await GET({
      url: "https://example.com/api/download?selection=science%3Aprimary%3Aextra",
    } as Request);

    expect(response.status).toBe(400);
  });

  it("fails closed when the catalogue is unavailable", async () => {
    mockHub.mockResolvedValue(null);

    const response = await POST(
      postRequest([{ subjectSlug: "science", phase: "primary" }]),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Curriculum insights are unavailable.",
    });
  });

  it("rejects unpublished subject and phase combinations", async () => {
    const response = await POST(
      postRequest([{ subjectSlug: "maths", phase: "secondary" }]),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "The requested subject and phase are not published.",
    });
  });

  it("rejects a subject that cannot be resolved", async () => {
    mockSubjectBySlug.mockResolvedValue(null);

    const response = await POST(
      postRequest([{ subjectSlug: "science", phase: "primary" }]),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "The requested subject is unavailable.",
    });
  });
});
