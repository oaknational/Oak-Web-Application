import Badge from ".";

import theme from "@/styles/theme/default.theme";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("components/Badge", () => {
  test("should be the correct size (from theme)", async () => {
    const { getByTestId } = renderWithTheme(
      <Badge data-testid="test" text="Win" />
    );

    expect(getByTestId("test")).toHaveStyle(`width: ${theme.badge.size}`);
    expect(getByTestId("test")).toHaveStyle(`height: ${theme.badge.size}`);
  });
});
