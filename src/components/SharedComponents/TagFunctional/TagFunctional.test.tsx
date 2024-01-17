import { TagFunctional } from "./TagFunctional";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Component - tag functional", () => {
  test("renders tag name", () => {
    const { getByText } = renderWithTheme(
      <TagFunctional color="pink" text="Tag Title" />,
    );
    const tag = getByText("Tag Title");
    expect(tag).toBeInTheDocument();
  });
});
