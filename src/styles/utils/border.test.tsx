import styled from "styled-components";
import { render } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import type { BorderProps } from "./border";
import { border } from "./border";

describe("border", () => {
  test("should correctly handle prop 'ba'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $ba={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-left: 0.75rem solid");
    expect(getByTestId("test")).toHaveStyle("border-top: 0.75rem solid");
    expect(getByTestId("test")).toHaveStyle("border-bottom: 0.75rem solid");
    expect(getByTestId("test")).toHaveStyle("border-right: 0.75rem solid");
  });
  test("should correctly handle prop 'bv'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $bv={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-top: 0.75rem solid");
    expect(getByTestId("test")).toHaveStyle("border-bottom: 0.75rem solid");
  });
  test("should correctly handle prop 'bh'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $bh={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-left: 0.75rem solid");
    expect(getByTestId("test")).toHaveStyle("border-right: 0.75rem solid");
  });

  test.each([
    ["$bl", "1px", "border-left: 0.063rem solid"],
    ["$br", "1px", "border-right: 0.063rem solid"],
    ["$bt", "1em", "border-top: 1em solid"],
    ["$bb", "1px", "border-bottom: 0.063rem solid"],
  ])("should correctly handle prop '%s'", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />,
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
  test("should correctly handle prop 'borderColor'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $borderColor={"grey40"} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-color: #cacaca");
  });
  test("should correctly handle prop 'borderRadius'", async () => {
    const StyledComponent = styled.div<BorderProps>`
      ${border}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $borderRadius={32} />,
    );

    expect(getByTestId("test")).toHaveStyle("border-radius: 2rem");
  });
});
