import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Body from "./Body";

describe("Body", () => {
  test("Body should be the correct size", async () => {
    const { getByTestId } = renderWithProviders(
      <Body data-testid="test" fontSize={12} />
    );

    expect(getByTestId("test")).toHaveStyle("font-size: 12px");
  });
  test.todo("p descendants should inherit correct attributes");
});
