import styled from "styled-components";
import { render } from "@testing-library/react";

import imageSize from "./imageSize";

describe("size", () => {
  test.each([
    ["$imageWidth", 31, "width: 31px;"],
    ["$imageHeight", 20, "height: 20px;"],
  ])("should correctly handle prop", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div`
      ${imageSize}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
});