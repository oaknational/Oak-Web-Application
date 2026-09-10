import { PupilLessonQuizTopNav } from "./PupilLessonQuizTopNav";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizTopNav", () => {
  it("renders the heading and question summary", () => {
    render(
      <PupilLessonQuizTopNav
        section="starter-quiz"
        currentQuestion={3}
        totalQuestions={7}
      />,
    );

    expect(document.body).toHaveTextContent("Starter Quiz");
    expect(document.body).toHaveTextContent("Question 3 of 7");
  });

  it("uses the supplied heading for explanatory text", () => {
    render(
      <PupilLessonQuizTopNav
        section="exit-quiz"
        isExplanatoryText={true}
        heading="Review question"
      />,
    );

    expect(document.body).toHaveTextContent("Review question");
    expect(document.body).not.toHaveTextContent("Question 1 of 1");
  });
});
