import { act } from "@testing-library/react";

import { CurricFiltersThreads } from "./CurricFiltersThreads";
import { basicSetup } from "./CurricFiltersThreads.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "theme"]);

describe("CurricFiltersThreads", () => {
  it("renders correctly", () => {
    const { getAllByRole } = render(
      <CurricFiltersThreads
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
    const { getAllByRole } = render(
      <CurricFiltersThreads
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: ["thread2"],
          pathways: [],
          keystages: [],
        }}
        onChangeFilters={() => {}}
        data={basicSetup}
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

  it("interacts correctly when selecting thread", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = render(
      <CurricFiltersThreads
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
      pathways: [],
      keystages: [],
    });
  });

  it("interacts correctly when selecting none", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = render(
      <CurricFiltersThreads
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: ["thread1"],
          pathways: [],
          keystages: [],
        }}
        onChangeFilters={onChangeFilters}
        data={basicSetup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(4);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
      keystages: [],
    });
  });
});
