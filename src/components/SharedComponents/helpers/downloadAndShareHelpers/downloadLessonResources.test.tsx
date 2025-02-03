import { vi } from "vitest";
import type { Mock } from "vitest";

import { createLessonDownloadLink } from "./createDownloadLink";
import downloadLessonResources from "./downloadLessonResources";

import type { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";

vi.mock("./createDownloadLink", () => ({
  createLessonDownloadLink: vi.fn(),
}));
vi.mock("./createAndClickHiddenDownloadLink");

const data = {
  url: "downloadUrl",
};

const successResponse = {
  json: () =>
    Promise.resolve({
      data,
    }),
  ok: true,
};

const resourcesToDownload: ResourcesToDownloadArrayType = [
  "exit-quiz-answers",
  "worksheet-pdf",
];

describe("downloadLessonResources", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve(successResponse)) as Mock;
  });

  it("should return when no resource types are passed", async () => {
    console.log = vi.fn();
    await downloadLessonResources("lesson-slug", [], true);

    expect(console.log).toHaveBeenCalledWith("no resources to download");
  });

  it("should call createDownloadResourcesLink with correct parameters", async () => {
    await downloadLessonResources("lesson-slug", resourcesToDownload, true);

    expect(createLessonDownloadLink).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug",
      selection: "exit-quiz-answers,worksheet-pdf",
      isLegacyDownload: true,
    });
  });
});
