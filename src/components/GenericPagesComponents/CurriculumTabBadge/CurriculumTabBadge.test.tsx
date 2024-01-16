import CurriculumTabBadge from ".";

import theme from "@/styles/theme/default.theme";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("components/CurriculumTabBadge", () => {
  test("should be the correct size (from theme)", async () => {
    const { getByTestId } = renderWithTheme(
      <CurriculumTabBadge data-testid="test" text="Win" />,
    );

    expect(getByTestId("test")).toHaveStyle(`width: ${theme.badge.size}`);
    expect(getByTestId("test")).toHaveStyle(`height: ${theme.badge.size}`);
  });
});
