import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { ProgrammeView } from "./ProgrammeView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import { formatCurriculumUnitsData } from "@/pages-helpers/curriculum/docx/tab-helpers";

jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => "/programmes/science-secondary-aqa/units",
    useSearchParams: jest.fn(),
    useRouter: () => jest.fn(),
  };
});

// Mock window.matchMedia
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window history
let pushSpy: jest.SpyInstance;
beforeEach(() => {
  pushSpy = jest.spyOn(globalThis.history, "pushState");
});

const defaultProps = {
  subjectTitle: "Science",
  curriculumSelectionSlugs: {
    phaseSlug: "secondary",
    subjectSlug: "maths",
    ks4OptionSlug: "aqa",
  },
  curriculumPhaseOptions: curriculumPhaseOptions,
  phaseTitle: "Secondary",
  curriculumUnitsFormattedData: formatCurriculumUnitsData(
    curriculumUnitsTabFixture(),
  ),
  subjectPhaseSanityData: null,
  tabSlug: "units" as const,
  examboardTitle: "AQA",
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
    const unitsTab = screen.getByRole("button", { name: "Unit sequence" });
    expect(unitsTab).toHaveStyle("background: #bef2bd");

    const overviewTab = screen.getByRole("button", { name: "Explainer" });
    expect(overviewTab).toHaveStyle("background: #222222");
  });
  it("renders the correct tab content for units", () => {
    render(<ProgrammeView {...defaultProps} />);
    const heading = screen.getByRole("heading", { name: "Year 7" });
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for overview", () => {
    render(<ProgrammeView {...defaultProps} tabSlug="overview" />);
    const heading = screen.getByText("Overview tab");
    expect(heading).toBeInTheDocument();
  });
  it("renders the correct tab content for download", () => {
    render(<ProgrammeView {...defaultProps} tabSlug="download" />);
    const heading = screen.getByText("Download tab");
    expect(heading).toBeInTheDocument();
  });
  it("navigates on tab click", async () => {
    render(<ProgrammeView {...defaultProps} />);
    const overviewTabButton = screen.getByRole("button", { name: "Explainer" });
    const user = userEvent.setup();
    await user.click(overviewTabButton);
    expect(pushSpy).toHaveBeenCalledWith(null, "", "overview");
  });
});
