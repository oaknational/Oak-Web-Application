import theme, { OakColorName, OakTheme } from "../theme";

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

export default getColor;
