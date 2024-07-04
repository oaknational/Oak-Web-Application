import type JSZip from "jszip";

import { xmlElementToJson } from "../xml";
import { appendBodyElements } from "../docx";

type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  header: number;
  footer: number;
};
export default async function generate(
  zip: JSZip,
  { margins, isLast = false }: { margins: Margins; isLast?: boolean },
) {
  const pageXml = `
        <root>
          ${isLast ? "" : "<w:p><w:pPr>"}
            <w:sectPr>
              <w:pgSz
                w:w="11906"
                w:h="16838"
              />
              <w:pgMar
                w:top="${margins.top}"
                w:right="${margins.right}"
                w:bottom="${margins.bottom}"
                w:left="${margins.left}"
                w:header="${margins.header}"
                w:footer="${margins.footer}"
                w:gutter="0"
              />
              <w:cols
                w:space="708"
              />
              <w:docGrid
                w:linePitch="360"
              />
            </w:sectPr>
          ${isLast ? "" : "</w:pPr></w:p>"}
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
