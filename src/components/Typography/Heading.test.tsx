import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Heading, { HeadingFontSize, HeadingTag } from "./Heading";

describe("Heading", () => {
  test.each([["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"]])(
    "should correctly render %s tag",
    (tag) => {
      const { getByRole } = renderWithProviders(
        <Heading tag={tag as HeadingTag} fontSize={32} />
      );

      expect(getByRole("heading", { level: 1 })).toBeTruthy();
    }
  );
  test.each([32, 46])("should render font-size %spx", (fontSize) => {
    const { getByTestId } = renderWithProviders(
      <Heading
        data-testid="test"
        fontSize={fontSize as HeadingFontSize}
        tag="h1"
      />
    );

    expect(getByTestId("test")).toHaveStyle(`font-size: ${fontSize}px`);
  });
});
