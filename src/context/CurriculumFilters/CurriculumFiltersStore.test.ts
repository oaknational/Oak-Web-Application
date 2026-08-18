import { createCurriculumFiltersStore } from "./CurriculumFiltersStore";

import { createFilter } from "@/fixtures/curriculum/filters";

const defaultFilter = createFilter({
  years: ["7", "8"],
  tiers: ["foundation"],
});

const searchParam = (key: string) =>
  new URLSearchParams(window.location.search).get(key);

describe("createCurriculumFiltersStore", () => {
  beforeEach(() => {
    globalThis.history.replaceState(null, "", "/programme/units");
  });

  it("seeds from defaultFilter when there is no server-resolved filter", () => {
    const store = createCurriculumFiltersStore({ defaultFilter });

    expect(store.getState().filters).toEqual(defaultFilter);
  });

  it("seeds from initialFilter so the first client render matches SSR", () => {
    const initialFilter = createFilter({ years: ["7"], tiers: ["higher"] });
    const store = createCurriculumFiltersStore({
      defaultFilter,
      initialFilter,
    });

    expect(store.getState().filters).toEqual(initialFilter);
  });

  describe("setFilters", () => {
    it("updates the filters and mirrors them into the URL", () => {
      const store = createCurriculumFiltersStore({ defaultFilter });

      store
        .getState()
        .setFilters(createFilter({ years: ["7"], tiers: ["higher"] }));

      expect(store.getState().filters.tiers).toEqual(["higher"]);
      expect(searchParam("tiers")).toBe("higher");
      expect(searchParam("years")).toBe("7");
    });

    it("omits values matching the default filter from the URL", () => {
      const store = createCurriculumFiltersStore({ defaultFilter });

      store.getState().setFilters(defaultFilter);

      expect(window.location.search).toBe("");
    });

    it("writes against the latest defaultFilter", () => {
      const store = createCurriculumFiltersStore({ defaultFilter });
      const nextDefault = createFilter({ years: ["9"], tiers: ["higher"] });

      store.setState({ defaultFilter: nextDefault });
      store.getState().setFilters(nextDefault);

      expect(window.location.search).toBe("");
    });
  });

  describe("syncFromSearchParams", () => {
    it("applies params present in the URL", () => {
      const store = createCurriculumFiltersStore({ defaultFilter });

      store
        .getState()
        .syncFromSearchParams(new URLSearchParams("tiers=higher"));

      expect(store.getState().filters.tiers).toEqual(["higher"]);
    });

    it("resets filters whose param has gone, so back/forward restores state", () => {
      const store = createCurriculumFiltersStore({
        defaultFilter,
        initialFilter: createFilter({ years: ["7", "8"], tiers: ["higher"] }),
      });

      store.getState().syncFromSearchParams(new URLSearchParams(""));

      expect(store.getState().filters.tiers).toEqual(["foundation"]);
    });

    it("does not notify subscribers when nothing changed", () => {
      const store = createCurriculumFiltersStore({ defaultFilter });
      const listener = jest.fn();
      store.subscribe(listener);

      store.getState().syncFromSearchParams(new URLSearchParams(""));

      expect(listener).not.toHaveBeenCalled();
    });

    it("treats a null params object as 'no filters in the URL'", () => {
      const store = createCurriculumFiltersStore({
        defaultFilter,
        initialFilter: createFilter({ years: ["7"], tiers: ["higher"] }),
      });

      store.getState().syncFromSearchParams(null);

      expect(store.getState().filters).toEqual(defaultFilter);
    });
  });

  describe("persist rehydration", () => {
    it("layers URL params over the defaults", async () => {
      globalThis.history.replaceState(
        null,
        "",
        "/programme/units?tiers=higher",
      );
      const store = createCurriculumFiltersStore({ defaultFilter });

      await store.persist.rehydrate();

      expect(store.getState().filters).toEqual({
        ...defaultFilter,
        tiers: ["higher"],
      });
    });

    it("is skipped on creation so SSR and the first client render agree", () => {
      globalThis.history.replaceState(
        null,
        "",
        "/programme/units?tiers=higher",
      );

      const store = createCurriculumFiltersStore({
        defaultFilter,
        initialFilter: createFilter({ years: ["7", "8"], tiers: ["higher"] }),
      });

      expect(store.getState().filters.years).toEqual(["7", "8"]);
    });
  });
});
