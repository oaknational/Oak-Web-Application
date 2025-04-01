import { css, type Interpolation, type StyleFunction } from "styled-components";

import truthy from "../../utils/truthy";
import type { PropsWithTheme } from "../theme";

// Having the key on both sides allows precise types.
const BREAKPOINTS = Object.freeze({
  small: { name: "small", value: 750 },
  large: { name: "large", value: 1280 },
} as const);
// Explicitly setting the sorted breakpoints allows better type safety in the code,
// at the cost of requiring a check at build time to ensure the breakpoints are in sync.
const SORTED_BREAKPOINTS = [750, 1280] as const;

type BreakpointMapping = typeof BREAKPOINTS;
type SortedBreakpoints = typeof SORTED_BREAKPOINTS;

/**
 * Build time check to ensure the sorted breakpoints and the breakpoints object are in sync
 * @param breakpointMapping
 * @param sortedBreakpoints
 * @returns void
 *
 * @throws {TypeError} if the breakpoints are not in sync
 */
function validateSortedBreakpoints(
  breakpointMapping: BreakpointMapping,
  sortedBreakpoints: SortedBreakpoints,
): void {
  const inSync = Object.values(breakpointMapping)
    .map(({ value }) => value)
    .every((value, index) => value === sortedBreakpoints[index]);

  if (!inSync) {
    throw new TypeError(
      `Breakpoints are not in sync:\nMapping: ${JSON.stringify(breakpointMapping)}\nSorted: ${JSON.stringify(sortedBreakpoints)}`,
    );
  }
}

// Should throw at build time if the breakpoint definitions are not in sync.
validateSortedBreakpoints(BREAKPOINTS, SORTED_BREAKPOINTS);

function getBreakpointFromName<K extends keyof BreakpointMapping>(
  key: K,
): BreakpointMapping[K]["value"] {
  return BREAKPOINTS[key]["value"];
}
// Aliases for backwards compatibility
export const getBreakpoint = getBreakpointFromName;
export const breakpoints = SORTED_BREAKPOINTS;

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

// Return type that aligns with styled-components' expectations
export type ResponsiveReturn<P extends object> = Interpolation<P>;

/**
 * Create a responsive CSS property that adapts to different screen sizes.
 * This implementation is directly compatible with styled-components v6.
 *
 * @param attr CSS property name (e.g., "padding-left")
 * @param getValues Function to extract values from props
 * @param parse Optional parser for the values
 * @returns A function that returns styled-components compatible interpolation
 */
function responsive<
  Props extends object,
  T extends string | number | undefined | null,
>(
  attr: string,
  getValues: (props: Props) => ResponsiveValues<T | undefined | null>,
  parse:
    | ((unparsed: T | undefined | null) => string | number | undefined | null)
    | ((
        unparsed: T | undefined | null,
      ) => (props: PropsWithTheme) => string | number | undefined | null) = (
    x,
  ) => x,
): StyleFunction<Props> {
  return (props) => {
    // Helper function to create a CSS rule for a value
    const createCssRule = (value: T | undefined | null) => {
      if (typeof value === "undefined") {
        return undefined;
      }

      return css`
        ${attr}: ${parse(value)};
      `;
    };

    const values = getValues(props);

    if (typeof values === "undefined") {
      return undefined;
    }

    if (!Array.isArray(values)) {
      return css`
        ${createCssRule(values)}
      `;
    }

    if (values.length === 0) {
      return [];
    }

    // For array values, build a responsive array of CSS rules
    const cssRules = [];

    // Add the base rule for the first value
    const firstRule = createCssRule(values[0]);
    if (firstRule) {
      cssRules.push(css`
        ${firstRule}
      `);
    }

    // Add media queries for subsequent values
    for (let i = 0; i < Math.min(values.length - 1, breakpoints.length); i++) {
      const value = values[i + 1];
      const breakpoint = breakpoints[i];

      if (value !== undefined) {
        const rule = createCssRule(value);
        if (rule) {
          cssRules.push(css`
            @media (min-width: ${breakpoint}px) {
              ${rule}
            }
          `);
        }
      }
    }

    return cssRules.length > 0 ? cssRules : undefined;
  };
}

export default responsive;
