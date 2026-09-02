import { screen } from "@testing-library/dom";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { mockProgrammeFiltersData } from "../Filters/ProgrammeFilters.test";

import { UnitSequenceView, UnitSequenceViewProps } from "./UnitSequenceView";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createYearData } from "@/fixtures/curriculum/yearData";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import { BrowseFilters } from "@/context/BrowseFilters/types";
import { createFilter } from "@/context/BrowseFilters/utils/fixtures";

const render = renderWithProviders();

jest.mock("next/navigation");

jest.mocked(useRouter).mockReturnValue({
  prefetch: jest.fn(),
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
});
jest.mocked(usePathname).mockReturnValue("/");
jest
  .mocked(useSearchParams)
  .mockReturnValue(new URLSearchParams("") as ReadonlyURLSearchParams);

const defaultFilters = createFilter({
  years: ["7", "10"],
});

const defaultProps: UnitSequenceViewProps = {
  curriculumSelectionSlugs: {
    phaseSlug: "primary",
    subjectSlug: "maths",
    ks4OptionSlug: null,
  },
  curriculumUnitsFormattedData: mockProgrammeFiltersData,
  ks4Options: [],
  ks4OptionFilterDimensions: {},
};

const noFiltersData: UnitSequenceViewProps["curriculumUnitsFormattedData"] = {
  yearData: {
    "all years": createYearData({
      units: [createUnit({ year: "all years" })],
      keystage: "ks3",
    }),
  },
  yearOptions: ["all years"],
  threadOptions: [],
  keystages: ["ks3"],
};

const renderUnitSequenceView = (
  props: UnitSequenceViewProps = defaultProps,
  filters: BrowseFilters = defaultFilters,
) =>
  render(
    <BrowseFiltersProvider defaultFilter={filters}>
      <UnitSequenceView {...props} />
    </BrowseFiltersProvider>,
  );

describe("UnitSequenceView", () => {
  it("renders filters when expected", () => {
    renderUnitSequenceView();
    const allFiltersBtn = screen.getByText("All filters");
    expect(allFiltersBtn).toBeInTheDocument();
  });
  it("does not render filters when none should display", () => {
    renderUnitSequenceView({
      ...defaultProps,
      curriculumUnitsFormattedData: noFiltersData,
    });
    const allFiltersBtn = screen.queryByText("All filters");
    expect(allFiltersBtn).not.toBeInTheDocument();
  });
});
