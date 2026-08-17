import {
  createCurriculumFiltersUrlStorage,
  filtersFromSearchString,
  searchStringWithFilters,
} from "./curriculumFiltersUrlStorage";

import { createFilter } from "@/fixtures/curriculum/filters";

describe("filtersFromSearchString", () => {
  it("reads the filter params it owns", () => {
    expect(
      filtersFromSearchString("?years=7,8&child_subjects=biology&tiers=higher"),
    ).toEqual({
      years: ["7", "8"],
      childSubjects: ["biology"],
      tiers: ["higher"],
    });
  });

  it("omits params that are absent, rather than defaulting them", () => {
    expect(filtersFromSearchString("?tiers=higher")).toEqual({
      tiers: ["higher"],
    });
  });

  it("ignores params that don't belong to the filters", () => {
    expect(filtersFromSearchString("?utm_source=newsletter")).toEqual({});
  });

  it("ignores empty filter params", () => {
    expect(filtersFromSearchString("?tiers=")).toEqual({});
  });
});

describe("searchStringWithFilters", () => {
  const defaultFilter = createFilter({
    years: ["7", "8"],
    tiers: ["foundation"],
  });

  it("writes filters that differ from the default", () => {
    const search = searchStringWithFilters(
      "",
      createFilter({ years: ["7", "8"], tiers: ["higher"] }),
      defaultFilter,
    );

    expect(new URLSearchParams(search).get("tiers")).toBe("higher");
  });

  it("omits filters that match the default, keeping shared URLs short", () => {
    const search = searchStringWithFilters("", defaultFilter, defaultFilter);

    expect(search).toBe("");
  });

  it("preserves params belonging to other features", () => {
    const search = searchStringWithFilters(
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
    const search = searchStringWithFilters(
      "?tiers=higher",
      defaultFilter,
      defaultFilter,
    );

    expect(new URLSearchParams(search).get("tiers")).toBeNull();
  });
});

describe("createCurriculumFiltersUrlStorage", () => {
  const defaultFilter = createFilter({
    years: ["7", "8"],
    tiers: ["foundation"],
  });
  const storage = createCurriculumFiltersUrlStorage(() => defaultFilter);

  beforeEach(() => {
    globalThis.history.replaceState(null, "", "/programme/units");
  });

  it("returns null when the URL carries no filters, so defaults survive", () => {
    expect(storage.getItem("curriculumFilters")).toBeNull();
  });

  it("reads only the filters present in the URL", () => {
    globalThis.history.replaceState(null, "", "/programme/units?tiers=higher");

    expect(storage.getItem("curriculumFilters")).toEqual({
      state: { filters: { tiers: ["higher"] } },
      version: 0,
    });
  });

  it("writes filters to the URL without a page navigation", () => {
    storage.setItem("curriculumFilters", {
      state: { filters: createFilter({ years: ["7"], tiers: ["higher"] }) },
      version: 0,
    });

    expect(window.location.pathname).toBe("/programme/units");
    expect(new URLSearchParams(window.location.search).get("tiers")).toBe(
      "higher",
    );
  });

  it("leaves no trailing '?' when every filter is at its default", () => {
    globalThis.history.replaceState(null, "", "/programme/units?tiers=higher");

    storage.setItem("curriculumFilters", {
      state: { filters: defaultFilter },
      version: 0,
    });

    expect(window.location.search).toBe("");
    expect(window.location.href).toBe("http://localhost/programme/units");
  });

  it("removeItem strips filter params but keeps the rest", () => {
    globalThis.history.replaceState(
      null,
      "",
      "/programme/units?tiers=higher&utm_source=newsletter",
    );

    storage.removeItem("curriculumFilters");

    const params = new URLSearchParams(window.location.search);
    expect(params.get("tiers")).toBeNull();
    expect(params.get("utm_source")).toBe("newsletter");
  });
});
