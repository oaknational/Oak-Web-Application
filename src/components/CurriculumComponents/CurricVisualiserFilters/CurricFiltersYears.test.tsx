import { act } from "@testing-library/react";

import { CurricFiltersYears } from "./CurricFiltersYears";
import { basicSetup } from "./CurricFiltersYears.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersYears", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(elements[0]!.value).toEqual("all");
    expect(elements[1]!.value).toEqual("10");
    expect(elements[2]!.value).toEqual("11");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole, rerender } = renderWithTheme(
      <CurricFiltersYears
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
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
    });

    // 11
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["11"],
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
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
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
    });
  });
});
