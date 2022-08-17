import styled from "styled-components";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import typography from "./typography";

const StyledComponent = styled.div`
  ${typography}
`;

describe("typography", () => {
  test("should correctly handle prop $fontFamily='body'", async () => {
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" $fontFamily="body" />
    );

    expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
  });
  test("should correctly handle prop $fontFamily='ui'", async () => {
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" $fontFamily="ui" />
    );

    expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
  });
  test("should correctly handle prop $fontFamily='ui'", async () => {
    const { getByTestId } = renderWithProviders(
      <StyledComponent data-testid="test" $fontFamily="heading" />
    );

    expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
  });
});
