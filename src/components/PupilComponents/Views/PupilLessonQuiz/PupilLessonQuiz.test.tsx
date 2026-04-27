import userEvent from "@testing-library/user-event";

import { pickQuizTooltip } from "./helpers/pickQuizTooltip";

import {
  PupilLessonQuizBottomNav,
  PupilLessonQuizCheckButton,
  PupilLessonQuizNextButton,
  PupilLessonQuizTopNav,
  PupilLessonQuizView,
} from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";
import { QuizQuestionAnswers } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuiz", () => {
  it("renders the quiz view shell with question content", () => {
    render(
      <PupilLessonQuizView
        lessonSectionName="starter-quiz"
        phase="primary"
        topNav={{
          section: "starter-quiz",
          currentQuestion: 2,
          totalQuestions: 5,
        }}
        bottomNav={{
          actionSlot: <button type="button">Check answer</button>,
          answerFeedback: <>Correct</>,
          feedback: "correct",
        }}
        questionSlot={<div>Question content</div>}
      />,
    );

    expect(document.body).toHaveTextContent("Starter Quiz");
    expect(document.body).toHaveTextContent("Question content");
    expect(document.body).toHaveTextContent("Check answer");
  });

  it("renders the check button tooltip wiring", () => {
    render(
      <PupilLessonQuizCheckButton
        formId="quiz-form"
        tooltip="Select an answer"
        isTooltipOpen={true}
      />,
    );

    const button = document.querySelector("button[type='submit']");

    expect(button).toHaveAttribute("form", "quiz-form");
    expect(button).toHaveAttribute("aria-describedby", "quiz-tooltip");
    expect(document.body).toHaveTextContent("Check");
  });

  it("renders the next button and handles clicks", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <PupilLessonQuizNextButton label="Next question" onClick={onClick} />,
    );

    await user.click(document.querySelector("button") as HTMLElement);

    expect(document.body).toHaveTextContent("Next question");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders quiz top navigation states", () => {
    render(
      <>
        <PupilLessonQuizTopNav
          section="starter-quiz"
          currentQuestion={3}
          totalQuestions={7}
        />
        <PupilLessonQuizTopNav
          section="exit-quiz"
          isExplanatoryText={true}
          heading="Review question"
        />
      </>,
    );

    expect(document.body).toHaveTextContent("Starter Quiz");
    expect(document.body).toHaveTextContent("Question 3 of 7");
    expect(document.body).toHaveTextContent("Review question");
  });

  it("passes quiz bottom-nav content through", () => {
    render(
      <PupilLessonQuizBottomNav
        hint="Try using the key words"
        answerFeedback={<>Almost there</>}
        actionSlot={<button type="button">Try again</button>}
      />,
    );

    expect(document.body).toHaveTextContent("Try using the key words");
    expect(document.body).toHaveTextContent("Try again");
  });

  it.each([
    [{ order: [{}] }, "You need to order to move on!"],
    [{ match: [{}] }, "You need to match to move on!"],
    [{ "short-answer": [{}] }, "You need to type an answer to move on!"],
    [
      {
        "multiple-choice": [
          { answerIsCorrect: true },
          { answerIsCorrect: true },
        ],
      },
      "You need to select answers to move on!",
    ],
    [
      {
        "multiple-choice": [
          { answerIsCorrect: true },
          { answerIsCorrect: false },
        ],
      },
      "You need to select an answer to move on!",
    ],
  ] as Array<[QuizQuestionAnswers, string]>)(
    "returns the right tooltip for %s",
    (answers, expected) => {
      expect(pickQuizTooltip(answers)).toBe(expected);
    },
  );
});
