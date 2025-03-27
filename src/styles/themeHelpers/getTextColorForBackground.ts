import { OakColorName, PropsWithTheme } from "../theme";

import getColorByName from "./getColorByName";

function getTextColorForBackground(): undefined;
function getTextColorForBackground(
  background: OakColorName,
): (props: PropsWithTheme) => string;
function getTextColorForBackground(
  background?: OakColorName,
): ((props: PropsWithTheme) => string) | undefined;
function getTextColorForBackground(background?: OakColorName) {
  if (!background) {
    return;
  }

  return (props: PropsWithTheme) => {
    const contrastColor = props.theme.contrastColors[background];
    if (!contrastColor) {
      console.warn(`Contrast color for ${background} not found in theme`);
      return "inherit";
    }
    return getColorByName(contrastColor)(props);
  };
}

export default getTextColorForBackground;
