import { act, screen } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import mockRouter from "next-router-mock";
import { usePathname } from "next/navigation";

import {
  getDedupedPupilLessonOutcome,
  LessonOverview,
  LessonOverviewProps,
} from "./LessonOverview.view";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockLoggedOut,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagVariantKey: jest.fn(),
}));

const lessonMediaClipsStarted = jest.fn();
const lessonResourceDownloadStarted = jest.fn();
const teachingMaterialsSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonMediaClipsStarted: (...args: []) =>
        lessonMediaClipsStarted(...args),
      lessonResourceDownloadStarted: (...args: []) =>
        lessonResourceDownloadStarted(...args),
      teachingMaterialsSelected: (...args: []) =>
        teachingMaterialsSelected(...args),
    },
    getSessionId: jest.fn(),
  }),
}));

const renderLessonOverview = (props?: Partial<LessonOverviewProps>) =>
  renderWithProviders()(
    <LessonOverview
      lesson={{ ...lessonOverviewFixture(), isCanonical: false }}
      isBeta={false}
      {...props}
    />,
  );

describe("isPupilLessonOutcomeInKeyLearningPoints", () => {
  it("should return plo if the pupil lesson outcome is not in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return undefined if pupilLessonOutcome is undefined ", () => {
    const result = getDedupedPupilLessonOutcome(undefined, [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe(undefined);
  });
  it("should return plo if the key learning points are undefined", () => {
    const result = getDedupedPupilLessonOutcome(
      "pupil lesson outcome",
      undefined,
    );
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return null if the pupil lesson outcome is in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "pupil lesson outcome" },
    ]);
    expect(result).toBe(null);
  });
});
describe("lessonOverview.view", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("when sub-header feature flag is enabled", () => {
    beforeEach(() => {
      (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("test");
    });

    it("renders with sub-header content", () => {
      renderLessonOverview({
        lesson: {
          ...lessonOverviewFixture(),
          isCanonical: false,
          hasMediaClips: true,
        },
      });
      expect(
        screen.getByText(
          "The practice tasks in the lesson slides are also available as an editable worksheet ready to download in PowerPoint format.",
        ),
      ).toBeInTheDocument();
    });
  });
  describe("when sub-header feature flag is not enabled", () => {
    beforeEach(() => {
      (useFeatureFlagVariantKey as jest.Mock).mockReturnValue("control");
    });
    it("renders without sub-header content", () => {
      renderLessonOverview({
        lesson: {
          ...lessonOverviewFixture(),
          isCanonical: false,
          hasMediaClips: true,
        },
      });

      expect(
        screen.queryByText(
          "The practice tasks in the lesson slides are also available as an editable worksheet ready to download in PowerPoint format.",
        ),
      ).not.toBeInTheDocument();
    });
  });
  describe("tracking", () => {
    it("should call lessonMediaClipsStarted when play all is clicked for media clips", () => {
      renderLessonOverview({
        lesson: {
          ...lessonOverviewFixture(),
          isCanonical: false,
          hasMediaClips: true,
        },
      });
      const playAllButton = screen.getByText("Play all");
      playAllButton.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "go_to_media_clips_page_button",
        engagementIntent: "use",
        phase: "secondary",
        mediaClipsButtonName: "play all",
        eventVersion: "2.0.0",
        journeyId: "mockJourneyId",
        learningCycle: null,
        platform: "owa",
        product: "teacher lesson resources",
        examBoard: null,
        keyStageSlug: "ks3",
        keyStageTitle: "Key stage 3",
        pathway: null,
        subjectSlug: "biology",
        subjectTitle: "Biology",
        tierName: null,
        unitName: "Cells",
        unitSlug: "cells",
        lessonName: "Structure of cells",
        lessonSlug: "lesson-3-structure-of-cells",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        lessonReleaseCohort: "2023-2026",
        releaseGroup: "2023",
        yearGroupName: "Year 7",
        yearGroupSlug: "year-7",
      });
    });
    it.each(["lesson slides", "worksheet"])(
      "should call lessonResourceDownloadStarted when %s download button clicked",
      async (resource) => {
        renderLessonOverview({
          lesson: {
            ...lessonOverviewFixture(),
            isCanonical: false,
            hasMediaClips: true,
          },
        });
        const downloadLink = screen.getByText(`Download ${resource}`);

        act(() => {
          downloadLink.click();
        });

        expect(lessonResourceDownloadStarted).toHaveBeenCalled();
      },
    );
    it("should handle no release date when lessonResourceDownloadStarted is called", () => {
      renderLessonOverview({
        lesson: {
          ...lessonOverviewFixture({
            lessonReleaseDate: undefined,
            isLegacy: false,
          }),

          isCanonical: false,
          hasMediaClips: true,
        },
      });
      const downloadLink = screen.getByText("Download lesson slides");
      act(() => {
        downloadLink.click();
      });
      expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          unitName: "Cells",
          unitSlug: "cells",
          yearGroupName: "Year 7",
          yearGroupSlug: "year-7",
          subjectSlug: "biology",
          subjectTitle: "Biology",
          phase: "secondary",
          lessonSlug: "lesson-3-structure-of-cells",
          keyStageSlug: "ks3",
          keyStageTitle: "Key stage 3",
          lessonName: "Structure of cells",
        }),
      );
    });
    it("should handle no release date when lessonMediaClipsStarted is called", () => {
      renderLessonOverview({
        lesson: {
          ...lessonOverviewFixture({
            lessonReleaseDate: undefined,
            isLegacy: false,
          }),
          isCanonical: false,
          hasMediaClips: true,
        },
      });
      const playAllButton = screen.getByText("Play all");
      playAllButton.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "go_to_media_clips_page_button",
        engagementIntent: "use",
        phase: "secondary",
        mediaClipsButtonName: "play all",
        eventVersion: "2.0.0",
        journeyId: "mockJourneyId",
        learningCycle: null,
        platform: "owa",
        product: "teacher lesson resources",
        examBoard: null,
        keyStageSlug: "ks3",
        keyStageTitle: "Key stage 3",
        pathway: null,
        subjectSlug: "biology",
        subjectTitle: "Biology",
        tierName: null,
        unitName: "Cells",
        unitSlug: "cells",
        lessonName: "Structure of cells",
        lessonSlug: "lesson-3-structure-of-cells",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        lessonReleaseCohort: "2023-2026",
        releaseGroup: "2023",
        yearGroupName: "Year 7",
        yearGroupSlug: "year-7",
      });
    });
  });
  it("Should show the sign in prompt when geoRestricted or loginRequired is true, the user is not signed in", () => {
    setUseUserReturn(mockLoggedOut);
    renderLessonOverview({
      lesson: {
        ...lessonOverviewFixture(),

        isCanonical: false,
        hasMediaClips: true,
        geoRestricted: true,
        loginRequired: true,
      },
    });
    const restrictedContentPrompt = screen.getByText("Sign in to continue");
    expect(restrictedContentPrompt).toBeInTheDocument();
  });
  it("Should hide restricted content when sign in prompt is shown", () => {
    setUseUserReturn(mockLoggedOut);
    renderLessonOverview({
      lesson: {
        ...lessonOverviewFixture(),
        isCanonical: false,
        hasMediaClips: true,
        geoRestricted: true,
        loginRequired: true,
      },
    });
    const quizContent = screen.queryByText(
      "Which of these statements about trees is true?",
    );

    expect(quizContent).not.toBeInTheDocument();
  });

  it("Should not show the sign in prompt when the user is signed in", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccess,
    });
    renderLessonOverview({
      lesson: {
        ...lessonOverviewFixture(),

        isCanonical: false,
        hasMediaClips: true,
        geoRestricted: true,
        loginRequired: true,
      },
    });
    const restrictedContentPrompt = screen.queryByText("Sign in to continue");
    expect(restrictedContentPrompt).not.toBeInTheDocument();
    const quizContent = screen.getAllByText(
      "Which of these statements about trees is true?",
    );

    expect(quizContent[0]).toBeInTheDocument();
  });
});
describe("redirected overlay", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/?redirected=true");
  });
  it("Should show redirect modal when redirected query param is present", () => {
    setUseUserReturn(mockLoggedOut);
    mockRouter.setCurrentUrl("/?redirected=true");
    renderLessonOverview({
      lesson: {
        ...lessonOverviewFixture({
          lessonReleaseDate: undefined,
          isLegacy: false,
        }),

        isCanonical: false,
        hasMediaClips: true,
      },
    });
    expect(
      screen.getByTestId("teacher-redirected-overlay-btn"),
    ).toBeInTheDocument();
  });
});
