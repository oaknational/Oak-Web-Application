import {
  css,
  DefaultTheme,
  Interpolation,
  ThemedStyledProps,
} from "styled-components";

import truthy from "../../utils/truthy";
import { PropsWithTheme } from "../theme";

const breakpointsByName = {
  small: 600,
  medium: 900,
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
  <Props, T extends string | number | undefined>(
    attr: string,
    getValues: (props: Props) => ResponsiveValues<T | undefined>,
    parse:
      | ((unparsed: T | undefined) => string | number | undefined)
      | ((
          unparsed: T | undefined
        ) => (props: PropsWithTheme) => string | number | undefined) = (x) => x
  ) =>
  (props: Props): Interpolation<ThemedStyledProps<Props, DefaultTheme>> => {
    const attrCss = (value: T | undefined) =>
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
