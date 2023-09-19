import TagFunctional, { COLOR_OPTIONS } from "./TagFunctional";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - tag functional", () => {
  test("renders tag name", () => {
    const { getByText } = renderWithTheme(
      <TagFunctional>Tag Title</TagFunctional>,
    );
    const tag = getByText("Tag Title");
    expect(tag).toBeInTheDocument();
  });

  test.each(Object.keys(COLOR_OPTIONS))(
    "accepts color as background: %s",
    (color) => {
      const { getByText } = renderWithTheme(
        <TagFunctional $background={color}>Test</TagFunctional>,
      );
      const tag = getByText("Test");
      const colorPair = COLOR_OPTIONS[color as keyof typeof COLOR_OPTIONS];
      if (!colorPair || colorPair.length !== 2) {
        throw new Error(`Color ${color} is not defined`);
      }
      expect(tag).toBeInTheDocument();
    },
  );
});
