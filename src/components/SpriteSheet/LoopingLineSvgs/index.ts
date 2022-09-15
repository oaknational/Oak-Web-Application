import LoopingLine from "./LoopingLine.graphic";
import LoopingLine2 from "./LoopingLine2.graphic";
import LoopingLine3 from "./LoopingLine3.graphic";

const loopingLineSvgSymbols = {
  LoopingLine,
  LoopingLine2,
  LoopingLine3,
};

export const LOOPING_LINES = Object.keys(loopingLineSvgSymbols) as Array<
  keyof typeof loopingLineSvgSymbols
>;
export type LoopingLineSvgName = keyof typeof loopingLineSvgSymbols;

export default loopingLineSvgSymbols;
