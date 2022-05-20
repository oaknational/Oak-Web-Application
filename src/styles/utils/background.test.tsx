import styled from "styled-components";
import { render } from "@testing-library/react";

import background from "./background";

describe("background", () => {
  test("should correctly handle prop 'background' as string", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" background="calmAndWarm" />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #303030");
  });
  test("should correctly handle prop 'background' as array", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" background={["calmAndWarm"]} />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #303030");
  });
});
