import JSZip from "jszip";
import Mammoth from "mammoth/mammoth.browser";

const wordDrawingNamespace =
  "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";

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
export function restoreMammothCallouts(html: string) {
  const root = document.createElement("div");
  root.innerHTML = html;
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
