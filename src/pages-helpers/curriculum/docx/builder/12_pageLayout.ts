import type JSZip from "jszip";

import { xmlElementToJson } from "../xml";
import { appendBodyElements, cmToTwip } from "../docx";

export default async function generate(zip: JSZip) {
  const pageXml = `
        <root>
          <w:sectPr>
            <w:pgSz
              w:w="11906"
              w:h="16838"
            />
            <w:pgMar
              w:top="${cmToTwip(1.25)}"
              w:right="${cmToTwip(1.25)}"
              w:bottom="${cmToTwip(1.25)}"
              w:left="${cmToTwip(1.25)}"
              w:header="${cmToTwip(1.25)}"
              w:footer="${cmToTwip(1.25)}"
              w:gutter="0"
            />
            <w:cols
              w:space="708"
            />
            <w:docGrid
              w:linePitch="360"
            />
          </w:sectPr>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
