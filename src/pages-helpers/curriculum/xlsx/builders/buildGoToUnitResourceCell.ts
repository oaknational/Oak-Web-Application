import { cartesianToExcelCoords } from "@ooxml-tools/units";

import { safeXml } from "../../docx/xml";
import { XmlIndexMap } from "../helper";

export function buildGoToUnitResourceCell<T extends XmlIndexMap>(
  cellStyleIndexMap: T,
  x: number,
  y: number,
) {
  return safeXml`
    <c
      r="${cartesianToExcelCoords([x, y])}"
      t="inlineStr"
      s="${cellStyleIndexMap.temp3!}"
    >
      <is>
        <r>
          <rPr>
            <sz val="12" />
            <color rgb="FF000000" />
            <rFont val="Arial" />
            <family val="2" />
            <u val="single" />
          </rPr>
          <t>Go to unit resources</t>
        </r>
      </is>
    </c>
  `;
}
