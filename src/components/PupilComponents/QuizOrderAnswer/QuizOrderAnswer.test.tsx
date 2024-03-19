import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import * as oakComponents from "@oaknational/oak-components";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizOrderAnswer } from "./QuizOrderAnswer";

import { QuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { OrderAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakQuizOrder: jest.fn().mockReturnValue(null),
  };
});

window.matchMedia = () => ({ matches: true }) as unknown as MediaQueryList;

describe(QuizOrderAnswer, () => {
  const mouse: OrderAnswer = {
    answer: [
      {
        type: "text",
        text: "Mouse",
      },
    ],
    correct_order: 1,
  };
  const cat: OrderAnswer = {
    answer: [
      {
        type: "text",
        text: "Cat",
      },
    ],
    correct_order: 2,
  };
  const elephant: OrderAnswer = {
    answer: [
      {
        type: "text",
        text: "Elephant",
      },
    ],
    correct_order: 3,
  };
  const context = createQuizEngineContext({
    currentQuestionData: {
      questionId: 1,
      questionUid: "test-question",
      questionType: "order",
      questionStem: [
        {
          type: "text",
          text: "Put the animals in order by weight, lightest to heaviest",
        },
      ],
      feedback: "",
      hint: "",
      active: true,
      answers: {
        order: [mouse, cat, elephant],
      },
    },
  });
  const newOrder = [
    { label: "Cat", id: "2" },
    { label: "Mouse", id: "1" },
    { label: "Elephant", id: "3" },
  ];

  it("renders a hidden input for each item", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizOrderAnswer />
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
    let onItemOrderChange: oakComponents.OakQuizOrderProps["onChange"];

    jest.spyOn(oakComponents, "OakQuizOrder").mockImplementation((props) => {
      onItemOrderChange = props.onChange;
      return <div />;
    });
    const onInitialChange = jest.fn();

    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizOrderAnswer onInitialChange={onInitialChange} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      onItemOrderChange?.(newOrder);
    });

    expect(onInitialChange).toHaveBeenCalled();
  });

  describe("when feedback is present", () => {
    const feedbackContext = createQuizEngineContext({
      ...context,
      questionState: [
        {
          mode: "feedback",
          grade: 0,
          feedback: ["correct", "correct", "incorrect"],
          offerHint: false,
          isPartiallyCorrect: true,
        },
      ],
    });

    it('displays the feedback when "feedback" is present', () => {
      let onItemOrderChange: oakComponents.OakQuizOrderProps["onChange"];

      jest.spyOn(oakComponents, "OakQuizOrder").mockImplementation((props) => {
        onItemOrderChange = props.onChange;
        return <div />;
      });

      const { getAllByTestId, rerender } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizOrderAnswer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      act(() => {
        onItemOrderChange?.(newOrder);
      });

      rerender(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={feedbackContext}>
            <QuizOrderAnswer />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      const items = getAllByTestId("order-item-feedback");

      expect(items.at(0)!.textContent).toContain("Cat");
      expect(items.at(1)!.textContent).toContain("Mouse");
      expect(items.at(2)!.textContent).toContain("Elephant");
    });
  });
});
