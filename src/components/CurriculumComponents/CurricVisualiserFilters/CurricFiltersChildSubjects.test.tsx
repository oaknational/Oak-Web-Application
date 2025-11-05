import { act } from "@testing-library/react";

import { CurricFiltersChildSubjects } from "./CurricFiltersChildSubjects";
import { ks4Setup, ks3and4Setup } from "./CurricFiltersChildSubjects.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersChildSubjects", () => {
  it("renders correctly ks4 only", () => {
    const { getAllByRole, getByRole } = render(
      <CurricFiltersChildSubjects
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={() => {}}
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByRole("heading").textContent).toEqual("Exam subject (KS4)");
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("renders correctly ks3 & ks4", () => {
    const { getAllByRole, getByRole } = render(
      <CurricFiltersChildSubjects
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["7", "8", "9", "10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={() => {}}
        data={ks3and4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByRole("heading").textContent).toEqual("Exam subject");
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = render(
      <CurricFiltersChildSubjects
        filters={{
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          years: ["10", "11"],
          threads: [],
          pathways: [],
        }}
        onChangeFilters={onChangeFilters}
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      childSubjects: ["biology"],
      subjectCategories: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      childSubjects: ["chemistry"],
      subjectCategories: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      childSubjects: ["physics"],
      subjectCategories: [],
      threads: [],
      tiers: [],
      years: ["10", "11"],
      pathways: [],
    });
  });
});
