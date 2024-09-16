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

describe("PupilResults", () => {
  it("displays the title Results Page", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsResults
            starterQuizQuestionsArray={quizQuestions}
            exitQuizQuestionsArray={exitQuizQuestions}
            attemptData={{
              browseData: {
                subject: "ewfw",
                yearDescription: "efwef",
              },
              lessonData: {
                slug: "efwef",
                title: "efwef",
              },
              sectionResults: sectionResultsFixture,
            }}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Results Page")).toBeInTheDocument();
  });
});
