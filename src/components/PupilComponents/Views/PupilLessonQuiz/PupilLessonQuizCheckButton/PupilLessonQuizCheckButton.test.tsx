import { PupilLessonQuizCheckButton } from "./PupilLessonQuizCheckButton";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import "@/__tests__/__helpers__/ResizeObserverMock";

const render = renderWithProvidersByName(["oakTheme"]);

describe("PupilLessonQuizCheckButton", () => {
  it("renders submit button attributes and tooltip wiring", () => {
    render(
      <PupilLessonQuizCheckButton
        formId="quiz-form"
        tooltip="Select an answer"
        isTooltipOpen={true}
      />,
    );

    const button = document.querySelector("button[type='submit']");

    expect(button).toHaveTextContent("Check");
    expect(button).toHaveAttribute("form", "quiz-form");
    expect(button).toHaveAttribute("aria-describedby", "quiz-tooltip");
    expect(document.body).toHaveTextContent("Select an answer");
  });
});
