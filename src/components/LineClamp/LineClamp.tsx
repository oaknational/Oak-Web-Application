import styled from "styled-components";

/**
 * Will limit number of lines displayed to `props.lines`.
 * ## Usage
 * Use sparingly, it is very much preferrable enforce a sensible character
 * limit when using content from a CMS.
 *
 * ## Caveat
 * Uses CSS property -webkit-line-clamp, but it is
 * [widely supported](https://caniuse.com/mdn-css_properties_-webkit-line-clamp).
 *
 *
 */
export type LineClampProps = {
  lines: number;
};
const LineClamp = styled.div<LineClampProps>`
  /* stylelint-disable */
  display: -webkit-box;
  /* stylelint-enable */
  -webkit-line-clamp: ${(props) => props.lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export default LineClamp;
