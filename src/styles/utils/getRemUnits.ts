/**
 * We've been using px so that we can share a language with designers.
 * However for the sake of accessibility, these should resolve to rem
 * values in the stylesheets that the browser reads.
 */
const BASE_FONT_SIZE_PX = 16;
export const REM_DP = 3;
function pxToRem(px: number): number {
  return Number((px / BASE_FONT_SIZE_PX).toFixed(REM_DP));
}
/**
 * Converts a px value to rem units, appends "rem" to the end of the value.
 * Values that are not numbers or strings that end with "px" will be returned
 * as-is.
 * @param px - A number or string value that ends with "px".
 * @returns A string value that ends with "rem".
 * @example
 * getRemUnits(16) // "1rem"
 * getRemUnits("16px") // "1rem"
 * getRemUnits("50%") // "50%"
 * getRemUnits(null) // null
 * getRemUnits(undefined) // undefined
 *
 */
export function getRemUnits(
  px: number | string | null | undefined,
): string | null | undefined {
  if (px === null || px === undefined) {
    return px;
  }
  if (typeof px === "number") {
    return `${pxToRem(px)}rem`;
  }
  if (px.endsWith("px")) {
    const [value] = px.split("px");
    if (!value) {
      console.warn("getRemUnits: Could not parse px value", px);
      return px;
    }
    return `${pxToRem(parseFloat(value))}rem`;
  }
  return px;
}
