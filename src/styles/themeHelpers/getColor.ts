import theme, { COLOR_NAMES, OakColorName, OakTheme } from "../theme";

const getColor = (
  colorNameOrFn?: OakColorName | ((theme: OakTheme) => OakColorName | string)
): string | undefined => {
  if (!colorNameOrFn) {
    return;
  }

  const colorName =
    typeof colorNameOrFn === "function" ? colorNameOrFn(theme) : colorNameOrFn;

  // eslint-disable-next-line
  // @ts-ignore
  return theme.colors[colorName].color;
};

export const colorNameOrThrow = (maybeColorName: string): OakColorName => {
  const colorName = COLOR_NAMES.find(
    (eachColorName) => eachColorName === maybeColorName
  );
  if (colorName) {
    return colorName;
  }
  throw new Error("Color not found");
};

export default getColor;
