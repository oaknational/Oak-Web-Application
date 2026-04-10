import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakTooltipProps } from "@oaknational/oak-components";
import { useSearchParams } from "next/navigation";
import mockRouter from "next-router-mock";
import { PostSubmissionState } from "@oaknational/google-classroom-addon/types";

import {
  PupilExperienceView,
  pickAvailableSectionsForLesson,
} from "./PupilExperience.view";

import * as LessonEngineProvider from "@/components/PupilComponents/LessonEngineProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { allLessonReviewSections } from "@/components/PupilComponents/LessonEngineProvider";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import "@/__tests__/__helpers__/IntersectionObserverMock";
import "@/__tests__/__helpers__/ResizeObserverMock";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { mapPupilLessonProgressToSectionResults } from "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults";
import { mapToSubmitCourseWorkProgress } from "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress";

const classroomAddOnOpenedMock = jest.fn();
const clearAddOnOpenedFlagMock = jest.fn();
const lessonEngineProviderMock = jest.fn();
const pupilViewsVideoMock = jest.fn();
const analyticsTrackMock = new Proxy(
  {
    classroomAddOnOpened: classroomAddOnOpenedMock,
  } as Record<string, jest.Mock>,
  {
    get: (target, property) => {
      const key = String(property);

      if (!(key in target)) {
        target[key] = jest.fn();
      }

      return target[key];
    },
  },
);

const googleClassroomAnalyticsMock = {
  trackAddOnOpenedOnce: classroomAddOnOpenedMock,
  clearAddOnOpenedFlag: clearAddOnOpenedFlagMock,
};

jest.mock("next/router", () => jest.requireActual("next-router-mock"));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  __esModule: true,
  usePathname: jest.fn(),
  useRouter: jest.fn(),
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

jest.mock("@/components/PupilViews/PupilExpired/PupilExpired.view", () => ({
  PupilExpiredView: jest.fn(() => "PupilExpiredView"),
}));

jest.mock("@/components/PupilViews/PupilReview", () => {
  return {
    PupilViewsReview: () => (
      <div>
        <div>Lesson review</div>
        <div data-testid="content-guidance-info">Guidance Title</div>
        <div data-testid="suervision-level-info">Supervision Level</div>
      </div>
    ),
  };
});

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: jest.fn(),
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: analyticsTrackMock,
  }),
}));

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    getAddOnContext: jest.fn(),
    getPostSubmissionState: jest.fn(),
    getPupilLessonProgress: jest.fn(),
    submitPupilProgress: jest.fn(),
    verifySession: jest.fn(),
    getCourseWorkContext: jest.fn(),
    getCourseWorkProgress: jest.fn(),
    upsertCourseWorkProgress: jest.fn(),
    getGoogleSignInUrl: jest.fn(),
  },
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  ...jest.requireActual("@oaknational/google-classroom-addon/ui"),
  GoogleSignInView: () => (
    <div data-testid="google-sign-in-view">Sign in with Google</div>
  ),
}));

jest.mock(
  "@/browser-lib/google-classroom/mapToSubmitCourseWorkProgress",
  () => ({
    mapToSubmitCourseWorkProgress: jest.fn().mockReturnValue({}),
  }),
);

jest.mock(
  "@/browser-lib/google-classroom/mapPupilLessonProgressToSectionResults",
  () => ({
    mapPupilLessonProgressToSectionResults: jest.fn(),
  }),
);

jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics", () => ({
  __esModule: true,
  GoogleClassroomAnalyticsProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => children,
  useGoogleClassroomAnalytics: (
    selector?: (state: typeof googleClassroomAnalyticsMock) => unknown,
  ) =>
    selector
      ? selector(googleClassroomAnalyticsMock)
      : googleClassroomAnalyticsMock,
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
const createMockSearchParams = (
  params?: ConstructorParameters<typeof URLSearchParams>[0],
) =>
  new URLSearchParams(params) as NonNullable<
    ReturnType<typeof useSearchParams>
  >;

