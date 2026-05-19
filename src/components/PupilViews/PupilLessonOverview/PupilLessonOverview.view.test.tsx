import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "next/navigation";

import { PupilViewsLessonOverview } from "./PupilLessonOverview.view";

import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { OakPupilClientProvider } from "@/context/Pupil/OakPupilClientProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";

const mockTrackSectionStarted = jest.fn();

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, jest.fn()])),
  identify: jest.fn(),
  posthogDistinctId: "123",
};

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

jest.mock("zod-to-camel-case", () => ({
  __esModule: true,
  default: jest.fn((value) => value),
  keysToCamelCase: jest.fn((value) => value),
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useTrackSectionStarted", () => ({
  useTrackSectionStarted: jest.fn(),
}));

jest.mock(
  "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton",
  () => ({
    ViewAllLessonsButton: ({
      href,
      onClick,
    }: {
      href?: string | null;
      onClick?: () => void;
    }) => (
      <button
        data-testid="view-all-lessons-button"
        data-href={href}
        onClick={onClick}
      >
        View all lessons
      </button>
    ),
  }),
);

jest.mock(
  "@/components/SharedComponents/TakedownBanner/TakedownBanner",
  () => ({
    getDoesSubjectHaveNewUnits: jest.fn(() => true),
    TakedownBanner: (props: Record<string, unknown>) => (
      <div
        data-testid="takedown-banner"
        data-is-expiring={String(props.isExpiring)}
        data-is-legacy={String(props.isLegacy)}
        data-onward-href={String(props.onwardHref)}
      />
    ),
  }),
);

const mockedUseAssignmentSearchParams =
  useAssignmentSearchParams as jest.MockedFunction<
    typeof useAssignmentSearchParams
  >;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;
const mockedUseTrackSectionStarted =
  useTrackSectionStarted as jest.MockedFunction<typeof useTrackSectionStarted>;

const mockBrowseData = lessonBrowseDataFixture({
  programmeSlug: "english-primary",
  programmeFields: {
    ...lessonBrowseDataFixture({}).programmeFields,
    phase: "primary",
    yearDescription: "Year 1",
    subject: "English",
    subjectSlug: "english",
  },
  lessonSlug: "introduction-to-the-canterbury-tales",
  lessonData: {
    ...lessonBrowseDataFixture({}).lessonData,
    expirationDate: null,
  },
});

const render = renderWithProviders();

const renderOverview = (
  context?: Partial<LessonEngineContextType>,
  props?: Partial<React.ComponentProps<typeof PupilViewsLessonOverview>>,
) => {
  return render(
    <OakPupilClientProvider>
      <LessonEngineContext.Provider value={createLessonEngineContext(context)}>
        <PupilViewsLessonOverview
          lessonTitle="Introduction to The Canterbury Tales"
          starterQuizNumQuestions={4}
          exitQuizNumQuestions={5}
          browseData={mockBrowseData}
          {...props}
        />
      </LessonEngineContext.Provider>
    </OakPupilClientProvider>,
  );
};

