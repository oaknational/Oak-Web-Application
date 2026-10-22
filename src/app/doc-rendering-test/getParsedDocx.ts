import Mammoth from "mammoth/mammoth.browser";
import DOMPurify from "dompurify";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";
import { mammothStyleMap } from "./mammothStyles";

/** Converts the public DOCX export using the browser DOM. */
export async function getParsedDocx(fileId: string, signal?: AbortSignal) {
  const response = await fetch(
    `https://docs.google.com/document/d/${fileId}/export?format=docx`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(
      `Google Docs export failed: ${response.status} ${response.statusText}`,
    );
  }
  const { arrayBuffer, convertImage, sectionBorders, paragraphFills } =
    await prepareMammothImages(await response.arrayBuffer());
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
    document,
    paragraphFills,
  );
  return {
    fileId,
    html: DOMPurify.sanitize(html),
    messages: result.messages.map((message) => message.message),
  };
}
