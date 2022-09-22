import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Span from "./Span";

describe("Span", () => {
  test("should apply font-family from props", () => {
    const { getByText } = renderWithTheme(<Span $fontFamily="body">Test</Span>);
    expect(getByText("Test")).toHaveStyle("font-family: Lexend,sans-serif;");
  });
});
