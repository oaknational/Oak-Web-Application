import { getPreselectedDownloadResourceTypes } from "./getDownloadResourceType";

import lessonDownloadsFixtures from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";

const downloads = lessonDownloadsFixtures().downloads;
describe("getDownloadResourceType", () => {
  it("should return presentation for slide deck", async () => {
    const resourceType = getPreselectedDownloadResourceTypes("slide deck", [
      ...downloads,
      {
        type: "presentation",
        exists: true,
        label: "Presentation",
        ext: "PDF",
      },
    ]);

    expect(resourceType).toEqual(["presentation"]);
  });
  it("should return all for all", async () => {
    const resourceTypes = getPreselectedDownloadResourceTypes("all", downloads);

    expect(resourceTypes).toEqual("all");
  });
  it("should return remove preselected if it does not exist as a download", async () => {
    const resourceTypes = getPreselectedDownloadResourceTypes("worksheet", [
      ...downloads,
      {
        type: "worksheet-pdf",
        exists: false,
        label: "Worksheet",
        ext: "PDF",
      },
    ]);

    expect(resourceTypes).toEqual([]);
  });
});
