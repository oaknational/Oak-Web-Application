import { QuizResultShortAnswer } from "./QuizResultShortAnswer";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizResultShortAnswer", () => {
  it("renders the text for all of the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          pupilAnswer={"This is the correct answer"}
          feedback={"correct"}
        />
        ,
      </OakThemeProvider>,
    );

    expect(getByText("This is the correct answer")).toBeInTheDocument();
  });

  it("marks correct answers as correct", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          pupilAnswer={"This is the correct answer"}
          feedback={"correct"}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByTestId("tick")).toHaveLength(1);
    expect(() => getAllByTestId("cross")).toThrow(
      'Unable to find an element by: [data-testid="cross"]',
    );
  });

  it("marks incorrect answers as incorrect", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          pupilAnswer={"This is not the correct answer"}
          feedback={"incorrect"}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByTestId("cross")).toHaveLength(1);
    expect(() => getAllByTestId("tick")).toThrow();
  });
});
