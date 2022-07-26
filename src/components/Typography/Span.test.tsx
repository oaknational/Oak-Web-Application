import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Span from "./Span";

describe("Span", () => {
  test("should apply font-family from props", () => {
    const { getByText } = renderWithProviders(
      <Span $fontFamily="body">Test</Span>
    );
    expect(getByText("Test")).toHaveStyle("font-family: ABeeZee,sans-serif;");
  });
});
