import { shouldInitIntroWorksheetResult } from "./shouldInitIntroWorksheetResult";

describe("shouldInitIntroWorksheetResult", () => {
  it("returns true when worksheet availability has not been initialised on intro", () => {
    expect(
      shouldInitIntroWorksheetResult({
        worksheetAvailable: undefined,
        currentSection: "intro",
      }),
    ).toBe(true);
  });

  it("returns false when already initialised or not on intro", () => {
    expect(
      shouldInitIntroWorksheetResult({
        worksheetAvailable: false,
        currentSection: "intro",
      }),
    ).toBe(false);
    expect(
      shouldInitIntroWorksheetResult({
        worksheetAvailable: undefined,
        currentSection: "video",
      }),
    ).toBe(false);
  });
});
