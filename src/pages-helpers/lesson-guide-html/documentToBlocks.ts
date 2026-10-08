import type { Element } from "xml-js";

import {
  attr,
  child,
  childElements,
  findDescendant,
  isOn,
  numberAttr,
  textOf,
  type NumberingLookup,
  type Relationship,
} from "./ooxml";
import { orderCellsForReading } from "./readingOrder";

export type TextInline = {
  type: "text";
  text: string;
  bold?: true;
  italic?: true;
  verticalAlign?: "superscript" | "subscript";
  href?: string;
};

export type Inline =
  | TextInline
  | { type: "break"; href?: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width?: number;
      height?: number;
      href?: string;
    };

export type ListBlock = {
  type: "list";
  ordered: boolean;
  items: { content: Inline[]; lists: ListBlock[] }[];
};

export type Block =
  | { type: "heading"; level: number; content: Inline[] }
  | { type: "paragraph"; content: Inline[] }
  | ListBlock;

export type ConversionContext = {
  relationships: Map<string, Relationship>;
  isOrderedList: NumberingLookup;
  /** Returns a URL for an image part such as "media/image1.png". */
  resolveImageSrc?: (target: string) => string | undefined;
  warnings: Set<string>;
};

type ListParagraph = {
  type: "listItem";
  content: Inline[];
  numId: string;
  level: number;
  indent?: number;
};

const SAFE_HREF = /^(https?:|mailto:|tel:)/i;
const EMU_PER_PX = 9525;

/** Converts the children of `w:body` or a table cell into blocks, flattening tables. */
export function convertBlocks(
  nodes: Element[],
  ctx: ConversionContext,
): Block[] {
  const blocks: Block[] = [];
  let listParagraphs: ListParagraph[] = [];
  const flushList = () => {
    if (listParagraphs.length > 0) blocks.push(buildList(listParagraphs, ctx));
    listParagraphs = [];
  };

  for (const node of unwrapContentControls(nodes)) {
    if (node.name === "w:p") {
      const paragraph = convertParagraph(node, ctx);
      // Empty paragraphs are spacing; skipping them also lets a list carry on
      // past a blank line.
      if (!paragraph) continue;
      if (paragraph.type === "listItem") {
        listParagraphs.push(paragraph);
      } else {
        flushList();
        blocks.push(paragraph);
      }
    } else if (node.name === "w:tbl") {
      flushList();
      blocks.push(...convertTable(node, ctx));
    }
  }
  flushList();
  return blocks;
}

function unwrapContentControls(nodes: Element[]): Element[] {
  return nodes.flatMap((node) => {
    if (node.name === "w:sdt") {
      return unwrapContentControls(childElements(child(node, "w:sdtContent")));
    }
    if (node.name === "w:customXml") {
      return unwrapContentControls(childElements(node));
    }
    return [node];
  });
}

/** Lesson guide tables are layout, so their cells are read out in a single column. */
function convertTable(table: Element, ctx: ConversionContext): Block[] {
  const cells = readTableGrid(table).map((cell) => {
    const blocks = convertBlocks(cell.nodes, ctx);
    return {
      ...cell,
      blocks,
      hasContent: blocks.length > 0,
      startsWithHeading: blocks[0]?.type === "heading",
    };
  });
  return orderCellsForReading(cells).flatMap((cell) => cell.blocks);
}

type TableCell = {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
  nodes: Element[];
};

