import { StandardLonghandPropertiesHyphen } from "csstype";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

type PropertyName = "all" | keyof StandardLonghandPropertiesHyphen;
type Duration = "0.1s" | "0.3s" | "0.4s" | "0.5s" | "0.8s";
type Easing =
  | "ease"
  | "ease-in-out"
  | "ease-out"
  | "cubic-bezier(0.34, 1.56, 0.64, 1)";

type Transition = `${PropertyName} ${Duration} ${Easing}`;

export type TransitionProps = {
  $transition?: ResponsiveValues<Transition>;
};
const transition = css<TransitionProps>`
  ${responsive("transition", (props) => props.$transition)}
`;

export default transition;
