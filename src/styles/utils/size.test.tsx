import styled from "styled-components";
import { render } from "@testing-library/react";

import size from "./size";

describe("size", () => {
  test.each([
    ["$width", "50%", "width: 50%;"],
    ["$height", 20, "height: 20px;"],
    ["$minWidth", 80, "min-width: 80px;"],
    ["$minHeight", 12, "min-height: 12px;"],
    ["$maxWidth", "100%", "max-width: 100%;"],
    ["$maxHeight", 80, "max-height: 80px;"],
  ])("should correctly handle prop '%s'", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div`
      ${size}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
});
