import styled from "styled-components";
import { render } from "@testing-library/react";

import zIndex, { ZIndexProps } from "./zIndex";

describe("zIndex", () => {
  test("should correctly handle prop 'zIndex' as string", async () => {
    const StyledComponent = styled.div<ZIndexProps>`
      ${zIndex}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $zIndex="inFront" />,
    );

    expect(getByTestId("test")).toHaveStyle("z-index: 1");
  });
  test("should correctly handle prop 'zIndex' as array", async () => {
    const StyledComponent = styled.div<ZIndexProps>`
      ${zIndex}
    `;
    const { getByTestId } = render(
      // eslint-disable-next-line
      // @ts-ignore
      <StyledComponent data-testid="test" $zIndex={["neutral"]} />,
    );

    expect(getByTestId("test")).toHaveStyle("z-index: 0");
  });
});
