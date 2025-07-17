import { OakColorFilterToken } from "@oaknational/oak-components";

import { LessonOverviewHeaderDownloadAllButton } from "./LessonOverviewHeaderDownloadAllButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { OakColorName } from "@/styles/theme";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { AnalyticsUseCaseValueType } from "@/browser-lib/avo/Avo";

const mockFeatureFlagEnabled = jest.fn();
jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));

const mockUseCopyrightRequirements = {
  showSignedOutGeoRestricted: false,
  showSignedOutLoginRequired: false,
};
jest.mock("@/hooks/useCopyrightRequirements", () => ({
  useCopyrightRequirements: () => mockUseCopyrightRequirements,
}));

jest.mock("next/router", () => require("next-router-mock"));
const mockDownloadAllButton = jest.fn();
const baseProps = {
  ...lessonOverviewFixture(),
  lessonSlug: "test-lesson",
  unitSlug: "test-unit",
  programmeSlug: "test-programme",
  expired: false,
  showDownloadAll: true,
  onClickDownloadAll: mockDownloadAllButton,
  isSpecialist: false,
  isCanonical: false,
  geoRestricted: false,
  loginRequired: false,
  breadcrumbs: [],
  background: "white" as OakColorName,
  isNew: false,
  subjectIconBackgroundColor: "white" as OakColorFilterToken,
  subjectSlug: "test-subject",
  keyStageSlug: "test-keystage",
  keyStageTitle: "Test Key Stage",
  subjectTitle: "Test Subject",
  unitTitle: "Test Unit",
  track: jest.fn() as unknown as TrackFns,
  analyticsUseCase: "Teacher" as AnalyticsUseCaseValueType,
  isShareable: true,
  onClickShareAll: jest.fn(),
  showShare: true,
};

const render = renderWithProviders();

describe("LessonOverviewHeaderDownloadAllButton", () => {
  beforeEach(() => {
    mockFeatureFlagEnabled.mockReturnValueOnce(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the download button with correct text", () => {
    const { getByTestId, getByText } = render(
      <LessonOverviewHeaderDownloadAllButton {...baseProps} />,
    );

    const downloadButton = getByTestId("download-all-button");

    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton.tagName).toBe("A");
    expect(getByText("Download all resources")).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute("href");
    downloadButton.click();
    expect(mockDownloadAllButton).toHaveBeenCalled();
  });

  it("does not render when expired is true", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeaderDownloadAllButton {...baseProps} expired={true} />,
    );

    expect(queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("does not render when showDownloadAll is false", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeaderDownloadAllButton
        {...baseProps}
        showDownloadAll={false}
      />,
    );

    expect(queryByTestId("download-all-button")).not.toBeInTheDocument();
  });

  it("renders a sign up button when downloads are restricted", () => {
    mockUseCopyrightRequirements.showSignedOutGeoRestricted = true;
    mockUseCopyrightRequirements.showSignedOutLoginRequired = true;
    const { getByTestId } = render(
      <LessonOverviewHeaderDownloadAllButton {...baseProps} />,
    );
    const downloadButton = getByTestId("download-all-button");
    expect(downloadButton).not.toHaveAttribute("href");
    downloadButton.click();
    expect(mockDownloadAllButton).not.toHaveBeenCalled();
  });
});
