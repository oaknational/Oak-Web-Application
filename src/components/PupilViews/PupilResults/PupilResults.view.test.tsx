import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { PupilViewsResults } from "./PupilResults.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
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
      </OakThemeProvider>,
    );
    expect(getByText("Results")).toBeInTheDocument();
  });
});
