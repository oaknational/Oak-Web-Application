import {
  checkIsResourceCopyrightRestricted,
  getIsResourceDownloadable,
} from "./downloadsCopyright";

describe("downloads copyright", () => {
  test("checkIsResourceCopyrightRestricted works for non-copyright restricted resource types", () => {
    const res = checkIsResourceCopyrightRestricted("intro-quiz-answers", [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);
    expect(res).toBe(false);
  });
  test("checkIsResourceCopyrightRestricted works for copyright restricted resouce types when copyright is present", () => {
    const res = checkIsResourceCopyrightRestricted("presentation", [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);
    expect(res).toBe(true);
  });
  test("checkIsResourceCopyrightRestricted works for copyright restricted resouce types when copyright is not present", () => {
    const res = checkIsResourceCopyrightRestricted("presentation", []);
    expect(res).toBe(false);
  });
  test("getIsResourceDownloadable returns false when resource does not exist in downloads", () => {
    const res = getIsResourceDownloadable("intro-quiz-answers", [], []);
    expect(res).toBe(false);
  });
  test("getIsResourceDownloadable returns true when resource exists in downloads", () => {
    const res = getIsResourceDownloadable(
      "intro-quiz-answers",
      [{ exists: true, type: "intro-quiz-answers" }],
      [],
    );
    expect(res).toBe(true);
  });
  test("getIsResourceDownloadable returns false when copyright prevents download of resource", () => {
    const res = getIsResourceDownloadable(
      "presentation",
      [{ exists: true, type: "presentation" }],
      [{ copyrightInfo: "This lesson contains copyright material." }],
    );
    expect(res).toBe(false);
  });
});
