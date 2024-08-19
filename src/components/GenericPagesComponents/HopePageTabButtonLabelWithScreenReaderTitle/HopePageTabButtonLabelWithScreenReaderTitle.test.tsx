import HopePageTabButtonLabelWithScreenReaderTitle from "./HopePageTabButtonLabelWithScreenReaderTitle";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HopePageTabButtonLabelWithScreenReaderTitle", () => {
  test("should have correct default styles", () => {
    const { getByText } = renderWithTheme(
      <HopePageTabButtonLabelWithScreenReaderTitle>
        Test
      </HopePageTabButtonLabelWithScreenReaderTitle>,
    );
    const span = getByText("Test");
    expect(span).toHaveStyle(
      "font-family: --var(google-font),Lexend,sans-serif",
    );
    expect(span).toHaveStyle(`font-size: 1rem`);
  });
});
