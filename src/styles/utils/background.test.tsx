import styled from "styled-components";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import background from "./background";

describe("background", () => {
  test("should correctly handle prop 'background' as string", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" background="calmAndWarm" />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #333");
  });
  test("should correctly handle prop 'background' as array", async () => {
    const StyledComponent = styled.div`
      ${background}
    `;
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" background={["calmAndWarm"]} />
    );

    expect(getByTestId("test")).toHaveStyle("background-color: #ffd166");
    expect(getByTestId("test")).toHaveStyle("color: #333");
  });
});
