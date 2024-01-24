import { describe, expect, it } from "vitest";

import HopePageTabButtonLabelWithScreenReaderTitle from "./HopePageTabButtonLabelWithScreenReaderTitle";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("HopePageTabButtonLabelWithScreenReaderTitle", () => {
  it("should have correct default styles", () => {
    const { getByText } = renderWithTheme(
      <HopePageTabButtonLabelWithScreenReaderTitle>
        Test
      </HopePageTabButtonLabelWithScreenReaderTitle>,
    );
    const span = getByText("Test");
    expect(span).toHaveStyle("font-family: Lexend,sans-serif");
    expect(span).toHaveStyle(`font-size: 1rem`);
  });
});
