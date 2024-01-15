import { ReactNode } from "react";
import { act, render, renderHook } from "@testing-library/react";
import { OakSpan } from "@oak-academy/oak-components";

import {
  LessonEngineProvider,
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

  it("progresses to the next section in order with proceedToNextQuestion", () => {
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

    for (const s of lessonSections) {
      act(() => {
        const { proceedToNextSection } = result.current;
        proceedToNextSection();
      });
      const nextSection = lessonSections[lessonSections.indexOf(s) + 1] ?? s;
      expect(result.current.currentSection).toEqual(nextSection);
    }
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
});
