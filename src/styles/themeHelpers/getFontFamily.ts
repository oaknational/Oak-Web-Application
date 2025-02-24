import { OakFontName, PropsWithTheme } from "../theme";

function getFontFamily(): "inherit";
function getFontFamily(
  fontName: OakFontName,
): (props: PropsWithTheme) => string;
function getFontFamily(
  fontName?: OakFontName,
): ((props: PropsWithTheme) => string) | "inherit";
function getFontFamily(fontName?: OakFontName) {
  if (!fontName) {
    return "inherit";
  }
  return ({ theme }: PropsWithTheme) => theme.fonts?.[fontName];
}

export default getFontFamily;
