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

const mockBroweData = lessonBrowseDataFixture({
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

describe("PupilViewsLessonOverview", () => {
  it("displays the lesson title", () => {
    const { queryByRole } = render(
      <OakPupilClientProvider>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            browseData={mockBroweData}
          />
        </LessonEngineContext.Provider>
      </OakPupilClientProvider>,
    );

    expect(
      queryByRole("heading", { name: "Introduction to The Canterbury Tales" }),
    ).toBeInTheDocument();
  });

  [
    [/Intro/, "intro"],
    [/Starter quiz/, "starter-quiz"],
    [/Exit quiz/, "exit-quiz"],
    [/Lesson video/, "video"],
  ].forEach(([name, section]) => {
    it(`allows navigation to the "${section}" section of the quiz`, () => {
      const updateCurrentSection = jest.fn();

      const { getByRole } = render(
        <OakPupilClientProvider>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({ updateCurrentSection })}
          >
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              browseData={mockBroweData}
            />
          </LessonEngineContext.Provider>
        </OakPupilClientProvider>,
      );

      getByRole("link", { name }).click();

      expect(updateCurrentSection).toHaveBeenCalledWith(section);
    });
  });

  it("displays in-progress for in progress sections", () => {
    const { getByTestId } = render(
      <OakPupilClientProvider>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({
            currentSection: "starter-quiz",
            sectionResults: {
              "starter-quiz": {
                grade: 1,
                isComplete: false,
                numQuestions: 0,
              },
            },
          })}
        >
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            browseData={mockBroweData}
          />
        </LessonEngineContext.Provider>
      </OakPupilClientProvider>,
    );

    expect(getByTestId("starter-quiz")).toHaveTextContent(/In progress/);
  });

  it("displays the number of questions for each quiz", () => {
    // console.log(logAttempt);
    const { getByTestId } = render(
      <OakPupilClientProvider>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            browseData={mockBroweData}
          />
        </LessonEngineContext.Provider>
      </OakPupilClientProvider>,
    );

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
      const { getByTestId } = render(
        <LessonEngineContext.Provider
          value={createLessonEngineContext(context)}
        >
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            browseData={mockBroweData}
          />
        </LessonEngineContext.Provider>,
      );

      expect(getByTestId("proceed-to-next-section")).toHaveTextContent(label);
    },
  );
});
