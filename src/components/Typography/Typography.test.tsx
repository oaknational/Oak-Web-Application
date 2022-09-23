import { FontVariantName, FONT_VARIANTS } from "../../styles/utils/typography";
import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import Typography from "./Typography";

describe("Typography", () => {
  test.each(Object.entries(FONT_VARIANTS))(
    'should correctly handle prop $font="%s"',
    async (font, [fontSize, lineHeight, fontWeight, letterSpacing]) => {
      const { getByTestId } = renderWithTheme(
        <Typography data-testid="test" $font={font as FontVariantName} />
      );

      expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
      expect(getByTestId("test")).toHaveStyle(`font-size: ${fontSize}px`);
      expect(getByTestId("test")).toHaveStyle(`line-height: ${lineHeight}px`);
      expect(getByTestId("test")).toHaveStyle(`font-weight: ${fontWeight}`);
      expect(getByTestId("test")).toHaveStyle(
        `letter-spacing: ${letterSpacing}`
      );
    }
  );
});
