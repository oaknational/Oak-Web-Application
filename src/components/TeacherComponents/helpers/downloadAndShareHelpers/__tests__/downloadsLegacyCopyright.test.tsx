import {
  isDownloadAvailable,
  getFilteredDownloads,
  isResourceTypeSubjectToCopyright,
  checkIfResourceHasLegacyCopyright,
} from "../downloadsLegacyCopyright";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { LegacyCopyrightContent } from "@/node-lib/curriculum-api-2023/shared.schema";

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

describe("checkIfResourceHasLegacyCopyright", () => {
  const mockLegacyCopyright: LegacyCopyrightContent = [
    { copyrightInfo: "This lesson contains copyright material." },
  ];

  it("should return true for copyrighted resource types when copyright content exists", () => {
    expect(
      checkIfResourceHasLegacyCopyright("worksheet-pdf", mockLegacyCopyright),
    ).toBe(true);
    expect(
      checkIfResourceHasLegacyCopyright("presentation", mockLegacyCopyright),
    ).toBe(true);
    expect(
      checkIfResourceHasLegacyCopyright("worksheet-pptx", mockLegacyCopyright),
    ).toBe(true);
  });

  it("should return false when no copyright content exists", () => {
    expect(checkIfResourceHasLegacyCopyright("worksheet-pdf", [])).toBe(false);
  });

  it("should return false for non-copyrighted resource types", () => {
    expect(
      checkIfResourceHasLegacyCopyright(
        "intro-quiz-answers",
        mockLegacyCopyright,
      ),
    ).toBe(false);
  });
});
