import { act, screen } from "@testing-library/react";

import { ProgrammeUnitList } from "./UnitList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createYearData } from "@/fixtures/curriculum/yearData";

const render = renderWithProviders();

jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: jest.fn(() => "/"),
}));

const unitOverviewAccessedMock = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewAccessed: unitOverviewAccessedMock,
    },
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    isSignedIn: false,
  })),
}));

jest.mock("@/hooks/useAnalyticsPageProps", () => ({
  __esModule: true,
  default: () => ({ analyticsUseCase: null }),
}));

const emptyStateMessage = "No units in this category";
jest.mock("@/utils/curriculum/formatting", () => ({
  ...jest.requireActual("@/utils/curriculum/formatting"),
  getSubjectCategoryMessage: () => emptyStateMessage,
}));

const defaultProps = {
  units: [
    createUnit({ slug: "unit-one", title: "Unit One" }),
    createUnit({ slug: "unit-two", title: "Unit Two" }),
  ],
  yearData: {
    "7": createYearData({}),
  },
  year: "7",
  filters: createFilter({}),
};

describe("ProgrammeUnitList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of unit links when units are provided", () => {
    render(<ProgrammeUnitList {...defaultProps} />);

    expect(screen.getByRole("link", { name: /Unit One/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Unit Two/i })).toBeInTheDocument();
  });

  it("renders getSubjectCategoryMessage when units array is empty", () => {
    render(<ProgrammeUnitList {...defaultProps} units={[]} />);

    expect(screen.getByText(emptyStateMessage)).toBeInTheDocument();
  });

  it("renders list as an ordered list", () => {
    const { container } = render(<ProgrammeUnitList {...defaultProps} />);

    const list = container.querySelector("ol");
    expect(list).toBeInTheDocument();
  });

  it("calls track.unitOverviewAccessed when a unit link is clicked", async () => {
    render(<ProgrammeUnitList {...defaultProps} />);

    const link = screen.getByRole("link", { name: /Unit One/i });
    await act(async () => {
      link.click();
    });

    expect(unitOverviewAccessedMock).toHaveBeenCalledTimes(1);
    expect(unitOverviewAccessedMock).toHaveBeenCalledWith(
      expect.objectContaining({
        unitName: "Unit One",
        unitSlug: "unit-one",
        componentType: "unit_info_button",
      }),
    );
  });
});
