import {
  PupilExperienceView,
  pickAvailableSectionsForLesson,
} from "./PupilExperience.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { PupilLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonOverview/pupilLessonOverview.schema";
import { allLessonReviewSections } from "@/components/PupilComponents/LessonEngineProvider";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

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

  const lessonData: PupilLessonOverviewPageData = pupilLessonOverviewFixture();

  it("should render", () => {
    const { getByText } = renderWithTheme(
      <PupilExperienceView curriculumData={lessonData} hasWorksheet={false} />,
    );

    expect(getByText(lessonData.lessonTitle)).toBeInTheDocument();
  });
});
