import JSZip from "jszip";
import Mammoth from "mammoth/mammoth.browser";
import { oakColorTokens } from "@oaknational/oak-components";

import { sectionColours } from "./MammothDocumentPreview";

const wordDrawingNamespace =
  "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
const wordNamespace =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const relationshipNamespace =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

async function restoreHeaderHeadings(zip: JSZip, xml: Document) {
  const section = xml.getElementsByTagNameNS(wordNamespace, "sectPr")[0];
  const references = Array.from(
    section?.getElementsByTagNameNS(wordNamespace, "headerReference") ?? [],
  );
  const firstPage = section?.getElementsByTagNameNS(
    wordNamespace,
    "titlePg",
  )[0];
  const useFirstPage =
    firstPage &&
    !["0", "false", "off"].includes(
      firstPage.getAttributeNS(wordNamespace, "val") ?? "",
    );
  const reference =
    (useFirstPage &&
      references.find(
        (node) => node.getAttributeNS(wordNamespace, "type") === "first",
      )) ||
    references.find(
      (node) => node.getAttributeNS(wordNamespace, "type") === "default",
    );
  if (!reference) return;
  const relationships = zip.file("word/_rels/document.xml.rels");
  if (!relationships) throw new Error("DOCX is missing document relationships");
  const relations = new DOMParser().parseFromString(
    await relationships.async("string"),
    "application/xml",
  );
  const id = reference.getAttributeNS(relationshipNamespace, "id");
  const relationship = Array.from(
    relations.getElementsByTagNameNS("*", "Relationship"),
  ).find((node) => node.getAttribute("Id") === id);
  const target = relationship?.getAttribute("Target");
  if (!target || relationship?.getAttribute("TargetMode") === "External") {
    throw new Error("DOCX header relationship is invalid");
  }
  const path = new URL(
    target,
    "https://docx.local/word/document.xml",
  ).pathname.slice(1);
  const part = zip.file(path);
  if (!part) throw new Error(`DOCX is missing header part: ${path}`);
  const header = new DOMParser().parseFromString(
    await part.async("string"),
    "application/xml",
  );
  if (header.getElementsByTagName("parsererror").length) {
    throw new Error("DOCX contains invalid header XML");
  }
  const body = xml.getElementsByTagNameNS(wordNamespace, "body")[0];
  if (!body) throw new Error("DOCX is missing document body");
  const first = body.firstChild;
  for (const paragraph of Array.from(
    header.getElementsByTagNameNS(wordNamespace, "p"),
  )) {
    const style = paragraph
      .getElementsByTagNameNS(wordNamespace, "pStyle")[0]
      ?.getAttributeNS(wordNamespace, "val");
    const text = Array.from(
      paragraph.getElementsByTagNameNS(wordNamespace, "t"),
    )
      .map((node) => node.textContent ?? "")
      .join("");
    if (!style || !/^(Title|Heading[1-6])$/i.test(style) || !text.trim())
      continue;
    // Copy heading text, not header drawings or relationships scoped to its part.
    const heading = xml.createElementNS(wordNamespace, "w:p");
    const properties = xml.createElementNS(wordNamespace, "w:pPr");
    const headingStyle = xml.createElementNS(wordNamespace, "w:pStyle");
    headingStyle.setAttributeNS(wordNamespace, "w:val", style);
    properties.appendChild(headingStyle);
    heading.appendChild(properties);
    const run = xml.createElementNS(wordNamespace, "w:r");
    const content = xml.createElementNS(wordNamespace, "w:t");
    content.textContent = text;
    run.appendChild(content);
    heading.appendChild(run);
    body.insertBefore(heading, first);
  }
}

type SectionColour = (typeof sectionColours)[number];
type CellStyle = {
  background?: SectionColour;
  inverted: boolean;
  left?: SectionColour;
  right?: SectionColour;
};
type SectionStyle = {
  border?: SectionColour;
  cells: (CellStyle | undefined)[];
};

