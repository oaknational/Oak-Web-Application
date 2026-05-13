import { getUnitListingHref } from "./getUnitListingHref";

describe("getUnitListingHref", () => {
  it("builds a pupil programme options href from subject, phase and year", () => {
    expect(
      getUnitListingHref({
        subjectSlug: "english",
        phaseSlug: "primary",
        yearSlug: "year-1",
      }),
    ).toBe("/pupils/programmes/english-primary-year-1/options");
  });
});
