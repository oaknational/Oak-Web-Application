import { screen } from "@testing-library/dom";
import { GetServerSidePropsContext } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, { getServerSideProps } from "@/pages/about-us/oaks-impact";

const mockGetFeatureFlag = jest.fn();

jest.mock("@/node-lib/posthog/getFeatureFlag", () => ({
  __esModule: true,
  getFeatureFlag: () => mockGetFeatureFlag(),
}));

jest.mock("@/node-lib/posthog/getPosthogId", () => ({
  __esModule: true,
  getPosthogIdFromCookie: jest.fn().mockReturnValue("test-id"),
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    topNav: () => jest.fn().mockResolvedValue(topNavFixture)(),
  },
}));

afterAll(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("pages/about-us/oaks-impact.tsx", () => {
  it("renders title when feature flag is enabled", async () => {
    mockGetFeatureFlag.mockResolvedValue(true);

    const { container } = renderWithProviders()(
      <OaksImpact topNav={topNavFixture} />,
    );

    const heading = await screen.findByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe("getServerSideProps", () => {
    it("should return props data when feature flag is enabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(true);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });
    it("should return not found when feature flag is disabled", async () => {
      mockGetFeatureFlag.mockResolvedValue(false);

      const propsResult = await getServerSideProps({
        req: { cookies: {} },
      } as GetServerSidePropsContext);

      expect(propsResult).toMatchObject({
        notFound: true,
      });
    });
  });
});