function readSectionColours(xml: Document): SectionStyle[] {
  const colourToken = (hex: string | null) =>
    sectionColours.find(
      (token) =>
        oakColorTokens[token].toLowerCase() === `#${hex?.toLowerCase()}`,
    );
  return Array.from(xml.getElementsByTagNameNS(wordNamespace, "tbl")).map(
    (table) => {
      const properties = Array.from(
        table.getElementsByTagNameNS(wordNamespace, "tc"),
      )
        .filter((cell) => cell.closest("tbl") === table)
        .map((cell) => cell.getElementsByTagNameNS(wordNamespace, "tcPr")[0]);
      // Mammoth omits continuation cells covered by a vertical merge.
      const cells = properties
        .filter((property) => {
          const merge = property?.getElementsByTagNameNS(
            wordNamespace,
            "vMerge",
          )[0];
          return (
            !merge || merge.getAttributeNS(wordNamespace, "val") === "restart"
          );
        })
        .map((property) => {
          if (!property) return undefined;
          const shading = property.getElementsByTagNameNS(
            wordNamespace,
            "shd",
          )[0];
          const background = colourToken(
            shading?.getAttributeNS(wordNamespace, "fill") ?? null,
          );
          const borders = property.getElementsByTagNameNS(
            wordNamespace,
            "tcBorders",
          )[0];
          const verticalBorder = (side: "left" | "right") => {
            const border = borders?.getElementsByTagNameNS(
              wordNamespace,
              side,
            )[0];
            const style = border?.getAttributeNS(wordNamespace, "val");
            if (!style || style === "nil" || style === "none") return undefined;
            return colourToken(
              border?.getAttributeNS(wordNamespace, "color") ?? null,
            );
          };
          const textColours = Array.from(
            property.parentElement?.getElementsByTagNameNS(
              wordNamespace,
              "color",
            ) ?? [],
          );
          return {
            background,
            left: verticalBorder("left"),
            right: verticalBorder("right"),
            inverted: textColours.some(
              (colour) =>
                colour.getAttributeNS(wordNamespace, "val")?.toLowerCase() ===
                "ffffff",
            ),
          };
        });
      // Fully shaded heading bands are fills, not outlines around a section.
      if (cells.length && cells.every((cell) => cell?.background)) {
        return {
          cells: cells.map(
            (cell) =>
              cell && {
                background: cell.background,
                inverted: cell.inverted,
              },
          ),
        };
      }
      for (const property of properties) {
        if (!property) continue;
        const borders = property.getElementsByTagNameNS(
          wordNamespace,
          "tcBorders",
        )[0];
        for (const border of Array.from(borders?.children ?? [])) {
          const style = border.getAttributeNS(wordNamespace, "val");
          if (!style || style === "nil" || style === "none") continue;
          const colour = colourToken(
            border.getAttributeNS(wordNamespace, "color"),
          );
          if (colour) return { border: colour, cells };
        }
      }
      return { cells };
    },
  );
}

type Drawing = {
  alt: string;
  width?: number;
  height?: number;
  background: boolean;
  pagePosition?: { x: number; y: number };
};

/**
 * Mammoth retains image bytes but discards drawing dimensions and positioning.
 * Temporary alt-text IDs carry that metadata through its image conversion API.
 */
export async function prepareMammothImages(arrayBuffer: ArrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const part = zip.file("word/document.xml");
  if (!part) throw new Error("DOCX is missing word/document.xml");
  const xml = new DOMParser().parseFromString(
    await part.async("string"),
    "application/xml",
  );
  if (xml.getElementsByTagName("parsererror").length) {
    throw new Error("DOCX contains invalid document XML");
  }
  await restoreHeaderHeadings(zip, xml);
  const drawings = new Map<string, Drawing>();
  const pixels = (value: string | null) => {
    const emu = Number(value);
    return Number.isFinite(emu) && emu > 0
      ? Math.max(1, Math.round(emu / 9525))
      : undefined;
  };
  for (const drawing of Array.from(
    xml.getElementsByTagNameNS("*", "drawing"),
  )) {
    const properties = drawing.getElementsByTagNameNS(
      wordDrawingNamespace,
      "docPr",
    )[0];
    if (!properties) continue;
    const extent = drawing.getElementsByTagNameNS(
      wordDrawingNamespace,
      "extent",
    )[0];
    const anchor = drawing.getElementsByTagNameNS(
      wordDrawingNamespace,
      "anchor",
    )[0];
    const id = `mammoth-drawing-${drawings.size}`;
    const pageOffset = (direction: "positionH" | "positionV") => {
      const position = anchor?.getElementsByTagNameNS(
        wordDrawingNamespace,
        direction,
      )[0];
      if (position?.getAttribute("relativeFrom") !== "page") return undefined;
      const value = position.getElementsByTagNameNS(
        wordDrawingNamespace,
        "posOffset",
      )[0]?.textContent;
      if (!value?.trim()) return undefined;
      const offset = Number(value);
      return Number.isFinite(offset) ? offset : undefined;
    };
    const x = pageOffset("positionH");
    const y = pageOffset("positionV");
    drawings.set(id, {
      alt:
        properties.getAttribute("descr") ||
        properties.getAttribute("title") ||
        "",
      width: pixels(extent?.getAttribute("cx") ?? null),
      height: pixels(extent?.getAttribute("cy") ?? null),
      background: ["1", "true"].includes(
        anchor?.getAttribute("behindDoc") ?? "",
      ),
      pagePosition: x !== undefined && y !== undefined ? { x, y } : undefined,
    });
    properties.setAttribute("descr", id);
  }
  zip.file("word/document.xml", new XMLSerializer().serializeToString(xml));
  return {
    sectionBorders: readSectionColours(xml),
    arrayBuffer: await zip.generateAsync({ type: "arraybuffer" }),
    convertImage: Mammoth.images.imgElement(async (image) => {
      const metadata =
        "altText" in image && typeof image.altText === "string"
          ? drawings.get(image.altText)
          : undefined;
      return {
        src: `data:${image.contentType};base64,${await image.readAsBase64String()}`,
        ...(metadata
          ? {
              alt: metadata.alt,
              ...(metadata.width ? { width: String(metadata.width) } : {}),
              ...(metadata.height ? { height: String(metadata.height) } : {}),
              ...(metadata.background
                ? { "data-docx-background": "true" }
                : {}),
              ...(metadata.pagePosition && !metadata.background
                ? {
                    "data-docx-page-x": String(metadata.pagePosition.x),
                    "data-docx-page-y": String(metadata.pagePosition.y),
                  }
                : {}),
            }
          : {}),
      };
    }),
  };
}

