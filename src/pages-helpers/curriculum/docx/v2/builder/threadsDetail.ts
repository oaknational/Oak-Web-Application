import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";
import { createThreadOptions, threadUnitByYear } from "../../util";

import { appendBodyElements } from "./helper";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

function sortByOrder(units: Unit[]) {
  return [...units].sort((a, b) => a.order - b.order);
}

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const elements = createThreadOptions(data.units).map((thread) => {
    const threadInfo = threadUnitByYear(data.units, thread.slug);

    const yearElements = Object.entries(threadInfo).map(([year, units]) => {
      return `
                <w:p>
                    <w:pPr>
                    </w:pPr>
                    <w:r>
                        <w:t>${cdata(`Year ${year}`)}</w:t>
                    </w:r>
                </w:p>
                ${sortByOrder(units)
                  .map((unit) => {
                    return `
                        <w:p>
                            <w:pPr>
                            </w:pPr>
                            <w:r>   
                                <w:t>${cdata(
                                  `Unit ${unit.order}: ${unit.title}`,
                                )}</w:t>
                            </w:r>
                        </w:p>
                    `;
                  })
                  .join("")}
            `;
    });

    return `
            <w:p>
                <w:pPr>
                </w:pPr>
                <w:r>
                    <w:t>${cdata(`Thread: ${thread.title}`)}</w:t>
                </w:r>
            </w:p>
            ${yearElements.join("")}
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        `;
  });

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Threads detail")}</w:t>
                </w:r>
            </w:p>
            ${elements.join("")}
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