function readTableGrid(table: Element): TableCell[] {
  const cells: TableCell[] = [];
  const occupied: TableCell[][] = [];

  childElements(table, "w:tr").forEach((row, rowIndex) => {
    const rowCells: TableCell[] = [];
    occupied[rowIndex] = rowCells;
    let col =
      numberAttr(child(child(row, "w:trPr"), "w:gridBefore"), "w:val") ?? 0;

    for (const tc of childElements(row, "w:tc")) {
      const tcPr = child(tc, "w:tcPr");
      const span = numberAttr(child(tcPr, "w:gridSpan"), "w:val") ?? 1;
      const vMerge = child(tcPr, "w:vMerge");
      const nodes = childElements(tc).filter((node) => node.name !== "w:tcPr");

      // A vertically merged cell continues the cell above it in the same column.
      const continued =
        vMerge && attr(vMerge, "w:val") !== "restart"
          ? occupied[rowIndex - 1]?.[col]
          : undefined;
      const cell = continued ?? {
        rowStart: rowIndex,
        rowEnd: rowIndex,
        colStart: col,
        colEnd: col + span - 1,
        nodes: [],
      };
      if (continued) {
        continued.rowEnd = rowIndex;
      } else {
        cells.push(cell);
      }
      cell.nodes.push(...nodes);

      for (let c = col; c < col + span; c++) rowCells[c] = cell;
      col += span;
    }
  });

  return cells;
}

function convertParagraph(
  paragraph: Element,
  ctx: ConversionContext,
): Exclude<Block, ListBlock> | ListParagraph | undefined {
  const pPr = child(paragraph, "w:pPr");
  const content = tidyInlines(
    collectInlines(childElements(paragraph), undefined, ctx),
  );
  const hasText = content.some(
    (inline) => inline.type === "text" && inline.text.trim() !== "",
  );
  if (!hasText && !content.some((inline) => inline.type === "image")) {
    return undefined;
  }

  // Heading styles also hold icons with no text; those aren't headings.
  const headingLevel = getHeadingLevel(pPr);
  if (headingLevel !== undefined && hasText) {
    return { type: "heading", level: headingLevel, content };
  }

  const numPr = child(pPr, "w:numPr");
  const numId = attr(child(numPr, "w:numId"), "w:val");
  if (numId && numId !== "0") {
    const ind = child(pPr, "w:ind");
    return {
      type: "listItem",
      content,
      numId,
      level: numberAttr(child(numPr, "w:ilvl"), "w:val") ?? 0,
      indent: numberAttr(ind, "w:left") ?? numberAttr(ind, "w:start"),
    };
  }

  return { type: "paragraph", content };
}

function getHeadingLevel(pPr: Element | undefined) {
  const style = attr(child(pPr, "w:pStyle"), "w:val") ?? "";
  if (/^title$/i.test(style)) return 1;
  const match = /^heading\s?([1-6])$/i.exec(style);
  if (match) return Number(match[1]);
  const outlineLevel = numberAttr(child(pPr, "w:outlineLvl"), "w:val");
  return outlineLevel !== undefined && outlineLevel < 6
    ? outlineLevel + 1
    : undefined;
}

/**
 * Nests list paragraphs by level, then by indent. Google Docs exports every
 * item at level 0 and shows sub-steps only through a deeper indent.
 */
function buildList(
  paragraphs: ListParagraph[],
  ctx: ConversionContext,
): ListBlock {
  const isOrdered = (paragraph: ListParagraph) => {
    const ordered = ctx.isOrderedList(paragraph.numId, paragraph.level);
    if (ordered === undefined) {
      ctx.warnings.add(
        "Some list types couldn't be found in the numbering definitions (word/numbering.xml), so those lists are shown as bulleted lists.",
      );
    }
    return ordered ?? false;
  };
  const compareDepth = (a: ListParagraph, b: ListParagraph) => {
    if (a.level !== b.level) return a.level - b.level;
    if (a.indent === undefined || b.indent === undefined) return 0;
    // Allow for rounding: Google Docs writes indents like 425.19685039370086.
    return Math.abs(a.indent - b.indent) < 20 ? 0 : a.indent - b.indent;
  };

  const [first] = paragraphs;
  const root: ListBlock = {
    type: "list",
    ordered: first ? isOrdered(first) : false,
    items: [],
  };
  const open: { list: ListBlock; depth: ListParagraph }[] = [];

  for (const paragraph of paragraphs) {
    let current = open[open.length - 1];
    while (
      current &&
      open.length > 1 &&
      compareDepth(paragraph, current.depth) < 0
    ) {
      open.pop();
      current = open[open.length - 1];
    }
    const parentItem = current?.list.items[current.list.items.length - 1];
    if (!current) {
      current = { list: root, depth: paragraph };
      open.push(current);
    } else if (parentItem && compareDepth(paragraph, current.depth) > 0) {
      const nested: ListBlock = {
        type: "list",
        ordered: isOrdered(paragraph),
        items: [],
      };
      parentItem.lists.push(nested);
      current = { list: nested, depth: paragraph };
      open.push(current);
    }
    current.list.items.push({ content: paragraph.content, lists: [] });
  }

  return root;
}

