import { OakColorName, PropsWithTheme } from "../theme";

function getColorByName(): undefined;
function getColorByName(
  colorName: OakColorName,
): (props: PropsWithTheme) => string;
function getColorByName(
  colorName?: OakColorName,
): ((props: PropsWithTheme) => string) | undefined;
function getColorByName(colorName?: OakColorName) {
  if (!colorName) {
    return;
  }

  return ({ theme }: PropsWithTheme) => theme.colors?.[colorName];
}

export default getColorByName;
