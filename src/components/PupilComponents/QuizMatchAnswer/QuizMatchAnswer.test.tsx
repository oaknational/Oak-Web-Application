import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMatchAnswer } from "./QuizMatchAnswer";

import * as oakComponents from "@oaknational/oak-components";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { QuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakQuizMatch: jest.fn().mockReturnValue(null),
  };
});

window.matchMedia = () => ({ matches: true }) as unknown as MediaQueryList;

describe(QuizMatchAnswer, () => {
  const mouse: MatchAnswer = {
    correct_choice: [
      {
        type: "text",
        text: "Mouse",
      },
    ],
    match_option: [
      {
        type: "text",
        text: "Likes cheese",
      },
    ],
  };
  const cat: MatchAnswer = {
    correct_choice: [
      {
        type: "text",
        text: "Cat",
      },
    ],
    match_option: [
      {
        type: "text",
        text: "Likes to be petted",
      },
    ],
  };
  const elephant: MatchAnswer = {
    correct_choice: [
      {
        type: "text",
        text: "Elephant",
      },
    ],
    match_option: [
      {
        type: "text",
        text: "Never forgets",
      },
    ],
  };
  const context = createQuizEngineContext({
    currentQuestionData: {
      questionId: 1,
      questionUid: "test-question",
      questionType: "match",
      questionStem: [
        {
          type: "text",
          text: "Match the animals to their characteristic",
        },
      ],
      feedback: "",
      hint: "",
      active: true,
      answers: {
        match: [mouse, cat, elephant],
      },
    },
  });
  const newMatches = {
    "0": { label: "Mouse", id: "0" },
    "1": { label: "Elephant", id: "2" },
    "2": { label: "Cat", id: "1" },
  };

  it("renders a hidden input for each item", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMatchAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const input = getAllByTestId("order-input");

    expect(input.length).toBe(3);
    expect(input.at(0)).toHaveAttribute("name", "order-test-question");
    expect(input.at(1)).toHaveAttribute("name", "order-test-question");
    expect(input.at(2)).toHaveAttribute("name", "order-test-question");
  });

  it("calls onInitialChange when items are re-ordered", () => {
    let onChange: oakComponents.OakQuizMatchProps["onChange"];

    jest.spyOn(oakComponents, "OakQuizMatch").mockImplementation((props) => {
      onChange = props.onChange;
      return <div />;
    });
    const onInitialChange = jest.fn();

    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMatchAnswer onInitialChange={onInitialChange} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      onChange?.(newMatches);
    });

    expect(onChange).toHaveBeenCalled();
  });

  describe("when feedback is present", () => {
    const feedbackContext = createQuizEngineContext({
      ...context,
      questionState: [
        {
          mode: "feedback",
          grade: 0,
          feedback: ["correct", "incorrect", "incorrect"],
          offerHint: false,
          isPartiallyCorrect: true,
        },
      ],
    });

    it("displays the feedback", () => {
      let onChange: oakComponents.OakQuizMatchProps["onChange"];

      jest.spyOn(oakComponents, "OakQuizMatch").mockImplementation((props) => {
        onChange = props.onChange;
        return <div />;
      });

      const { getAllByTestId, rerender } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizMatchAnswer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      act(() => {
        onChange?.(newMatches);
      });

      rerender(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={feedbackContext}>
            <QuizMatchAnswer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      const feedback = getAllByTestId("match-feedback");

      expect(feedback.at(0)!.textContent).toContain("Likes cheese");
      expect(feedback.at(0)!.textContent).toContain("Mouse");
      expect(feedback.at(1)!.textContent).toContain("Likes to be petted");
      expect(feedback.at(1)!.textContent).toContain("Elephant");
      expect(feedback.at(2)!.textContent).toContain("Never forgets");
      expect(feedback.at(2)!.textContent).toContain("Cat");
    });
  });
});
