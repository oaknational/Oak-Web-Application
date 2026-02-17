import { act } from "@testing-library/react";

import { CurricFiltersTiers } from "./CurricFiltersTiers";
import { ks4Setup, ks3and4Setup } from "./CurricFiltersTiers.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersTiers", () => {
  it("renders correctly ks4", () => {
    const { getAllByRole, getByText } = render(
      <CurricFiltersTiers
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
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(getByText("Learning tier (KS4)")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("renders correctly ks3&4", () => {
    const { getAllByRole, getByText } = render(
      <CurricFiltersTiers
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
        data={ks3and4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(getByText("Learning tier")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("renders correctly", () => {
    const { getAllByRole } = render(
      <CurricFiltersTiers
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
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("interacts correctly", () => {
    const onChangeFilters = jest.fn();
    const { getAllByRole } = render(
      <CurricFiltersTiers
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
        data={ks4Setup}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: ["foundation"],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "learning_tier_button",
    );
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith(
      {
        subjectCategories: [],
        childSubjects: [],
        threads: [],
        tiers: ["higher"],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      "learning_tier_button",
    );
  });
});
