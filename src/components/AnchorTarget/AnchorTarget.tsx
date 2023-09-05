import styled, { css } from "styled-components";

import theme from "@/styles/theme";

/**
 * AnchorTarget is a component to enable in-page linking to a particular section
 *
 * ## Usage
 *
 * Drop AnchorTarget inside a relative or absolulely positioned element, passing
 * it a unique 'id'. Then link it elsewhere using `<a href='#${id}' />`.
 *
 * @todo Currently theme.header.height only specifies a minHeight, which means
 * that this component is not reliable. We should set actual 'height' on the
 * site header.
 */
type AnchorTargetProps = {
  $paddingTop?: number;
};

const anchorTarget = css<AnchorTargetProps>`
  ${(props) => css`
    scroll-margin-top: ${props.$paddingTop !== undefined
      ? theme.header.height + props.$paddingTop
      : theme.header.height}px;
    position: absolute;
    top: 0;
  `}
`;

const AnchorTarget = styled.span<AnchorTargetProps>`
  ${anchorTarget}
`;

export default AnchorTarget;
