import { resolveInternalHref } from "./resolveInternalHref";

describe("resolveInternalHref()", () => {
  it.each([
    [{ contentType: "homepage" }, "/"],
    [{ contentType: "aboutCorePage" }, "/about-us"],
    [{ contentType: "planningCorePage" }, "/lesson-planning"],
    [{ contentType: "supportCorePage" }, "/support"],
    [{ contentType: "curriculumCorePage" }, "/develop-your-curriculum"],
    [{ contentType: "webinar", slug: "the-webinar" }, "/webinars/the-webinar"],
    [{ contentType: "webinarListingPage" }, "/webinars"],
    [{ contentType: "newsPost", slug: "the-post" }, "/blog/the-post"],
    [{ contentType: "newsListingPage" }, "/blog"],
    [{ contentType: "policyPage", slug: "the-policy" }, "/legal/the-policy"],
    [{ contentType: "landingPage", slug: "landing-page" }, "/lp/landing-page"],
  ])("generates the correct href for %s", (entry, expectedHref) => {
    expect(resolveInternalHref(entry as never)).toBe(expectedHref);
  });

  it("throws when encountering an unknown contentType", () => {
    expect(() => {
      resolveInternalHref({ contentType: "foo" as never });
    }).toThrow();
  });
});
