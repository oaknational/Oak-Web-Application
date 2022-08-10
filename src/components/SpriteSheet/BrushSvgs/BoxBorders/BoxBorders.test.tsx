import { isInaccessible } from "@testing-library/react";

import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import BoxBorders from ".";

describe("BoxBorders", () => {
  test("should be excluded from the accessibility API", () => {
    const { getByTestId } = renderWithProviders(<BoxBorders />);

    const element = getByTestId("brush-borders");
    expect(isInaccessible(element)).toBe(true);
  });
});
