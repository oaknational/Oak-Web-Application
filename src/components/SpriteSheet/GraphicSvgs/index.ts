import HandHoldingPaper from "./HandHoldingPaper.graphic";
import MagicCarpet from "./MagicCarpet.graphic";

const graphicSvgSymbols = {
  HandHoldingPaper,
  MagicCarpet,
};

export const GRAPHIC_NAMES = Object.keys(graphicSvgSymbols) as Array<
  keyof typeof graphicSvgSymbols
>;
export type GraphicSvgName = keyof typeof graphicSvgSymbols;

export default graphicSvgSymbols;
