import { act } from "@testing-library/react";

import { CurricFiltersSubjectCategories } from "./CurricFiltersSubjectCategories";
import { basicSetup } from "./CurricFiltersSubjectCategories.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersSubjectCategories", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersSubjectCategories
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
    expect(elements[0]!.value).toEqual("1");
    expect(elements[1]!.value).toEqual("2");
    expect(elements[2]!.value).toEqual("3");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersSubjectCategories
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

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: ["1"],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: ["2"],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
    });
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: ["3"],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
    });
  });
});
