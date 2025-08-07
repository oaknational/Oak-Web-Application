import { safeXml } from "@ooxml-tools/xml";

import { xmlElementToJson } from "../xml";
import { appendBodyElements, createFooter, JSZipCached } from "../docx";

type Margins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  header: number;
  footer: number;
};
type Footers = {
  default?: string;
  first?: string;
  even?: string;
};
export default async function generate(
  zip: JSZipCached,
  {
    margins,
    isLast = false,
    footers,
  }: { margins: Margins; isLast?: boolean; footers?: Footers },
) {
  const wrapInParagraphIfNotLast = (isLast: boolean, xml: string) => {
    if (!isLast) {
      return safeXml`
        <w:p>
          <w:pPr>${xml}</w:pPr>
        </w:p>
      `;
    }
    return xml;
  };

  const pageXml = safeXml`
    <root>
      ${wrapInParagraphIfNotLast(
        isLast,
        safeXml`
          <w:sectPr>
            ${!footers?.first ? "" : createFooter(footers.first, "first")}
            ${!footers?.default ? "" : createFooter(footers.default, "default")}
            ${!footers?.even ? "" : createFooter(footers.even, "even")}
            <w:pgSz w:w="11906" w:h="16838" />
            <w:pgMar
              w:top="${margins.top}"
              w:right="${margins.right}"
              w:bottom="${margins.bottom}"
              w:left="${margins.left}"
              w:header="${margins.header}"
              w:footer="${margins.footer}"
              w:gutter="0"
            />
            <w:cols w:space="708" />
            <w:docGrid w:linePitch="360" />
          </w:sectPr>
        `,
      )}
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
