"use client";

import {
  OakBox,
  OakHeading,
  OakLI,
  OakLink,
  OakOL,
  OakP,
  OakUL,
} from "@oaknational/oak-components";
import { Fragment, ReactNode, useState } from "react";

type TextStyle = {
  [property: string]: unknown;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  baselineOffset?: string;
  link?: { url?: string; headingId?: string; bookmarkId?: string };
};

type ParagraphElement = {
  textRun?: { content?: string; textStyle?: TextStyle };
  inlineObjectElement?: { inlineObjectId?: string };
  horizontalRule?: object;
  pageBreak?: object;
  columnBreak?: object;
};

type Paragraph = {
  elements?: ParagraphElement[];
  positionedObjectIds?: string[];
  paragraphStyle?: {
    namedStyleType?: string;
    headingId?: string;
    direction?: string;
  };
  bullet?: { listId?: string; nestingLevel?: number };
};

type EmbeddedObject = {
  title?: string;
  description?: string;
  imageProperties?: { contentUri?: string };
  size?: {
    width?: { magnitude?: number; unit?: string };
    height?: { magnitude?: number; unit?: string };
  };
};

type StructuralElement = {
  paragraph?: Paragraph;
  sectionBreak?: object;
  tableOfContents?: { content?: StructuralElement[] };
  table?: {
    tableRows?: {
      tableCells?: {
        content?: StructuralElement[];
        tableCellStyle?: { rowSpan?: number; columnSpan?: number };
      }[];
    }[];
  };
};

/** The Google Docs API fields used for semantic, rather than print, rendering. */
export type GoogleDocsDocument = {
  title?: string;
  body?: { content?: StructuralElement[] };
  namedStyles?: {
    styles?: { namedStyleType?: string; textStyle?: TextStyle }[];
  };
  lists?: Record<
    string,
    {
      listProperties?: {
        nestingLevels?: {
          glyphType?: string;
          glyphSymbol?: string;
          startNumber?: number;
        }[];
      };
    }
  >;
  inlineObjects?: Record<
    string,
    {
      inlineObjectProperties?: {
        embeddedObject?: EmbeddedObject;
      };
    }
  >;
  positionedObjects?: Record<
    string,
    {
      positionedObjectProperties?: {
        embeddedObject?: EmbeddedObject;
      };
    }
  >;
};

const headingTags = {
  TITLE: "h1",
  HEADING_1: "h1",
  HEADING_2: "h2",
  HEADING_3: "h3",
  HEADING_4: "h4",
  HEADING_5: "h5",
  HEADING_6: "h6",
} as const;

const listTypes: Record<string, "A" | "a" | "I" | "i" | "1"> = {
  ALPHA: "A",
  alpha: "a",
  ROMAN: "I",
  roman: "i",
  DECIMAL: "1",
  ZERO_DECIMAL: "1",
};

function isHeading(type: string): type is keyof typeof headingTags {
  return Object.prototype.hasOwnProperty.call(headingTags, type);
}

function safeUrl(url: string, image = false) {
  return (image ? /^https?:\/\//i : /^(https?:\/\/|mailto:|tel:|#)/i).test(
    url.trim(),
  );
}

function renderText(content: string, style: TextStyle): ReactNode {
  let node: ReactNode = content.split(/[\n\v]/).map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
  if (style.bold) node = <strong>{node}</strong>;
  if (style.italic) node = <em>{node}</em>;
  if (style.underline) node = <u>{node}</u>;
  if (style.strikethrough) node = <s>{node}</s>;
  if (style.baselineOffset === "SUPERSCRIPT") node = <sup>{node}</sup>;
  if (style.baselineOffset === "SUBSCRIPT") node = <sub>{node}</sub>;
  const link = style.link;
  const href =
    link?.url ?? (link?.headingId ? `#${link.headingId}` : undefined);
  if (href && safeUrl(href)) node = <OakLink href={href}>{node}</OakLink>;
  return node;
}

