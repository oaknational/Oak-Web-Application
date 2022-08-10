import styled from "styled-components";

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
const AnchorTarget = styled.span`
  scroll-margin-top: ${({ theme }) => theme.header.height}px;
  position: absolute;
  top: 0;
`;

export default AnchorTarget;
