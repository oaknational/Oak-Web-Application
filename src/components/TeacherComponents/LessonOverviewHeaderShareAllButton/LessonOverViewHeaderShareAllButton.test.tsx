import { OakColorFilterToken } from "@oaknational/oak-components";

import { LessonOverviewHeaderShareAllButton } from "./LessonOverviewHeaderShareAllButton";

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

const baseProps = {
  ...lessonOverviewFixture(),
  lessonSlug: "test-lesson",
  unitSlug: "test-unit",
  programmeSlug: "test-programme",
  isShareable: true,
  onClickShareAll: jest.fn(),
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
  onClickDownloadAll: jest.fn(),
  showDownloadAll: true,
  showShare: true,
};

const render = renderWithProviders();

describe("LessonOverviewHeaderShareAllButton", () => {
  beforeEach(() => {
    mockFeatureFlagEnabled.mockReturnValueOnce(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the share button with correct text", () => {
    const { getByTestId } = render(
      <LessonOverviewHeaderShareAllButton {...baseProps} />,
    );

    const shareButton = getByTestId("share-all-button");

    expect(shareButton).toBeInTheDocument();
    expect(shareButton.tagName).toBe("A");
    expect(shareButton).toHaveTextContent("Share activities with pupils");
  });

  it("disables share button when isShareable is false", () => {
    const { getByTestId } = render(
      <LessonOverviewHeaderShareAllButton {...baseProps} isShareable={false} />,
    );
    const shareButton = getByTestId("share-all-button");
    expect(shareButton).toBeDisabled();
    expect(shareButton.tagName).toBe("BUTTON");
  });

  it("renders sign up button when content is restricted", () => {
    mockUseCopyrightRequirements.showSignedOutGeoRestricted = true;
    const { queryByTestId, getByTestId } = render(
      <LessonOverviewHeaderShareAllButton {...baseProps} />,
    );
    const shareButton = queryByTestId("share-all-button");
    const signUpButton = getByTestId("sign-up-button");
    expect(shareButton).not.toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });
});
