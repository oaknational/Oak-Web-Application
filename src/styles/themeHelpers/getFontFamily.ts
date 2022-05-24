import theme, { OakFontName } from "../theme";

const getFontFamily = (fontName?: OakFontName) => {
  if (!fontName) {
    return "inherit";
  }
  return theme.fonts[fontName];
};

export default getFontFamily;
