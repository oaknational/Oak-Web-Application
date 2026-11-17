import styled from "styled-components";
import { render } from "@testing-library/react";

import size, { SizeProps } from "./size";

describe("size", () => {
  test.each([
    ["$width", "50%", "width: 50%;"],
    ["$height", 20, "height: 1.25rem;"],
    ["$minWidth", 80, "min-width: 5rem;"],
    ["$minHeight", 12, "min-height: 0.75rem;"],
    ["$maxWidth", "100%", "max-width: 100%;"],
    ["$maxHeight", 80, "max-height: 5rem;"],
  ])("should correctly handle prop '%s'", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div<SizeProps>`
      ${size}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />,
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
});
