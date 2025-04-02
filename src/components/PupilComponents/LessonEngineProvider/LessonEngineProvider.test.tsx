import { ReactNode } from "react";
import { act, renderHook, render } from "@testing-library/react";
import { OakSpan } from "@oaknational/oak-components";

import {
  LessonEngineProvider,
  LessonSection,
  allLessonReviewSections,
  isLessonReviewSection,
  isLessonSection,
  useLessonEngineContext,
} from "./LessonEngineProvider";

import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, jest.fn()])),
  identify: jest.fn(),
  posthogDistinctId: "123",
};

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

describe("LessonEngineProvider", () => {
  const ProviderWrapper = ({
    children,
    initialSection = "overview",
  }: {
    children: ReactNode;
    initialSection?: LessonSection;
  }) => {
    return (
      <LessonEngineProvider
        initialLessonReviewSections={allLessonReviewSections}
        initialSection={initialSection}
      >
        {children}
      </LessonEngineProvider>
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders children correctly", () => {
    const { getByText } = render(
      <LessonEngineProvider
        initialLessonReviewSections={allLessonReviewSections}
        initialSection="overview"
      >
        <OakSpan>Hello World</OakSpan>
      </LessonEngineProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });

  it("tracks the current section", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
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

  it("progresses to the next uncompleted section in order with proceedToNextSection", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    act(() => {
      result.current.completeActivity("intro");
      result.current.proceedToNextSection();
    });
    expect(result.current.currentSection).toEqual("starter-quiz");
  });

  it("returns to the review when proceedToNextSection is called and all sections are complete", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    act(() => {
      allLessonReviewSections.forEach((section) => {
        result.current.completeActivity(section);
      });
      result.current.proceedToNextSection();
    });

    expect(result.current.currentSection).toEqual("review");
  });

  it("returns to overview on completeSection when not all sections are complete", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    allLessonReviewSections.forEach((s) => {
      expect(result.current.currentSection).toEqual("overview");

      act(() => {
        result.current.completeActivity(s);
      });
    });

    expect(result.current.currentSection).toEqual("review");
  });

  it("sets `isComplete` for the section when it is completed", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    allLessonReviewSections.forEach((section) => {
      expect(result.current.sectionResults[section]?.isComplete).toBeFalsy();
      act(() => {
        result.current.completeActivity(section);
      });
      expect(result.current.sectionResults.intro?.isComplete).toEqual(true);
    });
  });

  it("sets `isLessonComplete` to true when all review sections are complete", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    allLessonReviewSections.forEach((section) => {
      expect(result.current.isLessonComplete).toEqual(false);

      act(() => {
        result.current.completeActivity(section);
      });
    });

    expect(result.current.isLessonComplete).toEqual(true);
  });

  it("tracks section results", () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: (props) => (
        <ProviderWrapper initialSection="starter-quiz" {...props} />
      ),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    expect(result.current.sectionResults).toEqual({});

    act(() => {
      result.current.updateSectionResult({ grade: 0, numQuestions: 0 });
    });

    expect(result.current.sectionResults).toEqual({
      "starter-quiz": expect.objectContaining({ grade: 0, numQuestions: 0 }),
    });
  });

  it('marks the section as incomplete when "updateSectionResult" is called', () => {
    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.updateCurrentSection("starter-quiz");
      result.current.updateSectionResult({ grade: 2, numQuestions: 4 });
    });

    // This ensures that when a pupil starts to retake a quiz the lesson
    // returns to the incomplete state so that partial results are not displayed
    expect(result.current.sectionResults["starter-quiz"]?.isComplete).toEqual(
      false,
    );
  });

  it("sends tracking data when the lesson is started", () => {
    const lessonStarted = jest.fn();

    jest
      .spyOn(usePupilAnalyticsMock.track, "lessonStarted")
      .mockImplementation(lessonStarted);

    const { result } = renderHook(() => useLessonEngineContext(), {
      wrapper: ProviderWrapper,
    });

    act(() => {
      result.current.proceedToNextSection();
    });
    expect(lessonStarted).toHaveBeenCalledTimes(1);
  });
});

describe(isLessonReviewSection, () => {
  it("returns true when the given section is a review section", () => {
    expect(isLessonReviewSection("overview")).toEqual(false);
    expect(isLessonReviewSection("starter-quiz")).toEqual(true);
  });
});

describe(isLessonSection, () => {
  it("returns true when the given string is a valid lesson section", () => {
    expect(isLessonSection("overview")).toEqual(true);
    expect(isLessonSection("banana")).toEqual(false);
  });
});
