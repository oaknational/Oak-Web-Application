import { screen } from "@testing-library/dom";

import { SaveCount } from "./SaveCount";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockUseFeatureFlagEnabled = jest.fn().mockReturnValue(false);
jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagEnabled: () => mockUseFeatureFlagEnabled(),
}));

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: jest.fn(() => ({
    data: 10,
    isLoading: false,
  })),
}));

describe("SaveCount", () => {
  it("renders nothing when the feature flag is disabled", () => {
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.queryByTestId("save-count");
    expect(saveCount).not.toBeInTheDocument();
  });
  it("renders the save count when the feature flag is enabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(true);
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.getByTestId("save-count");
    expect(saveCount).toBeInTheDocument();
    expect(saveCount).toHaveTextContent("10");
  });
  it('links to the "my-library" page', () => {
    mockUseFeatureFlagEnabled.mockReturnValue(true);
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.getByTestId("save-count");
    expect(saveCount.firstChild).toHaveAttribute(
      "href",
      "/teachers/my-library",
    );
  });
});
