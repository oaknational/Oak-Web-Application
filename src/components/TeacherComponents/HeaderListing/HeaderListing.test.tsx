import { screen } from "@testing-library/dom";

import HeaderListing, { HeaderListingProps } from "./HeaderListing";
import { headerListingProps } from "./HeaderListing.stories";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

const props = headerListingProps as unknown as HeaderListingProps;

const mockUseUnitDownloadButtonState = jest.fn().mockResolvedValue({
  showDownloadMessage: false,
  setShowDownloadMessage: jest.fn(),
  downloadError: false,
  setDownloadError: jest.fn(),
  setDownloadInProgress: jest.fn(),
  downloadInProgress: false,
  showIncompleteMessage: false,
  setShowIncompleteMessage: jest.fn(),
});

jest.mock(
  "src/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton",
  () => {
    return {
      __esModule: true,
      default: () => <button>Download</button>,
      useUnitDownloadButtonState: () => mockUseUnitDownloadButtonState(),
    };
  },
);

jest.mock(
  "@/components/TeacherComponents/hooks/downloadAndShareHooks/useUnitDownloadExistenceCheck",
  () => {
    return jest.fn(() => ({
      exists: true,
      fileSize: "1.2MB",
      hasCheckedFiles: true,
    }));
  },
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink",
  () => ({
    __esModule: true,
    default: jest.fn(),
  }),
);

const mockFeatureFlag = jest.fn();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(() => "option-a"),
  useFeatureFlagEnabled: () => mockFeatureFlag,
}));

describe("HeaderListing", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = jest.fn(() => Promise.resolve({})) as jest.Mock;
    mockFeatureFlag.mockReturnValue(false);
  });
  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(<HeaderListing {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("English");
  });
  it("doesnt render unit download button", () => {
    renderWithTheme(<HeaderListing {...props} />);
    const unitDownloadButton = screen.queryByRole("button");
    expect(unitDownloadButton).not.toBeInTheDocument();
  });
  it('renders a unit download button when "unitDownloadFileId" and "onUnitDownloadSuccess" is provided', () => {
    setUseUserReturn(mockLoggedIn);
    renderWithTheme(
      <HeaderListing
        {...props}
        unitDownloadFileId="123"
        onUnitDownloadSuccess={jest.fn}
      />,
    );
    const unitDownloadButton = screen.getByRole("button");
    expect(unitDownloadButton).toBeInTheDocument();
  });
  it("renders an alert banner when show download message is true", () => {
    mockUseUnitDownloadButtonState.mockReturnValueOnce({
      showDownloadMessage: true,
      setShowDownloadMessage: jest.fn(),
      downloadError: false,
      setDownloadError: jest.fn(),
      setDownloadInProgress: jest.fn(),
      downloadInProgress: false,
      showIncompleteMessage: false,
      setShowIncompleteMessage: jest.fn(),
    });
    setUseUserReturn(mockLoggedIn);
    renderWithTheme(
      <HeaderListing
        {...props}
        unitDownloadFileId="123"
        onUnitDownloadSuccess={jest.fn}
      />,
    );
    const banner = screen.getAllByText(
      "Downloads may take a few minutes on slower Wi-Fi connections.",
    );
    expect(banner[0]).toBeInTheDocument();
  });
  it("renders an alert banner when show incomplete message is true", async () => {
    mockUseUnitDownloadButtonState.mockReturnValueOnce({
      showDownloadMessage: false,
      setShowDownloadMessage: jest.fn(),
      downloadError: false,
      setDownloadError: jest.fn(),
      setDownloadInProgress: jest.fn(),
      downloadInProgress: false,
      showIncompleteMessage: true,
      setShowIncompleteMessage: jest.fn(),
    });
    setUseUserReturn(mockLoggedIn);
    renderWithTheme(
      <HeaderListing
        {...props}
        unitDownloadFileId="123"
        onUnitDownloadSuccess={jest.fn}
        isIncompleteUnit={true}
      />,
    );

    const banner = await screen.findAllByText("This unit is incomplete");
    expect(banner[0]).toBeInTheDocument();
  });
  it("renders RiskAssessmentBanner if showRiskAssessmentBanner prop is set to true", async () => {
    renderWithTheme(
      <HeaderListing {...props} showRiskAssessmentBanner={true} />,
    );
    const banner = await screen.findAllByText("for all practical PE lessons", {
      exact: false,
    });
    expect(banner[0]).toBeInTheDocument();
  });
  it("does not render RiskAssessmentBanner if showRiskAssessmentBanner prop is set to false", () => {
    renderWithTheme(
      <HeaderListing {...props} showRiskAssessmentBanner={false} />,
    );
    const banner = screen.queryByText("for all practical PE lessons", {
      exact: false,
    });
    expect(banner).not.toBeInTheDocument();
  });
  it("renders subject description for financial education", () => {
    renderWithTheme(
      <HeaderListing
        {...props}
        subjectDescriptionUnitListingData={unitListingFixture({
          subjectSlug: "financial-education",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
        })}
      />,
    );
    const financeSubjectDescription = screen.getAllByTestId(
      "teacher-financial-education-description",
    );
    expect(financeSubjectDescription.length).toBeGreaterThanOrEqual(1);
  });
  it("doesn't render subject description when there is no component for the subjectSlug (testing-not-for-publication)", () => {
    renderWithTheme(
      <HeaderListing
        {...props}
        subjectDescriptionUnitListingData={unitListingFixture({
          subjectSlug: "testing-not-for-publication",
        })}
      />,
    );
    const financeSubjectDescription = screen.queryByTestId(
      "teacher-financial-education-description",
    );
    expect(financeSubjectDescription).not.toBeInTheDocument();
  });
  it("doesnt render a save button when the feature flag is disabled", () => {
    renderWithTheme(<HeaderListing {...props} />);
    const saveButton = screen.queryByRole("button");
    expect(saveButton).not.toBeInTheDocument();
  });
  it("renders a save button when the feature flag is enabled", async () => {
    mockFeatureFlag.mockReturnValue(true);
    renderWithTheme(
      <HeaderListing {...props} onSave={jest.fn} isUnitSaved={false} />,
    );

    const saveButton = await screen.findByRole("button");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Save");
  });
  it("renders the correct text when the unit is saved", async () => {
    mockFeatureFlag.mockReturnValue(true);
    renderWithTheme(
      <HeaderListing {...props} onSave={jest.fn} isUnitSaved={true} />,
    );

    const saveButton = await screen.findByRole("button");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Saved");
  });
});
