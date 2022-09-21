import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Typography from "./Typography";

describe("Typography", () => {
  test("Typography should be the correct size", async () => {
    const { getByTestId } = renderWithTheme(
      <Typography data-testid="test" $fontSize={12} />
    );

    expect(getByTestId("test")).toHaveStyle("font-size: 12px");
  });
});
