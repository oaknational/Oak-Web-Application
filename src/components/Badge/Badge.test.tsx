import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Badge from ".";

describe("components/Badge", () => {
  test("should be the correct size (from theme)", async () => {
    const { getByTestId } = renderWithProviders(
      <Badge data-testid="test" text="Win" />
    );

    expect(getByTestId("test")).toHaveStyle("width: 54px");
    expect(getByTestId("test")).toHaveStyle("height: 54px");
  });
});
