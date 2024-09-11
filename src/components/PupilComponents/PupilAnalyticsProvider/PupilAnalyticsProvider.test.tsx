import { OakP } from "@oaknational/oak-components";

import {
  PupilAnalyticsProvider,
  getPupilAudioData,
  getPupilPathwayData,
  getPupilVideoData,
} from "./PupilAnalyticsProvider";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("PupilAnalyticsProvider", () => {
  const pupilPathwayData = getPupilPathwayData(lessonBrowseDataFixture({}));
  const pupilAudioData = getPupilAudioData(lessonContentFixture({}));
  const pupilVideoData = getPupilVideoData(lessonContentFixture({}));

  it("should render children", () => {
    const { getByText } = render(
      <PupilAnalyticsProvider
        pupilPathwayData={pupilPathwayData}
        pupilAudioData={pupilAudioData}
        pupilVideoData={pupilVideoData}
      >
        <OakP>Hello World</OakP>
      </PupilAnalyticsProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });

  describe("track", () => {
    it("calls track on the analytics object", () => {
      render(
        <PupilAnalyticsProvider
          pupilPathwayData={pupilPathwayData}
          pupilAudioData={pupilAudioData}
          pupilVideoData={pupilVideoData}
        >
          <OakP>Hello World</OakP>
        </PupilAnalyticsProvider>,
      );
    });
  });
});
