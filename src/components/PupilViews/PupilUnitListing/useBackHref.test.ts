import { useBackHref } from "./useBackHref";

describe("useBackHref", () => {
  it("should render a link which links back to tiers if the programme has tiers and examboards", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      isLegacy: false,
      tierSlug: "core",
      yearSlug: "year-10",
      examboardSlug: "aqa",
    });

    expect(backHref).toBe(
      "/pupils/beta/programmes/maths-secondary-year-10/options?examboard=aqa",
    );
    expect(backLabel).toBe("Select tiers");
  });

  it("should render a link which links back to subjects if the programme has no tiers and no examboards", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
      isLegacy: false,
    });

    expect(backHref).toBe("/pupils/beta/years/year-10/subjects");
    expect(backLabel).toBe("Select subjects");
  });

  it("should render a link which links back to examboards if the programme has examboards and no tiers", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
      isLegacy: false,
      examboardSlug: "aqa",
    });

    expect(backHref).toBe(
      "/pupils/beta/programmes/maths-secondary-year-10/options",
    );
    expect(backLabel).toBe("Select examboards");
  });
});
