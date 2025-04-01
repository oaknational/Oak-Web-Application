import styled from "styled-components";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import type { BackgroundProps } from "./background";
import background from "./background";

describe("background", () => {
  test("should correctly handle prop 'background' as string", async () => {
    const StyledComponent = styled.div<BackgroundProps>`
      ${background}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $background="oakGreen" />,
    );

    expect(getByTestId("test")).toHaveStyle(
      "background-color: rgb(40, 124, 52)",
    );
    expect(getByTestId("test")).toHaveStyle("color: rgb(255, 255, 255)");
  });
  test("should correctly handle prop 'background' as array", async () => {
    const StyledComponent = styled.div<BackgroundProps>`
      ${background}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $background={["lavender50"]} />,
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #c6d1ef");
    expect(getByTestId("test")).toHaveStyle("color: rgb(34, 34, 34)");
  });
});
