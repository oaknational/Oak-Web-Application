import Banners from "./Banners";

import render from "@/__tests__/__helpers__/renderWithTheme";

const mockFeatureFlagEnabled = jest.fn();
jest.mock("posthog-js/react", () => {
  return {
    useFeatureFlagEnabled: () => mockFeatureFlagEnabled(),
  };
});

describe("Banners", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("shows oaks impact banner", async () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("Oak is now used in 72% of schools");
    expect(container).toMatchSnapshot();
  });
});
