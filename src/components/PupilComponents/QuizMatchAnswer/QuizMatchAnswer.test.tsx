import React from "react";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMatchAnswer } from "./QuizMatchAnswer";

import * as oakComponents from "@oaknational/oak-components";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { QuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakQuizMatch: jest.fn().mockReturnValue(null),
  };
});

window.matchMedia = () => ({ matches: true }) as unknown as MediaQueryList;

describe(QuizMatchAnswer, () => {
  const mouse: MatchAnswer = {
    correctChoice: [
      {
        type: "text",
        text: "Mouse",
      },
    ],
    matchOption: [
      {
        type: "text",
        text: "Likes cheese",
      },
    ],
  };
  const cat: MatchAnswer = {
    correctChoice: [
      {
        type: "text",
        text: "Cat",
      },
    ],
    matchOption: [
      {
        type: "text",
        text: "Likes to be petted",
      },
    ],
  };
  const elephant: MatchAnswer = {
    correctChoice: [
      {
        type: "text",
        text: "Elephant",
      },
    ],
    matchOption: [
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
      order: 1,
    },
  });
  const completeMatches = {
    "0": { label: "Mouse", id: "0", announcement: "Mouse" },
    "1": { label: "Elephant", id: "2", announcement: "Elephant" },
    "2": { label: "Cat", id: "1", announcement: "Cat" },
  };

  let onChange: oakComponents.OakQuizMatchProps["onChange"];

  beforeEach(() => {
    jest.spyOn(oakComponents, "OakQuizMatch").mockImplementation((props) => {
      onChange = props.onChange;
      return <div />;
    });
  });

  it("renders a hidden input for each item", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMatchAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      onChange!(completeMatches);
    });

    const matches = getAllByTestId("match-input");
    const choices = getAllByTestId("choice-input");

    expect(matches.length).toBe(3);
    expect(choices.length).toBe(3);
    expect(matches.at(1)).toHaveAttribute("name", "match-test-question-match");
    expect(matches.at(1)).toHaveAttribute("value", "1");
    expect(choices.at(1)).toHaveAttribute("name", "match-test-question-choice");
    expect(choices.at(1)).toHaveAttribute("value", "2");
  });

  it('sets the question mode to "input" when all matches are made', () => {
    const contextWithUpdateSpy = {
      ...context,
      updateQuestionMode: jest.fn(),
    };

    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={contextWithUpdateSpy}>
          <QuizMatchAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      onChange!({ "0": { label: "Mouse", id: "0", announcement: "Mouse" } });
    });

    expect(contextWithUpdateSpy.updateQuestionMode).toHaveBeenLastCalledWith(
      "init",
    );

    act(() => {
      onChange?.(completeMatches);
    });

    expect(contextWithUpdateSpy.updateQuestionMode).toHaveBeenLastCalledWith(
      "input",
    );
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
      const { getAllByTestId, rerender } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizMatchAnswer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      act(() => {
        onChange!(completeMatches);
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
      expect(feedback.at(1)!.textContent).toContain(
        "Correct answer: Cat - Likes to be petted",
      );
      expect(feedback.at(2)!.textContent).toContain("Never forgets");
      expect(feedback.at(2)!.textContent).toContain("Cat");
      expect(feedback.at(2)!.textContent).toContain(
        "Correct answer: Elephant - Never forgets",
      );
    });
  });
});
