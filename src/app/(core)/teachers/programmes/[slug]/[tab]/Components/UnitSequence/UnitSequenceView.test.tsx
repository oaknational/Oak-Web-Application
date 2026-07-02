import { screen } from "@testing-library/dom";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";

import { mockProgrammeFiltersData } from "../Filters/ProgrammeFilters.test";

import { UnitSequenceView, UnitSequenceViewProps } from "./UnitSequenceView";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createYearData } from "@/fixtures/curriculum/yearData";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("next/navigation");

jest.mocked(usePathname).mockReturnValue("/");
jest
  .mocked(useSearchParams)
  .mockReturnValue(new URLSearchParams("") as ReadonlyURLSearchParams);

const defaultProps: UnitSequenceViewProps = {
  filters: createFilter({ years: ["7", "10"] }),
  setFilters: jest.fn(),
  curriculumSelectionSlugs: {
    phaseSlug: "",
    subjectSlug: "",
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

describe("UnitSequenceView", () => {
  it("renders filters when expected", () => {
    render(<UnitSequenceView {...defaultProps} />);
    const yearLegend = screen.getByRole("group", { name: "Year group" });
    expect(yearLegend).toBeInTheDocument();
  });
  it("does not render filters when none should display", () => {
    render(
      <UnitSequenceView
        {...defaultProps}
        curriculumUnitsFormattedData={noFiltersData}
      />,
    );
    const yearLegend = screen.queryByRole("group", { name: "Year group" });
    expect(yearLegend).not.toBeInTheDocument();
  });
});