/** Reunites decorative backgrounds with their heading and linked text. */
export function restoreMammothCallouts(
  html: string,
  sectionBorders: SectionStyle[] = [],
) {
  const root = document.createElement("div");
  root.innerHTML = html;
  const tables = root.querySelectorAll("table");
  if (
    sectionBorders.some((style) => style.border || style.cells.some(Boolean)) &&
    tables.length !== sectionBorders.length
  ) {
    throw new Error("DOCX section tables do not match the converted HTML");
  }
  tables.forEach((table, index) => {
    const style = sectionBorders[index];
    if (style?.border)
      table.parentElement?.classList.add(`docx-section-${style.border}`);
    const cells = Array.from(table.querySelectorAll("td, th")).filter(
      (cell) => cell.closest("table") === table,
    );
    style?.cells.forEach((fill, cellIndex) => {
      if (!fill) return;
      const cell = cells[cellIndex];
      if (!cell)
        throw new Error("DOCX shaded cell is missing from converted HTML");
      if (fill.background) cell.classList.add(`docx-fill-${fill.background}`);
      if (fill.left) cell.classList.add(`docx-border-left-${fill.left}`);
      if (fill.right) cell.classList.add(`docx-border-right-${fill.right}`);
      if (fill.inverted) cell.classList.add("docx-text-inverted");
    });
  });
  for (const image of Array.from(
    root.querySelectorAll<HTMLImageElement>("img[data-docx-background]"),
  )) {
    const paragraph = image.closest("p, h1, h2, h3, h4, h5, h6");
    if (!paragraph || paragraph.textContent?.trim()) continue;
    if (paragraph.querySelectorAll("img").length !== 1) continue;
    const heading = paragraph.nextElementSibling;
    if (!heading?.matches("h1, h2, h3, h4, h5, h6")) continue;
    const content: Element[] = [heading];
    let next = heading.nextElementSibling;
    while (
      next &&
      !next.matches("h1, h2, h3, h4, h5, h6, .docx-table") &&
      !next.querySelector("img[data-docx-background]")
    ) {
      content.push(next);
      next = next.nextElementSibling;
    }
    if (!content.some((element) => element.querySelector("a[href]"))) continue;
    const src = image.getAttribute("src") ?? "";
    if (!/^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(src)) continue;
    const callout = document.createElement("div");
    callout.className = "docx-callout";
    callout.style.backgroundImage = `url("${src}")`;
    // Preserve bookmark targets belonging to the original background paragraph.
    for (const bookmark of Array.from(paragraph.querySelectorAll("a[id]"))) {
      callout.append(bookmark);
    }
    paragraph.replaceWith(callout);
    callout.append(...content);
  }
  // Page-anchored icons share an anchor paragraph but belong to the following
  // table's callouts in vertical page order, not drawing/XML order.
  for (const paragraph of Array.from(
    root.querySelectorAll("p, h1, h2, h3, h4, h5, h6"),
  )) {
    const icons = Array.from(
      paragraph.querySelectorAll<HTMLImageElement>(
        "img[data-docx-page-x][data-docx-page-y]",
      ),
    );
    if (
      icons.length < 2 ||
      paragraph.textContent?.trim() ||
      paragraph.querySelectorAll("img").length !== icons.length ||
      !icons.every(
        (icon) => icon.dataset.docxPageX === icons[0]?.dataset.docxPageX,
      )
    )
      continue;
    const table = paragraph.nextElementSibling;
    if (!table?.matches(".docx-table")) continue;
    const headings = Array.from(table.querySelectorAll(".docx-callout")).map(
      (callout) => callout.querySelector("h1, h2, h3, h4, h5, h6"),
    );
    if (
      headings.length !== icons.length ||
      headings.some((heading) => !heading)
    )
      continue;
    icons.sort(
      (a, b) => Number(a.dataset.docxPageY) - Number(b.dataset.docxPageY),
    );
    icons.forEach((icon, index) => {
      icon.classList.add("docx-callout-icon");
      delete icon.dataset.docxPageX;
      delete icon.dataset.docxPageY;
      const callout = headings[index]!.parentElement!;
      const text = document.createElement("div");
      text.className = "docx-callout-text";
      text.append(...Array.from(callout.childNodes));
      callout.classList.add("docx-callout-with-icon");
      callout.append(text, icon);
    });
    // Keep any bookmark targets at their original location.
    if (!paragraph.querySelector("a[id]")) paragraph.remove();
  }
  return root.innerHTML;
}
