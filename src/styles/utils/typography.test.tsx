import styled from "styled-components";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import typography, { FontVariant, FONT_VARIANTS } from "./typography";

const StyledComponent = styled.div`
  ${typography}
`;

describe("typography", () => {
  test.each(Object.entries(FONT_VARIANTS))(
    'should correctly handle prop $font="%s"',
    async (font, [fontSize, lineHeight, fontWeight, letterSpacing]) => {
      const { getByTestId } = renderWithTheme(
        <StyledComponent data-testid="test" $font={font as FontVariant} />
      );

      expect(getByTestId("test")).toHaveStyle("font-family: Lexend,sans-serif");
      expect(getByTestId("test")).toHaveStyle(
        `font-size: ${Number((fontSize / 16).toFixed(3))}rem`
      );
      expect(getByTestId("test")).toHaveStyle(
        `line-height: ${Number((lineHeight / 16).toFixed(3))}rem`
      );
      expect(getByTestId("test")).toHaveStyle(`font-weight: ${fontWeight}`);
      expect(getByTestId("test")).toHaveStyle(
        `letter-spacing: ${letterSpacing}`
      );
    }
  );
});
