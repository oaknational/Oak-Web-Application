import { OakP } from "@oaknational/oak-components";

import {
  PupilAnalyticsProvider,
  getPupilPathwayData,
} from "./PupilAnalyticsProvider";

import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("PupilAnalyticsProvider", () => {
  it("should render children", () => {
    const pupilPathwayData = getPupilPathwayData(lessonBrowseDataFixture({}));

    const { getByText } = render(
      <PupilAnalyticsProvider pupilPathwayData={pupilPathwayData}>
        <OakP>Hello World</OakP>
      </PupilAnalyticsProvider>,
    );

    expect(getByText("Hello World")).toBeInTheDocument();
  });
});
