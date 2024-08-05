import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultMatch } from "./QuizResultMatch";

import { matchAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

describe("QuizResultMatch", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it.each([
    { pupilAnswers: ["grass", "cow", "human"] },
    { pupilAnswers: ["cow", "human", "grass"] },
    { pupilAnswers: ["cow", "human", "grass"] },
  ])("renders the text for all of the answers", ({ pupilAnswers }) => {
    const { getAllByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMatch
          answers={matchAnswers}
          feedback={["correct", "correct", "correct"]}
          pupilAnswers={pupilAnswers}
        />
      </OakThemeProvider>,
    );

    const renderedTexts = getAllByText(/[A-Za-z]+/).filter(
      (e) => e.textContent !== "Your answer:",
    );

    expect(renderedTexts).toHaveLength(6);
  });

  it("renders correct answers as correct", () => {
    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMatch
          answers={matchAnswers}
          feedback={["correct", "correct", "correct"]}
          pupilAnswers={["grass", "cow", "human"]}
        />
      </OakThemeProvider>,
    );

    expect(getAllByAltText("tick")).toHaveLength(3);
    expect(() => getAllByAltText("cross")).toThrow(
      "Unable to find an element with the alt text: cross",
    );
  });

  it("renders incorrect answers as incorrect", () => {
    const { getAllByAltText } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResultMatch
            answers={matchAnswers}
            feedback={["incorrect", "incorrect", "incorrect"]}
            pupilAnswers={["cow", "human", "grass"]}
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    expect(getAllByAltText("cross")).toHaveLength(3);
  });

  it("throws an error if the answer is not found", () => {
    expect(() =>
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResultMatch
            answers={matchAnswers}
            feedback={["correct", "correct", "correct"]}
            pupilAnswers={["grass", "cow", "human", "dog"]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Answer not found for index 3");
  });

  it("throws error if correct choice object not found", () => {
    matchAnswers.push({ correctChoice: [] });
    console.log(matchAnswers);
    expect(() =>
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResultMatch
            answers={matchAnswers}
            feedback={["correct", "correct", "correct"]}
            pupilAnswers={["grass", "cow", "human", "dog"]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Correct choice not found for pupil answer dog");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
