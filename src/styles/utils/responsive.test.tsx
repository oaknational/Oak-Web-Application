import { render } from "@testing-library/react";
import styled, { css, RuleSet, DefaultTheme } from "styled-components";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import responsive, { ResponsiveReturn } from "./responsive";

import { OakColorName } from "../theme";

// Simplified version of SizeValue from ../theme/types
type TestSizeValue = number | number[] | string | null;
interface TestProps {
  $pl?: TestSizeValue;
  pl?: TestSizeValue;
  pr?: TestSizeValue;
  pt?: TestSizeValue;
  pb?: TestSizeValue;
  ml?: TestSizeValue;
  mr?: TestSizeValue;
  mt?: TestSizeValue;
  mb?: TestSizeValue;
}

const StyledComponent = styled.div<TestProps>`
  ${({ $pl }) => css`
    padding-left: ${$pl}px;
  `}
`;

// Updated stringify function to handle styled-components v6 format changes
const stringify = (cssArray: ResponsiveReturn<TestProps>) => {
  if (!cssArray) {
    return "Oops, no cssArray";
  }
  // Convert to string, remove all whitespace, and remove commas that v6 adds
  return cssArray.toString().replace(/\s+/g, "").replace(/,/g, "");
};

const pxOrUndefined = (value: number | unknown) =>
  typeof value === "number" ? `${value}px` : undefined;

// Mock theme for tests
const mockTheme: DefaultTheme = {
  colors: {
    purple: "#845ad9",
  },
} as DefaultTheme;

describe("responsive", () => {
  it("should return css for a single value", () => {
    const { container } = render(
      <StyledComponent data-testid="test" $pl={12} />,
    );
    expect(container).toMatchSnapshot();
  });
  it("should correctly handle a single value", async () => {
    const props = {
      pl: 12,
      theme: mockTheme,
    };
    const styles = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined,
    )(props);
    const StyledComponent = styled.div<TestProps>`
      ${styles}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" $pl={12} />,
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 12px");
  });
  it("should correctly handle array of values", async () => {
    const props = {
      pl: [0, 12],
      theme: mockTheme,
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined,
    )(props);
    const expected = css`
      padding-left: 0px;

      @media (min-width: 750px) {
        padding-left: 12px;
      }
    `;

    expect(stringify(actual)).toEqual(stringify(expected));
  });
  it("should handle the case where the last value is a zero", async () => {
    const props = {
      pl: [36, 12, 0],
      theme: mockTheme,
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined,
    )(props);
    const expected = css`
      padding-left: 36px;

      @media (min-width: 750px) {
        padding-left: 12px;
      }

      @media (min-width: 1280px) {
        padding-left: 0px;
      }
    `;
    expect(stringify(actual)).toEqual(stringify(expected));
  });
  it("should default parse to be identity fn", () => {
    const props = {
      pl: "0.5em",
      theme: mockTheme,
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
    )(props);
    const expected = css`
      padding-left: 0.5em;
    `;
    expect(stringify(actual as RuleSet<object>)).toEqual(stringify(expected));
  });
  test("should handle when parse fn gets from theme", async () => {
    // Note that we don't need to provide a theme in the props,
    // it is provided by the renderWithTheme wrapper
    interface ThemedProps {
      $color?: OakColorName;
    }

    const StyledComponent = styled.div<ThemedProps>`
      ${responsive(
        "color",
        (props) => props.$color,
        (colorName) => (props) => props.theme.colors[colorName as OakColorName],
      )}
    `;
    const { getByTestId } = renderWithTheme(
      <StyledComponent data-testid="test" $color="purple" />,
    );

    expect(getByTestId("test")).toHaveStyle("color: #845ad9");
  });
  test.each([
    ["pl", "padding-left", "1em", "padding-left: 1em;"],
    ["pr", "padding-right", "1em", "padding-right: 1em;"],
    ["pt", "padding-top", "1em", "padding-top: 1em;"],
    ["pb", "padding-bottom", "1em", "padding-bottom: 1em;"],
    ["ml", "margin-left", "1em", "margin-left: 1em;"],
    ["mr", "margin-right", "1em", "margin-right: 1em;"],
    ["mt", "margin-top", "1em", "margin-top: 1em;"],
    ["mb", "margin-bottom", "1em", "margin-bottom: 1em;"],
  ])("should correctly handle prop %s", (prop, attr, value, expected) => {
    const props = {
      [prop as keyof TestProps]: value,
      theme: mockTheme,
    };

    const actual = responsive(
      attr,
      (props: TestProps) => props[prop as keyof TestProps],
    )(props);

    expect(stringify(actual)).toEqual(stringify(expected.replace(/\s+/g, "")));
  });
});
