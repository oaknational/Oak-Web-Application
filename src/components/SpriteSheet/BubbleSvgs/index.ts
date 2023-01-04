import Bubble from "./Bubble.graphic";
import Bubble2 from "./Bubble2.graphic";

const bubbleSvgSymbols = {
  Bubble,
  Bubble2,
};

export const BUBBLES = Object.keys(bubbleSvgSymbols) as Array<
  keyof typeof bubbleSvgSymbols
>;
export type BubbleSvgName = keyof typeof bubbleSvgSymbols;

export default bubbleSvgSymbols;
