import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import P from "./P";

describe("P", () => {
  test("should set the correct font-family", () => {
    const { getByTestId } = renderWithTheme(
      <P data-testid="paragraph">Here is some paragraph text</P>,
    );
    expect(getByTestId("paragraph")).toHaveStyle(
      "font-family: Lexend,sans-serif",
    );
  });
});
