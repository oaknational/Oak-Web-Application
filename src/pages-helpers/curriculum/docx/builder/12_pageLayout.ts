import type JSZip from "jszip";

import { safeXml, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  createHeader,
  insertHeaders,
  createFooter,
  insertFooters,
} from "../docx";

const DISABLE_HEADERS = true;
const DISABLE_FOOTERS = false;

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

  const headers = await insertHeaders(zip, {
    default: safeXml`
      <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      <w:hdr
        xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
        xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
        xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex"
        xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex"
        xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex"
        xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex"
        xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex"
        xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex"
        xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex"
        xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"
        xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:oel="http://schemas.microsoft.com/office/2019/extlst"
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
        xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
        xmlns:w10="urn:schemas-microsoft-com:office:word"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
        xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"
        xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"
        xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"
        xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"
        xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"
        xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
        xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
        xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
        xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
        mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14"
      >
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Header" />
          </w:pPr>
          <w:r>
            <w:t />
          </w:r>
        </w:p>
      </w:hdr>
    `,
  });

  const footers = await insertFooters(zip, {
    default: safeXml`
      <?xml version="1.0" encoding="UTF-8" standalone="yes" ?>
      <w:ftr
        xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
        xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex"
        xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex"
        xmlns:cx2="http://schemas.microsoft.com/office/drawing/2015/10/21/chartex"
        xmlns:cx3="http://schemas.microsoft.com/office/drawing/2016/5/9/chartex"
        xmlns:cx4="http://schemas.microsoft.com/office/drawing/2016/5/10/chartex"
        xmlns:cx5="http://schemas.microsoft.com/office/drawing/2016/5/11/chartex"
        xmlns:cx6="http://schemas.microsoft.com/office/drawing/2016/5/12/chartex"
        xmlns:cx7="http://schemas.microsoft.com/office/drawing/2016/5/13/chartex"
        xmlns:cx8="http://schemas.microsoft.com/office/drawing/2016/5/14/chartex"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        xmlns:aink="http://schemas.microsoft.com/office/drawing/2016/ink"
        xmlns:am3d="http://schemas.microsoft.com/office/drawing/2017/model3d"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:oel="http://schemas.microsoft.com/office/2019/extlst"
        xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
        xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
        xmlns:v="urn:schemas-microsoft-com:vml"
        xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
        xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
        xmlns:w10="urn:schemas-microsoft-com:office:word"
        xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
        xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
        xmlns:w16cex="http://schemas.microsoft.com/office/word/2018/wordml/cex"
        xmlns:w16cid="http://schemas.microsoft.com/office/word/2016/wordml/cid"
        xmlns:w16="http://schemas.microsoft.com/office/word/2018/wordml"
        xmlns:w16sdtdh="http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash"
        xmlns:w16se="http://schemas.microsoft.com/office/word/2015/wordml/symex"
        xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
        xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
        xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
        xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
        mc:Ignorable="w14 w15 w16se w16cid w16 w16cex w16sdtdh wp14"
      >
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Footer" />
          </w:pPr>
          <w:r>
            <w:t />
          </w:r>
        </w:p>
      </w:ftr>
    `,
  });

  const pageXml = safeXml`
    <root>
      ${wrapInParagraphIfNotLast(
        isLast,
        safeXml`
          <w:sectPr>
            ${DISABLE_HEADERS ? "" : createHeader(headers.default, "first")}
            ${DISABLE_HEADERS ? "" : createHeader(headers.default, "default")}
            ${DISABLE_HEADERS ? "" : createHeader(headers.default, "even")}
            ${DISABLE_FOOTERS ? "" : createFooter(footers.default, "first")}
            ${DISABLE_FOOTERS ? "" : createFooter(footers.default, "default")}
            ${DISABLE_FOOTERS ? "" : createFooter(footers.default, "even")}
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
