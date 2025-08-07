import { cartesianToExcelCoords } from "@ooxml-tools/units";
import { cdata, safeXml } from "@ooxml-tools/xml";

import { XmlIndexMap } from "../helper";

export function buildNcCriteriaText<T extends XmlIndexMap>({
  cellStyleIndexMap,
  nationalCurricText,
  x,
  y,
}: {
  cellStyleIndexMap: T;
  nationalCurricText: string;
  x: number;
  y: number;
}) {
  return safeXml`
    <c
      r="${cartesianToExcelCoords([x, y])}"
      t="inlineStr"
      s="${cellStyleIndexMap.temp4!}"
    >
      <is>
        <t xml:space="preserve">${cdata(`\n${nationalCurricText}\n`)}</t>
      </is>
    </c>
  `;
}
