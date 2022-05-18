import { css } from "styled-components";

import truthy from "../../utils/truthy";
import { PropsWithTheme } from "../theme";

import { getBreakpointsArray } from "./getBreakpoints";

export type ValueOrArray<T> = T | T[];

const getResponsiveStyles =
  <
    PropKey extends string,
    PropType extends string | number,
    Props = { [k in PropKey]?: ValueOrArray<PropType> }
  >({
    attr,
    getValues,
    parseValue = (x) => x,
  }: {
    attr: string;
    getValues: (props: Props) => ValueOrArray<PropType>;
    parseValue?: (unparsedValue: PropType) => string | number | undefined;
  }) =>
  (props: PropsWithTheme<Props>) => {
    const attrCss = (value: string | number | undefined) => `${attr}: ${value}`;
    const { theme } = props;
    const values = getValues(props);
    if (typeof values === "undefined") {
      return undefined;
    }
    if (!Array.isArray(values)) {
      const value = parseValue(values);
      return css<PropsWithTheme<Props>>`
        ${attrCss(value)};
      `;
    }
    if (values.length === 0) {
      return [];
    }

    const firstValue =
      typeof values[0] === "undefined" ? undefined : parseValue(values[0]);
    if (!firstValue) {
      console.warn(
        `getResponsiveStyles: could not parse value. attr:${attr}, values:${values}`
      );
    }

    return [
      css<PropsWithTheme<Props>>`
        ${attrCss(firstValue)};
      `,
      ...getBreakpointsArray({ theme })
        .slice(0, values.length)
        .map((breakpoint, i) => {
          const value = values[i + 1]; // Values are shifted relative to breakpoints

          if (value === undefined) {
            return undefined;
          }

          return css`
            @media (min-width: ${breakpoint}) {
              ${css`
                ${attrCss(value)};
              `}
          `;
        })
        .filter(truthy),
    ];
  };

export default getResponsiveStyles;
