import { vi } from "vitest";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultMatch } from "./QuizResultMatch";

import { matchAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

describe("QuizResultMatch", () => {
  beforeAll(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it.each([
    { pupilAnswers: [0, 1, 2] },
    { pupilAnswers: [1, 2, 0] },
    { pupilAnswers: [1, 2, 0] },
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
          pupilAnswers={[0, 1, 2]}
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
            pupilAnswers={[1, 2, 0]}
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
            pupilAnswers={[0, 1, 2, 3]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Answer not found for index 3");
  });

  it("throws error if correct choice object not found", () => {
    matchAnswers.push({ correctChoice: [] });
    expect(() =>
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResultMatch
            answers={matchAnswers}
            feedback={["correct", "correct", "correct"]}
            pupilAnswers={[0, 1, 2, 3]}
          />
        </OakThemeProvider>,
      ),
    ).toThrow("Correct choice not found for pupil answer 3");
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
});