mockedUseAssignmentSearchParams.mockReturnValue({
  isClassroomAssignment: false,
  classroomAssignmentChecked: true,
});
mockedUseSearchParams.mockReturnValue(null);

jest.mock("@/components/PupilViews/PupilLessonOverview", () => {
  return {
    PupilViewsLessonOverview: () => (
      <div>
        <div>Lesson Title</div>
        <div data-testid="content-guidance-info">Guidance Title</div>
        <div data-testid="suervision-level-info">Supervision Level</div>
      </div>
    ),
  };
});

jest.mock("@/components/PupilViews/PupilVideo", () => ({
  PupilViewsVideo: (props: unknown) => {
    pupilViewsVideoMock(props);
    return <div data-testid="pupil-video">Video</div>;
  },
}));

jest.mock(
  "@/components/PupilComponents/pupilUtils/useWorksheetInfoState",
  () => ({
    useWorksheetInfoState: jest.fn().mockResolvedValue({ worksheetInfo: [] }),
  }),
);

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakTooltip: ({ children, tooltip }: OakTooltipProps) => (
      <>
        {children}
        <div role="tooltip">{tooltip}</div>
      </>
    ),
  };
});

const render = renderWithProviders();

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("PupilExperienceView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    classroomAddOnOpenedMock.mockClear();
    clearAddOnOpenedFlagMock.mockClear();
    classroomAddOnOpenedMock.mockReturnValue(true);
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams({
        courseId: "course-1",
        itemId: "item-1",
        attachmentId: "attachment-1",
      }),
    );
    mockedGoogleClassroomApi.getAddOnContext.mockResolvedValue(null);
    mockedGoogleClassroomApi.getPostSubmissionState.mockResolvedValue(null);
    mockedGoogleClassroomApi.getPupilLessonProgress.mockResolvedValue(null);
    mockedGoogleClassroomApi.submitPupilProgress.mockResolvedValue(undefined);
    mockedGoogleClassroomApi.verifySession.mockReturnValue(
      jest.fn().mockResolvedValue({
        authenticated: false,
        session: undefined,
        token: undefined,
      }),
    );
    mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue(null);
    mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue(null);
    mockedGoogleClassroomApi.upsertCourseWorkProgress.mockResolvedValue(
      undefined,
    );
    mockedMapPupilLessonProgressToSectionResults.mockReturnValue({});
    mockedMapToSubmitCourseWorkProgress.mockReturnValue({} as never);
    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { search: "" },
    });
    Object.defineProperty(globalThis, "cookieStore", {
      value: { get: jest.fn() },
      writable: true,
    });
    mockRouter.setCurrentUrl("/");
  });

  describe("pickAvailableSectionsForLesson", () => {
    it("returns all sections if all are available", () => {
      const sections = pickAvailableSectionsForLesson(
        lessonContentFixture({
          starterQuiz: quizQuestions,
          exitQuiz: quizQuestions,
          videoMuxPlaybackId: "123",
        }),
      );
      expect(sections).toEqual(allLessonReviewSections);
    });
    it("should not include a section if it has no content", () => {
      const withoutStarterQuiz = pickAvailableSectionsForLesson(
        lessonContentFixture({
          starterQuiz: [],
        }),
      );
      const withoutExitQuiz = pickAvailableSectionsForLesson(
        lessonContentFixture({
          exitQuiz: [],
        }),
      );
      const withoutVideo = pickAvailableSectionsForLesson(
        lessonContentFixture({
          videoMuxPlaybackId: null,
        }),
      );
      expect(withoutStarterQuiz).not.toContain("starter-quiz");
      expect(withoutExitQuiz).not.toContain("exit-quiz");
      expect(withoutVideo).not.toContain("video");
    });
  });

  describe("classroom add-on tracking", () => {
    it("tracks classroomAddOnOpened for a direct classroom pupil landing", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      const lessonContent = lessonContentFixture({});
      const lessonBrowseData = lessonBrowseDataFixture({});

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(classroomAddOnOpenedMock).toHaveBeenCalledTimes(1);
      });
      expect(classroomAddOnOpenedMock).toHaveBeenCalledWith({
        analyticsUseCase: "Pupil",
      });
    });

    it("does not retrack classroomAddOnOpened when sign-in already marked it", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      const lessonContent = lessonContentFixture({});
      const lessonBrowseData = lessonBrowseDataFixture({});

      classroomAddOnOpenedMock.mockReturnValue(false);
      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(classroomAddOnOpenedMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("PupilPageContent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should render", () => {
      const lessonContent = lessonContentFixture({
        lessonTitle: "Lesson Title",
      });
      const lessonBrowseData = lessonBrowseDataFixture({
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );
      const { getByText } = render(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      expect(getByText("Lesson Title")).toBeInTheDocument();
    });

    // we don't render the video section as it crashes without a valid mux id
    [
      [/Introduction/, "intro"],
      [/Starter Quiz/, "starter-quiz"],
      [/Exit Quiz/, "exit-quiz"],
    ].forEach(([name, section]) => {
      it("renders the current section", () => {
        const lessonContent = lessonContentFixture({});
        const lessonBrowseData = lessonBrowseDataFixture({});

        jest
          .spyOn(LessonEngineProvider, "useLessonEngineContext")
          .mockReturnValue(
            createLessonEngineContext({
              currentSection: section as LessonEngineProvider.LessonSection,
            }),
          );

        const { getByText } = render(
          <PupilExperienceView
            lessonContent={lessonContent}
            browseData={lessonBrowseData}
            hasWorksheet={false}
            hasAdditionalFiles={false}
            additionalFiles={null}
            worksheetInfo={null}
            initialSection="overview"
            pageType="browse"
          />,
        );

        expect(getByText(name as RegExp)).toBeInTheDocument();
      });
    });

    it("passes transcript arrays to the video view and renders video after section changes to video", async () => {
      const lessonContent = lessonContentFixture({
        videoMuxPlaybackId: "mux-id",
        transcriptSentences: ["One", "Two"],
      });
      const lessonBrowseData = lessonBrowseDataFixture({});

      const contextSpy = jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      const { rerender, queryByTestId, getByTestId } = render(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      expect(queryByTestId("pupil-video")).not.toBeInTheDocument();

      contextSpy.mockReturnValue(
        createLessonEngineContext({
          currentSection: "video",
        }),
      );

      rerender(
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(getByTestId("pupil-video")).toBeInTheDocument();
      });

      expect(pupilViewsVideoMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          transcriptSentences: ["One", "Two"],
        }),
      );
    });
  });

  describe("Google Classroom state handling", () => {
    it("hydrates progress and sets review/read-only when submission is turned in", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      mockedGoogleClassroomApi.getAddOnContext.mockResolvedValue({
        studentContext: { submissionId: "submission-1" },
        pupilLoginHint: "pupil-1",
      });
      mockedGoogleClassroomApi.getPostSubmissionState.mockResolvedValue({
        submissionState: PostSubmissionState.TURNED_IN,
      });
      mockedGoogleClassroomApi.getPupilLessonProgress.mockResolvedValue({
        submissionId: "submission-1",
      } as never);
      mockedMapPupilLessonProgressToSectionResults.mockReturnValue({
        intro: { isComplete: true },
      } as never);

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({ lessonTitle: "Lesson Title" })}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(mockedGoogleClassroomApi.getAddOnContext).toHaveBeenCalledWith({
          courseId: "course-1",
          itemId: "item-1",
          attachmentId: "attachment-1",
        });
        expect(
          mockedGoogleClassroomApi.getPostSubmissionState,
        ).toHaveBeenCalledWith({
          courseId: "course-1",
          itemId: "item-1",
          attachmentId: "attachment-1",
          submissionId: "submission-1",
        });
        expect(
          mockedGoogleClassroomApi.getPupilLessonProgress,
        ).toHaveBeenCalledWith({
          submissionId: "submission-1",
          itemId: "item-1",
          attachmentId: "attachment-1",
        });
      });

      expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          initialSection: "review",
          isReadOnly: true,
          initialSectionResults: expect.objectContaining({
            intro: { isComplete: true },
          }),
          isHydratingInitialProgress: false,
        }),
      );

      expect(
        screen.getByText(
          "You have turned-in this assignment. You can review the lesson and see your previous answers.",
        ),
      ).toBeInTheDocument();
    });

    it("re-fetches submission state when the window regains focus", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      mockedGoogleClassroomApi.getAddOnContext.mockResolvedValue({
        studentContext: { submissionId: "submission-1" },
        pupilLoginHint: "pupil-1",
      });
      mockedGoogleClassroomApi.getPostSubmissionState.mockResolvedValue({
        submissionState: PostSubmissionState.CREATED,
      });

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({})}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getPostSubmissionState,
        ).toHaveBeenCalledTimes(1);
      });

      await act(async () => {
        window.dispatchEvent(new Event("focus"));
      });

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getPostSubmissionState,
        ).toHaveBeenCalledTimes(2);
      });
    });

    it("does not fetch classroom state without required params", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      mockedUseSearchParams.mockReturnValue(new URLSearchParams());

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({})}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(mockedGoogleClassroomApi.getAddOnContext).not.toHaveBeenCalled();
      });
    });

    it("does not fetch classroom state when cookieStore is unavailable", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      Object.defineProperty(globalThis, "cookieStore", {
        value: undefined,
        writable: true,
      });

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({})}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      expect(
        mockedGoogleClassroomApi.getPostSubmissionState,
      ).not.toHaveBeenCalled();
      expect(
        mockedGoogleClassroomApi.getPupilLessonProgress,
      ).not.toHaveBeenCalled();
    });

    it("submits mapped progress when onNext is triggered and logs submission errors", async () => {
      mockedUseAssignmentSearchParams.mockReturnValue({
        isClassroomAssignment: true,
        classroomAssignmentChecked: true,
      });
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      mockedGoogleClassroomApi.getAddOnContext.mockResolvedValue({
        studentContext: { submissionId: "submission-1" },
        pupilLoginHint: "pupil-1",
      });
      mockedGoogleClassroomApi.getPostSubmissionState.mockResolvedValue({
        submissionState: PostSubmissionState.CREATED,
      });
      mockedGoogleClassroomApi.submitPupilProgress.mockRejectedValueOnce(
        new Error("submit failed"),
      );

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );

      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({})}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

      await waitFor(() => {
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({
            onNext: expect.any(Function),
          }),
        );
      });

      const onNext = lessonEngineProviderMock.mock.calls.at(-1)?.[0].onNext;
      await act(async () => {
        await onNext?.({ intro: { isComplete: true } }, "intro");
      });

      expect(
        mockedGoogleClassroomApi.submitPupilProgress,
      ).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  it("should render the expired view if the lesson is expired", () => {
    const lessonContent = lessonContentFixture({});

    const lessonBrowseData = lessonBrowseDataFixture({});
    lessonBrowseData.lessonData.deprecatedFields = { expired: true };

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(getByText("PupilExpiredView", { exact: false })).toBeInTheDocument();
  });

  it("should render the content guidance on lessons that have guidance", () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId, getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    const dialog = getByRole("alertdialog");

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(contentguidanceLabel);
    expect(dialog).toHaveTextContent(supervisionLevel);
    expect(getByTestId("content-guidance-info")).toHaveTextContent(
      contentguidanceLabel,
    );
    expect(getByTestId("suervision-level-info")).toHaveTextContent(
      supervisionLevel,
    );
  });

  it("should close content guidance modal when modal is accepted", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId, queryByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    await userEvent.click(getByTestId("acceptButton"));
    await waitFor(() => {
      expect(queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });
  it("should post message to parent if isClassroom and content guidance is declined", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    const postMessageSpy = jest.fn();
    Object.defineProperty(window, "parent", {
      value: { postMessage: postMessageSpy },
      writable: true,
    });

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    await userEvent.click(getByTestId("declineButton"));

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: "Classroom",
        action: "closeIframe",
      },
      "https://classroom.google.com",
    );
  });
  it("should navigate back if not isClassroom and content guidance is declined", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const backUrl = "/back-url";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
        backUrl={backUrl}
      />,
    );
    await userEvent.click(getByTestId("declineButton"));

    await waitFor(() => {
      expect(mockRouter.asPath).toBe(backUrl);
    });
  });

  it("should call router.back if not isClassroom and no backUrl is provided", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    const backSpy = jest.spyOn(mockRouter, "back");

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByTestId } = render(
      <PupilExperienceView
        lessonContent={lessonContentFixture({
          lessonTitle: "Lesson Title",
          contentGuidance: [
            {
              contentguidanceLabel: "Guidance Title",
              contentguidanceArea: "Guidance Area",
              contentguidanceDescription: "Guidance Description",
            },
          ],
          supervisionLevel: "Supervision Level",
        })}
        browseData={lessonBrowseDataFixture({})}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    await userEvent.click(getByTestId("declineButton"));

    expect(backSpy).toHaveBeenCalled();
  });

  it("should render the default message on lessons that age restriction and no content guidance", () => {
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: null,
      supervisionLevel: null,
    });
    const lessonBrowseData = lessonBrowseDataFixture({
      features: {
        ageRestriction: "7_and_above",
      },
    });

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    const dialog = getByRole("alertdialog");

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      "To view this lesson, you must be in year 7 and above",
    );
    expect(dialog).toHaveTextContent(
      "Speak to an adult before starting this lesson.",
    );
  });

  it("should render the correct message on lessons that age restriction and content guidance", () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({
      features: {
        ageRestriction: "10_and_above",
      },
    });

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId, getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    const dialog = getByRole("alertdialog");

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      "To view this lesson, you must be in year 10 and above",
    );
    expect(dialog).toHaveTextContent(contentguidanceLabel);
    expect(dialog).toHaveTextContent(supervisionLevel);
    expect(getByTestId("content-guidance-info")).toHaveTextContent(
      contentguidanceLabel,
    );
    expect(getByTestId("suervision-level-info")).toHaveTextContent(
      supervisionLevel,
    );
  });

  it("should render the default age restriction message for unknown values", () => {
    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByRole } = render(
      <PupilExperienceView
        lessonContent={lessonContentFixture({
          contentGuidance: null,
          supervisionLevel: null,
        })}
        browseData={lessonBrowseDataFixture({
          features: {
            ageRestriction: "unknown" as never,
          },
        })}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(getByRole("alertdialog")).toHaveTextContent(
      "This lesson is age restricted.",
    );
  });
  it("should have robots meta tag with index & follow", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    render(
      <PupilExperienceView
        backUrl="/somewhere-else"
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(
      document.querySelector("meta[name=robots]")?.getAttribute("content"),
    ).toEqual("noindex,follow");
  });

  it("should have robots meta tag with noindex & nofollow", async () => {
    const supervisionLevel = "Supervision Level";
    const contentguidanceLabel = "Guidance Title";
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
      contentGuidance: [
        {
          contentguidanceLabel,
          contentguidanceArea: "Guidance Area",
          contentguidanceDescription: "Guidance Description",
        },
      ],
      deprecatedFields: {
        isSensitive: true,
      },
      supervisionLevel,
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    render(
      <PupilExperienceView
        backUrl="/somewhere-else"
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(
      document.querySelector("meta[name=robots]")?.getAttribute("content"),
    ).toEqual("noindex,nofollow");
  });

  it("should render with phase secondary and no lessonContent title", async () => {
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
    });
    const lessonBrowseData = lessonBrowseDataFixture({
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    lessonBrowseData.programmeFields.phase = "secondary";
    lessonContent.lessonTitle = null;

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "review",
      }),
    );

    const { getByText, queryByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="review"
        pageType="browse"
      />,
    );

    expect(queryByText("Lesson Title")).toBeNull();
    expect(getByText("Lesson review")).toBeInTheDocument();
  });

  it("should show nothing with unknown section", async () => {
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
    });
    const lessonBrowseData = lessonBrowseDataFixture({});

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: undefined,
      }),
    );

    const { queryByText } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(queryByText("Lesson Title")).toBeNull();
  });

  describe("CourseWork flow", () => {
    const setAssignmentToken = (token: string | null) => {
      Object.defineProperty(window, "location", {
        configurable: true,
        writable: true,
        value: { search: token ? `?assignmentToken=${token}` : "" },
      });
    };

    const renderWithCourseWork = () =>
      render(
        <PupilExperienceView
          lessonContent={lessonContentFixture({})}
          browseData={lessonBrowseDataFixture({})}
          hasWorksheet={false}
          hasAdditionalFiles={false}
          additionalFiles={null}
          worksheetInfo={null}
          initialSection="overview"
          pageType="browse"
        />,
      );

    beforeEach(() => {
      setAssignmentToken("test-token-123");
      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({ currentSection: "overview" }),
        );
    });

    it("shows the sign-in overlay when the pupil is not authenticated", async () => {
      mockedGoogleClassroomApi.verifySession.mockReturnValue(
        jest.fn().mockResolvedValue({
          authenticated: false,
          session: undefined,
          token: undefined,
        }),
      );

      renderWithCourseWork();

      await waitFor(() => {
        expect(screen.getByTestId("google-sign-in-view")).toBeInTheDocument();
      });
      // Ensure hydration ran and all state updates have settled
      await waitFor(() => {
        expect(mockedGoogleClassroomApi.verifySession).toHaveBeenCalled();
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({ isHydratingInitialProgress: false }),
        );
      });
    });

    it("does not show the sign-in overlay when the pupil is authenticated", async () => {
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
        courseId: "c-1",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      renderWithCourseWork();

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getCourseWorkContext,
        ).toHaveBeenCalled();
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({ isHydratingInitialProgress: false }),
        );
      });
      expect(
        screen.queryByTestId("google-sign-in-view"),
      ).not.toBeInTheDocument();
    });

    it("restores saved progress when context and prior progress are present", async () => {
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
        courseId: "c-1",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
      mockedGoogleClassroomApi.getCourseWorkProgress.mockResolvedValue({
        starterQuiz: { grade: 3, numQuestions: 5 },
        exitQuiz: { grade: 4, numQuestions: 5 },
      } as never);

      renderWithCourseWork();

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getCourseWorkProgress,
        ).toHaveBeenCalledWith("sub-1", "test-token-123");
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({ isHydratingInitialProgress: false }),
        );
      });
      expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({
          initialSectionResults: expect.objectContaining({
            "starter-quiz": { grade: 3, numQuestions: 5 },
            "exit-quiz": { grade: 4, numQuestions: 5 },
          }),
        }),
      );
    });

    it("wires onNext and onSectionResultUpdate to LessonEngineProvider", async () => {
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
        courseId: "c-1",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });

      renderWithCourseWork();

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getCourseWorkContext,
        ).toHaveBeenCalled();
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({
            onNext: expect.any(Function),
            onSectionResultUpdate: expect.any(Function),
            isHydratingInitialProgress: false,
          }),
        );
      });
    });

    it("saves progress via upsertCourseWorkProgress when onNext is called after context is ready", async () => {
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
        courseId: "c-1",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
      const progressPayload = { submissionId: "sub-1", sections: {} } as never;
      mockedMapToSubmitCourseWorkProgress.mockReturnValue(progressPayload);

      renderWithCourseWork();

      // Wait for hydration to complete so courseWorkContextRef is populated
      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getCourseWorkContext,
        ).toHaveBeenCalled();
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

      expect(mockedMapToSubmitCourseWorkProgress).toHaveBeenCalledWith(
        expect.objectContaining({ submissionId: "sub-1" }),
        { intro: { isComplete: true } },
      );
      expect(
        mockedGoogleClassroomApi.upsertCourseWorkProgress,
      ).toHaveBeenCalledWith(progressPayload);
    });

    it("does not enter the CourseWork flow when there is no assignmentToken", async () => {
      setAssignmentToken(null);

      renderWithCourseWork();

      await waitFor(() => {
        expect(lessonEngineProviderMock).toHaveBeenCalled();
      });

      expect(mockedGoogleClassroomApi.verifySession).not.toHaveBeenCalled();
    });

    it("renders the lesson normally when the context has no submissionId", async () => {
      mockedGoogleClassroomApi.verifySession.mockReturnValue(
        jest.fn().mockResolvedValue({
          authenticated: true,
          loginHint: "pupil@test.com",
          session: "session-abc",
          token: "token-abc",
        }),
      );
      mockedGoogleClassroomApi.getCourseWorkContext.mockResolvedValue({
        courseWorkId: "cw-1",
        courseId: "c-1",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        // No submissionId
      });

      renderWithCourseWork();

      await waitFor(() => {
        expect(
          mockedGoogleClassroomApi.getCourseWorkContext,
        ).toHaveBeenCalled();
        expect(lessonEngineProviderMock).toHaveBeenLastCalledWith(
          expect.objectContaining({ isHydratingInitialProgress: false }),
        );
      });

      // No progress saved, no sign-in overlay
      expect(
        screen.queryByTestId("google-sign-in-view"),
      ).not.toBeInTheDocument();
      expect(
        mockedGoogleClassroomApi.getCourseWorkProgress,
      ).not.toHaveBeenCalled();
    });
  });
});
describe("lessonAccessedPupilJourney analytics", () => {
  const defaultLessonEngineContext = () =>
    jest
      .spyOn(LessonEngineProvider, "useLessonEngineContext")
      .mockReturnValue(
        createLessonEngineContext({ currentSection: "overview" }),
      );

  const defaultProps = () => ({
    lessonContent: lessonContentFixture({
      contentGuidance: null,
      supervisionLevel: null,
    }),
    browseData: lessonBrowseDataFixture({}),
    hasWorksheet: false as const,
    hasAdditionalFiles: false as const,
    additionalFiles: null,
    worksheetInfo: null,
    initialSection: "overview" as const,
    pageType: "browse" as const,
  });

  beforeEach(() => {
    mockedUseAssignmentSearchParams.mockReset();
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReset();
    mockedUseSearchParams.mockReturnValue(null);
    (googleClassroomApi.getAddOnContext as jest.Mock).mockClear();
    (googleClassroomApi.getAddOnContext as jest.Mock).mockResolvedValue(null);
    (googleClassroomApi.getPupilLessonProgress as jest.Mock).mockClear();
    (googleClassroomApi.getPupilLessonProgress as jest.Mock).mockResolvedValue(
      null,
    );
    analyticsTrackMock.lessonAccessedPupilJourney?.mockClear();
  });

  it("fires immediately for a non-classroom lesson once the assignment check is complete", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    await waitFor(() => {
      expect(
        analyticsTrackMock.lessonAccessedPupilJourney,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          componentType: "page view",
          clientEnvironment: "web-browser",
          courseId: null,
          itemId: null,
          attachmentId: null,
          submissionId: null,
          pupilLoginHint: null,
          teacherLoginHint: null,
          classroomAssignmentId: null,
        }),
      );
    });
  });

  it("does not fire before the assignment check is complete", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: false,
    });
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    expect(
      analyticsTrackMock.lessonAccessedPupilJourney,
    ).not.toHaveBeenCalled();
  });

  it("fires when attachmentId is missing and skips getAddOnContext", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(
      createMockSearchParams({
        itemType: "courseWork",
        courseId: "course-123",
        itemId: "item-456",
      }),
    );
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    await waitFor(() => {
      expect(
        analyticsTrackMock.lessonAccessedPupilJourney,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          componentType: "page view",
          courseId: "course-123",
          itemId: "item-456",
          attachmentId: null,
          submissionId: null,
          pupilLoginHint: null,
          teacherLoginHint: null,
          classroomAssignmentId: "course-123:item-456",
          clientEnvironment: "web-browser",
        }),
      );
    });

    expect(googleClassroomApi.getAddOnContext).not.toHaveBeenCalled();
  });

  it("fires after getAddOnContext resolves and includes the resolved classroom context", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(
      createMockSearchParams({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
    );
    (googleClassroomApi.getAddOnContext as jest.Mock).mockResolvedValue({
      studentContext: { submissionId: "sub-101" },
      pupilLoginHint: "pupil@example.com",
      teacherLoginHint: "teacher@example.com",
    });
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    await waitFor(() => {
      expect(
        analyticsTrackMock.lessonAccessedPupilJourney,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          componentType: "page view",
          courseId: "course-123",
          itemId: "item-456",
          attachmentId: "attachment-789",
          submissionId: "sub-101",
          pupilLoginHint: "pupil@example.com",
          teacherLoginHint: "teacher@example.com",
          classroomAssignmentId: "course-123:item-456",
          clientEnvironment: "web-browser",
        }),
      );
    });
  });

  it("fires with null classroom context when getAddOnContext returns no student context", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(
      createMockSearchParams({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
    );
    (googleClassroomApi.getAddOnContext as jest.Mock).mockResolvedValue({
      pupilLoginHint: "pupil@example.com",
      teacherLoginHint: null,
    });
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    await waitFor(() => {
      expect(
        analyticsTrackMock.lessonAccessedPupilJourney,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          submissionId: null,
          teacherLoginHint: null,
          pupilLoginHint: "pupil@example.com",
        }),
      );
    });
  });

  it("fires even when getAddOnContext throws", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue(
      createMockSearchParams({
        courseId: "course-123",
        itemId: "item-456",
        attachmentId: "attachment-789",
      }),
    );
    (googleClassroomApi.getAddOnContext as jest.Mock).mockRejectedValue(
      new Error("Network error"),
    );
    defaultLessonEngineContext();

    render(<PupilExperienceView {...defaultProps()} />);

    await waitFor(() => {
      expect(analyticsTrackMock.lessonAccessedPupilJourney).toHaveBeenCalled();
    });
  });
});

