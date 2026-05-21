import {
  buildIntegratedProgrammeUnitsUrl,
  getLegacyProgrammeSlugFromPathname,
  tryLegacyProgrammeUnitsRedirect,
} from "./legacyProgrammeUnitsRedirect";

describe("getLegacyProgrammeSlugFromPathname", () => {
  it("extracts programme slug from unit listing path", () => {
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/citizenship-secondary-ks3/units",
      ),
    ).toBe("citizenship-secondary-ks3");
  });

  it("does not match lesson paths", () => {
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/citizenship-secondary-ks3/units/some-unit/lessons",
      ),
    ).toBeNull();
  });

  it("does not match subjectPhaseSlug unit listing paths", () => {
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/citizenship-secondary/units",
      ),
    ).toBeNull();
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/english-secondary-aqa/units",
      ),
    ).toBeNull();
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/computing-secondary-core/units",
      ),
    ).toBeNull();
  });

  it("does not match lesson paths under subjectPhaseSlug", () => {
    expect(
      getLegacyProgrammeSlugFromPathname(
        "/teachers/programmes/citizenship-secondary/units/some-unit/lessons",
      ),
    ).toBeNull();
  });
});

describe("buildIntegratedProgrammeUnitsUrl", () => {
  it("redirects citizenship ks3 with year and learning-theme query params", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "citizenship-secondary-ks3",
      new URLSearchParams("year=year-7&learning-theme=all"),
    );

    expect(url).toBe(
      "/programmes/citizenship-secondary/units?keystages=ks3&years=7",
    );
  });

  it("redirects ks4 computing with examboard in subject phase slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "computing-secondary-ks4-gcse-aqa",
      new URLSearchParams(),
    );

    expect(url).toBe("/programmes/computing-secondary-aqa/units?keystages=ks4");
  });

  it("redirects ks4 maths with tier query param", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "maths-secondary-ks4-foundation",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
    );
  });

  it("redirects primary ks1 slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "computing-primary-ks1",
      new URLSearchParams(),
    );

    expect(url).toBe("/programmes/computing-primary/units?keystages=ks1");
  });

  it("redirects biology to science with child subject and tier", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "biology-secondary-ks4-higher-aqa",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/science-secondary-aqa/units?keystages=ks4&tiers=higher&child_subjects=biology",
    );
  });

  it("redirects chemistry to science with child subject", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "chemistry-secondary-ks4-aqa",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/science-secondary-aqa/units?keystages=ks4&child_subjects=chemistry",
    );
  });

  it("redirects combined science with tier and examboard", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "combined-science-secondary-ks4-foundation-edexcel",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/science-secondary-edexcel/units?keystages=ks4&tiers=foundation&child_subjects=combined-science",
    );
  });

  it("redirects pathway-only gcse slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "citizenship-secondary-ks4-gcse",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/citizenship-secondary-gcse/units?keystages=ks4",
    );
  });

  it("redirects core pathway slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "computing-secondary-ks4-core",
      new URLSearchParams(),
    );

    expect(url).toBe(
      "/programmes/computing-secondary-core/units?keystages=ks4",
    );
  });

  it("maps learning-theme and category query params", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      "english-secondary-ks3",
      new URLSearchParams("learning-theme=theme-1&category=grammar"),
    );

    expect(url).toBe(
      "/programmes/english-secondary/units?keystages=ks3&threads=theme-1&subject_categories=grammar",
    );
  });

  it("returns null for invalid programme slug", () => {
    expect(
      buildIntegratedProgrammeUnitsUrl(
        "invalid-programme-slug",
        new URLSearchParams(),
      ),
    ).toBeNull();
  });
});

describe("tryLegacyProgrammeUnitsRedirect", () => {
  it("does not redirect subjectPhaseSlug unit listing", () => {
    expect(
      tryLegacyProgrammeUnitsRedirect({
        nextUrl: {
          pathname: "/teachers/programmes/citizenship-secondary/units",
          searchParams: new URLSearchParams(),
        },
      }),
    ).toBeNull();
  });

  it("returns destination for matching pathname", () => {
    expect(
      tryLegacyProgrammeUnitsRedirect({
        nextUrl: {
          pathname: "/teachers/programmes/citizenship-secondary-ks3/units",
          searchParams: new URLSearchParams("year=year-7&learning-theme=all"),
        },
      }),
    ).toBe("/programmes/citizenship-secondary/units?keystages=ks3&years=7");
  });

  it("returns null for non-matching pathname", () => {
    expect(
      tryLegacyProgrammeUnitsRedirect({
        nextUrl: {
          pathname: "/teachers/programmes/citizenship-secondary-ks3/units/foo",
          searchParams: new URLSearchParams(),
        },
      }),
    ).toBeNull();
  });
});
