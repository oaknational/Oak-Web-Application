import { FC } from "react";
import { PortableTextMarkComponentProps } from "@portabletext/react";
import type {
  PortableTextBlock,
  PortableTextMarkDefinition,
} from "@portabletext/types";

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

export const PostFootnotesSection: FC<PostFootnotesSectionProps> = ({
  footnotes,
}) => {
  return (
    <footer role="doc-endnotes">
      <ol>
        {footnotes.map(({ markKey, index, label, source }) => (
          <li id={footnoteCitationAnchor(markKey)} key={markKey}>
            {source ? <a href={source}>{label}</a> : label}

            <a
              // @TODO: Anchor under-scrolls due to header
              // @TODO: Backlink isn't inheriting correct styles
              href={`#${footnoteBackLinkAnchor(markKey)}`}
              aria-label={`Back to reference ${index}`}
              role="doc-backlink"
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </footer>
  );
};
