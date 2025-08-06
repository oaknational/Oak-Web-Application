import { cartesianToExcelCoords } from "@ooxml-tools/units";
import { cdata, safeXml } from "@ooxml-tools/xml";

import { UnitOption } from "@/utils/curriculum/types";

export function buildUnitOptionCell<T extends Record<string, string>>(
  cellStyleIndexMap: T,
  x: number,
  y: number,
  unitOption: UnitOption,
  unitOptionIndex: number,
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
            <sz val="14" />
            <color rgb="FF000000" />
            <rFont val="Arial" />
            <family val="2" />
          </rPr>
          <t xml:space="preserve">${cdata(
              `\nOption ${unitOptionIndex + 1}\n`,
            )}</t>
        </r>
        <r>
          <rPr>
            <sz val="14" />
            <color rgb="FF000000" />
            <rFont val="Arial Bold" />
            <family val="2" />
          </rPr>
          <t xml:space="preserve">${cdata(`${unitOption.title}\n`)}</t>
        </r>
      </is>
    </c>
  `;
}
