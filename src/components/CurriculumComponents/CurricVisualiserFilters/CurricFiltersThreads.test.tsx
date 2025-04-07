import { act } from "@testing-library/react";

import { CurricFiltersThreads } from "./CurricFiltersThreads";
import { basicSetup } from "./CurricFiltersThreads.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersThreads", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersThreads
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(4);
    expect(elements[0]!.value).toEqual("");
    expect(elements[1]!.value).toEqual("thread1");
    expect(elements[2]!.value).toEqual("thread2");
    expect(elements[3]!.value).toEqual("thread3");
  });

  it("renders correctly with selected thread", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersThreads
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: ["thread2"],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(4);
    expect(elements[0]!.value).toEqual("");
    expect(elements[1]!.value).toEqual("thread1");
    expect(elements[2]!.value).toEqual("thread2");
    expect(elements[2]!).toBeChecked();
    expect(elements[3]!.value).toEqual("thread3");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersThreads
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
        slugs={{
          phaseSlug: "secondary",
          subjectSlug: "english",
          ks4OptionSlug: null,
        }}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(4);

    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: ["thread1"],
      tiers: [],
      years: ["10", "11"],
    });
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: ["thread2"],
      tiers: [],
      years: ["10", "11"],
    });
    act(() => elements[3]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: ["thread3"],
      tiers: [],
      years: ["10", "11"],
    });
  });
});
