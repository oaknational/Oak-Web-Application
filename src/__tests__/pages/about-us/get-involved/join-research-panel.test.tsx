import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import joinResearchPanelPageFixture from "./join-research-panel.fixtures";

import "@/__tests__/__helpers__/ResizeObserverMock";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import AboutUsJoinResearchPanel, {
  getServerSideProps,
} from "@/pages/about-us/get-involved/join-research-panel";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import CMSClient from "@/node-lib/cms";

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(() => false),
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

beforeEach(() => {
  jest.clearAllMocks();
  mockCMSClient.joinResearchPanelPage.mockResolvedValue(
    joinResearchPanelPageFixture,
  );
});

describe("pages/about/get-involved/join-research-panel.tsx", () => {
  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsJoinResearchPanel
        topNav={topNavFixture}
        pageData={joinResearchPanelPageFixture}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return notFound when the feature flag is disabled", async () => {
      (isFeatureFlagEnabledServer as jest.Mock).mockImplementation(() => false);

      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
