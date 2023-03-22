import { preselectedDownloadTitleTypeMap } from "../downloads.types";

import { getPreselectedDownloadResourceTypes } from "./getDownloadResourceType";

describe("getDownloadResourceType", () => {
  it("should return undefined if the resource title is not matched", async () => {
    const resourceType = getPreselectedDownloadResourceTypes("");

    expect(resourceType).toBe(undefined);
  });
  it("should return an array of download types for each title key in the preselectedDownloadTitleTypeMap object", async () => {
    const resourceTypes = Object.keys(preselectedDownloadTitleTypeMap).map(
      (title) => {
        return getPreselectedDownloadResourceTypes(title);
      }
    );

    expect(resourceTypes).toEqual([
      ["presentation"],
      ["intro-quiz-questions", "intro-quiz-answers"],
      ["exit-quiz-questions", "exit-quiz-answers"],
      ["worksheet-pdf", "worksheet-pptx"],
      "all",
    ]);
  });
});
