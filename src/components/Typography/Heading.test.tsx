import { FontVariant, FONT_VARIANTS } from "../../styles/utils/typography";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";
import { REM_DP } from "../../styles/utils/getRemUnits";

import Heading, { HeadingTag } from "./Heading";

describe("Heading", () => {
  test.each([["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"], ["h1"]])(
    "should correctly render %s tag",
    (tag) => {
      const { getByRole } = renderWithTheme(
        <Heading tag={tag as HeadingTag} />
      );

      expect(getByRole("heading", { level: 1 })).toBeTruthy();
    }
  );
  test.each(Object.entries(FONT_VARIANTS))(
    'should correctly handle prop $font="%s"',
    async (font, [fontSize, lineHeight, fontWeight, letterSpacing]) => {
      const { getByTestId } = renderWithTheme(
        <Heading tag={"h1"} data-testid="test" $font={font as FontVariant} />
      );

      expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
      expect(getByTestId("test")).toHaveStyle(
        `font-size: ${Number((fontSize / 16).toFixed(REM_DP))}rem`
      );
      expect(getByTestId("test")).toHaveStyle(
        `line-height:  ${Number((lineHeight / 16).toFixed(REM_DP))}rem`
      );
      expect(getByTestId("test")).toHaveStyle(`font-weight: ${fontWeight}`);
      expect(getByTestId("test")).toHaveStyle(
        `letter-spacing: ${letterSpacing}`
      );
    }
  );
});