function collectInlines(
  nodes: Element[],
  href: string | undefined,
  ctx: ConversionContext,
): Inline[] {
  return nodes.flatMap((node): Inline[] => {
    switch (node.name) {
      case "w:r":
        return convertRun(node, href, ctx);
      case "w:hyperlink":
        return collectInlines(
          childElements(node),
          resolveHyperlink(node, ctx),
          ctx,
        );
      case "w:ins":
      case "w:smartTag":
      case "w:customXml":
      case "w:fldSimple":
        return collectInlines(childElements(node), href, ctx);
      case "w:sdt":
        return collectInlines(
          childElements(child(node, "w:sdtContent")),
          href,
          ctx,
        );
      default:
        // Paragraph properties, bookmarks, deleted text and proofing marks.
        return [];
    }
  });
}

function resolveHyperlink(node: Element, ctx: ConversionContext) {
  const text = textOf(node);
  const anchor = attr(node, "w:anchor");
  if (anchor) {
    ctx.warnings.add(
      `The link "${text}" points to a bookmark in the document, which isn't supported, so it's shown as plain text.`,
    );
    return undefined;
  }
  const id = attr(node, "r:id");
  const target = id ? ctx.relationships.get(id)?.target : undefined;
  return checkHref(target, `The link "${text}"`, ctx);
}

function checkHref(
  target: string | undefined,
  description: string,
  ctx: ConversionContext,
) {
  if (target === undefined) {
    ctx.warnings.add(
      `${description} has no target in the relationships (word/_rels/document.xml.rels), so it's shown without a link.`,
    );
    return undefined;
  }
  if (!SAFE_HREF.test(target.trim())) {
    ctx.warnings.add(
      `${description} goes to "${target}", which isn't a web, email or phone link, so it's shown without a link.`,
    );
    return undefined;
  }
  return target.trim();
}

function convertRun(
  run: Element,
  href: string | undefined,
  ctx: ConversionContext,
): Inline[] {
  const rPr = child(run, "w:rPr");
  const verticalAlign = attr(child(rPr, "w:vertAlign"), "w:val");
  const formatting: Pick<TextInline, "bold" | "italic" | "verticalAlign"> = {
    bold: isOn(child(rPr, "w:b")) || undefined,
    italic: isOn(child(rPr, "w:i")) || undefined,
    verticalAlign:
      verticalAlign === "superscript" || verticalAlign === "subscript"
        ? verticalAlign
        : undefined,
  };
  const text = (value: string): Inline => ({
    type: "text",
    text: value,
    ...formatting,
    href,
  });

  const convertContent = (nodes: Element[]): Inline[] =>
    nodes.flatMap((node): Inline[] => {
      switch (node.name) {
        case "w:t":
          return [
            text(
              (node.elements ?? []).map((t) => String(t.text ?? "")).join(""),
            ),
          ];
        case "w:tab":
          return [text(" ")];
        case "w:noBreakHyphen":
          return [text("-")];
        case "w:br":
        case "w:cr": {
          const breakType = attr(node, "w:type");
          return breakType === "page" || breakType === "column"
            ? []
            : [{ type: "break", href }];
        }
        case "w:drawing":
          return convertDrawing(node, href, ctx);
        case "mc:AlternateContent":
          return convertContent(childElements(child(node, "mc:Choice")));
        default:
          return [];
      }
    });

  return convertContent(childElements(run));
}

