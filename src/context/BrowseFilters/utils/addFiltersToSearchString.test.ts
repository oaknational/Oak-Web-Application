import { addFiltersToSearchString } from "./addFiltersToSearchString";
import { createFilter } from "./fixtures";

describe("addFiltersToSearchString", () => {
  const defaultFilter = createFilter({
    years: ["7", "8"],
    tiers: ["foundation"],
  });

  it("writes filters that differ from the default", () => {
    const search = addFiltersToSearchString(
      "",
      createFilter({ years: ["7", "8"], tiers: ["higher"] }),
      defaultFilter,
    );

    expect(new URLSearchParams(search).get("tiers")).toBe("higher");
  });

  it("omits filters that match the default, keeping shared URLs short", () => {
    const search = addFiltersToSearchString("", defaultFilter, defaultFilter);

    expect(search).toBe("");
  });

  it("preserves params belonging to other features", () => {
    const search = addFiltersToSearchString(
      "?utm_source=newsletter&focus_ks4_option=aqa",
      createFilter({ years: ["7", "8"], tiers: ["higher"] }),
      defaultFilter,
    );
    const params = new URLSearchParams(search);

    expect(params.get("utm_source")).toBe("newsletter");
    expect(params.get("focus_ks4_option")).toBe("aqa");
    expect(params.get("tiers")).toBe("higher");
  });

  it("clears filter params that are no longer active", () => {
    const search = addFiltersToSearchString(
      "?tiers=higher",
      defaultFilter,
      defaultFilter,
    );

    expect(new URLSearchParams(search).get("tiers")).toBeNull();
  });
});
