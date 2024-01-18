import P from "./P";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("P", () => {
  it("should set the correct font-family", () => {
    const { getByTestId } = renderWithTheme(
      <P data-testid="paragraph">Here is some paragraph text</P>,
    );
    expect(getByTestId("paragraph")).toHaveStyle(
      "font-family: Lexend,sans-serif",
    );
  });
});
