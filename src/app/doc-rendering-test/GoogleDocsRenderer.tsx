"use client";

import {
  OakBox,
  OakHeading,
  OakLI,
  OakLink,
  OakOL,
  OakP,
  OakSpan,
  OakUL,
  OakFontToken,
  oakColorTokens,
} from "@oaknational/oak-components";
import { Fragment, ReactNode, useState } from "react";

import {
  GoogleDocsCell,
  GoogleDocsContent,
  GoogleDocsSection,
} from "./GoogleDocsRenderer.styles";

const sectionColours = ["mint", "purple", "teal", "blue"] as const;

type Colour = {
  color?: { rgbColor?: { red?: number; green?: number; blue?: number } };
};
type CellBorder = {
  color?: Colour;
  width?: { magnitude?: number; unit?: string };
  dashStyle?: string;
};
type CellStyle = {
  rowSpan?: number;
  columnSpan?: number;
  backgroundColor?: Colour;
  borderLeft?: CellBorder;
  borderRight?: CellBorder;
  borderTop?: CellBorder;
  borderBottom?: CellBorder;
};

type TextStyle = {
  [property: string]: unknown;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  baselineOffset?: string;
  foregroundColor?: Colour;
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
    shading?: { backgroundColor?: Colour };
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
        tableCellStyle?: CellStyle;
      }[];
    }[];
  };
};

