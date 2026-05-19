import { getDedupedContentGuidanceLabels } from "./getDedupedContentGuidanceLabels";

describe("getDedupedContentGuidanceLabels", () => {
  it("returns unique guidance labels in first-seen order", () => {
    expect(
      getDedupedContentGuidanceLabels([
        {
          contentguidanceLabel: "Contains conflict.",
          contentguidanceArea: null,
          contentguidanceDescription: null,
        },
        {
          contentguidanceLabel: "Contains conflict.",
          contentguidanceArea: null,
          contentguidanceDescription: null,
        },
        {
          contentguidanceLabel: "Mentions loss.",
          contentguidanceArea: null,
          contentguidanceDescription: null,
        },
      ]),
    ).toEqual(["Contains conflict.", "Mentions loss."]);
  });

  it("returns an empty label when guidance has no label", () => {
    expect(
      getDedupedContentGuidanceLabels([
        {
          contentguidanceLabel: null,
          contentguidanceArea: null,
          contentguidanceDescription: null,
        },
      ]),
    ).toEqual([""]);
  });

  it("returns an empty array when guidance is missing", () => {
    expect(getDedupedContentGuidanceLabels(null)).toEqual([]);
    expect(getDedupedContentGuidanceLabels(undefined)).toEqual([]);
  });
});