describe("PupilViewsLessonOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    mockedUseSearchParams.mockReturnValue({
      get: jest.fn(() => null),
    } as unknown as ReturnType<typeof useSearchParams>);
    mockedUseTrackSectionStarted.mockReturnValue({
      trackSectionStarted: mockTrackSectionStarted,
    });
  });

  it("displays the lesson title", () => {
    const { queryByRole } = renderOverview();

    expect(
      queryByRole("heading", { name: "Introduction to The Canterbury Tales" }),
    ).toBeInTheDocument();
  });

  it("disables and shows loading on the proceed button while initial progress is hydrating", () => {
    renderOverview({
      isHydratingInitialProgress: true,
    });

    expect(screen.getByTestId("proceed-to-next-section")).toBeDisabled();
    expect(screen.getAllByText("Loading").length).toBeGreaterThan(0);
  });

  [
    [/Intro/, "intro"],
    [/Starter quiz/, "starter-quiz"],
    [/Exit quiz/, "exit-quiz"],
    [/Lesson video/, "video"],
  ].forEach(([name, section]) => {
    it(`allows navigation to the "${section}" section of the quiz`, () => {
      const updateCurrentSection = jest.fn();

      const { getByRole } = renderOverview({ updateCurrentSection });

      getByRole("link", { name }).click();

      expect(updateCurrentSection).toHaveBeenCalledWith(section);
    });
  });

  it("displays in-progress for in progress sections", () => {
    const { getByTestId } = renderOverview({
      currentSection: "starter-quiz",
      sectionResults: {
        "starter-quiz": {
          grade: 1,
          isComplete: false,
          numQuestions: 0,
        },
      },
    });

    expect(getByTestId("starter-quiz")).toHaveTextContent(/In progress/);
  });

  it("displays the number of questions for each quiz", () => {
    const { getByTestId } = renderOverview();

    expect(getByTestId("starter-quiz")).toHaveTextContent(/4 Questions/);
    expect(getByTestId("exit-quiz")).toHaveTextContent(/5 questions/);
  });

  it.each([
    {
      context: { lessonStarted: false },
      label: "Let's get ready",
    },
    {
      context: {
        sectionResults: { intro: { isComplete: true } },
        lessonStarted: false,
      },
      label: "Start lesson",
    },
    {
      context: {
        sectionResults: {
          "starter-quiz": { isComplete: true, numQuestions: 5, grade: 1 },
        },
        lessonStarted: true,
      },
      label: "Continue lesson",
    },
    {
      context: {
        sectionResults: {
          "exit-quiz": { isComplete: true, numQuestions: 5, grade: 1 },
        },
        lessonStarted: true,
      },
      label: "Continue lesson",
    },
    {
      context: {
        isLessonComplete: true,
        lessonStarted: true,
      },
      label: "Lesson review",
    },
  ] satisfies Array<{
    context: Partial<LessonEngineContextType>;
    label: string;
  }>)(
    'renders "$label" for the proceed to next section button',
    ({ label, context }) => {
      const { getByTestId } = renderOverview(context);

      expect(getByTestId("proceed-to-next-section")).toHaveTextContent(label);
    },
  );

  it("redirects to review on mount when read only", async () => {
    const updateCurrentSection = jest.fn();

    renderOverview({
      isReadOnly: true,
      updateCurrentSection,
    });

    await waitFor(() => {
      expect(updateCurrentSection).toHaveBeenCalledWith("review");
      expect(mockTrackSectionStarted).toHaveBeenCalledWith("review");
    });
  });

  it("proceeds to the first incomplete section and tracks it", async () => {
    const proceedToNextSection = jest.fn();

    renderOverview({
      proceedToNextSection,
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
      sectionResults: {
        intro: { isComplete: true },
        "starter-quiz": { isComplete: true, numQuestions: 4, grade: 1 },
      },
    });

    await userEvent.click(screen.getByTestId("proceed-to-next-section"));

    expect(proceedToNextSection).toHaveBeenCalled();
    expect(mockTrackSectionStarted).toHaveBeenCalledWith("video");
  });

  it("keeps the user on review when read only and proceed is clicked", async () => {
    const updateCurrentSection = jest.fn();
    const proceedToNextSection = jest.fn();

    renderOverview({
      isReadOnly: true,
      updateCurrentSection,
      proceedToNextSection,
    });

    await userEvent.click(screen.getByTestId("proceed-to-next-section"));

    expect(proceedToNextSection).not.toHaveBeenCalled();
    expect(updateCurrentSection).toHaveBeenCalledWith("review");
    expect(mockTrackSectionStarted).toHaveBeenCalledWith("review");
  });

  it("renders lesson outcomes and formatted content guidance", () => {
    renderOverview(undefined, {
      pupilLessonOutcome: "Understand the prologue",
      phonicsOutcome: "Pronounce new sounds",
      contentGuidance: [
        {
          contentguidanceLabel: "Contains discussion of grief",
          contentguidanceArea: "theme",
          contentguidanceDescription: null,
        },
        {
          contentguidanceLabel: "References loss.",
          contentguidanceArea: "theme",
          contentguidanceDescription: null,
        },
      ],
      supervisionLevel: "Discuss with a trusted adult",
    });

    expect(screen.getByText("Lesson outcome")).toBeInTheDocument();
    expect(screen.getByText("Understand the prologue")).toBeInTheDocument();
    expect(screen.getByText("Pronounce new sounds")).toBeInTheDocument();
    expect(screen.getByTestId("content-guidance-info")).toHaveTextContent(
      "Contains discussion of grief. References loss. Discuss with a trusted adult.",
    );
  });

  it("shows the back button only for non-classroom lessons and tracks abandonment", async () => {
    renderOverview(
      {
        isLessonComplete: false,
      },
      { backUrl: "/back" },
    );

    await userEvent.click(screen.getByTestId("view-all-lessons-button"));

    expect(screen.getByTestId("view-all-lessons-button")).toBeInTheDocument();
    expect(usePupilAnalyticsMock.track.lessonAbandoned).toHaveBeenCalledWith(
      {},
    );
  });

  it("hides the back button for classroom assignments and while assignment check is incomplete", () => {
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: true,
      classroomAssignmentChecked: true,
    });

    const { rerender } = renderOverview(undefined, { backUrl: "/back" });

    expect(
      screen.queryByTestId("view-all-lessons-button"),
    ).not.toBeInTheDocument();

    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: false,
    });

    rerender(
      <OakPupilClientProvider>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            browseData={mockBrowseData}
            backUrl="/back"
          />
        </LessonEngineContext.Provider>
      </OakPupilClientProvider>,
    );

    expect(
      screen.queryByTestId("view-all-lessons-button"),
    ).not.toBeInTheDocument();
  });

  it("renders the takedown banner and section progress states", () => {
    renderOverview(
      {
        isReadOnly: true,
        isHydratingInitialProgress: true,
        lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
        sectionResults: {
          "starter-quiz": { isComplete: true, numQuestions: 4, grade: 2 },
          "exit-quiz": { isComplete: false, numQuestions: 5, grade: 1 },
        },
      },
      {
        browseData: {
          ...mockBrowseData,
          programmeSlug: "legacy-programme",
          actions: { displayExpiringBanner: true },
          lessonData: {
            ...mockBrowseData.lessonData,
            expirationDate: "2026-05-01",
          },
        },
      },
    );

    expect(screen.getAllByTestId("takedown-banner")).toHaveLength(2);
    expect(screen.getByTestId("starter-quiz")).toHaveTextContent(/Complete/);
    expect(screen.getByTestId("exit-quiz")).toHaveTextContent(/In progress/);
  });
});
