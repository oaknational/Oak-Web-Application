import { StandardLonghandPropertiesHyphen } from "csstype";
import { css } from "styled-components";

import responsive, { ResponsiveValues } from "./responsive";

type PropertyName = "all" | keyof StandardLonghandPropertiesHyphen;
type Duration = "0.1s" | "0.3s";
type Easing = "ease";

type Transition = `${PropertyName} ${Duration} ${Easing}`;

export type TransitionProps = {
  $transition?: ResponsiveValues<Transition>;
};
const transition = css<TransitionProps>`
  ${responsive("transition", (props) => props.$transition)}
`;

export default transition;
