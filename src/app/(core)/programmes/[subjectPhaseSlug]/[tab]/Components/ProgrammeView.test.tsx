import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ProgrammeView } from "./ProgrammeView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  curriculumOverviewCMSFixture,
  curriculumOverviewMVFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

const usePathnameMock = jest
  .fn()
  .mockReturnValue("/programmes/science-secondary-aqa/units");

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => usePathnameMock(),
    useSearchParams: jest.fn(),
    useRouter: () => jest.fn(),
  };
});

// Mock window history
let pushSpy: jest.SpyInstance;
beforeEach(() => {
  pushSpy = jest.spyOn(globalThis.history, "pushState");
});

const defaultProps = {
  curriculumSelectionSlugs: {
    phaseSlug: "secondary",
    subjectSlug: "science",
    ks4OptionSlug: "aqa",
  },
  curriculumSelectionTitles: {
    subjectTitle: "Science",
    phaseTitle: "Secondary",
    examboardTitle: "AQA",
  },
  subjectPhaseSlug: "science-secondary-aqa",
  ks4Options: [],
  curriculumUnitsFormattedData: formatCurriculumUnitsData(
    curriculumUnitsTabFixture(),
  ),
  curriculumInfo: curriculumOverviewMVFixture(),
  curriculumCMSInfo: curriculumOverviewCMSFixture(),
  subjectPhaseSanityData: null,
  tabSlug: "units" as const,
  trackingData: {
    phaseSlug: "secondary",
    subjectSlug: "maths",
    ks4OptionSlug: "aqa",
    subjectTitle: "Science",
    ks4OptionTitle: "AQA",
  },
};

const render = renderWithProviders();
describe("ProgrammeView", () => {
  it("renders the programme header", () => {
    render(<ProgrammeView {...defaultProps} />);
    const heading = screen.getByRole("heading", {
      name: "Science secondary AQA",
    });
    expect(heading).toBeInTheDocument();
  });
  it("highlights the correct tab", () => {
    render(<ProgrammeView {...defaultProps} />);
    const unitsTab = screen.getByRole("link", { name: "Unit sequence" });
    expect(unitsTab).toHaveStyle("background: #bef2bd");

    const overviewTab = screen.getByRole("link", { name: "Explainer" });
    expect(overviewTab).toHaveStyle("background: #222222");
  });
  it("renders the correct tab content for units", () => {
    render(<ProgrammeView {...defaultProps} />);
    const heading = screen.getByRole("heading", { name: "Year 7 units" });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for overview", () => {
    usePathnameMock.mockReturnValue(
      "/programmes/science-secondary-aqa/overview",
    );
    render(<ProgrammeView {...defaultProps} tabSlug="overview" />);
    const heading = screen.getByRole("heading", { name: "Aims and purpose" });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for download", () => {
    usePathnameMock.mockReturnValue(
      "/programmes/science-secondary-aqa/download",
    );
    render(<ProgrammeView {...defaultProps} tabSlug="download" />);
    const heading = screen.getByText("Download tab");
    expect(heading).toBeInTheDocument();
  });
  it("navigates on tab click", async () => {
    render(<ProgrammeView {...defaultProps} />);
    const overviewTabButton = screen.getByRole("link", { name: "Explainer" });
    const user = userEvent.setup();
    await user.click(overviewTabButton);
    expect(pushSpy).toHaveBeenCalledWith(null, "", "overview");
  });
});
