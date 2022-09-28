import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Span from "./Span";

describe("Span", () => {
  test("should apply font-family from props", () => {
    const { getByText } = renderWithTheme(<Span $font="body-1">Test</Span>);
    const span = getByText("Test");
    expect(span).toHaveStyle("font-family: Lexend,sans-serif");
    expect(span).toHaveStyle(`font-size: 18px`);
    expect(span).toHaveStyle(`line-height: 28px`);
    expect(span).toHaveStyle(`font-weight: 300`);
    expect(span).toHaveStyle(`letter-spacing: -0.005em`);
  });
});
