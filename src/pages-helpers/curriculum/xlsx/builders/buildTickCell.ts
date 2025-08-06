import { cartesianToExcelCoords } from "@ooxml-tools/units";

import { cdata, safeXml } from "../../docx/xml";
import { XmlIndexMap } from "../helper";

export function buildTickCell<T extends XmlIndexMap>(
  cellStyleIndexMap: T,
  hasNcCriteria: boolean,
  x: number,
  y: number,
) {
  return safeXml`
    <c
      r="${cartesianToExcelCoords([x, y])}"
      t="inlineStr"
      s="${hasNcCriteria ? cellStyleIndexMap.temp5! : cellStyleIndexMap.temp0!}"
    >
      <is>
        <t>${cdata(hasNcCriteria ? "✓" : "")}</t>
      </is>
    </c>
  `;
}
