import type { Element } from "xml-js";

import { textIncludes } from "./util";

import { checkWithinElement } from "@/components/CurriculumComponents/DocxPOC/docx";
import { xmlElementToJson } from "@/components/CurriculumComponents/DocxPOC/patches/xml";

export function endOfDocumentPatch() {
  return async (el: Element) => {
    if (
      el.type === "element" &&
      el.name === "w:p" &&
      checkWithinElement(
        el,
        (el: Element) =>
          el.type === "text" && textIncludes(el.text, "{{TRANSITION_TABLE}}"),
      )
    ) {
      return xmlElementToJson(`
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t xml:space="preserve">TODO:Transition table</w:t>
                </w:r>
              </w:p>
            `);
    }
    return el;
  };
}
