import styled from "styled-components";
import { render } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import border, { BorderProps } from "./border";

describe("border", () => {
  test("should correctly handle prop 'ba' as number", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $ba={12} />,
    );

    expect(getByTestId("test")).toHaveStyle(
      "border: 12px solid rgb(34, 34, 34)",
    );
  });

  test("should correctly handle prop 'bv' as number", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $bv={12} />,
    );

    expect(getByTestId("test")).toHaveStyle(
      "border-top: 12px solid rgb(34, 34, 34)",
    );
    expect(getByTestId("test")).toHaveStyle(
      "border-bottom: 12px solid rgb(34, 34, 34)",
    );
  });

  test("should correctly handle prop 'bh' as number", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $bh={12} />,
    );

    expect(getByTestId("test")).toHaveStyle(
      "border-left: 12px solid rgb(34, 34, 34)",
    );
    expect(getByTestId("test")).toHaveStyle(
      "border-right: 12px solid rgb(34, 34, 34)",
    );
  });

  test("should correctly handle prop 'bt'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;

    expect(() => renderWithTheme(<StyledComponent $bt={12} />)).not.toThrow();
  });

  test("should correctly handle prop 'br'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;

    expect(() => renderWithTheme(<StyledComponent $br={12} />)).not.toThrow();
  });

  test("should correctly handle prop 'bb'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;

    expect(() => renderWithTheme(<StyledComponent $bb={12} />)).not.toThrow();
  });

  test("should correctly handle prop 'bl'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;

    expect(() => renderWithTheme(<StyledComponent $bl={12} />)).not.toThrow();
  });

  test("should correctly handle prop 'borderColor'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $borderColor={"grey40"} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-color: rgb(147, 148, 156)");
  });

  test("should correctly handle prop 'borderRadius'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $borderRadius={32} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-radius: 32px");
  });
});
