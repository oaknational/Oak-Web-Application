import type { Element } from "xml-js";

import { checkWithinElement } from "../../docx";
import { xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

export function unitLessonsPatch(
  unit: CombinedCurriculumData["units"][number],
) {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(el, (inner: Element) => {
        return inner.type === "text" && inner.text === "{{=UNIT.LESSONS}}";
      })
    ) {
      const listRules = {
        // TODO: We should be using numbering here, but the numbered lists don't reset currently.
        numbering: `
          <w:ilvl w:val="0"/>
          <w:numId w:val="8"/>
        `,
        bullets: `
          <w:ilvl w:val="0"/>
          <w:numId w:val="3"/>
        `,
      };

      const lessonsXml =
        unit.lessons?.map((lesson) => {
          return `
          <w:p>
              <w:pPr>
                  <w:numPr>
                    ${listRules.bullets}
                  </w:numPr>
                  <w:spacing w:line="240" w:lineRule="auto"/>
                  <w:ind w:left="425" w:right="-17"/>
                  <w:rPr>
                      <w:color w:val="222222"/>
                  </w:rPr>
              </w:pPr>
              <w:r>
                  <w:rPr>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t><![CDATA[${lesson.title}]]></w:t>
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
