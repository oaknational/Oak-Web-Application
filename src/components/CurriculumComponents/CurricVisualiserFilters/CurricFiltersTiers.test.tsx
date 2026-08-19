import { act } from "@testing-library/react";

import { CurricFiltersTiers } from "./CurricFiltersTiers";
import { ks4Setup, ks3and4Setup } from "./CurricFiltersTiers.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { useBrowseFilters } from "@/context/BrowseFilters";

jest.mock("@/context/BrowseFilters", () => ({
  useBrowseFilters: jest.fn(),
}));

const mockUseBrowseFilters = jest.mocked(useBrowseFilters);

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersTiers", () => {
  it("renders correctly ks4", () => {
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
    const { getAllByRole, getByText } = render(
      <CurricFiltersTiers data={ks4Setup} context={"curriculum-visualiser"} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(getByText("Learning tier (KS4)")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("renders correctly ks3&4", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        pathways: [],
        keystages: [],
      },
      onChangeFilters: () => {},
    });
    const { getAllByRole, getByText } = render(
      <CurricFiltersTiers
        data={ks3and4Setup}
        context={"curriculum-visualiser"}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(getByText("Learning tier")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("renders correctly", () => {
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
      <CurricFiltersTiers data={ks4Setup} context={"curriculum-visualiser"} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);
    expect(elements[0]!.value).toEqual("foundation");
    expect(elements[1]!.value).toEqual("higher");
  });

  it("interacts correctly", () => {
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
    const { getAllByRole } = render(
      <CurricFiltersTiers data={ks4Setup} context={"curriculum-visualiser"} />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(2);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: expect.objectContaining({
        tiers: ["foundation"],
      }),
      filterType: "Tier filter",
      filterValue: "foundation",
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: expect.objectContaining({
        tiers: ["higher"],
      }),
      filterType: "Tier filter",
      filterValue: "higher",
    });
  });
});
