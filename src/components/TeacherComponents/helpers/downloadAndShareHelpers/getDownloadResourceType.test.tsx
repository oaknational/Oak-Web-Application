import { getPreselectedDownloadResourceTypes } from "./getDownloadResourceType";

describe("getDownloadResourceType", () => {
  it("should return presentation for slide deck", async () => {
    const resourceType = getPreselectedDownloadResourceTypes("slide deck");

    expect(resourceType).toEqual(["presentation"]);
  });
  it("should return all for all", async () => {
    const resourceTypes = getPreselectedDownloadResourceTypes("all");

    expect(resourceTypes).toEqual("all");
  });
});
