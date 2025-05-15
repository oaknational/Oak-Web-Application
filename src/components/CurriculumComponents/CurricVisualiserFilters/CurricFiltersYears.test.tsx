import { act } from "@testing-library/react";

import { CurricFiltersYears } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersYears", () => {
  it("renders correctly (non-pathways)", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
        ks4Options={[]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(elements[0]!.nextSibling!.textContent).toEqual("All");
    expect(elements[1]!.nextSibling!.textContent).toEqual("Year 10");
    expect(elements[2]!.nextSibling!.textContent).toEqual("Year 11");
  });

  it("renders correctly (pathways)", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
        ks4Options={[
          { slug: "core", title: "Core" },
          { slug: "gcse", title: "Gcse" },
        ]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(5);
    expect(elements[0]!.nextSibling!.textContent).toEqual("All");
    expect(elements[1]!.nextSibling!.textContent).toEqual("Year 10 (Core)");
    expect(elements[2]!.nextSibling!.textContent).toEqual("Year 11 (Core)");
    expect(elements[3]!.nextSibling!.textContent).toEqual("Year 10 (GCSE)");
    expect(elements[4]!.nextSibling!.textContent).toEqual("Year 11 (GCSE)");
  });

  it("interacts correctly (non-pathway)", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole, rerender } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
        ks4Options={[]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);

    // 10
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10"],
      pathways: [],
    });

    // 11
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["11"],
      pathways: [],
    });

    // Re-render because "all" will be selected by default
    rerender(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
        ks4Options={[]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    // All
    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
  });

  it("interacts correctly (pathway)", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole, rerender } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
        ks4Options={[
          { slug: "core", title: "Core" },
          { slug: "gcse", title: "Gcse" },
        ]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: "gcse",
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(5);

    // 10-core
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10"],
      pathways: ["core"],
    });

    // 11-core
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["11"],
      pathways: ["core"],
    });

    // 10-gcse
    act(() => elements[3]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10"],
      pathways: ["non_core"],
    });

    // 11-gcse
    act(() => elements[4]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["11"],
      pathways: ["non_core"],
    });

    // Re-render because "all" will be selected by default
    rerender(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
        ks4Options={[]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    // All
    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
  });
});
