/**
 * We've been using px so that we can share a language with designers.
 * However for the sake of accessibility, these should resolve to rem
 * values in the stylesheets that the browser reads.
 */
const BASE_FONT_SIZE = 16;
function pxToRem(px: number): number {
  return Number((px / BASE_FONT_SIZE).toFixed(3));
}
function pxToRemString(
  px: number | string | null | undefined
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
      console.warn("pxToRemString: Could not parse px value", px);
      return px;
    }
    return `${pxToRem(parseFloat(value))}rem`;
  }
  return px;
}
export { pxToRemString };
