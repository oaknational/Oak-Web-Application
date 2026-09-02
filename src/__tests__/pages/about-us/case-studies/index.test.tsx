import { GetServerSidePropsContext } from "next/types";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksCaseStudyList, {
  getServerSideProps,
} from "@/pages/about-us/case-studies/index";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

const mockShouldSkipInitialBuild = false;

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

jest.mock("@/node-lib/isr", () => ({
  ...jest.requireActual("@/node-lib/isr"),
  get shouldSkipInitialBuild() {
    return mockShouldSkipInitialBuild;
  },
  getFallbackBlockingConfig: jest.fn(),
}));

jest.mock("@/node-lib/cms");

jest.mock("@/utils/featureFlagChecks/server", () => ({
  isFeatureFlagEnabledServer: jest.fn(() => false),
}));

describe("pages/about-us/case-studies/index.tsx", () => {
  it("renders title", async () => {
    const { container } = renderWithProviders()(
      <OaksCaseStudyList topNav={topNavFixture} />,
    );

    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("returns data when enabled", async () => {
      (isFeatureFlagEnabledServer as jest.Mock).mockImplementation(
        (_cookies, flag) => {
          return flag === "case-studies-v2" ? true : false;
        },
      );

      const propsResult = await getServerSideProps({
        req: {
          cookies: {},
        },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });

    it("returns not-found when not enabled", async () => {
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
