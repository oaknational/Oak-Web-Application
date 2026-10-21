import Mammoth from "mammoth/mammoth.browser";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";
import { mammothStyleMap } from "./mammothStyles";

/** Conversion runs on the server with a request-local DOM, never global DOM shims. */
export async function getParsedDocx(fileId: string) {
  const response = await fetch(
    `https://docs.google.com/document/d/${fileId}/export?format=docx`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(
      `Google Docs export failed: ${response.status} ${response.statusText}`,
    );
  }
  const dom = new JSDOM();
  try {
    const { arrayBuffer, convertImage, sectionBorders, paragraphFills } =
      await prepareMammothImages(await response.arrayBuffer(), dom.window);
    const result = await Mammoth.convertToHtml(
      { arrayBuffer },
      {
        styleMap: mammothStyleMap,
        includeDefaultStyleMap: true,
        includeEmbeddedStyleMap: false,
        ignoreEmptyParagraphs: true,
        idPrefix: "mammoth-",
        convertImage,
      },
    );
    const html = restoreMammothCallouts(
      result.value,
      sectionBorders,
      dom.window.document,
      paragraphFills,
    );
    return {
      fileId,
      html: createDOMPurify(dom.window).sanitize(html),
      messages: result.messages.map((message) => message.message),
    };
  } finally {
    dom.window.close();
  }
}
