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
});