function renderImage(id: string | undefined, document: GoogleDocsDocument) {
  const object = id
    ? document.inlineObjects?.[id]?.inlineObjectProperties?.embeddedObject
    : undefined;
  return renderEmbeddedImage(object);
}

function renderEmbeddedImage(object: EmbeddedObject | undefined) {
  const src = object?.imageProperties?.contentUri;
  if (!src || !safeUrl(src, true)) {
    return <span role="note">[Image unavailable]</span>;
  }
  const dimension = (value?: { magnitude?: number; unit?: string }) =>
    value?.magnitude === undefined
      ? undefined
      : value.magnitude * (value.unit === "PT" ? 96 / 72 : 1);
  return (
    <GoogleDocsImage
      key={src}
      src={src}
      alt={object?.description || object?.title || ""}
      width={dimension(object?.size?.width)}
      height={dimension(object?.size?.height)}
    />
  );
}

function GoogleDocsImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span role="note">[Image unavailable{alt ? `: ${alt}` : ""}]</span>;
  }
  return (
    // Google Docs content URIs are temporary external URLs, not Next image assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setFailed(true)}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}

function renderParagraph(paragraph: Paragraph, document: GoogleDocsDocument) {
  const elements = paragraph.elements ?? [];
  const type = paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT";
  const inheritedStyle = document.namedStyles?.styles?.find(
    (style) => style.namedStyleType === type,
  )?.textStyle;
  const content: ReactNode[] = elements.map((element, index) => {
    let node: ReactNode;
    if (element.textRun) {
      // Google Docs terminates each paragraph with a newline; it is not a <br>.
      const text =
        index === elements.length - 1
          ? (element.textRun.content ?? "").replace(/\n$/, "")
          : (element.textRun.content ?? "");
      node = renderText(text, {
        ...inheritedStyle,
        ...element.textRun.textStyle,
      });
    } else if (element.inlineObjectElement) {
      node = renderImage(element.inlineObjectElement.inlineObjectId, document);
    } else if (element.horizontalRule) {
      node = <hr />;
    } else if (element.pageBreak || element.columnBreak) {
      return null;
    } else {
      node = <span role="note">[Unsupported document element]</span>;
    }
    return <Fragment key={index}>{node}</Fragment>;
  });
  // Floating print images become inline content at their paragraph anchor.
  for (const id of paragraph.positionedObjectIds ?? []) {
    content.push(
      <Fragment key={`positioned-${id}`}>
        {renderEmbeddedImage(
          document.positionedObjects?.[id]?.positionedObjectProperties
            ?.embeddedObject,
        )}
      </Fragment>,
    );
  }
  const hasContent =
    !!paragraph.positionedObjectIds?.length ||
    elements.some(
      (element) =>
        element.textRun?.content?.trim() ||
        (!element.textRun && !element.pageBreak && !element.columnBreak),
    );
  if (!hasContent) return null;
  const props = {
    id: paragraph.paragraphStyle?.headingId,
    dir:
      paragraph.paragraphStyle?.direction === "RIGHT_TO_LEFT"
        ? "rtl"
        : undefined,
  };
  // A rule is flow content and cannot be nested inside a paragraph or heading.
  if (elements.some((element) => element.horizontalRule)) {
    return <OakBox {...props}>{content}</OakBox>;
  }
  if (isHeading(type)) {
    return (
      <OakHeading {...props} tag={headingTags[type]} $mb="spacing-16">
        {content}
      </OakHeading>
    );
  }
  return (
    <OakP {...props} $mb="spacing-12">
      {content}
    </OakP>
  );
}

type ListNode = {
  listId: string;
  level: number;
  items: { paragraph: Paragraph; children: ListNode[] }[];
};

function renderList(
  list: ListNode,
  document: GoogleDocsDocument,
  counters: Map<string, number>,
): ReactNode {
  const properties =
    document.lists?.[list.listId]?.listProperties?.nestingLevels?.[list.level];
  const ordered =
    !!properties?.glyphType &&
    properties.glyphType !== "GLYPH_TYPE_UNSPECIFIED" &&
    properties.glyphType !== "NONE";
  const counterKey = `${list.listId}:${list.level}`;
  const start = counters.get(counterKey) ?? properties?.startNumber ?? 1;
  counters.set(counterKey, start + list.items.length);
  const items = list.items.map((item, index) => (
    <OakLI key={index} $font="body-2">
      {renderParagraph(item.paragraph, document)}
      {item.children.map((child, index) => (
        <Fragment key={index}>{renderList(child, document, counters)}</Fragment>
      ))}
    </OakLI>
  ));
  if (!ordered) return <OakUL $mb="spacing-16">{items}</OakUL>;
  const type = listTypes[properties.glyphType ?? ""];
  return (
    <OakOL start={start} type={type} $mb="spacing-16">
      {items}
    </OakOL>
  );
}

function renderBlocks(
  elements: StructuralElement[],
  document: GoogleDocsDocument,
): ReactNode {
  const blocks: ReactNode[] = [];
  const counters = new Map<string, number>();
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    if (!element) continue;
    if (element.paragraph?.bullet) {
      const roots: ListNode[] = [];
      const stack: ListNode[] = [];
      while (index < elements.length) {
        const paragraph = elements[index]?.paragraph;
        if (!paragraph?.bullet) break;
        const { listId, nestingLevel = 0 } = paragraph.bullet;
        if (!listId)
          throw new Error("Google Docs list item is missing a listId");
        while (stack.length && stack[stack.length - 1]!.level > nestingLevel) {
          stack.pop();
        }
        let current = stack[stack.length - 1];
        if (current?.level === nestingLevel && current.listId !== listId) {
          stack.pop();
          current = undefined;
        }
        if (!current || current.level !== nestingLevel) {
          current = { listId, level: nestingLevel, items: [] };
          const parent = stack[stack.length - 1];
          const siblings = parent?.items[parent.items.length - 1]?.children;
          (siblings ?? roots).push(current);
          stack.push(current);
        }
        current.items.push({ paragraph, children: [] });
        index++;
      }
      index--;
      blocks.push(...roots.map((list) => renderList(list, document, counters)));
    } else if (element.paragraph) {
      blocks.push(renderParagraph(element.paragraph, document));
    } else if (element.table) {
      blocks.push(
        <OakBox $overflowX="auto" $mb="spacing-24">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {element.table.tableRows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.tableCells?.map((cell, cellIndex) => {
                    const { rowSpan = 1, columnSpan = 1 } =
                      cell.tableCellStyle ?? {};
                    // Merged cells have zero-span placeholders in the API.
                    if (rowSpan === 0 || columnSpan === 0) return null;
                    return (
                      <td
                        key={cellIndex}
                        rowSpan={rowSpan}
                        colSpan={columnSpan}
                        style={{
                          verticalAlign: "top",
                          padding: "12px",
                          border: "1px solid currentColor",
                        }}
                      >
                        {renderBlocks(cell.content ?? [], document)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </OakBox>,
      );
    } else if (element.tableOfContents) {
      blocks.push(
        <nav aria-label="Table of contents">
          {renderBlocks(element.tableOfContents.content ?? [], document)}
        </nav>,
      );
    } else if (!element.sectionBreak) {
      blocks.push(<OakP role="note">[Unsupported document block]</OakP>);
    }
  }
  return blocks.map((block, index) => <Fragment key={index}>{block}</Fragment>);
}

/** Renders body content; repeated print headers, footers and page breaks are omitted. */
export function GoogleDocsRenderer({
  document,
}: {
  document: GoogleDocsDocument;
}) {
  if (!document.body?.content) {
    return (
      <OakP role="alert">This document has no body content to render.</OakP>
    );
  }
  return (
    <OakBox as="article" aria-label={document.title} $width="100%">
      {renderBlocks(document.body.content, document)}
    </OakBox>
  );
}
