import { css, type DefaultTheme, type Interpolation } from "styled-components";

import truthy from "../../utils/truthy";
import { PropsWithTheme } from "../theme";

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

export type ResponsiveReturn<P extends object> = Interpolation<
  P & { theme?: DefaultTheme }
>;

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
  (props: Props): ResponsiveReturn<Props> => {
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
      css<Props>`
        ${attrCss(values[0])}
      `,
      ...breakpoints
        .slice(0, values.length)
        .map((breakpoint, i) => {
          const value = values[i + 1]; // Values are shifted relative to breakpoints

          if (value === undefined) {
            return undefined;
          }

          return css<Props>`
            @media (min-width: ${breakpoint}px) {
              ${css<Props>`
                ${attrCss(value)}
              `}
            }
          `;
        })
        .filter(truthy),
    ];
  };

export default responsive;
