import {
  checkIfResourceHasLegacyCopyright,
  getFilteredDownloads,
  getIsResourceDownloadable,
  isDownloadAvailable,
  isResourceTypeSubjectToCopyright,
} from "./downloadsLegacyCopyright";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LegacyCopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

describe("checkIfResourceHasLegacCopyright", () => {
  test("checkIfResourceHasLegacyCopyright works for non-copyright restricted resource types", () => {
    const res = checkIfResourceHasLegacyCopyright("intro-quiz-answers", [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);
    expect(res).toBe(false);
  });
  test("checkIfResourceHasLegacyCopyright works for copyright restricted resouce types when copyright is present", () => {
    const res = checkIfResourceHasLegacyCopyright("presentation", [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);
    expect(res).toBe(true);
  });
  test("checkIfResourceHasLegacyCopyright works for copyright restricted resouce types when copyright is not present", () => {
    const res = checkIfResourceHasLegacyCopyright("presentation", []);
    expect(res).toBe(false);
  });
  test("getIsResourceDownloadable returns false when resource does not exist in downloads", () => {
    const res = getIsResourceDownloadable("intro-quiz-answers", [], []);
    expect(res).toBe(false);
  });

  test("getIsResourceDownloadable returns true when resource is available and has no copyright restrictions", () => {
    const res = getIsResourceDownloadable(
      "intro-quiz-answers",
      [
        {
          exists: true,
          inGcsBucket: true,
          type: "intro-quiz-answers",
          label: "Starter quiz answers",
          ext: "pdf",
          forbidden: null,
        },
      ],
      [],
    );
    expect(res).toBe(true);
  });

  test("getIsResourceDownloadable returns false when copyright prevents download of copyright-restricted resource", () => {
    const res = getIsResourceDownloadable(
      "presentation",
      [
        {
          exists: true,
          inGcsBucket: true,
          type: "presentation",
          label: "Slide deck",
          ext: "pptx",
          forbidden: null,
        },
      ],
      [{ copyrightInfo: "This lesson contains copyright material." }],
    );
    expect(res).toBe(false);
  });

  test("getIsResourceDownloadable returns true when copyright-restricted resource has no copyright content", () => {
    const res = getIsResourceDownloadable(
      "presentation",
      [
        {
          exists: true,
          inGcsBucket: true,
          type: "presentation",
          label: "Slide deck",
          ext: "pptx",
          forbidden: null,
        },
      ],
      [],
    );
    expect(res).toBe(true);
  });
});

describe("isDownloadAvailable", () => {
  it("should return true when download exists, is not forbidden, and is in GCS bucket", () => {
    const download = {
      exists: true,
      forbidden: false,
      inGcsBucket: true,
      type: "worksheet-pdf",
    } as LessonDownloadsPageData["downloads"][number];

    expect(isDownloadAvailable(download)).toBe(true);
  });

  it("should return false when download does not exist", () => {
    const download = {
      exists: false,
      forbidden: false,
      inGcsBucket: true,
      type: "worksheet-pdf",
    } as LessonDownloadsPageData["downloads"][number];

    expect(isDownloadAvailable(download)).toBe(false);
  });

  it("should return false when download is forbidden", () => {
    const download = {
      exists: true,
      forbidden: true,
      inGcsBucket: true,
      type: "worksheet-pdf",
    } as LessonDownloadsPageData["downloads"][number];

    expect(isDownloadAvailable(download)).toBe(false);
  });

  it("should return false when download is not in GCS bucket", () => {
    const download = {
      exists: true,
      forbidden: false,
      inGcsBucket: false,
      type: "worksheet-pdf",
    } as LessonDownloadsPageData["downloads"][number];

    expect(isDownloadAvailable(download)).toBe(false);
  });

  it("should return true when inGcsBucket is undefined (bucket not checked)", () => {
    const download = {
      exists: true,
      forbidden: false,
      inGcsBucket: undefined,
      type: "worksheet-pdf",
    } as LessonDownloadsPageData["downloads"][number];

    expect(isDownloadAvailable(download)).toBe(true);
  });
});

describe("getFilteredDownloads", () => {
  const mockLegacyCopyright: LegacyCopyrightContent = [
    { copyrightInfo: "This lesson contains copyright material." },
  ];

  it("should filter out downloads with legacy copyright and unavailable downloads", () => {
    const downloads = [
      {
        type: "worksheet-pdf",
        exists: true,
        forbidden: false,
        inGcsBucket: true,
      },
      {
        type: "presentation",
        exists: true,
        forbidden: false,
        inGcsBucket: true,
      },
      {
        type: "intro-quiz-answers",
        exists: true,
        forbidden: false,
        inGcsBucket: false,
      },
      {
        type: "exit-quiz-questions",
        exists: false,
        forbidden: false,
        inGcsBucket: true,
      },
    ] as LessonDownloadsPageData["downloads"];

    const result = getFilteredDownloads(downloads, mockLegacyCopyright);

    // Should filter out worksheet-pdf and presentation (copyright)
    // Should filter out intro-quiz-answers (not in bucket)
    // Should filter out exit-quiz-questions (doesn't exist)
    expect(result).toHaveLength(0);
  });

  it("should include downloads without copyright issues that are available", () => {
    const downloads = [
      {
        type: "intro-quiz-answers",
        exists: true,
        forbidden: false,
        inGcsBucket: true,
      },
      {
        type: "exit-quiz-questions",
        exists: true,
        forbidden: false,
        inGcsBucket: true,
      },
    ] as LessonDownloadsPageData["downloads"];

    const result = getFilteredDownloads(downloads, []);

    expect(result).toHaveLength(2);
    expect(result).toEqual(downloads);
  });

  it("should handle empty downloads array", () => {
    const downloads: LessonDownloadsPageData["downloads"] = [];

    const result = getFilteredDownloads(downloads, mockLegacyCopyright);

    expect(result).toHaveLength(0);
  });
});

describe("isResourceTypeSubjectToCopyright", () => {
  it("should return true for worksheet-pdf", () => {
    expect(isResourceTypeSubjectToCopyright("worksheet-pdf")).toBe(true);
  });

  it("should return true for presentation", () => {
    expect(isResourceTypeSubjectToCopyright("presentation")).toBe(true);
  });

  it("should return true for worksheet-pptx", () => {
    expect(isResourceTypeSubjectToCopyright("worksheet-pptx")).toBe(true);
  });

  it("should return false for other resource types", () => {
    expect(isResourceTypeSubjectToCopyright("intro-quiz-answers")).toBe(false);
    expect(isResourceTypeSubjectToCopyright("exit-quiz-questions")).toBe(false);
  });
});
