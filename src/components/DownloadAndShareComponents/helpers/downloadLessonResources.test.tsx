import type { ResourcesToDownloadArrayType } from "../downloadAndShare.types";

import downloadLessonResources from "./downloadLessonResources";
import createDownloadResourcesLink from "./createDownloadResourcesLink";

vi.mock("./createDownloadResourcesLink");
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
const resourcesToDownloadAsSelection = "exit-quiz-answers,worksheet-pdf";

describe("downloadLessonResources", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve(successResponse)) as jest.Mock;
  });

  it("should return when no resource types are passed", async () => {
    console.log = vi.fn();
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
