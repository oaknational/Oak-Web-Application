import styled from "styled-components";
import { render } from "@testing-library/react";

import { margin, MarginProps, padding, PaddingProps } from "./spacing";

describe("spacing", () => {
  test("should correctly handle prop 'ma'", async () => {
    const StyledComponent = styled.div<MarginProps>`
      ${margin}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $ma={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("margin-left: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("margin-top: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("margin-bottom: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("margin-right: 0.75rem");
  });
  test("should correctly handle prop 'mv'", async () => {
    const StyledComponent = styled.div<MarginProps>`
      ${margin}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $mv={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("margin-top: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("margin-bottom: 0.75rem");
  });
  test("should correctly handle prop 'mh'", async () => {
    const StyledComponent = styled.div<MarginProps>`
      ${margin}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $mh={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("margin-left: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("margin-right: 0.75rem");
  });
  test("should correctly handle prop 'pv'", async () => {
    const StyledComponent = styled.div<PaddingProps>`
      ${padding}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $pv={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("padding-top: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("padding-bottom: 0.75rem");
  });
  test("should correctly handle prop 'ph'", async () => {
    const StyledComponent = styled.div<PaddingProps>`
      ${padding}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $ph={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("padding-right: 0.75rem");
  });
  test("should correctly handle prop 'pa'", async () => {
    const StyledComponent = styled.div<PaddingProps>`
      ${padding}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $pa={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("padding-top: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("padding-bottom: 0.75rem");
    expect(getByTestId("test")).toHaveStyle("padding-right: 0.75rem");
  });
  test.each([
    ["$pl", "1em", "padding-left: 1em;"],
    ["$pr", "1em", "padding-right: 1em;"],
    ["$pt", "1em", "padding-top: 1em;"],
    ["$pb", "1em", "padding-bottom: 1em;"],
    ["$ml", "1em", "margin-left: 1em;"],
    ["$mr", "1em", "margin-right: 1em;"],
    ["$mt", "1em", "margin-top: 1em;"],
    ["$mb", "1em", "margin-bottom: 1em;"],
  ])("should correctly handle prop '%s'", (prop, value, expected) => {
    const props = {
      [prop]: value,
    };

    const StyledComponent = styled.div<MarginProps & PaddingProps>`
      ${margin}
      ${padding}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" {...props} />,
    );

    expect(getByTestId("test")).toHaveStyle(expected);
  });
});
