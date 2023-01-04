import { Underline1, Underline2, HeaderUnderline } from "./UnderlineSvgs";

const brushSvgSymbols = {
  Underline1,
  Underline2,
  HeaderUnderline,
};

export const BRUSH_NAMES = Object.keys(brushSvgSymbols) as Array<
  keyof typeof brushSvgSymbols
>;
export type BrushSvgName = keyof typeof brushSvgSymbols;

export default brushSvgSymbols;
