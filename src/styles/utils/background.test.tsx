import styled from "styled-components";
import { render } from "@testing-library/react";

import background from "./background";

describe("spacing", () => {
  test("should correctly handle prop 'bg' as string", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" bg="calmAndWarm" />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #303030");
  });
  test("should correctly handle prop 'bg' as array", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" bg={["calmAndWarm"]} />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #303030");
  });
});
