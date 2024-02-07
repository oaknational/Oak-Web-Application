import { ReactNode } from "react";
import { act, render, renderHook } from "@testing-library/react";
import { OakSpan } from "@oaknational/oak-components";

import {
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
    });
    expect(result.current.completedSections).toEqual(["intro"]);

    act(() => {
      result.current.proceedToNextSection();
    });
    expect(result.current.currentSection).toEqual("starter-quiz");
  });

  it("tracks completed sections", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.completedSections).toEqual([]);

    const { completeSection } = result.current;

    lessonReviewSections.forEach((s, i) => {
      act(() => {
        completeSection(s);
      });

      expect(result.current.completedSections).toEqual(
        lessonReviewSections.slice(0, i + 1),
      );
    });
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
      act(() => {
        result.current.completeSection(s);
      });

      expect(result.current.currentSection).toEqual("overview");
    });

    act(() => {
      result.current.completeSection("exit-quiz");
    });

    expect(result.current.currentSection).toEqual("review");
  });

  it("doesn't duplicate completed sections", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.completedSections).toEqual([]);

    const { completeSection } = result.current;

    lessonReviewSections.forEach((s, i) => {
      act(() => {
        completeSection(s);
      });

      expect(result.current.completedSections).toEqual(
        lessonReviewSections.slice(0, i + 1),
      );
    });

    act(() => {
      completeSection("intro");
    });

    expect(result.current.completedSections).toEqual(lessonReviewSections);
  });

  it("gets the correct isComplete value", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) =>
        providerWrapper({
          ...props,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.completedSections).toEqual([]);

    lessonReviewSections.forEach((s) => {
      expect(result.current.getIsComplete(s)).toEqual(false);
      act(() => {
        result.current.completeSection("intro");
      });
      expect(result.current.getIsComplete("intro")).toEqual(true);
    });
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
      overview: { grade: 0, numQuestions: 0 },
    });
  });
});
