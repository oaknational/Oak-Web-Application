import { Element } from "xml-js";

import { xmlElementToJson } from "../../xml";
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
              </w:rPr>
              <w:t xml:space="preserve">Thread: </w:t>
            </w:r>
            <w:r>
              <w:rPr>
                <w:sz w:val="36"/>
                <w:b/>
              </w:rPr>
              <w:t>${thread.title}</w:t>
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
              <w:r>
                <w:rPr>
                  <w:b/>
                  <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Year ${year}</w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr>
                <w:sectPr>
                  <w:type w:val="continuous"/>
                  <w:pgSz w:w="11909" w:h="16834"/>
                  <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                  <w:cols w:space="720"/>
                </w:sectPr>
              </w:pPr>
            </w:p>
            ${sortByOrder(units)
              .map((unit) => {
                return `
                <w:p>
                  <w:pPr>
                    <w:numPr>
                      <w:ilvl w:val="0"/>
                      <w:numId w:val="3"/>
                    </w:numPr>
                    <w:ind w:left="426"/>
                  </w:pPr>
                  <w:r>
                    <w:t>Unit ${unit.order}: ${unit.title}</w:t>
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
                  <w:cols w:num="2" w:space="720"/>
                </w:sectPr>
              </w:pPr>
            </w:p>

            <w:p>
              <w:r>
                <w:t></w:t>
              </w:r>
            </w:p>
            <w:p>
              <w:pPr>
                <w:sectPr>
                  <w:type w:val="continuous"/>
                  <w:pgSz w:w="11909" w:h="16834"/>
                  <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                  <w:cols w:space="720"/>
                </w:sectPr>
              </w:pPr>
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
