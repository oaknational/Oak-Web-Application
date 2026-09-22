import { getFiltersFromSearchString } from "./getFiltersFromSearchString";

describe("getFiltersFromSearchString", () => {
  it("reads the filter params it owns", () => {
    expect(
      getFiltersFromSearchString(
        "?years=7,8&child_subjects=biology&tiers=higher",
      ),
    ).toEqual({
      years: ["7", "8"],
      childSubjects: ["biology"],
      tiers: ["higher"],
    });
  });

  it("omits params that are absent, rather than defaulting them", () => {
    expect(getFiltersFromSearchString("?tiers=higher")).toEqual({
      tiers: ["higher"],
    });
  });

  it("ignores params that don't belong to the filters", () => {
    expect(getFiltersFromSearchString("?utm_source=newsletter")).toEqual({});
  });

  it("ignores empty filter params", () => {
    expect(getFiltersFromSearchString("?tiers=")).toEqual({});
  });
});