function convertDrawing(
  drawing: Element,
  href: string | undefined,
  ctx: ConversionContext,
): Inline[] {
  const frame = child(drawing, "wp:inline") ?? child(drawing, "wp:anchor");
  const docPr = child(frame, "wp:docPr");
  const name = attr(docPr, "name") ?? "image";

  if (findDescendant(drawing, (el) => el.name === "w:txbxContent")) {
    ctx.warnings.add(
      `Text box "${name}" was left out: text boxes aren't converted yet.`,
    );
    return [];
  }
  // Word's "Mark as decorative" setting: <adec:decorative val="1"/>.
  const markedDecorative = findDescendant(
    docPr,
    (el) =>
      el.name?.endsWith(":decorative") === true &&
      !["0", "false"].includes(attr(el, "val") ?? "1"),
  );
  if (markedDecorative) return [];

  const alt = (attr(docPr, "descr") ?? attr(docPr, "title") ?? "").trim();
  if (!alt) {
    ctx.warnings.add(
      `Image "${name}" has no alt text, so it was treated as decorative and left out.`,
    );
    return [];
  }

  const embed = attr(
    findDescendant(drawing, (el) => el.name === "a:blip"),
    "r:embed",
  );
  const target = embed ? ctx.relationships.get(embed)?.target : undefined;
  const src = target ? ctx.resolveImageSrc?.(target) : undefined;
  if (!src) {
    ctx.warnings.add(
      `Image "${name}" (alt text "${alt}") couldn't be loaded, so it was left out.`,
    );
    return [];
  }

  const imageLink = attr(child(docPr, "a:hlinkClick"), "r:id");
  const imageHref = imageLink
    ? checkHref(
        ctx.relationships.get(imageLink)?.target,
        `The link on image "${name}"`,
        ctx,
      )
    : href;
  if (!imageHref && /\bclick\b/i.test(alt)) {
    ctx.warnings.add(
      `Image "${name}" has alt text that says to click it ("${alt}"), but it has no link.`,
    );
  }

  const extent = child(frame, "wp:extent");
  const toPx = (emu?: number) =>
    emu ? Math.round(emu / EMU_PER_PX) : undefined;
  return [
    {
      type: "image",
      src,
      alt,
      width: toPx(numberAttr(extent, "cx")),
      height: toPx(numberAttr(extent, "cy")),
      href: imageHref,
    },
  ];
}

const sameFormatting = (a: TextInline, b: TextInline) =>
  a.bold === b.bold &&
  a.italic === b.italic &&
  a.verticalAlign === b.verticalAlign &&
  a.href === b.href;

/**
 * Joins runs that Word split mid-word ("les" + "son.") and trims the
 * paragraph. Formatting on whitespace alone is dropped so it can join up.
 */
function tidyInlines(inlines: Inline[]): Inline[] {
  const tidied: Inline[] = [];
  for (const inline of inlines) {
    if (inline.type !== "text") {
      tidied.push(inline);
      continue;
    }
    const current: TextInline =
      inline.text.trim() === ""
        ? { type: "text", text: inline.text, href: inline.href }
        : inline;
    const previous = tidied[tidied.length - 1];
    if (previous?.type === "text" && sameFormatting(previous, current)) {
      tidied[tidied.length - 1] = {
        ...previous,
        text: previous.text + current.text,
      };
    } else {
      tidied.push(current);
    }
  }

  const first = tidied[0];
  if (first?.type === "text") {
    tidied[0] = { ...first, text: first.text.trimStart() };
  }
  const last = tidied[tidied.length - 1];
  if (last?.type === "text") {
    tidied[tidied.length - 1] = { ...last, text: last.text.trimEnd() };
  }
  return tidied.filter(
    (inline) => inline.type !== "text" || inline.text !== "",
  );
}
