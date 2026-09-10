import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultOrder } from "./QuizResultOrder";

import { invariant } from "@/utils/invariant";
import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

describe("QuizResultOrder", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it.each([
    { pupilAnswers: [1, 2, 3, 4] },
    { pupilAnswers: [2, 3, 1, 4] },
    { pupilAnswers: [4, 2, 1, 3] },
  ])("renders the text for all of the answers", ({ pupilAnswers }) => {
    const { getAllByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswers={pupilAnswers}
        />
      </OakThemeProvider>,
    );

    const renderedTexts = getAllByText(/[A-Za-z]+/).filter(
      (e) => e.textContent !== "Your answer:",
    );

    expect(renderedTexts).toHaveLength(4);

    pupilAnswers.forEach((pupilAnswer, i) => {
      const answer = orderAnswers[pupilAnswer - 1];
      if (!answer) {
        throw new Error("Answer not found");
      }
      for (const part of answer.answer) {
        if (part?.type === "text") {
          expect(renderedTexts[i]?.textContent).toContain(part.text);
        }
      }
    });
  });

  it("renders correct answers as correct", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswers={[1, 2, 3, 4]}
        />
      </OakThemeProvider>,
    );

    expect(getAllByTestId("tick")).toHaveLength(4);
    expect(() => getAllByTestId("cross")).toThrow();
  });

  it("renders incorrect answers as incorrect", () => {
    const { getAllByTestId } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResultOrder
            answers={orderAnswers}
            feedback={["correct", "correct", "correct", "incorrect"]}
            pupilAnswers={[1, 2, 3, 4]}
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );

    expect(getAllByTestId("tick")).toHaveLength(3);
    expect(getAllByTestId("cross")).toHaveLength(1);
  });

  it("throws if the pupilAnswer is not in the answers", () => {
    expect(() => {
      renderWithTheme(
        <MathJaxProvider>
          <OakThemeProvider theme={oakDefaultTheme}>
            <QuizResultOrder
              answers={orderAnswers}
              feedback={["correct", "correct", "correct", "correct"]}
              pupilAnswers={[1, 2, 3, 5]}
            />
          </OakThemeProvider>
        </MathJaxProvider>,
      );
    }).toThrow("Answer not found for index 5");
  });

  it("throws if an answer does not have text", () => {
    invariant(orderAnswers[0], "Answer must exist");
    invariant(orderAnswers[1], "Answer must exist");

    const orderAnswersWithNoText = [
      orderAnswers[0],
      { ...orderAnswers[1], answer: [] },
    ];
    expect(() => {
      renderWithTheme(
        <MathJaxProvider>
          <OakThemeProvider theme={oakDefaultTheme}>
            <QuizResultOrder
              answers={orderAnswersWithNoText}
              feedback={["correct", "correct"]}
              pupilAnswers={[1, 2]}
            />
          </OakThemeProvider>
        </MathJaxProvider>,
      );
    }).toThrow("Text is missing from order answer");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
