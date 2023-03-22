import { preselectedDownloadTypeMap } from "../downloads.types";

import { getPreselectedDownloadResourceTypes } from "./getDownloadResourceType";

describe("getDownloadResourceType", () => {
  it("should return undefined for an empty string", async () => {
    const resourceType = getPreselectedDownloadResourceTypes("");

    expect(resourceType).toBe(undefined);
  });
  it("should return undefined for an title that does not match", async () => {
    const resourceType = getPreselectedDownloadResourceTypes("not correct");

    expect(resourceType).toBe(undefined);
  });
  it("should return an array of download types for each title key in the preselectedDownloadTypeMap object", async () => {
    const resourceTypes = Object.keys(preselectedDownloadTypeMap).map(
      (title) => {
        return getPreselectedDownloadResourceTypes(title);
      }
    );

    expect(resourceTypes).toEqual(Object.values(preselectedDownloadTypeMap));
  });
});
