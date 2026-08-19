import { act } from "@testing-library/react";

import { CurricFiltersChildSubjects } from "./CurricFiltersChildSubjects";
import { ks4Setup, ks3and4Setup } from "./CurricFiltersChildSubjects.fixtures";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { useBrowseFilters } from "@/context/BrowseFilters";

jest.mock("@/context/BrowseFilters", () => ({
  useBrowseFilters: jest.fn(),
}));

const mockUseBrowseFilters = jest.mocked(useBrowseFilters);

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricFiltersChildSubjects", () => {
  it("renders correctly ks4 only", () => {
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
      <CurricFiltersChildSubjects
        data={ks4Setup}
        context={"curriculum-visualiser"}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByText("Exam subject (KS4)")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
  });

  it("renders correctly ks3 & ks4", () => {
    mockUseBrowseFilters.mockReturnValue({
      filters: {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
        pathways: [],
      },
      onChangeFilters: () => {},
    });
    const { getAllByRole, getByText } = render(
      <CurricFiltersChildSubjects
        data={ks3and4Setup}
        context={"curriculum-visualiser"}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);
    expect(getByText("Exam subject")).toBeInTheDocument();
    expect(elements[0]!.value).toEqual("biology");
    expect(elements[1]!.value).toEqual("chemistry");
    expect(elements[2]!.value).toEqual("physics");
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
      <CurricFiltersChildSubjects
        data={ks4Setup}
        context={"curriculum-visualiser"}
      />,
    );

    const elements = getAllByRole("radio") as HTMLInputElement[];
    expect(elements.length).toEqual(3);

    act(() => elements[0]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        childSubjects: ["biology"],
        subjectCategories: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Subject filter",
      filterValue: "biology",
    });
    act(() => elements[1]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        childSubjects: ["chemistry"],
        subjectCategories: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Subject filter",
      filterValue: "chemistry",
    });
    act(() => elements[2]!.click());
    expect(onChangeFilters).toHaveBeenCalledWith({
      newFilters: {
        childSubjects: ["physics"],
        subjectCategories: [],
        threads: [],
        tiers: [],
        years: ["10", "11"],
        pathways: [],
        keystages: [],
      },
      filterType: "Subject filter",
      filterValue: "physics",
    });
  });
});
