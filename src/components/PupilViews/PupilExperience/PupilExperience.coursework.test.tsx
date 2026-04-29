import { act, screen, waitFor } from "@testing-library/react";
import { useSearchParams } from "next/navigation";

import { PupilExperienceView } from "./PupilExperience.view";

import * as LessonEngineProvider from "@/components/PupilComponents/LessonEngineProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import { mapToSubmitCourseWorkProgress } from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";

const lessonEngineProviderMock = jest.fn();
const trackMock = {
  lessonAccessedPupilJourney: jest.fn(),
  contentGuidanceAccepted: jest.fn(),
  contentGuidanceDeclined: jest.fn(),
};

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  __esModule: true,
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/PupilComponents/LessonEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/LessonEngineProvider"),
  useLessonEngineContext: jest.fn(),
  LessonEngineProvider: jest.fn(
    ({ children, ...props }: { children: React.ReactNode }) => {
      lessonEngineProviderMock(props);
      return children;
    },
  ),
}));

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: jest.fn(),
}));

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    verifySession: jest.fn(),
    getCourseWorkContext: jest.fn(),
    getCourseWorkProgress: jest.fn(),
    upsertCourseWorkProgress: jest.fn(),
    getGoogleSignInUrl: jest.fn(),
    getAddOnContext: jest.fn(),
    getPupilLessonProgress: jest.fn(),
    getPostSubmissionState: jest.fn(),
    submitPupilProgress: jest.fn(),
  },
}));

jest.mock(
  "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults",
  () => ({
    mapPupilLessonProgressToSectionResults: jest.fn(),
  }),
);

jest.mock(
  "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress",
  () => ({
    mapToSubmitCourseWorkProgress: jest.fn(),
  }),
);

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider",
  () => ({
    PupilAnalyticsProvider: ({ children }: { children: React.ReactNode }) =>
      children,
    getPupilPathwayData: jest.fn(() => ({})),
  }),
);

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => ({
    usePupilAnalytics: () => ({
      track: trackMock,
    }),
  }),
);

jest.mock("@/components/PupilViews/PupilLessonOverview", () => ({
  PupilViewsLessonOverview: () => <div>Lesson Overview</div>,
}));

jest.mock("@/components/PupilViews/PupilIntro", () => ({
  PupilViewsIntro: () => <div>Intro</div>,
}));

jest.mock("@/components/PupilViews/PupilQuiz", () => ({
  PupilViewsQuiz: () => <div>Quiz</div>,
}));

jest.mock("@/components/PupilViews/PupilVideo", () => ({
  PupilViewsVideo: () => <div>Video</div>,
}));

jest.mock("@/components/PupilViews/PupilReview", () => ({
  PupilViewsReview: () => <div>Review</div>,
}));

jest.mock("@/components/PupilViews/PupilExpired/PupilExpired.view", () => ({
  PupilExpiredView: () => <div>Expired</div>,
}));

jest.mock(
  "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay",
  () => ({
    PupilRedirectedOverlay: () => null,
  }),
);

jest.mock(
  "@/components/PupilComponents/pupilUtils/useWorksheetInfoState",
  () => ({
    useWorksheetInfoState: jest.fn(() => ({ worksheetInfo: null })),
  }),
);

jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics", () => ({
  __esModule: true,
  GoogleClassroomAnalyticsProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
  useGoogleClassroomAnalytics: (selector?: (state: unknown) => unknown) =>
    selector
      ? selector({
          trackAddOnOpenedOnce: jest.fn(),
          clearAddOnOpenedFlag: jest.fn(),
        })
      : {
          trackAddOnOpenedOnce: jest.fn(),
          clearAddOnOpenedFlag: jest.fn(),
        },
}));

jest.mock("@/components/GoogleClassroom/useGoogleClassroomContext", () => ({
  __esModule: true,
  useGoogleClassroomContext: jest.fn(() => ({
    isClassroomAssignment: false,
    classroomAssignmentChecked: true,
    courseId: null,
    itemId: null,
    attachmentId: null,
    clientEnvironment: "web-browser",
    classroomAssignmentId: null,
  })),
}));

jest.mock("@/browser-lib/seo/getSeoProps", () => ({
  getSeoProps: jest.fn(() => ({})),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  ...jest.requireActual("@oaknational/google-classroom-addon/ui"),
  GoogleSignInView: () => (
    <div data-testid="google-sign-in-view">Sign in with Google</div>
  ),
}));

jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  OakInlineBanner: ({
    message,
    isOpen,
  }: {
    message: string;
    isOpen: boolean;
  }) => (isOpen ? <div>{message}</div> : null),
}));

const mockedUseAssignmentSearchParams =
  useAssignmentSearchParams as jest.MockedFunction<
    typeof useAssignmentSearchParams
  >;
const mockedUseSearchParams = useSearchParams as jest.Mock;
const mockedGoogleClassroomApi = googleClassroomApi as jest.Mocked<
  typeof googleClassroomApi
>;
const mockedMapPupilLessonProgressToSectionResults =
  mapPupilLessonProgressToSectionResults as jest.MockedFunction<
    typeof mapPupilLessonProgressToSectionResults
  >;
const mockedMapToSubmitCourseWorkProgress =
  mapToSubmitCourseWorkProgress as jest.MockedFunction<
    typeof mapToSubmitCourseWorkProgress
  >;

const render = renderWithProviders();

const setWindowLocationSearch = (search: string) => {
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { search },
  });
};

