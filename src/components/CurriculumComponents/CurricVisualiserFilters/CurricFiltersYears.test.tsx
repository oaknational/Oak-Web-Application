import { act } from "@testing-library/react";

import { CurricFiltersYears } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersYears", () => {
  it("renders correctly (non-pathways)", () => {
    const { getAllByRole } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
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

    const radios = getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAccessibleName("All");
    expect(radios[1]).toHaveAccessibleName("Year 10");
    expect(radios[2]).toHaveAccessibleName("Year 11");
  });

  it("renders correctly (pathways)", () => {
    const { getAllByRole } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
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

    const radios = getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(radios[0]).toHaveAccessibleName("All");
    expect(radios[1]).toHaveAccessibleName("Year 10 (Core)");
    expect(radios[2]).toHaveAccessibleName("Year 11 (Core)");
    expect(radios[3]).toHaveAccessibleName("Year 10 (GCSE)");
    expect(radios[4]).toHaveAccessibleName("Year 11 (GCSE)");
  });

  it("interacts correctly (non-pathway)", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole, rerender } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
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
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: [],
        keystages: [],
      },
      "year_group_button",
    );

    // 11
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: [],
        keystages: [],
      },
      "year_group_button",
    );

    // Re-render because "all" will be selected by default
    rerender(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10"],
          threads: [],
          pathways: [],
          keystages: [],
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
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "year_group_button",
    );
  });

  it("interacts correctly (pathway)", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole, rerender } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
          keystages: [],
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
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: ["core"],
        keystages: [],
      },
      "year_group_button",
    );

    // 11-core
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: ["core"],
        keystages: [],
      },
      "year_group_button",
    );

    // 10-gcse
    act(() => elements[3]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: ["non_core"],
        keystages: [],
      },
      "year_group_button",
    );

    // 11-gcse
    act(() => elements[4]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: ["non_core"],
        keystages: [],
      },
      "year_group_button",
    );

    // Re-render because "all" will be selected by default
    rerender(
      <CurricFiltersYears
        context="curriculum-visualiser"
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10"],
          threads: [],
          pathways: [],
          keystages: [],
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
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "year_group_button",
    );
  });
});
