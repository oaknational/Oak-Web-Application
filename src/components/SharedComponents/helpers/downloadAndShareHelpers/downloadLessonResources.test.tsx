import createDownloadResourcesLink from "./createDownloadResourcesLink";
import downloadLessonResources from "./downloadLessonResources";

import type { ResourcesToDownloadArrayType } from "@/components/TeacherComponents/types/downloadAndShare.types";

jest.mock("./createDownloadResourcesLink");
jest.mock("./createAndClickHiddenDownloadLink");

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
const resourcesToDownloadAsSelection = "exit-quiz-answers,worksheet-pdf";

describe("downloadLessonResources", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve(successResponse)) as jest.Mock;
  });

  it("should return when no resource types are passed", async () => {
    console.log = jest.fn();
    await downloadLessonResources("lesson-slug", [], true);

    expect(console.log).toHaveBeenCalledWith("no resources to download");
  });

  it("should call createDownloadResourcesLink with correct parameters", async () => {
    await downloadLessonResources("lesson-slug", resourcesToDownload, true);

    expect(createDownloadResourcesLink).toHaveBeenCalledWith(
      "lesson-slug",
      resourcesToDownloadAsSelection,
      true,
    );
  });
});
