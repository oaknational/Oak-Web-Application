import type { Element } from "xml-js";

import { checkWithinElement } from "../../docx";
import { xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

export function unitThreadsPatch(
  unit: CombinedCurriculumData["units"][number],
) {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(el, (inner: Element) => {
        return inner.type === "text" && inner.text === "{{=UNIT.THREADS}}";
      })
    ) {
      const lessonsXml =
        unit.threads.map((thread) => {
          return `
          <w:p>
              <w:pPr>
                <w:widowControl w:val="0"/>
                <w:numPr>
                    <w:ilvl w:val="0"/>
                    <w:numId w:val="3"/>
                </w:numPr>
                <w:spacing w:line="240" w:lineRule="auto"/>
                <w:ind w:left="425" w:right="0"/>
                <w:rPr>
                    <w:color w:val="222222"/>
                </w:rPr>
              </w:pPr>
              <w:r>
                  <w:rPr>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t><![CDATA[${thread.title}]]></w:t>
              </w:r>
          </w:p>
        ` as Element;
        }) ?? [];
      const xml = `<w:sectPr>${lessonsXml.join("")}</w:sectPr>`;
      return xmlElementToJson(xml) as Element;
    }
    return el;
  };
}
