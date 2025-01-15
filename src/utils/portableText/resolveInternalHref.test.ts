import { resolveInternalHref } from "./resolveInternalHref";

describe("resolveInternalHref()", () => {
  it.each([
    ["homepage", {}, "/"],
    ["aboutCorePage", {}, "/about-us/who-we-are"],
    ["aboutCorePage.whoWeAre", {}, `/about-us/who-we-are`],
    ["aboutCorePage.board", {}, `/about-us/board`],
    ["aboutCorePage.leadership", {}, `/about-us/leadership`],
    ["aboutCorePage.partners", {}, `/about-us/partners`],
    ["aboutCorePage.workWithUs", {}, `/about-us/work-with-us`],
    ["planningCorePage", {}, "/lesson-planning"],
    ["supportCorePage", {}, "/support-your-team"],
    ["webinar", { slug: "the-webinar" }, "/webinars/the-webinar"],
    ["webinarListingPage", {}, "/webinars"],
    ["newsPost", { slug: "the-post" }, "/blog/the-post"],
    ["newsListingPage", {}, "/blog"],
    ["policyPage", { slug: "the-policy" }, "/legal/the-policy"],
    ["landingPage", { slug: "landing-page" }, "/lp/landing-page"],
    ["contactCorePage", {}, `/contact-us`],
  ])(
    "generates the correct href for %s",
    (contentType, additionalParams, expectedHref) => {
      const entry = { contentType, ...additionalParams };
      expect(resolveInternalHref(entry as never)).toBe(expectedHref);
    },
  );

  it("proxies attachments", () => {
    const entry = {
      contentType: "attachment",
      file: {
        asset: {
          url: "https://cdn.sanity.io/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
        },
      },
    };
    expect(resolveInternalHref(entry as never)).toBe(
      "https://NEXT_PUBLIC_SANITY_ASSET_CDN_HOST/files/cuvjke51/production/becc1901c9dbacb8889f5952605672be926d5386.pdf",
    );
  });

  it("throws when encountering an unknown contentType", () => {
    expect(() => {
      resolveInternalHref({ contentType: "foo" as never });
    }).toThrow();
  });
});
