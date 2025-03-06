import { act } from "@testing-library/react";

import { CurricFiltersTiers } from "./CurricFiltersTiers";
import { basicSetup } from "./CurricFiltersTiers.fixtures";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricFiltersTiers", () => {
  it("renders correctly", () => {
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersTiers
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
    expect(elements.length).toEqual(2);
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <CurricFiltersTiers
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
    expect(elements.length).toEqual(2);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: ["foundation"],
      years: ["10", "11"],
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      subjectCategories: [],
      childSubjects: [],
      threads: [],
      tiers: ["higher"],
      years: ["10", "11"],
    });
  });
});
