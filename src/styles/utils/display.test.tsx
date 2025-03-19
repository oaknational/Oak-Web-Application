import { render } from "@testing-library/react";
import styled from "styled-components";

import display, { DisplayProps } from "./display";

describe("display", () => {
  test("should correctly handle prop 'display' as string", async () => {
    const StyledComponent = styled.div<DisplayProps>`
      ${display}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $display="block" />,
    );

    expect(getByTestId("test")).toHaveStyle("display: block");
  });
  test("should correctly handle prop 'display' as array", async () => {
    const StyledComponent = styled.div<DisplayProps>`
      ${display}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $display={["inline", "block"]} />,
    );

    expect(getByTestId("test")).toHaveStyle("display: inline");
  });
});
