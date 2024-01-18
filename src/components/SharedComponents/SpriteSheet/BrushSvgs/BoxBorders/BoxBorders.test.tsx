import { describe, expect, it } from "vitest";
import { isInaccessible } from "@testing-library/react";

import BoxBorders from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("BoxBorders", () => {
  it("should be excluded from the accessibility API", () => {
    const { getByTestId } = renderWithTheme(<BoxBorders />);

    const element = getByTestId("brush-borders");
    expect(isInaccessible(element)).toBe(true);
  });
});
