import {
  OakColorFilterToken,
  OakColorToken,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderShareAllButton } from "./LessonOverviewHeaderShareAllButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import { AnalyticsUseCaseValueType } from "@/browser-lib/avo/Avo";

jest.mock("next/router", () => require("next-router-mock"));
const mockOnClickShareAll = jest.fn();

const baseProps = {
  ...lessonOverviewFixture(),
  lessonSlug: "test-lesson",
  unitSlug: "test-unit",
  programmeSlug: "test-programme",
  isShareable: true,
  onClickShareAll: mockOnClickShareAll,
  isSpecialist: false,
  isCanonical: false,
  geoRestricted: false,
  loginRequired: false,
  breadcrumbs: [],
  background: "white" as OakColorToken,
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
  contentRestricted: false,
};

const render = renderWithProviders();

describe("LessonOverviewHeaderShareAllButton", () => {
  it("renders the share button with correct text", () => {
    const { getByTestId } = render(
      <LessonOverviewHeaderShareAllButton {...baseProps} />,
    );

    const shareButton = getByTestId("share-all-button");

    expect(shareButton).toBeInTheDocument();
    expect(shareButton.tagName).toBe("A");
    expect(shareButton).toHaveAttribute("href");
    expect(shareButton).toHaveTextContent("Share activities with pupils");
    shareButton.click();
    expect(mockOnClickShareAll).toHaveBeenCalled();
  });

  it("disables share button when isShareable is false", () => {
    const { getByTestId } = render(
      <LessonOverviewHeaderShareAllButton {...baseProps} isShareable={false} />,
    );
    const shareButton = getByTestId("share-all-button");
    expect(shareButton).toBeDisabled();
    expect(shareButton.tagName).toBe("BUTTON");
  });

  it("does not render a button when loginRequired", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeaderShareAllButton
        {...baseProps}
        loginRequired={true}
      />,
    );
    const shareButton = queryByTestId("share-all-button");
    expect(shareButton).not.toBeInTheDocument();
  });

  it("does not render a button when geoRestricted", () => {
    const { queryByTestId } = render(
      <LessonOverviewHeaderShareAllButton
        {...baseProps}
        geoRestricted={true}
      />,
    );
    const shareButton = queryByTestId("share-all-button");
    expect(shareButton).not.toBeInTheDocument();
  });
});
