import { breakpoints } from "../../styles/utils/responsive";

type Width = number | string;

/**
 * This function takes an array of numbers.
 * Each number represents the px width image that should be fetched at that
 * breakpoint.
 * getSizes([200, 500, 700]) // "(min-width: 1280px) 700px, (min-width: 750px) 500px, 200px"
 */
export function getSizes(
  widths: [Width] | [Width, Width] | [Width, Width, Width],
) {
  if (!widths.length) {
    return "";
  }
  const widthsSliced = widths.slice(0, breakpoints.length + 1);
  /**
   * `acc: string` annotation required
   * @see https://github.com/microsoft/TypeScript/issues/36554#issuecomment-650267069
   */
  const sizes = widthsSliced.reduceRight((acc: string, cur, i) => {
    const isLast = i === 0;
    const valueWithUnits = typeof cur === "number" ? `${cur}px` : `${cur}`;

    if (isLast) {
      return `${acc}${valueWithUnits}`;
    }
    const breakpoint = breakpoints[i - 1];
    return `${acc}(min-width: ${breakpoint}px) ${valueWithUnits}, `;
  }, "");

  return sizes;
}
