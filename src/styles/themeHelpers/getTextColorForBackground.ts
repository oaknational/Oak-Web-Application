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

  return (props: PropsWithTheme) => "#000000";
}

export default getTextColorForBackground;
