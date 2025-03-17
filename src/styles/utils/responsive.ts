import { css } from "styled-components";

import truthy from "../../utils/truthy";
import { PropsWithTheme } from "../theme";

const breakpointsByName = {
  small: 750,
  large: 1280,
};
export const breakpoints = Object.values(breakpointsByName).sort((a, b) =>
  a > b ? 1 : -1,
);
export interface BreakpointName {
  [key: string]: string | number;
}
export const getBreakpoint = (
  breakpointName: keyof typeof breakpointsByName,
) => {
  return breakpointsByName[breakpointName];
};
export type Device = "mobile" | "tablet" | "desktop";
const mediaQueries: Record<Device, string> = {
  mobile: `(max-width: ${getBreakpoint("small") - 1}px)`,
  tablet: `(min-width: ${getBreakpoint("small")}px and max-width: ${
    getBreakpoint("large") - 1
  }px)`,
  desktop: `(min-width: ${getBreakpoint("large")}px)`,
};
export const getMediaQuery = (device: Device) => {
  return mediaQueries[device];
};
export type ResponsiveValues<Value> = (Value | null) | (Value | null)[];

/**
 * A utility function that creates responsive CSS rules.
 * Updated to work with styled-components v6.
 */
const responsive =
  <Props extends object, T extends string | number | undefined | null>(
    attr: string,
    getValues: (props: Props) => ResponsiveValues<T | undefined | null>,
    parse:
      | ((unparsed: T | undefined | null) => string | number | undefined | null)
      | ((
          unparsed: T | undefined | null,
        ) => (props: PropsWithTheme) => string | number | undefined | null) = (
      x,
    ) => x,
  ) =>
  (props: Props): any => {
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
