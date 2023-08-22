import { MCAnswers } from "./MCAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

const lessonOverview = lessonOverviewFixture();
const starterQuiz = lessonOverview.starterQuiz;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

describe("MCAnswers", () => {
  it("renders the correct number of answers", () => {
    if (!mcqText) throw new Error("mcqText is null");
    if (!mcqText.answers["multiple-choice"])
      throw new Error("mcqText.answers['multiple-choice'] is null");

    const { getAllByRole } = renderWithTheme(
      <MCAnswers
        answers={mcqText.answers["multiple-choice"]}
        questionNumber={0}
      />
    );
    const answers = getAllByRole("listitem");

    expect(answers.length).toBe(4);
  });

  it.todo("renders the answer text");

  it.todo("highlights the correct answer");

  it.todo("renders the image answers");
});
