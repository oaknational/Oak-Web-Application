import { screen } from "@testing-library/react";

import { PupilViewsLessonOverview } from "./PupilLessonOverview.view";

import {
  LessonEngineContext,
  type LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { useAssignmentSearchParams } from "@/hooks/useAssignmentSearchParams";
import { useTrackSectionStarted } from "@/hooks/useTrackSectionStarted";

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: jest.fn(),
}));

jest.mock("@/hooks/useTrackSectionStarted", () => ({
  useTrackSectionStarted: jest.fn(),
}));

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => ({
    usePupilAnalytics: () => ({
      track: {
        lessonAbandoned: jest.fn(),
      },
    }),
  }),
);

jest.mock(
  "@/components/SharedComponents/TakedownBanner/TakedownBanner",
  () => ({
    getDoesSubjectHaveNewUnits: jest.fn(() => true),
    TakedownBanner: () => null,
  }),
);

const mockedUseAssignmentSearchParams =
  useAssignmentSearchParams as jest.MockedFunction<
    typeof useAssignmentSearchParams
  >;
const mockedUseTrackSectionStarted =
  useTrackSectionStarted as jest.MockedFunction<typeof useTrackSectionStarted>;

const render = renderWithProviders();

const browseData = {
  programmeFields: {
    phase: "primary",
    subject: "English",
    subjectSlug: "english",
    phaseSlug: "primary",
    yearSlug: "year-1",
    yearDescription: "Year 1",
  },
  programmeSlug: "programme-slug",
  actions: null,
  lessonData: {
    expirationDate: null,
  },
} as never;

const renderOverview = (context?: Partial<LessonEngineContextType>) =>
  render(
    <LessonEngineContext.Provider value={createLessonEngineContext(context)}>
      <PupilViewsLessonOverview
        lessonTitle="Lesson title"
        starterQuizNumQuestions={4}
        exitQuizNumQuestions={5}
        browseData={browseData}
      />
    </LessonEngineContext.Provider>,
  );

describe("PupilViewsLessonOverview loading state", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAssignmentSearchParams.mockReturnValue({
      isClassroomAssignment: false,
      classroomAssignmentChecked: true,
    });
    mockedUseTrackSectionStarted.mockReturnValue({
      trackSectionStarted: jest.fn(),
    });
  });

  it("disables and shows loading on the proceed button while initial progress is hydrating", () => {
    renderOverview({ isHydratingInitialProgress: true });

    expect(screen.getByTestId("proceed-to-next-section")).toBeDisabled();
    expect(screen.getAllByText("Loading").length).toBeGreaterThan(0);
  });
});
