import { isInaccessible } from "@testing-library/react";

import renderWithTheme from "../../../../__tests__/__helpers__/renderWithTheme";

import BoxBorders from ".";

describe("BoxBorders", () => {
  test("should be excluded from the accessibility API", () => {
    const { getByTestId } = renderWithTheme(<BoxBorders />);

    const element = getByTestId("brush-borders");
    expect(isInaccessible(element)).toBe(true);
  });
});
