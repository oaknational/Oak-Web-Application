import styled from "styled-components";

import { margin, MarginProps } from "@/styles/utils/spacing";
import getFontFamily from "@/styles/themeHelpers/getFontFamily";
import { GridProps } from "@/components/SharedComponents/Grid.deprecated";
import { grid } from "@/components/SharedComponents/Grid.deprecated/Grid.deprecated";
import { box, BoxProps } from "@/components/SharedComponents/Box";

/**
 * Styled `ol` (ordered list) component.
 *
 * ## Usage
 *
 * Use where we have an ordered list to ensure numbers are styled
 *
 * */
type OLProps = MarginProps;

const OL = styled.ol<MarginProps>`
  ${margin}
  counter-reset: item;
  padding: 0;

  li {
    display: block;
    counter-increment: item;
    margin: 0;
    padding: 0 0 0 16px;
    text-indent: -16px;
    list-style-type: none;
    line-height: 32px;

    // Portable text generates linebreaks within list items

    br {
      content: "";
      display: block;
      margin-top: 8px;
    }
  }

  & li::before {
    font-family: ${getFontFamily("ui")};
    padding-right: 4px;
    content: counter(item) ".";
  }

  a {
    color: ${(props) => props.theme.colors.navy};
  }
`;

export const GridOrderedList = styled("ol")<OLProps & GridProps & BoxProps>`
  display: grid;
  ${grid}${box}
`;

export default OL;
