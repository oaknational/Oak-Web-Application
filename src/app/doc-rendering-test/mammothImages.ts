import JSZip from "jszip";
import Mammoth from "mammoth/mammoth.browser";
import { oakColorTokens } from "@oaknational/oak-components";

const wordDrawingNamespace =
  "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
const wordNamespace =
  "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

export const sectionColours = ["mint", "purple", "teal", "blue"] as const;
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
  return root.innerHTML;
}
