import { ReactNode } from "react";
import { act, render, renderHook } from "@testing-library/react";
import { OakSpan } from "@oaknational/oak-components";

import {
  LessonEngineContextType,
  LessonEngineProvider,
  lessonReviewSections,
  useLessonEngineContext,
} from "./LessonEngineProvider";

describe("LessonEngineProvider", () => {
  const providerWrapper = ({ children }: { children: ReactNode }) => {
    return <LessonEngineProvider>{children}</LessonEngineProvider>;
  };
  it("renders children correctly", () => {
    const { getByText } = render(
      <LessonEngineProvider>
        <OakSpan>Hello World</OakSpan>
      </LessonEngineProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });

  it("tracks the current section", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.currentSection).toEqual("overview");

    const { updateCurrentSection } = result.current;

    act(() => {
      updateCurrentSection("intro");
    });

    expect(result.current.currentSection).toEqual("intro");
  });

  it("progresses to the next uncompleted section in order with proceedToNextQuestion", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    act(() => {
      result.current.completeSection("intro");
      result.current.proceedToNextSection();
    });
    expect(result.current.currentSection).toEqual("starter-quiz");
  });

  it("returns to overview on completeSection when not all sections are complete", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    lessonReviewSections.forEach((s) => {
      expect(result.current.currentSection).toEqual("overview");

      act(() => {
        result.current.completeSection(s);
      });
    });

    expect(result.current.currentSection).toEqual("review");
  });

  it("sets `isComplete` for the section when it is completed", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    lessonReviewSections.forEach((section) => {
      expect(result.current.sectionResults[section]?.isComplete).toBeFalsy();
      act(() => {
        result.current.completeSection("intro");
      });
      expect(result.current.sectionResults.intro?.isComplete).toEqual(true);
    });
  });

  it("sets `isLessonComplete` to true when all review sections are complete", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: providerWrapper,
    });

    lessonReviewSections.forEach((section) => {
      expect(result.current.isLessonComplete).toEqual(false);

      act(() => {
        result.current.completeSection(section);
      });
    });

    expect(result.current.isLessonComplete).toEqual(true);
  });

  it("tracks section results", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.sectionResults).toEqual({});

    act(() => {
      result.current.updateQuizResult({ grade: 0, numQuestions: 0 });
    });

    expect(result.current.sectionResults).toEqual({
      overview: expect.objectContaining({ grade: 0, numQuestions: 0 }),
    });
  });
});

export function createLessonEngineContext(
  overrides?: Partial<LessonEngineContextType>,
): NonNullable<LessonEngineContextType> {
  return {
    isLessonComplete: false,
    currentSection: "starter-quiz",
    sectionResults: {},
    completeSection: jest.fn(),
    updateCurrentSection: jest.fn(),
    proceedToNextSection: jest.fn(),
    updateQuizResult: jest.fn(),
    ...overrides,
  };
}
