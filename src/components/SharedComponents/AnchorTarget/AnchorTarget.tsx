import styled, { css } from "styled-components";

/**
 * AnchorTarget is a component to enable in-page linking to a particular section
 *
 * ## Usage
 *
 * Drop AnchorTarget inside a relative or absolutely positioned element, passing
 * it a unique 'id'. Then link it elsewhere using `<a href='#${id}' />`.
 *
 */
type AnchorTargetProps = {
  $paddingTop?: number;
  id: string;
};

const anchorTarget = css<AnchorTargetProps>`
  ${(props) => css`
    scroll-margin-top: ${props.$paddingTop ?? 0}px;
    position: absolute;
    top: 0;
  `}
`;

const AnchorTarget = styled.span<AnchorTargetProps>`
  ${anchorTarget}
`;

export default AnchorTarget;
