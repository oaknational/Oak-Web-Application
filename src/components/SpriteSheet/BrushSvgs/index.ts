import Underline from "./UnderlineSvgs";

const brushSvgSymbols = {
  Underline,
};

export const BRUSH_NAMES = Object.keys(brushSvgSymbols) as Array<
  keyof typeof brushSvgSymbols
>;
export type BrushSvgName = keyof typeof brushSvgSymbols;

export default brushSvgSymbols;
