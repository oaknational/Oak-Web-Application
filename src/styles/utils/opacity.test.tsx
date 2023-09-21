import styled from "styled-components";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import opacity, { OpacityProps } from "./opacity";

describe("opacity", () => {
  test("should correctly handle prop 'opacity' as string", async () => {
    const StyledComponent = styled.div<OpacityProps>`
      ${opacity}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $opacity={0.2} />
    );

    expect(getByTestId("test")).toHaveStyle("opacity: 0.2");
  });
  test("should correctly handle prop 'opacity' as array", async () => {
    const StyledComponent = styled.div<OpacityProps>`
      ${opacity}
    `;
    const { getByTestId } = renderWithTheme(
      // eslint-disable-next-line
      // @ts-ignore
      <StyledComponent data-testid="test" $opacity={[0.6]} />
    );

    expect(getByTestId("test")).toHaveStyle("opacity: 0.6");
  });
});
