import { FC } from "react";
import styled from "styled-components";
import { PortableTextMarkComponentProps } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from "@portabletext/types";
import {
  OakBox,
  OakLI,
  OakLink,
  OakOL,
  OakSpan,
} from "@oaknational/oak-components";

import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

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
  >[],
): Footnote[] => {
  return portableText
    .filter(({ _type }) => _type === "block")
    .flatMap(({ markDefs }) => markDefs)
    .filter(
      (markDef): markDef is FootnoteAnnotation => markDef?._type === "footnote",
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
    (note) => note.markKey === props.markKey,
  );

  if (!footnote) {
    return null;
  }

  return (
    <OakSpan>
      {props.children}

      <OakBox
        as="sup"
        $position="relative"
        $textDecoration={"underline"}
        $color={"text-link-active"}
      >
        <AnchorTarget id={footnoteBackLinkAnchor(footnote.markKey)} />

        <a
          href={`#${footnoteCitationAnchor(footnote.markKey)}`}
          role="doc-noteref"
          aria-label={`Go to footnote ${footnote.index}`}
        >
          {footnote.index}
        </a>
      </OakBox>
    </OakSpan>
  );
};

type PostFootnotesSectionProps = {
  footnotes: Footnote[];
};

const StyledLabel = styled.span`
  word-wrap: break-word;
  max-width: 100%;
`;

export const PostFootnotesSection: FC<PostFootnotesSectionProps> = ({
  footnotes,
}) => {
  if (!footnotes?.length) {
    return null;
  }

  return (
    <OakBox as="footer" $pt={"spacing-20"} $maxWidth={"100%"}>
      <h3>References</h3>
      <OakOL>
        {footnotes.map(({ markKey, index, label, source }) => {
          return (
            <OakLI id={footnoteCitationAnchor(markKey)} key={markKey}>
              {source ? (
                <OakLink href={source}>{label}</OakLink>
              ) : (
                <StyledLabel>{label}</StyledLabel>
              )}{" "}
              <OakLink
                href={`#${footnoteBackLinkAnchor(markKey)}`}
                aria-label={`Back to reference ${index}`}
                role="doc-backlink"
              >
                ↩
              </OakLink>
            </OakLI>
          );
        })}
      </OakOL>
    </OakBox>
  );
};
