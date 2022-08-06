import {
  css,
  DefaultTheme,
  Interpolation,
  ThemedStyledProps,
} from "styled-components";

import truthy from "../../utils/truthy";
import { PropsWithTheme } from "../theme";

const breakpointsByName = {
  small: 800,
  large: 1200,
};
const breakpoints = Object.values(breakpointsByName);
export const getBreakpoint = (
  breakpointName: keyof typeof breakpointsByName
) => {
  return breakpointsByName[breakpointName];
};

export type ResponsiveValues<Value> = Value | Value[];

const responsive =
  <Props, T extends string | number | undefined | null>(
    attr: string,
    getValues: (props: Props) => ResponsiveValues<T | undefined | null>,
    parse:
      | ((unparsed: T | undefined | null) => string | number | undefined | null)
      | ((
          unparsed: T | undefined | null
        ) => (props: PropsWithTheme) => string | number | undefined | null) = (
      x
    ) => x
  ) =>
  (props: Props): Interpolation<ThemedStyledProps<Props, DefaultTheme>> => {
    const attrCss = (value: T | undefined | null) =>
      typeof value === "undefined"
        ? undefined
        : css`
            ${attr}: ${parse(value)};
          `;
    const values = getValues(props);
    if (typeof values === "undefined") {
      return undefined;
    }
    if (!Array.isArray(values)) {
      return css`
        ${attrCss(values)}
      `;
    }
    if (values.length === 0) {
      return [];
    }

    return [
      css`
        ${attrCss(values[0])}
      `,
      ...breakpoints
        .slice(0, values.length)
        .map((breakpoint, i) => {
          const value = values[i + 1]; // Values are shifted relative to breakpoints

          if (value === undefined) {
            return undefined;
          }

          return css`
            @media (min-width: ${breakpoint}px) {
              ${css`
                ${attrCss(value)}
              `}
            }
          `;
        })
        .filter(truthy),
    ];
  };

export default responsive;
