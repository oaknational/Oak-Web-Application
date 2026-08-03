import { act } from "@testing-library/react";

import { ProgrammeOverview } from "./ProgrammeOverview";

import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForProgramme } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";

const render = renderWithProvidersByName(["theme", "oakTheme", "analytics"]);

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

Element.prototype.checkVisibility = jest.fn(() => true) as jest.Mock;
Element.prototype.scrollIntoView = jest.fn(() => {}) as jest.Mock;

const defaultProps = curriculumOverviewTabFixture();

const programmeState = getProgrammeStateForProgramme({
  programmeSlug: "secondary-maths",
  phaseSlug: "secondary",
  subjectSlug: "maths",
  phaseTitle: "Secondary",
  subjectTitle: "Maths",
});

const renderProgrammeOverview = (
  props?: Partial<{ curriculumCMSInfo: CurriculumOverviewSanityData }>,
) => {
  return render(
    <TeacherBrowseAnalyticsStoreProvider programmeState={programmeState}>
      <ProgrammeOverview {...defaultProps} {...props} />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};

describe("ProgrammeOverview", () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it("renders the overview tab", () => {
    const { getByRole } = renderProgrammeOverview();
    const link = getByRole("link", { name: "Aims and purpose" });

    act(() => {
      link.click();
    });

    expect(mockReplace).toHaveBeenCalledWith("#header-aims-and-purpose");
  });
});