/** The Google Docs API fields used for semantic, rather than print, rendering. */
export type GoogleDocsDocument = {
  title?: string;
  documentStyle?: {
    defaultHeaderId?: string;
    firstPageHeaderId?: string;
    useFirstPageHeaderFooter?: boolean;
  };
  headers?: Record<string, { content?: StructuralElement[] }>;
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
        positioning?: { layout?: string };
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

const headingFonts: Record<keyof typeof headingTags, OakFontToken> = {
  TITLE: "heading-4",
  HEADING_1: "heading-5",
  HEADING_2: "heading-6",
  HEADING_3: "heading-7",
  HEADING_4: "body-2-bold",
  HEADING_5: "body-3-bold",
  HEADING_6: "body-3-bold",
};

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

function colourHex(colour?: Colour) {
  const rgb = colour?.color?.rgbColor;
  if (!rgb) return undefined;
  return `#${[rgb.red, rgb.green, rgb.blue]
    .map((value) =>
      Math.round((value ?? 0) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function sectionColour(colour?: Colour) {
  const hex = colourHex(colour);
  return sectionColours.find((token) => oakColorTokens[token] === hex);
}

function borderColour(border?: CellBorder) {
  return (border?.width?.magnitude ?? 0) > 0 && border?.dashStyle !== "NONE"
    ? sectionColour(border?.color)
    : undefined;
}

function positionedBackground(
  paragraph: Paragraph | undefined,
  document: GoogleDocsDocument,
) {
  return paragraph?.positionedObjectIds
    ?.map((id) => document.positionedObjects?.[id]?.positionedObjectProperties)
    .find((object) => object?.positioning?.layout === "BEHIND_TEXT")
    ?.embeddedObject;
}

function renderText(content: string, style: TextStyle): ReactNode {
  let node: ReactNode = content.split(/[\n\v]/).map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ));
  if (style.bold)
    node = (
      <OakSpan as="strong" $font="body-2-bold">
        {node}
      </OakSpan>
    );
  if (style.italic) node = <OakSpan as="em">{node}</OakSpan>;
  if (style.underline) node = <OakSpan as="u">{node}</OakSpan>;
  if (style.strikethrough) node = <OakSpan as="s">{node}</OakSpan>;
  if (style.baselineOffset === "SUPERSCRIPT")
    node = (
      <OakSpan as="sup" $font="body-4">
        {node}
      </OakSpan>
    );
  if (style.baselineOffset === "SUBSCRIPT")
    node = (
      <OakSpan as="sub" $font="body-4">
        {node}
      </OakSpan>
    );
  const link = style.link;
  const href =
    link?.url ?? (link?.headingId ? `#${link.headingId}` : undefined);
  if (href && safeUrl(href)) node = <OakLink href={href}>{node}</OakLink>;
  if (colourHex(style.foregroundColor) === "#ffffff") {
    node = (
      <OakSpan className="docx-text-inverted" $color="text-inverted">
        {node}
      </OakSpan>
    );
  }
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
      : Math.max(
          1,
          Math.round(value.magnitude * (value.unit === "PT" ? 96 / 72 : 1)),
        );
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
  const type = paragraph.bullet
    ? "NORMAL_TEXT"
    : (paragraph.paragraphStyle?.namedStyleType ?? "NORMAL_TEXT");
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
  const fill = colourHex(paragraph.paragraphStyle?.shading?.backgroundColor);
  if (fill) {
    return (
      <OakBox
        className="docx-paragraph-fill"
        $pa="spacing-8"
        $mb="spacing-12"
        style={{ backgroundColor: fill }}
      >
        {renderParagraph(
          {
            ...paragraph,
            paragraphStyle: { ...paragraph.paragraphStyle, shading: undefined },
          },
          document,
        )}
      </OakBox>
    );
  }
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
      <OakHeading
        {...props}
        tag={headingTags[type]}
        $font={headingFonts[type]}
        $mt="spacing-24"
        $mb="spacing-8"
      >
        {content}
      </OakHeading>
    );
  }
  return (
    <OakP
      {...props}
      $font={type === "SUBTITLE" ? "heading-light-6" : "body-2"}
      $mb="spacing-12"
      $whiteSpace="pre-wrap"
    >
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
    <OakLI key={index} $font="body-2" $mb="spacing-4">
      {renderParagraph(item.paragraph, document)}
      {item.children.map((child, index) => (
        <Fragment key={index}>{renderList(child, document, counters)}</Fragment>
      ))}
    </OakLI>
  ));
  if (!ordered)
    return (
      <OakUL
        $mb="spacing-12"
        $pl="spacing-24"
        $mt={list.level > 0 ? "spacing-4" : "spacing-0"}
      >
        {items}
      </OakUL>
    );
  const type = listTypes[properties.glyphType ?? ""];
  return (
    <OakOL
      start={start}
      type={type}
      $mb="spacing-12"
      $mt={list.level > 0 ? "spacing-4" : "spacing-0"}
    >
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
    const background = positionedBackground(element.paragraph, document);
    const backgroundSrc = background?.imageProperties?.contentUri;
    const nextParagraph = elements[index + 1]?.paragraph;
    if (
      backgroundSrc &&
      safeUrl(backgroundSrc, true) &&
      !element.paragraph?.elements?.some(
        (run) => run.textRun?.content?.trim() || run.inlineObjectElement,
      ) &&
      nextParagraph &&
      isHeading(nextParagraph.paragraphStyle?.namedStyleType ?? "")
    ) {
      let end = index + 2;
      while (end < elements.length) {
        const next = elements[end];
        if (
          !next?.paragraph ||
          isHeading(next.paragraph.paragraphStyle?.namedStyleType ?? "") ||
          positionedBackground(next.paragraph, document)
        )
          break;
        end++;
      }
      const section = elements.slice(index + 1, end);
      if (
        section.some((block) =>
          block.paragraph?.elements?.some(
            (run) => run.textRun?.textStyle?.link,
          ),
        )
      ) {
        blocks.push(
          <OakBox
            className="docx-callout"
            $pa="spacing-12"
            $mb="spacing-12"
            id={element.paragraph?.paragraphStyle?.headingId}
            style={{
              backgroundImage: `url(${JSON.stringify(backgroundSrc)})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            {renderBlocks(section, document)}
          </OakBox>,
        );
        index = end - 1;
        continue;
      }
    }
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
      const cells =
        element.table.tableRows
          ?.flatMap((row) => row.tableCells ?? [])
          .filter(
            (cell) =>
              (cell.tableCellStyle?.rowSpan ?? 1) > 0 &&
              (cell.tableCellStyle?.columnSpan ?? 1) > 0,
          ) ?? [];
      const filledBand =
        cells.length > 0 &&
        cells.every((cell) =>
          sectionColour(cell.tableCellStyle?.backgroundColor),
        );
      const outline = filledBand
        ? undefined
        : cells
            .flatMap((cell) => {
              const style = cell.tableCellStyle;
              return [
                style?.borderTop,
                style?.borderBottom,
                style?.borderLeft,
                style?.borderRight,
              ].map(borderColour);
            })
            .find(Boolean);
      blocks.push(
        <GoogleDocsSection
          $sectionColour={outline}
          $ba={outline ? "border-solid-m" : undefined}
          $maxWidth="100%"
          $overflowX="auto"
          $mb="spacing-24"
          className={["docx-table", outline && `docx-section-${outline}`]
            .filter(Boolean)
            .join(" ")}
        >
          <OakBox
            as="table"
            $width="100%"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              {element.table.tableRows?.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.tableCells?.map((cell, cellIndex) => {
                    const { rowSpan = 1, columnSpan = 1 } =
                      cell.tableCellStyle ?? {};
                    // Merged cells have zero-span placeholders in the API.
                    if (rowSpan === 0 || columnSpan === 0) return null;
                    const background = sectionColour(
                      cell.tableCellStyle?.backgroundColor,
                    );
                    const left =
                      !filledBand &&
                      borderColour(cell.tableCellStyle?.borderLeft);
                    const right =
                      !filledBand &&
                      borderColour(cell.tableCellStyle?.borderRight);
                    return (
                      <GoogleDocsCell
                        as="td"
                        $pa="spacing-8"
                        $fillColour={background}
                        $bl={left ? "border-solid-m" : undefined}
                        $br={right ? "border-solid-m" : undefined}
                        $leftColour={left || undefined}
                        $rightColour={right || undefined}
                        key={cellIndex}
                        rowSpan={rowSpan}
                        colSpan={columnSpan}
                        className={
                          [
                            background && `docx-fill-${background}`,
                            left && `docx-border-left-${left}`,
                            right && `docx-border-right-${right}`,
                          ]
                            .filter(Boolean)
                            .join(" ") || undefined
                        }
                      >
                        {renderBlocks(cell.content ?? [], document)}
                      </GoogleDocsCell>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </OakBox>
        </GoogleDocsSection>,
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

function headerHeadings(document: GoogleDocsDocument): Paragraph[] {
  const style = document.documentStyle;
  const headerId =
    (style?.useFirstPageHeaderFooter && style.firstPageHeaderId) ||
    style?.defaultHeaderId;
  const content = headerId ? document.headers?.[headerId]?.content : undefined;
  const collect = (elements: StructuralElement[]): Paragraph[] =>
    elements.flatMap((element) => {
      if (element.paragraph) {
        const paragraph = element.paragraph;
        return isHeading(paragraph.paragraphStyle?.namedStyleType ?? "") &&
          paragraph.elements?.some((element) =>
            element.textRun?.content?.trim(),
          )
          ? [paragraph]
          : [];
      }
      return (
        element.table?.tableRows?.flatMap(
          (row) =>
            row.tableCells?.flatMap((cell) => collect(cell.content ?? [])) ??
            [],
        ) ?? []
      );
    });
  return collect(content ?? []);
}

/** Retains header headings once; repeated print headers, footers and page breaks are omitted. */
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
    <GoogleDocsContent
      as="article"
      aria-label={document.title}
      $width="100%"
      $font="body-2"
      $color="text-primary"
    >
      {headerHeadings(document).map((paragraph, index) => (
        <Fragment key={`header-${index}`}>
          {renderParagraph(paragraph, document)}
        </Fragment>
      ))}
      {renderBlocks(document.body.content, document)}
    </GoogleDocsContent>
  );
}
