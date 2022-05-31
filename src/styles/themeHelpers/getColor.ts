import theme, { OakColorName, OakTheme } from "../theme";

const getColor = (
  colorNameOrFn?: OakColorName | ((theme: OakTheme) => OakColorName)
): string | undefined => {
  if (!colorNameOrFn) {
    return;
  }

  const colorName =
    typeof colorNameOrFn === "function" ? colorNameOrFn(theme) : colorNameOrFn;

  return theme.colors[colorName];
};

export default getColor;
