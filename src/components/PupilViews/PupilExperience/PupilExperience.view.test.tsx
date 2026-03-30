import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakTooltipProps } from "@oaknational/oak-components";
import mockRouter from "next-router-mock";
import { useSearchParams } from "next/navigation";

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

const classroomAddOnOpenedMock = jest.fn();
const clearAddOnOpenedFlagMock = jest.fn();
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

jest.mock("@/components/PupilComponents/LessonEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/LessonEngineProvider"),
  useLessonEngineContext: jest.fn(),
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
    getPupilLessonProgress: jest.fn(),
    submitPupilProgress: jest.fn(),
  },
}));

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

mockedUseAssignmentSearchParams.mockReturnValue({
  isClassroomAssignment: true,
  classroomAssignmentChecked: true,
});

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
    classroomAddOnOpenedMock.mockClear();
    clearAddOnOpenedFlagMock.mockClear();
    classroomAddOnOpenedMock.mockReturnValue(true);
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
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
});
describe("lessonAccessedPupilJourney analytics", () => {
  const defaultLessonEngineContext = () =>
    jest
      .spyOn(LessonEngineProvider, "useLessonEngineContext")
      .mockReturnValue(
        createLessonEngineContext({ currentSection: "overview" }),
      );

  const defaultProps = () => ({
    lessonContent: lessonContentFixture({}),
    browseData: lessonBrowseDataFixture({}),
    hasWorksheet: false as const,
    hasAdditionalFiles: false as const,
    additionalFiles: null,
    worksheetInfo: null,
    initialSection: "overview" as const,
    pageType: "browse" as const,
  });

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(null);
    (googleClassroomApi.getAddOnContext as jest.Mock).mockResolvedValue(null);
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

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(
      analyticsTrackMock.lessonAccessedPupilJourney,
    ).not.toHaveBeenCalled();
  });

  it("fires when classroom context params are missing and skips getAddOnContext", async () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({
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
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({
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
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({
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
    (useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams({
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
});
