import { formatContentGuidanceText } from "./formatContentGuidanceText";

describe("formatContentGuidanceText", () => {
  it("adds punctuation and appends supervision level", () => {
    expect(
      formatContentGuidanceText({
        contentGuidance: [
          {
            contentguidanceLabel: "Threat",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
          {
            contentguidanceLabel: "Mild violence.",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
        supervisionLevel: "Adult supervision recommended",
      }),
    ).toBe("Threat. Mild violence. Adult supervision recommended.");
  });

  it("omits the supervision level when it is not provided", () => {
    expect(
      formatContentGuidanceText({
        contentGuidance: [
          {
            contentguidanceLabel: "Scenes of conflict",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      }),
    ).toBe("Scenes of conflict.");
  });
});
