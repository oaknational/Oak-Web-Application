import styled from "styled-components";
import { render } from "@testing-library/react";

import type { ImageSizeProps } from "./imageSize";
import imageSize from "./imageSize";

describe("size", () => {
  test.each([
    ["$imageWidth", 31, "width: 1.938rem;"],
    ["$imageHeight", 20, "height: 1.25rem;"],
  ])("should correctly handle prop", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div<ImageSizeProps>`
      ${imageSize}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />,
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
});
