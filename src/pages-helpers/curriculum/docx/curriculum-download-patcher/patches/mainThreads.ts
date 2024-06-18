import { Element } from "xml-js";

import { cdata, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

import { createThreadOptions, threadUnitByYear } from "./util";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

function sortByOrder(units: Unit[]) {
  return [...units].sort((a, b) => a.order - b.order);
}

export function mainThreadsPatch(data: CombinedCurriculumData) {
  return async () => {
    const container = {
      type: "element",
      name: "$FRAGMENT$",
      elements: [],
    } as Element;

    container.elements = createThreadOptions(data.units).map((thread) => {
      const threadInfo = threadUnitByYear(data.units, thread.slug);

      let rawXml = `
          <w:p>
            <w:pPr>
              <w:pageBreakBefore/>
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:sz w:val="36"/>
                <w:rFonts w:ascii="Lexend-Light" w:cs="Lexend-Light" w:eastAsia="Lexend-Light" w:hAnsi="Lexend-Light"/>
              </w:rPr>
              <w:t xml:space="preserve">Thread: </w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:sz w:val="36"/>
                <w:rFonts w:ascii="Lexend-Bold" w:cs="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold"/>
              </w:rPr>
              <w:t>${cdata(thread.title)}</w:t>
            </w:r>
          </w:p>

          <w:p>
            <w:r>
              <w:t></w:t>
            </w:r>
          </w:p>
        `;

      for (const [year, units] of Object.entries(threadInfo)) {
        rawXml += `
            <w:p>
              <w:pPr>
                <w:keepNext/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Lexend-Bold" w:cs="Lexend-Bold" w:eastAsia="Lexend-Bold" w:hAnsi="Lexend-Bold"/>
                  <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Year ${year}</w:t>
              </w:r>
            </w:p>
            ${sortByOrder(units)
              .map((unit, index) => {
                return `
                <w:p>
                  <w:pPr>
                    ${index < 3 ? "<w:keepNext/>" : ""}
                    <w:numPr>
                      <w:ilvl w:val="0"/>
                      <w:numId w:val="3"/>
                    </w:numPr>
                    <w:ind w:left="426"/>
                  </w:pPr>
                  <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Lexend-Light" w:eastAsia="Lexend-Light" w:hAnsi="Lexend-Light" w:cs="Lexend-Light"/>
                    </w:rPr>
                    <w:t>${cdata(`Unit ${unit.order}: ${unit.title}`)}</w:t>
                  </w:r>
                </w:p>
              `;
              })
              .join("")}
            <w:p>
              <w:pPr>
                <w:sectPr>
                  <w:type w:val="continuous"/>
                  <w:pgSz w:w="11909" w:h="16834"/>
                  <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                  <w:cols w:num="1" w:space="720"/>
                </w:sectPr>
              </w:pPr>
            </w:p>

            <w:p>
              <w:r>
                <w:t></w:t>
              </w:r>
            </w:p>
          `;
      }

      return {
        type: "element",
        name: "$FRAGMENT$",
        elements: xmlElementToJson(`<root>${rawXml}</root>`).elements,
      };
    });

    return container;
  };
}
