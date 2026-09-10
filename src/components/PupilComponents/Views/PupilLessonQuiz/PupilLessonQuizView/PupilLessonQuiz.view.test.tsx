import { PupilLessonQuizView } from "./PupilLessonQuiz.view";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizView", () => {
  it("renders top nav, question content and bottom nav action", () => {
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
});
