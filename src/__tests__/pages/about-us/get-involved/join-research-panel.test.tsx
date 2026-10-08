import { GetServerSidePropsContext } from "next";
import "jest-styled-components";

import renderWithProviders from "../../../__helpers__/renderWithProviders";

import AboutUsJoinResearchPanel, {
  getServerSideProps,
} from "@/pages/about-us/get-involved/join-research-panel";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(() => false),
}));

describe("pages/about/get-involved/join-research-panel.tsx", () => {
  it("renders", () => {
    const { container } = renderWithProviders()(
      <AboutUsJoinResearchPanel topNav={topNavFixture} />,
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
