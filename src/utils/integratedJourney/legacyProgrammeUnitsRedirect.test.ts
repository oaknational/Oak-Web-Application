import {
  buildIntegratedProgrammeUnitsUrl,
  getLegacyProgrammeUnitsRedirectDestination,
} from "./legacyProgrammeUnitsRedirect";

import { parseProgrammeSlug } from "@/utils/curriculum/slugs";

describe("buildIntegratedProgrammeUnitsUrl", () => {
  it("redirects citizenship ks3 with year and learning-theme query params", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("citizenship-secondary-ks3")!,
      {
        year: "year-7",
        "learning-theme": "all",
      },
    );

    expect(url).toBe(
      "/teachers/programmes/citizenship-secondary/units?keystages=ks3&years=7",
    );
  });

  it("redirects ks4 computing with examboard in subject phase slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("computing-secondary-ks4-gcse-aqa")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/computing-secondary-aqa/units?keystages=ks4",
    );
  });

  it("redirects ks4 maths with tier query param", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("maths-secondary-ks4-foundation")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
    );
  });

  it("redirects primary ks1 slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("computing-primary-ks1")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/computing-primary/units?keystages=ks1",
    );
  });

  it("redirects biology to science with child subject and tier", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("biology-secondary-ks4-higher-aqa")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/science-secondary-aqa/units?keystages=ks4&tiers=higher&child_subjects=biology",
    );
  });

  it("redirects chemistry to science with child subject", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("chemistry-secondary-ks4-aqa")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/science-secondary-aqa/units?keystages=ks4&child_subjects=chemistry",
    );
  });

  it("redirects combined science with tier and examboard", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("combined-science-secondary-ks4-foundation-edexcel")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/science-secondary-edexcel/units?keystages=ks4&tiers=foundation&child_subjects=combined-science",
    );
  });

  it("redirects pathway-only gcse slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("citizenship-secondary-ks4-gcse")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/citizenship-secondary-gcse/units?keystages=ks4",
    );
  });

  it("redirects core pathway slug", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("computing-secondary-ks4-core")!,
      {},
    );

    expect(url).toBe(
      "/teachers/programmes/computing-secondary-core/units?keystages=ks4",
    );
  });

  it("maps learning-theme and category query params", () => {
    const url = buildIntegratedProgrammeUnitsUrl(
      parseProgrammeSlug("english-secondary-ks3")!,
      {
        "learning-theme": "theme-1",
        category: "grammar",
      },
    );

    expect(url).toBe(
      "/teachers/programmes/english-secondary/units?keystages=ks3&threads=theme-1&subject_categories=grammar",
    );
  });
});

describe("getLegacyProgrammeUnitsRedirectDestination", () => {
  it("does not redirect subjectPhaseSlug unit listing", () => {
    expect(
      getLegacyProgrammeUnitsRedirectDestination("citizenship-secondary", {}),
    ).toBeNull();
  });

  it("returns destination for legacy programme slug", () => {
    expect(
      getLegacyProgrammeUnitsRedirectDestination("citizenship-secondary-ks3", {
        year: "year-7",
        "learning-theme": "all",
      }),
    ).toBe(
      "/teachers/programmes/citizenship-secondary/units?keystages=ks3&years=7",
    );
  });

  it("maps array search param values", () => {
    expect(
      getLegacyProgrammeUnitsRedirectDestination("english-secondary-ks3", {
        "learning-theme": "theme-1",
        category: "grammar",
      }),
    ).toBe(
      "/teachers/programmes/english-secondary/units?keystages=ks3&threads=theme-1&subject_categories=grammar",
    );
  });

  it("returns null for invalid programme slug", () => {
    expect(
      getLegacyProgrammeUnitsRedirectDestination("invalid-programme-slug", {}),
    ).toBeNull();
  });
});
