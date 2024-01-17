import { ReactNode } from "react";
import { act, render, renderHook } from "@testing-library/react";
import { OakSpan } from "@oak-academy/oak-components";

import {
  LessonEngineProvider,
  LessonSection,
  lessonSections,
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

    lessonSections.forEach((s, i) => {
      act(() => {
        completeSection(s);
      });

      expect(result.current.completedSections).toEqual(
        lessonSections.slice(0, i + 1),
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

    ["intro", "starter-quiz", "video"].forEach((s) => {
      act(() => {
        result.current.completeSection(s as LessonSection);
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

    lessonSections.forEach((s, i) => {
      act(() => {
        completeSection(s);
      });

      expect(result.current.completedSections).toEqual(
        lessonSections.slice(0, i + 1),
      );
    });

    act(() => {
      completeSection("overview");
    });

    expect(result.current.completedSections).toEqual(lessonSections);
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

    lessonSections.forEach((s) => {
      expect(result.current.getIsComplete(s)).toEqual(false);
      act(() => {
        result.current.completeSection("overview");
      });
      expect(result.current.getIsComplete("overview")).toEqual(true);
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
      result.current.updateQuizResult({ grade: 0, maxScore: 0 });
    });

    expect(result.current.sectionResults).toEqual({
      overview: { grade: 0, maxScore: 0 },
    });
  });
});
