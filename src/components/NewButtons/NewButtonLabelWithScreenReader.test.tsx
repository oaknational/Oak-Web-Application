import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import ButtonLabel from "./NewButtonLabelWithScreenReaderTitle";

describe("Span", () => {
  test("should have correct default styles", () => {
    const { getByText } = renderWithTheme(<ButtonLabel>Test</ButtonLabel>);
    const span = getByText("Test");
    expect(span).toHaveStyle("font-family: Lexend,sans-serif");
    expect(span).toHaveStyle(`font-size: 1rem`);
  });
});
