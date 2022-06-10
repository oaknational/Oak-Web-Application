import styled from "styled-components";
import { render } from "@testing-library/react";

import position from "./position";

describe("typography", () => {
  test("should correctly handle prop 'position' as string", async () => {
    const StyledComponent = styled.div`
      ${position}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" position="absolute" />
    );

    expect(getByTestId("test")).toHaveStyle("position: absolute");
  });

});
