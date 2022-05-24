import theme, { OakColorName } from "../theme";

const getColor = (colorName?: OakColorName) => {
  if (!colorName) {
    return;
  }
  return theme.colors[colorName].color;
};

export default getColor;
