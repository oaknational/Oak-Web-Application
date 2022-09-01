import { resolveInternalHref } from "./resolveInternalHref";

describe("resolveInternalHref()", () => {
  it.each([
    [{ contentType: "aboutCorePage" }, "/about-us"],
    [{ contentType: "planningCorePage" }, "/lesson-planning"],
    [{ contentType: "supportCorePage" }, "/support"],
    [{ contentType: "curriculumCorePage" }, "/develop-your-curriculum"],
    [{ contentType: "webinar", slug: "the-webinar" }, "/webinars/the-webinar"],
    [{ contentType: "webinarListingPage" }, "/webinars"],
    [{ contentType: "newsPost", slug: "the-post" }, "/blog/the-post"],
    [{ contentType: "newsListingPage" }, "/blog"],
    [{ contentType: "policyPage", slug: "the-policy" }, "/legal/the-policy"],
  ])("generates the correct href for %s", (entry, expectedHref) => {
    expect(resolveInternalHref(entry as never)).toBe(expectedHref);
  });

  it("throws when enountering an unknown contentType", () => {
    expect(() => {
      resolveInternalHref("foo" as never);
    }).toThrow();
  });
});
