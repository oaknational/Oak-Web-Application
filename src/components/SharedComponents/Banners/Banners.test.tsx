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
  test("shows curriculum banner when feature flag is disabled", async () => {
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("See curriculum plans");
    expect(container).toMatchSnapshot();
  });
  test("shows mythbusting banner when mythbusting campaign feature flag enabled", async () => {
    mockFeatureFlagEnabled.mockReturnValue(true);
    const { container } = render(<Banners />);
    expect(container).toHaveTextContent("Learn why");
    expect(container).toMatchSnapshot();
  });
  test("when hideIfFeatureFlagDisabled is true and mythbusting campaign disabled", async () => {
    const { container } = render(<Banners hideIfFeatureFlagDisabled />);
    expect(container).toBeEmptyDOMElement();
    expect(container).toMatchSnapshot();
  });
});
