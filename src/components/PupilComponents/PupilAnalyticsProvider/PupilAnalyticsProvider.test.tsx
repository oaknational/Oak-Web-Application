import { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
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

// Mock the useAnalytics hook
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({ track: jest.fn() })),
}));

const render = renderWithProviders();

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <PupilAnalyticsProvider
      pupilPathwayData={getPupilPathwayData(lessonBrowseDataFixture({}))}
      lessonContent={lessonContentFixture({})}
    >
      {children}
    </PupilAnalyticsProvider>
  );
};

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
    afterEach(() => {
      jest.clearAllMocks();
    });

    it.each(trackingEvents)(
      "calls track on the analytics object adding additional fields - %s",
      (eventName) => {
        //spy on the track function
        const trackSpy = { [eventName]: jest.fn() };
        (useAnalytics as jest.Mock).mockReturnValue({ track: trackSpy });

        const { result } = renderHook(() => usePupilAnalytics(), {
          wrapper: ProviderWrapper,
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
});
