import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../__helpers__/renderWithProviders";

import { testAboutPageBaseData } from "./about-us.fixtures";

import AboutUsMeetTheTeam, {
  AboutUsMeetTheTeamPage,
  getServerSideProps,
  mockData,
} from "@/pages/about-us/meet-the-team";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

jest.mock("@/node-lib/posthog/getFeatureFlag");
jest.mock("../../../node-lib/cms");
jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-posthog-id"),
}));

export const testAboutWhoWeArePageData: AboutUsMeetTheTeamPage["pageData"] = {
  ...testAboutPageBaseData,
  ...mockData,
};

describe("pages/about/meet-the-team.tsx", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsMeetTheTeam
        pageData={testAboutWhoWeArePageData}
        topNav={topNavFixture}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should 404 when not enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(false);
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });

    it("should 200 when enabled", async () => {
      (getFeatureFlag as jest.Mock).mockResolvedValue(true);
      const propsResult = await getServerSideProps({
        req: { cookies: {} },
        res: {},
        query: {},
        params: {},
      } as unknown as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: expect.anything(),
      });
    });
  });
});
