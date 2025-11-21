import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { PupilViewsResults } from "./PupilResults.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import {
  exitQuizQuestions,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";

describe("PupilResults", () => {
  it("displays the title Results Page", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsResults
            browseData={lessonBrowseDataFixture({})}
            starterQuizQuestionsArray={quizQuestions}
            exitQuizQuestionsArray={exitQuizQuestions}
            attemptData={{
              attemptId: "efwef",
              createdAt: "efwef",
              browseData: {
                subject: "ewfw",
                yearDescription: "efwef",
              },
              lessonData: {
                slug: "efwef",
                title: "efwef",
              },
              sectionResults:
                sectionResultsFixture as LessonAttemptCamelCase["sectionResults"],
            }}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Results")).toBeInTheDocument();
  });
});
