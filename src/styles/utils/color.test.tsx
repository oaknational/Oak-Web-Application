import styled from "styled-components";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import color, { ColorProps } from "./color";

describe("color", () => {
  test("should correctly handle prop 'color' as string", async () => {
    const StyledComponent = styled.div<ColorProps>`
      ${color}
    `;
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" color="teachersLilac" />
    );

    expect(getByTestId("test")).toHaveStyle("color: #c6d1ef");
  });
  test("should correctly handle prop 'color' as array", async () => {
    const StyledComponent = styled.div<ColorProps>`
      ${color}
    `;
    const { getByTestId } = renderWithProviders(
      // eslint-disable-next-line
      // @ts-ignore
      <StyledComponent data-testid="test" color={["black"]} />
    );

    expect(getByTestId("test")).toHaveStyle("color: rgb(0, 0, 0)");
  });
});
