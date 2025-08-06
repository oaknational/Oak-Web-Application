import { cartesianToExcelCoords } from "@ooxml-tools/units";

import { cdata, safeXml } from "../../docx/xml";
import { XmlIndexMap } from "../helper";

import { Unit } from "@/utils/curriculum/types";

export function buildUnitCell<T extends XmlIndexMap>(
  cellStyleIndexMap: T,
  x: number,
  y: number,
  unit: Unit,
  unitIndex: number,
  prefix?: string,
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
              `\n${prefix ? `${prefix}\n` : ""}Unit ${unitIndex + 1}\n`,
            )}</t>
        </r>
        <r>
          <rPr>
            <sz val="14" />
            <color rgb="FF000000" />
            <rFont val="Arial Bold" />
            <family val="2" />
          </rPr>
          <t xml:space="preserve">${cdata(`${unit.title}\n`)}</t>
        </r>
      </is>
    </c>
  `;
}