describe("redirected overlay", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/?redirected=true");
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
  });
  it("Should show redirect modal when redirected query param is present", () => {
    mockRouter.setCurrentUrl("/?redirected=true");
    const lessonContent = lessonContentFixture({
      lessonTitle: "Lesson Title",
    });
    const lessonBrowseData = lessonBrowseDataFixture({
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );
    const { getByTestId } = render(
      <PupilExperienceView
        lessonContent={lessonContent}
        browseData={lessonBrowseData}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );
    expect(getByTestId("pupil-redirected-overlay-btn")).toBeInTheDocument();
  });

  it("shows content guidance after the redirected overlay is closed", async () => {
    mockRouter.setCurrentUrl("/?redirected=true");
    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByTestId, queryByTestId } = render(
      <PupilExperienceView
        lessonContent={lessonContentFixture({
          contentGuidance: [
            {
              contentguidanceLabel: "Guidance Title",
              contentguidanceArea: "Guidance Area",
              contentguidanceDescription: "Guidance Description",
            },
          ],
          supervisionLevel: "Supervision Level",
        })}
        browseData={lessonBrowseDataFixture({})}
        hasWorksheet={false}
        hasAdditionalFiles={false}
        additionalFiles={null}
        worksheetInfo={null}
        initialSection="overview"
        pageType="browse"
      />,
    );

    expect(queryByTestId("acceptButton")).not.toBeInTheDocument();

    await userEvent.click(getByTestId("pupil-redirected-overlay-btn"));

    await waitFor(() => {
      expect(getByTestId("acceptButton")).toBeInTheDocument();
    });
  });
});
