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
  test("shows mythbusting banner", async () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("Learn why");
    expect(container).toMatchSnapshot();
  });
});