const props = {
  browseData: {
    programmeSlug: "programme-slug",
    unitSlug: "unit-slug",
    lessonSlug: "lesson-slug",
    programmeFields: {
      phase: "primary",
      subject: "English",
      subjectSlug: "english",
      phaseSlug: "primary",
      yearSlug: "year-1",
      yearDescription: "Year 1",
    },
    lessonData: {
      title: "Lesson title",
      pupilLessonOutcome: "Learn something",
      deprecatedFields: { expired: false },
    },
    features: {},
    actions: null,
  } as never,
  lessonContent: {
    lessonTitle: "Lesson title",
    lessonSlug: "lesson-slug",
    hasWorksheetAssetObject: false,
    starterQuiz: [],
    exitQuiz: [],
    pupilLessonOutcome: "Learn something",
    phonicsOutcome: null,
    contentGuidance: null,
    supervisionLevel: null,
    deprecatedFields: { isSensitive: false },
  } as never,
  hasWorksheet: false,
  hasAdditionalFiles: false,
  additionalFiles: null,
  worksheetInfo: null,
  initialSection: "exit-quiz" as const,
  pageType: "browse" as const,
};

describe("PupilExperienceView CourseWork flow", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    setWindowLocationSearch("?assignmentToken=test-token-123");
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(null);
    jest
      .spyOn(LessonEngineProvider, "useLessonEngineContext")
      .mockReturnValue(
        createLessonEngineContext({ currentSection: "overview" }),
      );
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn().mockResolvedValue({
        authenticated: true,
        loginHint: "pupil@test.com",
        session: "session-abc",
        token: "token-abc",
      }),
    );
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
      submissionId: "sub-1",
      courseWorkId: "cw-1",
      courseId: "course-1",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
    mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue(null);
    mockedGoogleClassroomApi.upsertCourseWorkProgress.mockResolvedValue(
      undefined,
    );
    mockedMapPupilLessonProgressToSectionResults.mockReturnValue({});
    mockedMapToSubmitCourseWorkProgress.mockReturnValue({} as never);
  });

  afterEach(() => {
    setWindowLocationSearch("");
  });

  it("starts in loading state, forces overview, and blocks coursework callbacks until ready", () => {
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn(() => new Promise(() => {})),
    );

    render(<PupilExperienceView {...props} />);

    expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        initialSection: "overview",
        isHydratingInitialProgress: true,
        onNext: undefined,
        onSectionResultUpdate: undefined,
      }),
    );
  });

  it("restores saved progress using the shared classroom progress mapper", async () => {
    const savedProgress = {
      starterQuiz: { grade: 3, numQuestions: 5 },
      exitQuiz: { grade: 4, numQuestions: 5 },
    } as never;
    const mappedProgress = {
      "starter-quiz": { grade: 3, numQuestions: 5, isComplete: true },
      "exit-quiz": { grade: 4, numQuestions: 5, isComplete: true },
    };
    mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue(
      savedProgress,
    );
    mockedMapPupilLessonProgressToSectionResults.mockReturnValue(
      mappedProgress,
    );

    render(<PupilExperienceView {...props} />);

    await waitFor(() => {
      expect(mockedMapPupilLessonProgressToSectionResults).toHaveBeenCalledWith(
        savedProgress,
      );
      expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          initialSectionResults: expect.objectContaining(mappedProgress),
          isHydratingInitialProgress: false,
        }),
      );
    });
  });

  it("shows a save error banner and retries with the latest snapshot on the next interaction", async () => {
    const firstPayload = { submissionId: "sub-1", sections: { intro: true } };
    const secondPayload = { submissionId: "sub-1", sections: { video: true } };
    mockedMapToSubmitCourseWorkProgress
      .mockReturnValueOnce(firstPayload as never)
      .mockReturnValueOnce(secondPayload as never);
    mockedGoogleClassroomApi.upsertCourseWorkProgress
      .mockRejectedValueOnce(new Error("Save failed"))
      .mockResolvedValueOnce(undefined);

    render(<PupilExperienceView {...props} />);

    await waitFor(() => {
      expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          onNext: expect.any(Function),
          isHydratingInitialProgress: false,
        }),
      );
    });

    const onNext = lessonEngineProviderMock.mock.calls.at(-1)?.[0].onNext;
    await act(async () => {
      await onNext?.({ intro: { isComplete: true } }, "intro");
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "We couldn't save your assignment progress. Please try again.",
        ),
      ).toBeInTheDocument();
    });

    await act(async () => {
      await onNext?.(
        {
          video: {
            played: true,
            duration: 20,
            timeElapsed: 20,
            isComplete: true,
          },
        },
        "video",
      );
    });

    expect(
      mockedGoogleClassroomApi.upsertCourseWorkProgress,
    ).toHaveBeenNthCalledWith(1, firstPayload);
    expect(
      mockedGoogleClassroomApi.upsertCourseWorkProgress,
    ).toHaveBeenNthCalledWith(2, secondPayload);
  });

  it("shows a load error banner and keeps coursework sync disabled when context is incomplete", async () => {
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
      courseWorkId: "cw-1",
      courseId: "course-1",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    render(<PupilExperienceView {...props} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "We couldn't load your assignment progress. You can still view the lesson, but progress won't sync.",
        ),
      ).toBeInTheDocument();
    });

    expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        initialSection: "overview",
        onNext: undefined,
        onSectionResultUpdate: undefined,
      }),
    );
  });
});
