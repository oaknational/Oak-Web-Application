import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultShortAnswer } from "./QuizResultShortAnswer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizResultShortAnswer", () => {
  it("renders the text for all of the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          answers={"This is the correct answer"}
          pupilAnswer={"This is the correct answer"}
        />
        ,
      </OakThemeProvider>,
    );

    expect(getByText("This is the correct answer")).toBeInTheDocument();
  });

  it("marks correct answers as correct", () => {
    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          answers={"This is the correct answer"}
          pupilAnswer={"This is the correct answer"}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByAltText("tick")).toHaveLength(1);
    expect(() => getAllByAltText("cross")).toThrow(
      "Unable to find an element with the alt text: cross",
    );
  });

  it("marks incorrect answers as incorrect", () => {
    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultShortAnswer
          answers={"This is the correct answer"}
          pupilAnswer={"This is not the correct answer"}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByAltText("cross")).toHaveLength(1);
    expect(() => getAllByAltText("tick")).toThrow(
      "Unable to find an element with the alt text: tick",
    );
  });
});
