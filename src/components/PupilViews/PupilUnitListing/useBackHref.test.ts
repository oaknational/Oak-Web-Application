import { useBackHref } from "./useBackHref";

describe("useBackHref", () => {
  it("should render a link which links back to tiers if the programme has tiers and examboards", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      tierSlug: "core",
      yearSlug: "year-10",
      examboardSlug: "aqa",
    });

    expect(backHref).toBe(
      "/pupils/programmes/maths-secondary-year-10/options/examboard/aqa",
    );
    expect(backLabel).toBe("Change tier");
  });

  it("should render a link which links back to subjects if the programme has no tiers and no examboards", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
    });

    expect(backHref).toBe("/pupils/years/year-10/subjects");
    expect(backLabel).toBe("Change subject");
  });

  it("should render a link which links back to examboards if the programme has examboards and no tiers", () => {
    const [backHref, backLabel] = useBackHref({
      baseSlug: "maths-secondary-year-10",
      yearSlug: "year-10",
      examboardSlug: "aqa",
    });

    expect(backHref).toBe("/pupils/programmes/maths-secondary-year-10/options");
    expect(backLabel).toBe("Change examboard");
  });
});
