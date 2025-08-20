import { act } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import mockRouter from "next-router-mock";

import {
  getDedupedPupilLessonOutcome,
  LessonOverview,
} from "./LessonOverview.view";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoggedIn,
  mockLoggedOut,
  mockUserWithDownloadAccess,
} from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockFeatureFlagEnabled = jest.fn().mockReturnValue(false);

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
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
  }),
}));

const render = renderWithProviders();

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
      const { getByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture(),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      expect(
        getByText(
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
      const { queryByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture(),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );

      expect(
        queryByText(
          "The practice tasks in the lesson slides are also available as an editable worksheet ready to download in PowerPoint format.",
        ),
      ).not.toBeInTheDocument();
    });
  });
  describe("tracking", () => {
    it("should call track.lessonMediaClipsStarted when play all is clicked for media clips", () => {
      const { getByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture(),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      const playAllButton = getByText("Play all");
      playAllButton.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "go_to_media_clips_page_button",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        learningCycle: undefined,
        lessonName: "Adverbial complex sentences",
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        mediaClipsButtonName: "play all",
        pathway: null,
        phase: null,
        platform: "owa",
        product: "media clips",
        releaseGroup: "legacy",
        subjectSlug: "english",
        subjectTitle: "English",
        tierName: null,
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        yearGroupName: null,
        yearGroupSlug: null,
      });
    });
    it("should call track.trackDownloadResourceButtonClicked when play all is clicked for media clips", () => {
      const { getByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture(),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      const playAllButton = getByText("Download lesson slides");
      act(() => {
        playAllButton.click();
      });
      expect(lessonResourceDownloadStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "lesson_download_button",
        downloadResourceButtonName: "slide deck",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        pathway: null,

        platform: "owa",

        product: "teacher lesson resources",
        subjectSlug: "english",
        subjectTitle: "English",
        tierName: null,
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
      });
    });
    it("should hanlde no release date when track.trackDownloadResourceButtonClicked is called", () => {
      const { getByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture({
              lessonReleaseDate: undefined,
              isLegacy: false,
            }),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      const playAllButton = getByText("Download lesson slides");
      act(() => {
        playAllButton.click();
      });
      expect(lessonResourceDownloadStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "lesson_download_button",
        downloadResourceButtonName: "slide deck",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        lessonName: "Adverbial complex sentences",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "unreleased",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        pathway: null,
        platform: "owa",
        product: "teacher lesson resources",
        subjectSlug: "english",
        subjectTitle: "English",
        tierName: null,
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
      });
    });
    it("should hanlde no release date when track.lessonMediaClipsStarted is called", () => {
      const { getByText } = render(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture({
              lessonReleaseDate: undefined,
              isLegacy: false,
            }),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      const playAllButton = getByText("Play all");
      playAllButton.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "go_to_media_clips_page_button",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        learningCycle: undefined,
        lessonName: "Adverbial complex sentences",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "unreleased",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        mediaClipsButtonName: "play all",
        pathway: null,
        phase: null,
        platform: "owa",
        product: "media clips",
        releaseGroup: "2023",
        subjectSlug: "english",
        subjectTitle: "English",
        tierName: null,
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        yearGroupName: null,
        yearGroupSlug: null,
      });
    });
  });
  it("Should show the sign in prompt when geoRestricted or loginRequired is true, the user is not signed in, and feature flag enabled", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    setUseUserReturn(mockLoggedOut);

    const { getByText } = render(
      <LessonOverview
        lesson={{
          ...lessonOverviewFixture(),
          isSpecialist: false,
          isCanonical: false,
          hasMediaClips: true,
          geoRestricted: true,
          loginRequired: true,
        }}
        isBeta={false}
      />,
    );
    const restrictedContentPrompt = getByText("Sign in to continue");
    expect(restrictedContentPrompt).toBeInTheDocument();
  });
  it("Should hide restricted content when sign in prompt is shown", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    setUseUserReturn(mockLoggedOut);

    const { queryByText } = render(
      <LessonOverview
        lesson={{
          ...lessonOverviewFixture(),
          isSpecialist: false,
          isCanonical: false,
          hasMediaClips: true,
          geoRestricted: true,
          loginRequired: true,
        }}
        isBeta={false}
      />,
    );
    const quizContent = queryByText(
      "Which of these statements about trees is true?",
    );

    expect(quizContent).not.toBeInTheDocument();
  });
  it("Should not show the sign in prompt when feature flag disabled", () => {
    mockFeatureFlagEnabled.mockReturnValue(false);
    setUseUserReturn(mockLoggedOut);
    const { queryByText, getAllByText } = render(
      <LessonOverview
        lesson={{
          ...lessonOverviewFixture(),
          isSpecialist: false,
          isCanonical: false,
          hasMediaClips: true,
          geoRestricted: true,
          loginRequired: true,
        }}
        isBeta={false}
      />,
    );

    const restrictedSignInPrompt = queryByText("Sign in to continue");
    expect(restrictedSignInPrompt).not.toBeInTheDocument();
    const quizContent = getAllByText(
      "Which of these statements about trees is true?",
    );

    expect(quizContent[0]).toBeInTheDocument();
  });
  it("Should not show the sign in prompt when the user is signed in", () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    setUseUserReturn({
      ...mockLoggedIn,
      user: mockUserWithDownloadAccess,
    });

    const { queryByText, getAllByText } = render(
      <LessonOverview
        lesson={{
          ...lessonOverviewFixture(),
          isSpecialist: false,
          isCanonical: false,
          hasMediaClips: true,
          geoRestricted: true,
          loginRequired: true,
        }}
        isBeta={false}
      />,
    );
    const restrictedContentPrompt = queryByText("Sign in to continue");
    expect(restrictedContentPrompt).not.toBeInTheDocument();
    const quizContent = getAllByText(
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
    mockFeatureFlagEnabled.mockReturnValue(false);
    setUseUserReturn(mockLoggedOut);
    mockRouter.setCurrentUrl("/?redirected=true");
    const { getByTestId } = render(
      <LessonOverview
        lesson={{
          ...lessonOverviewFixture({
            lessonReleaseDate: undefined,
            isLegacy: false,
          }),
          isSpecialist: false,
          isCanonical: false,
          hasMediaClips: true,
        }}
        isBeta={false}
      />,
    );
    expect(getByTestId("teacher-redirected-overlay-btn")).toBeInTheDocument();
  });
});
