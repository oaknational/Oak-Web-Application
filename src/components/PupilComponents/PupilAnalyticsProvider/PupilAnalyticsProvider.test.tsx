import { vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { OakP } from "@oaknational/oak-components";

import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
  trackingEvents,
} from "./PupilAnalyticsProvider";
import { usePupilAnalytics } from "./usePupilAnalytics";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import useAnalytics from "@/context/Analytics/useAnalytics";
import errorReporter from "@/common-lib/error-reporter";

// Mock the useAnalytics hook
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: vi.fn(() => ({ track: vi.fn() })),
}));

vi.mock("@/common-lib/error-reporter", () => ({
  default: vi.fn(() => vi.fn()),
}));

const render = renderWithProviders();

const pupilPathwayData = getPupilPathwayData(lessonBrowseDataFixture({}));

describe("PupilAnalyticsProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <PupilAnalyticsProvider
        pupilPathwayData={pupilPathwayData}
        lessonContent={lessonContentFixture({})}
      >
        <OakP>Hello World</OakP>
      </PupilAnalyticsProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });

  describe("track", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it.each(trackingEvents)(
      "calls track on the analytics object adding additional fields - %s",
      (eventName) => {
        //spy on the track function
        const trackSpy = { [eventName]: vi.fn() };
        (useAnalytics as jest.Mock).mockReturnValue({ track: trackSpy });

        const { result } = renderHook(() => usePupilAnalytics(), {
          wrapper: ({ children }: { children: ReactNode }) => (
            <PupilAnalyticsProvider
              lessonContent={lessonContentFixture({})}
              pupilPathwayData={getPupilPathwayData(
                lessonBrowseDataFixture({}),
              )}
            >
              {children}
            </PupilAnalyticsProvider>
          ),
        });

        //@ts-expect-error: it's not worth narrowing the types just for this test
        result.current.track[eventName]({});
        expect(trackSpy[eventName]).toHaveBeenCalledWith(
          expect.objectContaining({
            ...pupilPathwayData,
            analyticsUseCase: "Pupil",
          }),
        );
      },
    );
  });

  it.each([
    "lessonActivityStartedLessonAudio",
    "lessonActivityCompletedLessonAudio",
    "lessonActivityAbandonedLessonAudio",
  ])("reports an error if the audio data is missing", (eventName) => {
    //spy on the track function
    const trackSpy = { [eventName]: vi.fn() };
    (useAnalytics as jest.Mock).mockReturnValue({ track: trackSpy });

    const reporter = vi.fn();
    (errorReporter as jest.Mock).mockReturnValue(reporter);

    const { result } = renderHook(() => usePupilAnalytics(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <PupilAnalyticsProvider
          pupilPathwayData={getPupilPathwayData(lessonBrowseDataFixture({}))}
        >
          {children}
        </PupilAnalyticsProvider>
      ),
    });

    //@ts-expect-error: it's not worth narrowing the types just for this test
    result.current.track[eventName]({});

    expect(reporter).toHaveBeenCalledWith(
      new Error("No audio data available"),
      { severity: "warning" },
    );
  });

  it.each([
    "lessonActivityStartedLessonVideo",
    "lessonActivityCompletedLessonVideo",
    "lessonActivityAbandonedLessonVideo",
  ])("reports an error if the video data is missing", (eventName) => {
    //spy on the track function
    const trackSpy = { [eventName]: vi.fn() };
    (useAnalytics as jest.Mock).mockReturnValue({ track: trackSpy });

    const reporter = vi.fn();
    (errorReporter as jest.Mock).mockReturnValue(reporter);

    const { result } = renderHook(() => usePupilAnalytics(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <PupilAnalyticsProvider
          pupilPathwayData={getPupilPathwayData(lessonBrowseDataFixture({}))}
        >
          {children}
        </PupilAnalyticsProvider>
      ),
    });

    //@ts-expect-error: it's not worth narrowing the types just for this test
    result.current.track[eventName]({});

    expect(reporter).toHaveBeenCalledWith(
      new Error("No video data available"),
      { severity: "warning" },
    );
  });
});
