import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Text from "./Text";

describe("Text", () => {
  test("Text should be the correct size", async () => {
    const { getByTestId } = renderWithProviders(
      <Text data-testid="test" fontSize={12} />
    );

    expect(getByTestId("test")).toHaveStyle("font-size: 12px");
  });
  test.todo("p descendants should inherit correct attributes");
});
