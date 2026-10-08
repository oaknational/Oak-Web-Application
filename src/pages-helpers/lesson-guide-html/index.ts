import JSZip from "jszip";

import { blocksToHtml, type RenderOptions } from "./blocksToHtml";
import { convertBlocks, type ConversionContext } from "./documentToBlocks";
import {
  child,
  childElements,
  parseNumbering,
  parseRelationships,
  parseXml,
} from "./ooxml";

export {
  DEFAULT_SYMBOL_LABELS,
  renderStandaloneHtml,
  VISUALLY_HIDDEN_CLASS,
} from "./blocksToHtml";

export type LessonGuideParts = {
  /** `word/document.xml` */
  documentXml: string;
  /** `word/_rels/document.xml.rels`: link targets and image files. */
  relationshipsXml?: string;
  /** `word/numbering.xml`: whether each list is numbered or bulleted. */
  numberingXml?: string;
};

export type LessonGuideHtmlOptions = RenderOptions & {
  /** Returns a URL for an image part such as "media/image1.png". Images without one are left out. */
  resolveImageSrc?: (target: string) => string | undefined;
};

export type LessonGuideHtml = {
  /** Headings, paragraphs and lists, read in a single column. */
  html: string;
  /** Content that was left out or simplified, for whoever maintains the guide. */
  warnings: string[];
};

/**
 * Converts a lesson guide's WordprocessingML to accessible HTML. The guides'
 * landscape layout tables are flattened into a single reading order (see
 * `orderCellsForReading`).
 */
export function lessonGuideXmlToHtml(
  parts: LessonGuideParts,
  options: LessonGuideHtmlOptions = {},
): LessonGuideHtml {
  const body = child(
    child(parseXml(parts.documentXml), "w:document"),
    "w:body",
  );
  if (!body) {
    throw new Error("Expected a Word document.xml with a <w:body> element");
  }

  const ctx: ConversionContext = {
    relationships: parseRelationships(parts.relationshipsXml),
    isOrderedList: parseNumbering(parts.numberingXml),
    resolveImageSrc: options.resolveImageSrc,
    warnings: new Set(),
  };
  const blocks = convertBlocks(childElements(body), ctx);
  return { html: blocksToHtml(blocks, options), warnings: [...ctx.warnings] };
}

const IMAGE_TYPES: Record<string, string> = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
};

/** Converts a lesson guide `.docx`, embedding its images as data URLs. */
export async function lessonGuideDocxToHtml(
  docx: ArrayBuffer | Uint8Array,
  options: LessonGuideHtmlOptions = {},
): Promise<LessonGuideHtml> {
  const zip = await JSZip.loadAsync(docx);
  const read = (path: string) => zip.file(path)?.async("string");

  const documentXml = await read("word/document.xml");
  if (!documentXml) {
    throw new Error("The .docx file has no word/document.xml");
  }
  const relationshipsXml = await read("word/_rels/document.xml.rels");
  const numberingXml = await read("word/numbering.xml");

  const imageSrcs = new Map<string, string>();
  for (const { target, type, external } of parseRelationships(
    relationshipsXml,
  ).values()) {
    if (external || !type.endsWith("/image")) continue;
    // Targets are relative to word/, e.g. "media/image1.png".
    const path = new URL(target, "file:///word/").pathname.slice(1);
    const mimeType = IMAGE_TYPES[path.split(".").pop()?.toLowerCase() ?? ""];
    const file = zip.file(path);
    if (mimeType && file) {
      imageSrcs.set(
        target,
        `data:${mimeType};base64,${await file.async("base64")}`,
      );
    }
  }

  return lessonGuideXmlToHtml(
    { documentXml, relationshipsXml, numberingXml },
    { resolveImageSrc: (target) => imageSrcs.get(target), ...options },
  );
}
