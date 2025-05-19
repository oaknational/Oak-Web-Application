import { act } from "@testing-library/react";

import { CurricFiltersSubjectCategories } from "./CurricFiltersSubjectCategories";
import {
  ks4Setup,
  ks3and4Setup,
} from "./CurricFiltersSubjectCategories.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersSubjectCategories", () => {
  it("renders correctly ks4 only", () => {
    const { getAllByRole, getByRole } = renderWithTheme(
      <CurricFiltersSubjectCategories
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={() => {}}
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByRole("heading").textContent).toEqual("Category (KS4)");
    expect(elements[0]!.value).toEqual("1");
    expect(elements[1]!.value).toEqual("2");
    expect(elements[2]!.value).toEqual("3");
  });

  it("renders correctly ks3 & ks4", () => {
    const { getAllByRole, getByRole } = renderWithTheme(
      <CurricFiltersSubjectCategories
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["7", "8", "9", "10", "11"],
          threads: [],
          pathways: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={() => {}}
        data={ks3and4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByRole("heading").textContent).toEqual("Category");
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
          pathways: [],
        }}
        slugs={{
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: null,
        }}
        onChangeFilters={onChangeFilters}
        data={ks4Setup}
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
      pathways: [],
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: ["2"],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: ["3"],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
  });
});
