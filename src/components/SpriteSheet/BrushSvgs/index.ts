import { Underline1, Underline2 } from "./UnderlineSvgs";

const brushSvgSymbols = {
  Underline1,
  Underline2,
};

export const BRUSH_NAMES = Object.keys(brushSvgSymbols) as Array<
  keyof typeof brushSvgSymbols
>;
export type BrushSvgName = keyof typeof brushSvgSymbols;

export default brushSvgSymbols;
