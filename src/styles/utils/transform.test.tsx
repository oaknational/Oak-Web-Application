import styled from "styled-components";
import { render } from "@testing-library/react";

import transform, { TransformProps } from "./transform";

describe("transform", () => {
  test("should correctly handle prop 'transform' as string", async () => {
    const StyledComponent = styled.div<TransformProps>`
      ${transform}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $transform="translateY(20px)" />,
    );

    expect(getByTestId("test")).toHaveStyle("transform: translateY(20px)");
  });
  test("should correctly handle prop 'transform' as array", async () => {
    const StyledComponent = styled.div<TransformProps>`
      ${transform}
    `;
    const { getByTestId } = render(
      // eslint-disable-next-line
      // @ts-ignore
      <StyledComponent
        data-testid="test"
        $transform={["translateY(20px)", "translateY(40px)"]}
      />,
    );

    expect(getByTestId("test")).toHaveStyle("transform: translateY(20px)");
  });
});
