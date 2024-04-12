import { OakTooltipProps } from "@oaknational/oak-components";

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

  describe("PupilPageContent", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should render", () => {
      const lessonContent = lessonContentFixture({
        lessonTitle: "Lesson Title",
      });
      const lessonBrowseData = lessonBrowseDataFixture({});
      const pupilPathwayData = getPupilPathwayData(lessonContent);

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
            lessonContent={lessonContent}
            browseData={lessonBrowseData}
            hasWorksheet={false}
            initialSection="overview"
          />
        </PupilAnalyticsProvider>,
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

        const pupilPathwayData = getPupilPathwayData(lessonContent);

        const { getByText } = render(
          <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
            <PupilExperienceView
              lessonContent={lessonContent}
              browseData={lessonBrowseData}
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
    const lessonContent = lessonContentFixture({});

    const lessonBrowseData = lessonBrowseDataFixture({});
    lessonBrowseData.lessonData.deprecatedFields = { expired: true };

    const pupilPathwayData = getPupilPathwayData(lessonContent);

    jest.spyOn(LessonEngineProvider, "useLessonEngineContext").mockReturnValue(
      createLessonEngineContext({
        currentSection: "overview",
      }),
    );

    const { getByText } = render(
      <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
        <PupilExperienceView
          lessonContent={lessonContent}
          browseData={lessonBrowseData}
          hasWorksheet={false}
          initialSection="overview"
        />
      </PupilAnalyticsProvider>,
    );

    expect(getByText("PupilExpiredView", { exact: false })).toBeInTheDocument();
  });
});
