import {
  css,
  DefaultTheme,
  Interpolation,
  ThemedStyledProps,
} from "styled-components";

import truthy from "../../utils/truthy";

const breakpoints = [100, 900, 1200];

export type ResponsiveValues<Value> = Value | Value[];

const responsive =
  <Props, T extends string | number | undefined>(
    attr: string,
    getValues: (props: Props) => ResponsiveValues<T | undefined>,
    parse: (unpared: T | undefined) => string | number | undefined = (x) => x
  ) =>
  (props: Props): Interpolation<ThemedStyledProps<Props, DefaultTheme>> => {
    const attrCss = (value: T | undefined) =>
      typeof value === "undefined" ? undefined : `${attr}: ${parse(value)};`;
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
