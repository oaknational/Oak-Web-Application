import styled from "styled-components";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import background from "./background";

describe("background", () => {
  test("should correctly handle prop 'background' as string", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $background="pupilsGreen" />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #85cb6d");
    expect(getByTestId("test")).toHaveStyle("color: #000");
  });
  test("should correctly handle prop 'background' as array", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $background={["teachersLilac"]} />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #c6d1ef");
    expect(getByTestId("test")).toHaveStyle("color: #000");
  });
});
