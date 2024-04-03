import { OakTooltipProps } from "@oaknational/oak-components";

import {
  PupilExperienceView,
  pickAvailableSectionsForLesson,
} from "./PupilExperience.view";

import * as LessonEngineProvider from "@/components/PupilComponents/LessonEngineProvider";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { allLessonReviewSections } from "@/components/PupilComponents/LessonEngineProvider";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

jest.mock("@/components/PupilComponents/LessonEngineProvider", () => ({
  ...jest.requireActual("@/components/PupilComponents/LessonEngineProvider"),
  useLessonEngineContext: jest.fn(),
}));

jest.mock("@/components/PupilViews/PupilExpired/PupilExpired.view", () => ({
  PupilExpiredView: jest.fn(() => "PupilExpiredView"),
}));

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

describe("PupilExperienceView", () => {
  describe("pickAvailableSectionsForLesson", () => {
    it("returns all sections if all are available", () => {
      const sections = pickAvailableSectionsForLesson(
        pupilLessonOverviewFixture({
          starterQuiz: quizQuestions,
          exitQuiz: quizQuestions,
          videoMuxPlaybackId: "123",
        }),
      );

      expect(sections).toEqual(allLessonReviewSections);
    });

    it("should not include a section if it has no content", () => {
      const withoutStarterQuiz = pickAvailableSectionsForLesson(
        pupilLessonOverviewFixture({
          starterQuiz: [],
        }),
      );
      const withoutExitQuiz = pickAvailableSectionsForLesson(
        pupilLessonOverviewFixture({
          exitQuiz: [],
        }),
      );
      const withoutVideo = pickAvailableSectionsForLesson(
        pupilLessonOverviewFixture({
          videoMuxPlaybackId: null,
        }),
      );

      expect(withoutStarterQuiz).not.toContain("starter-quiz");
      expect(withoutExitQuiz).not.toContain("exit-quiz");
      expect(withoutVideo).not.toContain("video");
    });
  });

  describe("PupilPageContent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should render", () => {
      const lessonData = pupilLessonOverviewFixture();
      const pupilPathwayData = getPupilPathwayData(lessonData);

      jest
        .spyOn(LessonEngineProvider, "useLessonEngineContext")
        .mockReturnValue(
          createLessonEngineContext({
            currentSection: "overview",
          }),
        );
      const { getByText } = render(
        <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
          <PupilExperienceView
            curriculumData={lessonData}
            hasWorksheet={false}
            initialSection="overview"
          />
        </PupilAnalyticsProvider>,
      );

      expect(getByText(lessonData.lessonTitle)).toBeInTheDocument();
    });

    // we don't render the video section as it crashes without a valid mux id
    [
      [/Introduction/, "intro"],
      [/Starter Quiz/, "starter-quiz"],
      [/Exit Quiz/, "exit-quiz"],
    ].forEach(([name, section]) => {
      it("renders the current section", () => {
        const lessonData = pupilLessonOverviewFixture();

        jest
          .spyOn(LessonEngineProvider, "useLessonEngineContext")
          .mockReturnValue(
            createLessonEngineContext({
              currentSection: section as LessonEngineProvider.LessonSection,
            }),
          );

        const pupilPathwayData = getPupilPathwayData(lessonData);

        const { getByText } = render(
          <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
            <PupilExperienceView
              curriculumData={lessonData}
              hasWorksheet={false}
              initialSection="overview"
            />
          </PupilAnalyticsProvider>,
        );

        expect(getByText(name as RegExp)).toBeInTheDocument();
      });
    });
  });

  it("should render the expired view if the lesson is expired", () => {
    const lessonData = pupilLessonOverviewFixture({
      expired: true,
    });

    const pupilPathwayData = getPupilPathwayData(lessonData);

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByText } = render(
      <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
        <PupilExperienceView
          curriculumData={lessonData}
          hasWorksheet={false}
          initialSection="overview"
        />
      </PupilAnalyticsProvider>,
    );

    expect(getByText("PupilExpiredView", { exact: false })).toBeInTheDocument();
  });
});
