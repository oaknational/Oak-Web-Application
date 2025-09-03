import { screen } from "@testing-library/dom";

import { SaveCount } from "./SaveCount";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";

const mockUseFeatureFlagEnabled = jest.fn();
jest.mock("posthog-js/react", () => ({
  ...jest.requireActual("posthog-js/react"),
  useFeatureFlagEnabled: () => mockUseFeatureFlagEnabled(),
}));

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: jest.fn(() => ({
    data: 10,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe("SaveCount", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
    mockUseFeatureFlagEnabled.mockReturnValue(true);
  });
  it("renders nothing when the feature flag is disabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(false);
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.queryByTestId("save-count");
    expect(saveCount).not.toBeInTheDocument();
  });
  it("renders the save count when the feature flag is enabled", () => {
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.getByText("10");
    expect(saveCount).toBeInTheDocument();
  });
  it('links to the "my-library" page', () => {
    renderWithProviders()(<SaveCount />);
    const saveCount = screen.getByText("10");
    expect(saveCount.closest("a")).toHaveAttribute(
      "href",
      "/teachers/my-library",
    );
  });
  it("resets count to 0 when a user signs out", () => {
    const { rerender } = renderWithProviders()(<SaveCount />);
    const saveCount = screen.getByText("10");
    expect(saveCount).toBeInTheDocument();
    setUseUserReturn(mockLoggedOut);
    rerender(<SaveCount />);
    const resetSaveCount = screen.queryByText("0");
    expect(resetSaveCount).toBeInTheDocument();
  });
});
