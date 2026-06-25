import { screen } from "@testing-library/dom";
import { GetStaticPropsContext } from "next";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact, { getStaticProps } from "@/pages/about-us/oaks-impact";

const mockFeatureFlagEnabled = jest.fn();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
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
    mockFeatureFlagEnabled.mockReturnValue(true);

    const { container } = renderWithProviders()(
      <OaksImpact topNav={topNavFixture} />,
    );

    const heading = await screen.findByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders 404 when feature flag is disabled", async () => {
    mockFeatureFlagEnabled.mockReturnValue(false);

    const { container } = renderWithProviders()(
      <OaksImpact topNav={topNavFixture} />,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  describe("getStaticProps", () => {
    it("should return props data", async () => {
      const propsResult = await getStaticProps({
        params: {},
      } as unknown as GetStaticPropsContext);

      expect(propsResult).toMatchObject({
        props: {
          topNav: topNavFixture,
        },
      });
    });
  });
});
