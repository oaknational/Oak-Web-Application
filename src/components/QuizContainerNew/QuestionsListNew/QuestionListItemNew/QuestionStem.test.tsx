import { QuestionStem } from "./QuestionStem";

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

describe("QuestionListItem", () => {
  it("renders the primary question text", () => {
    if (!mcqText) throw new Error("mcqText is null");

    const { getByText } = renderWithTheme(
      <QuestionStem questionStem={mcqText.questionStem} index={0} />,
    );
    const primaryQuestionText = getByText("What is a main clause?");

    expect(primaryQuestionText).toBeInTheDocument();
  });

  it("renders the question number", () => {
    if (!mcqText) throw new Error("mcqText is null");

    const { getByText } = renderWithTheme(
      <QuestionStem questionStem={mcqText.questionStem} index={0} />,
    );
    const numberText = getByText("Q1.");

    expect(numberText).toBeInTheDocument();
  });

  it("renders question stem images", () => {
    if (!mcqStemImage) throw new Error("mcqText is null");

    const { getByRole } = renderWithTheme(
      <QuestionStem questionStem={mcqStemImage.questionStem} index={0} />,
    );
    const image = getByRole("img");

    expect(image).toBeInTheDocument();
  });

  it("renders the question number when there is no primary text", () => {
    if (!mcqStemImage) throw new Error("mcqText is null");

    const questionStem: (StemImageObject | StemTextObject)[] = [
      mcqStemImage.questionStem[1] as StemImageObject,
    ];

    const { getByText } = renderWithTheme(
      <QuestionStem questionStem={questionStem} index={0} />,
    );
    const numberText = getByText("Q1.");

    expect(numberText).toBeInTheDocument();
  });

  it("renders text after an image", () => {
    if (!mcqStemImage) throw new Error("mcqText is null");

    const questionStem: (StemImageObject | StemTextObject)[] = [
      ...mcqStemImage.questionStem,
      { text: "This is some text", type: "text" },
    ];

    const { getByText } = renderWithTheme(
      <QuestionStem questionStem={questionStem} index={0} />,
    );
    const secondaryText = getByText("This is some text");

    expect(secondaryText).toBeInTheDocument();
  });
});
