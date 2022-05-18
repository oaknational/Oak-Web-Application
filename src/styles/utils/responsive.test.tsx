import styled, {
  css,
  DefaultTheme,
  FlattenSimpleInterpolation,
  Interpolation,
  ThemedStyledProps,
} from "styled-components";
import { render } from "@testing-library/react";

import responsive from "./responsive";

type TestProps = { pl: number | number[] | string | string[] };
/**
 *
 * @description outputs from styled-components css function can vary in value
 * whilst still representing the same css.
 * For this reason we need to "simplify" the css that we get from responsive
 * in order to compare it with the expected css values.
 */
const simplify = (
  cssArray:
    | FlattenSimpleInterpolation
    | Interpolation<ThemedStyledProps<TestProps, DefaultTheme>>
) =>
  Array.isArray(cssArray)
    ? cssArray
        ?.flatMap((str: unknown) =>
          typeof str === "string" ? str.trim() : str
        )
        .flat()
        .join("")
        .replace(/([^0-9a-zA-Z.#])\s+/g, "$1")
        .replace(/\s([^0-9a-zA-Z.#]+)/g, "$1")
        .replace(/;}/g, "}")
        .replace(/\/\*.*?\*\//g, "")
        .trim()
    : "";
const pxOrUndefined = (value: number | unknown) =>
  typeof value === "number" ? `${value}px` : undefined;

describe("responsive", () => {
  it("should correctly handle a single value", async () => {
    const props = {
      pl: 12,
    };
    const styles = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined
    )(props);
    const StyledComponent = styled.div`
      ${styles}
    `;
    const { getByTestId } = render(
      <StyledComponent data-testid="test" pl={12} />
    );

    expect(getByTestId("test")).toHaveStyle("padding-left: 12px");
  });
  it("should correctly handle array of values", async () => {
    const props = {
      pl: [0, 12],
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined
    )(props);
    const expected = css`
      padding-left: 0px;
      @media (min-width: 100px) {
        padding-left: 12px;
      }
    `;

    expect(simplify(actual)).toEqual(simplify(expected));
  });
  it("should handle the case where the last value is a zero", async () => {
    const props = {
      pl: [36, 0],
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl,
      pxOrUndefined
    )(props);
    const expected = css`
      padding-left: 36px;
      @media (min-width: 100px) {
        padding-left: 0px;
      }
    `;
    expect(simplify(actual)).toEqual(simplify(expected));
  });
  it("should default parseValue to be identity fn", () => {
    const props = {
      pl: "0.5em",
    };

    const actual = responsive(
      "padding-left",
      (props: TestProps) => props.pl
    )(props);
    const expected = css`
      padding-left: 0.5em;
    `;
    expect(simplify(actual)).toEqual(simplify(expected));
  });
});
