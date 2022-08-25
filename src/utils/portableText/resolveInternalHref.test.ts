import { resolveInternalHref } from "./resolveInternalHref";

describe("resolveInternalHref()", () => {
  it.each([
    ["aboutCorePage", undefined, "/about"],
    ["planningCorePage", undefined, "/planning"],
    ["supportCorePage", undefined, "/support"],
    ["curriculumCorePage", undefined, "/curriculum"],
    ["webinar", { current: "the-webinar" }, "/webinars/the-webinar"],
    ["webinarListingPage", undefined, "/webinars"],
    ["newsPost", { current: "the-post" }, "/blog/the-post"],
    ["newsListingPage", undefined, "/blog"],
    ["policyPage", { current: "the-policy" }, "/legal/the-policy"],
  ])("generates the correct href for %s", (contentType, slug, expectedHref) => {
    expect(resolveInternalHref(contentType, slug)).toBe(expectedHref);
  });

  it("throws when enountering an unknown contentType", () => {
    expect(() => {
      resolveInternalHref("foo");
    }).toThrow();
  });
});
