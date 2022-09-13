import LoopingLine from "./LoopingLine.graphic";
import LoopingLine2 from "./LoopingLine2.graphic";

const loopingLineSvgSymbols = {
  LoopingLine,
  LoopingLine2,
};

export const LOOPING_LINES = Object.keys(loopingLineSvgSymbols) as Array<
  keyof typeof loopingLineSvgSymbols
>;
export type LoopingLineSvgName = keyof typeof loopingLineSvgSymbols;

export default loopingLineSvgSymbols;
