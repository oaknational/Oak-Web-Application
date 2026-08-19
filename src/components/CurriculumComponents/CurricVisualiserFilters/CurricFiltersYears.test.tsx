import { act } from "@testing-library/react";

import { CurricFiltersYears } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { useBrowseFilters } from "@/context/BrowseFilters";

jest.mock("@/context/BrowseFilters", () => ({
  useBrowseFilters: jest.fn(),
}));

const mockUseBrowseFilters = jest.mocked(useBrowseFilters);

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersYears", () => {
  it("renders correctly (non-pathways)", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters: () => {},
    });
    const { getAllByRole } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
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
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters: () => {},
    });
    const { getAllByRole } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
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

  it("renders correctly (pathways) on integrated journey without Core/GCSE duplication", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters: () => {},
    });
    const { getAllByRole } = render(
      <CurricFiltersYears
        context="integrated-journey"
        data={basicSetup}
        ks4Options={[
          { slug: "core", title: "Core" },
          { slug: "gcse", title: "Gcse" },
        ]}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "citizenship",
          ks4OptionSlug: "core",
        }}
      />,
    );

    const radios = getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAccessibleName("All");
    expect(radios[1]).toHaveAccessibleName("Year 10");
    expect(radios[2]).toHaveAccessibleName("Year 11");
  });

  it("interacts correctly (non-pathway)", () => {
    const onChangeFilters = jest.fn();
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters,
    });
    const { getAllByRole, rerender } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
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
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: [],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "10",
    });

    // 11
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "11",
    });

    // Re-render because "all" will be selected by default
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters,
    });
    rerender(
      <CurricFiltersYears
        context="curriculum-visualiser"
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
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "all",
    });
  });

  it("interacts correctly (pathway)", () => {
    const onChangeFilters = jest.fn();
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters,
    });
    const { getAllByRole, rerender } = render(
      <CurricFiltersYears
        context="curriculum-visualiser"
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
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: ["core"],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "10",
    });

    // 11-core
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: ["core"],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "11",
    });

    // 10-gcse
    act(() => elements[3]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10"],
        pathways: ["non_core"],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "10",
    });

    // 11-gcse
    act(() => elements[4]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["11"],
        pathways: ["non_core"],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "11",
    });

    // Re-render because "all" will be selected by default
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["10"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters,
    });
    rerender(
      <CurricFiltersYears
        context="curriculum-visualiser"
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
      newFilters: {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Year filter",
      filterValue: "all",
    });
  });
});
