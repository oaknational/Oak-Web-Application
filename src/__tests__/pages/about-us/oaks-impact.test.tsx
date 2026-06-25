import { screen } from "@testing-library/dom";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";
import OaksImpact from "@/pages/about-us/oaks-impact";

const mockFeatureFlagEnabled = jest.fn();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
}));

afterAll(() => {
  jest.clearAllMocks();
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
});
