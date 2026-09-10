import { getIntroWorksheetInitResult } from "./getIntroWorksheetInitResult";

describe("getIntroWorksheetInitResult", () => {
  it("sets worksheet availability from the lesson content", () => {
    expect(
      getIntroWorksheetInitResult({
        worksheetDownloaded: undefined,
        hasWorksheet: true,
      }),
    ).toEqual({
      worksheetDownloaded: false,
      worksheetAvailable: true,
    });
  });

  it("preserves a downloaded worksheet state", () => {
    expect(
      getIntroWorksheetInitResult({
        worksheetDownloaded: true,
        hasWorksheet: false,
      }),
    ).toEqual({
      worksheetDownloaded: true,
      worksheetAvailable: false,
    });
  });
});
