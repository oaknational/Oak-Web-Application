import { FC } from "react";
import styled from "styled-components";
import { PortableTextMarkComponentProps } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from "@portabletext/types";

import Box from "../../Box";

export type Footnote = {
  index: number;
  markKey: string;
  label: string;
  source?: string | null;
};

type FootnoteAnnotation = PortableTextMarkDefinition & {
  label: string;
  source?: string | null;
};

export const extractFootnotes = (
  portableText: PortableTextBlock<
    FootnoteAnnotation | PortableTextMarkDefinition
  >[]
): Footnote[] => {
  return portableText
    .filter(({ _type }) => _type === "block")
    .flatMap(({ markDefs }) => markDefs)
    .filter(
      (markDef): markDef is FootnoteAnnotation => markDef?._type === "footnote"
    )
    .map(({ label, _key, source }, i) => {
      return {
        index: i + 1,
        markKey: _key,
        label,
        source,
      };
    });
};

const footnoteCitationAnchor = (markKey: string) => `footnote-ref-${markKey}`;
const footnoteBackLinkAnchor = (markKey: string) => `footnote-note-${markKey}`;

type PostFootnoteAnnotationProps = PortableTextMarkComponentProps & {
  footnotes: Footnote[];
};

export const PostFootnoteAnnotation = (props: PostFootnoteAnnotationProps) => {
  const footnote = props.footnotes.find(
    (note) => note.markKey === props.markKey
  );

  if (!footnote) {
    return null;
  }

  return (
    <span>
      {props.children}
      <sup id={footnoteBackLinkAnchor(footnote.markKey)}>
        <a
          href={`#${footnoteCitationAnchor(footnote.markKey)}`}
          role="doc-noteref"
          aria-label={`Go to footnote ${footnote.index}`}
        >
          {footnote.index}
        </a>
      </sup>
    </span>
  );
};

type PostFootnotesSectionProps = {
  footnotes: Footnote[];
};

/**
 * Using a styled link instead of OakLink here as we don't want
 * any of the OakLink functionality, and OakLink appears to mangle
 * in-page anchor links by prepending the whole path to the href
 */
const FootnoteLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.hyperlink};
`;

export const PostFootnotesSection: FC<PostFootnotesSectionProps> = ({
  footnotes,
}) => {
  return (
    <Box as="footer" role="doc-endnotes" $pt={20}>
      <h3>References</h3>

      <Box as="ol" $pl={16}>
        {footnotes.map(({ markKey, index, label, source }) => (
          <li id={footnoteCitationAnchor(markKey)} key={markKey}>
            {source ? (
              <FootnoteLink href={source}>{label}</FootnoteLink>
            ) : (
              label
            )}{" "}
            <FootnoteLink
              href={`#${footnoteBackLinkAnchor(markKey)}`}
              aria-label={`Back to reference ${index}`}
              role="doc-backlink"
            >
              ↩
            </FootnoteLink>
          </li>
        ))}
      </Box>
    </Box>
  );
};
