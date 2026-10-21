import { OakBox, parseColor, parseSpacing } from "@oaknational/oak-components";
import styled from "styled-components";

export type SectionColour = "mint" | "purple" | "teal" | "blue";

/** Structural rules not exposed by Oak component props. */
export const GoogleDocsContent = styled(OakBox)`
  overflow-wrap: anywhere;

  td > :first-child,
  > :first-child,
  .docx-callout > :first-child {
    margin-top: 0;
  }

  td > :last-child,
  .docx-callout > :last-child {
    margin-bottom: 0;
  }

  li > p {
    margin-bottom: 0;
  }

  ul ul {
    list-style-type: circle;
  }

  ul ul ul {
    list-style-type: square;
  }

  ol {
    padding-inline-start: ${parseSpacing("spacing-24")};
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  s {
    text-decoration: line-through;
  }

  sup,
  sub {
    line-height: 0;
  }

  sup {
    vertical-align: super;
  }

  sub {
    vertical-align: sub;
  }
`;

export const GoogleDocsSection = styled(OakBox)<{
  $sectionColour?: SectionColour;
}>`
  border-color: ${({ $sectionColour }) =>
    $sectionColour && parseColor($sectionColour)};
`;

export const GoogleDocsCell = styled(OakBox)<{
  $fillColour?: SectionColour;
  $leftColour?: SectionColour;
  $rightColour?: SectionColour;
}>`
  vertical-align: top;
  background-color: ${({ $fillColour }) =>
    $fillColour && parseColor($fillColour)};
  border-left-color: ${({ $leftColour }) =>
    $leftColour && parseColor($leftColour)};
  border-right-color: ${({ $rightColour }) =>
    $rightColour && parseColor($rightColour)};
`;
