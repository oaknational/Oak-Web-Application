import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import NcAlignmentChecker, {
  getServerSideProps,
} from "@/pages/nc-alignment-checker";
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

jest.mock("../../../node-lib/cms");

const mockCMSClient = CMSClient as jest.MockedObject<typeof CMSClient>;

const seoFixture = {
  title: "NC Alignment Checker",
  description: "Check alignment with the national curriculum",
};

const pageDataFixture = {
  blocks: [], // TODO: add in fixtures for each block once components are built
  seo: seoFixture,
};

beforeEach(() => {
  jest.clearAllMocks();
  mockCMSClient.ncAlignmentCheckerLandingPage.mockResolvedValue(
    pageDataFixture,
  );
});

describe("pages/nc-alignment-checker.tsx", () => {
  it("renders", () => {
    const { container } = renderWithProviders()(
      <NcAlignmentChecker topNav={topNavFixture} pageData={pageDataFixture} />,
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

    it("should return not found if no data from CMS", async () => {
      (isFeatureFlagEnabledServer as jest.Mock).mockImplementation(() => true);
      mockCMSClient.ncAlignmentCheckerLandingPage.mockResolvedValue(null);

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
