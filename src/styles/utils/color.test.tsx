import styled from "styled-components";
import { render } from "@testing-library/react";

import color, { ColorProps } from "./color";

describe("color", () => {
  test("should correctly handle prop 'color' as string", async () => {
    const StyledComponent = styled.div<ColorProps>`
      ${color}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" color="calmAndWarm" />
    );

    expect(getByTestId("test")).toHaveStyle("color: #ffd166");
  });
  test("should correctly handle prop 'color' as array", async () => {
    const StyledComponent = styled.div<ColorProps>`
      ${color}
    `;
    const { getByTestId } = render(
      // eslint-disable-next-line
      // @ts-ignore
      <StyledComponent data-testid="test" color={["black"]} />
    );

    expect(getByTestId("test")).toHaveStyle("color: #000");
  });
});
