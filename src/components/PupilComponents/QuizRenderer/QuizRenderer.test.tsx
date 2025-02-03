import React from "react";
import "@testing-library/jest-dom";
import {
  OakPrimaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    numQuestions: 1,
  });

describe("QuizRenderer", () => {
  it("throws an error when there is no context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderWithTheme(<QuizRenderer formId="formId" />)).toThrow();
    spy.mockRestore();
  });

  it("renders questionStem when questionState.mode !== 'end'", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer formId="formId" />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const questionStemQuestion = getByText("What is a main clause?");
    expect(questionStemQuestion).toBeInTheDocument();
  });

  it("renders OakRadioGroup when questionState.mode !== 'end'", () => {
    const context = getQuizEngineContext();

    const { getByLabelText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer formId="formId" />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const radio1 = getByLabelText("a group of letters");
    expect(radio1).toBeInTheDocument();
  });

  it("updates question mode to grading when submit is clicked", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.updateQuestionMode = vi.fn();
      context.questionState[0].mode = "input";

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer formId="formId" />
              <OakPrimaryButton form={"formId"} type="submit">
                Submit
              </OakPrimaryButton>
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Submit" }));
      expect(context.updateQuestionMode).toHaveBeenCalledWith("grading");
    }
  });

  it("calls handleNextQuestion when next button is clicked and questionState.mode === 'feedback'", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "feedback";
      const handleNextQuestion = (context.handleNextQuestion = vi.fn());

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer formId="formId" />
              <OakPrimaryButton onClick={handleNextQuestion}>
                Next Question
              </OakPrimaryButton>
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      fireEvent.click(getByRole("button", { name: "Next Question" }));
      expect(context.handleNextQuestion).toHaveBeenCalledTimes(1);
    }
  });

  it("captures the MCQ selected answers when submit is clicked", () => {
    const context = getQuizEngineContext();

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = vi.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer formId="form-id" />
              <OakPrimaryButton form="form-id" type="submit">
                Submit
              </OakPrimaryButton>
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByRole("button", { name: "Submit" }));
      });

      expect(context.handleSubmitMCAnswer).toHaveBeenCalled();
      expect(context.handleSubmitMCAnswer).toHaveBeenCalledWith([
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[1],
      ]);
    }
  });

  it("captures the MCQ selected answers when submit is clicked (multiple answers)", () => {
    const context = getQuizEngineContext();

    if (context?.currentQuestionData?.answers?.["multiple-choice"]?.[1]) {
      context.currentQuestionData.answers[
        "multiple-choice"
      ][1].answerIsCorrect = true;
    }

    if (context?.questionState?.[0]) {
      context.questionState[0].mode = "input";
      context.handleSubmitMCAnswer = vi.fn();

      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer formId="form-id" />
              <OakPrimaryButton form="form-id" type="submit">
                Submit
              </OakPrimaryButton>
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByLabelText(/a group of words/));
        fireEvent.click(getByRole("button", { name: "Submit" }));
      });

      expect(context.handleSubmitMCAnswer).toHaveBeenCalled();
      expect(context.handleSubmitMCAnswer).toHaveBeenCalledWith([
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[1],
        context?.currentQuestionData?.answers?.["multiple-choice"]?.[2],
      ]);
    }
  });

  it("renders a shortAnswer when questionType === 'short-answer'", () => {
    const context = getQuizEngineContext();

    context.currentQuestionData = quizQuestions?.find(
      (q) => q.questionType === "short-answer",
    );

    if (context?.currentQuestionData) {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <QuizEngineContext.Provider value={context}>
              <QuizRenderer formId="form-id" />
            </QuizEngineContext.Provider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByRole("textbox")).toBeInTheDocument();
    }
  });

  it("calls handleSubmitShortAnswer when submit is clicked for a short answer", () => {
    const context = getQuizEngineContext();

    context.currentQuestionData = quizQuestions?.find(
      (q) => q.questionType === "short-answer",
    );

    if (context.questionState?.[0]) {
      context.questionState[0].mode = "input";
    }

    context.handleSubmitShortAnswer = vi.fn();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <QuizEngineContext.Provider value={context}>
            <QuizRenderer formId="form-id" />
            <OakPrimaryButton form="form-id" type="submit">
              Submit
            </OakPrimaryButton>
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.click(getByRole("button", { name: "Submit" }));
    });

    expect(context.handleSubmitShortAnswer).toHaveBeenCalled();
    expect(context.handleSubmitShortAnswer).toHaveBeenCalledWith("test");
  });
});
