import { render } from "@testing-library/react";
import styled from "styled-components";

import position, { PositionProps } from "./position";

describe("position", () => {
  test("should correctly handle prop 'position' as string", async () => {
    const StyledComponent = styled.div<PositionProps>`
      ${position}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $position="absolute" />,
    );

    expect(getByTestId("test")).toHaveStyle("position: absolute");
  });
  test("should correctly handle prop 'position' as array", async () => {
    const StyledComponent = styled.div<PositionProps>`
      ${position}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $position={["fixed"]} />,
    );

    expect(getByTestId("test")).toHaveStyle("position: fixed");
  });
});
