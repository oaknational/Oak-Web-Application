import { isInaccessible } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import BrushBorders from ".";

describe("BrushBorders", () => {
  test("should be excluded from the accessibility API", () => {
    const { getByTestId } = renderWithProviders(<BrushBorders />);

    const element = getByTestId("brush-borders");
    expect(isInaccessible(element)).toBe(true);
  });
});
