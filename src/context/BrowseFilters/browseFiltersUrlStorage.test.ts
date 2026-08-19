import { createBrowseFiltersUrlStorage } from "./browseFiltersUrlStorage";

import { createFilter } from "@/fixtures/curriculum/filters";

describe("createBrowseFiltersUrlStorage", () => {
  const defaultFilter = createFilter({
    years: ["7", "8"],
    tiers: ["foundation"],
  });
  const storage = createBrowseFiltersUrlStorage(() => defaultFilter);

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

  it("preserves an existing hash when writing filters", () => {
    globalThis.history.replaceState(null, "", "/programme/units#worksheet");

    storage.setItem("curriculumFilters", {
      state: { filters: createFilter({ years: ["7"], tiers: ["higher"] }) },
      version: 0,
    });

    expect(window.location.hash).toBe("#worksheet");
    expect(new URLSearchParams(window.location.search).get("tiers")).toBe(
      "higher",
    );
  });
});
