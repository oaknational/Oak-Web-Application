import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import { appendBodyElements, JSZipCached } from "../docx";

import { createThreadOptions, threadUnitByYear } from "./helper";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

function sortByOrder(units: Unit[]) {
  return [...units].sort((a, b) => a.order - b.order);
}

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const allThreadOptions = createThreadOptions(data.units);
  const elements = allThreadOptions.map((thread, threadIndex) => {
    const threadInfo = threadUnitByYear(data.units, thread.slug);
    const isLast = threadIndex === allThreadOptions.length - 1;

    const yearElements = Object.entries(threadInfo).map(([year, units]) => {
      return safeXml`
        <XML_FRAGMENT>
          <w:p>
            <w:pPr>
              <w:pStyle w:val="Heading4" />
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b w:val="true" />
                <w:i w:val="0" />
                <w:color w:val="222222" />
                <w:sz w:val="28" />
              </w:rPr>
              <w:t>${cdata(`Year ${year}`)}</w:t>
            </w:r>
          </w:p>
          ${sortByOrder(units)
            .map((unit) => {
              return safeXml`
                <w:p>
                  <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                      <w:color w:val="222222" />
                      <w:sz w:val="24" />
                      <w:b />
                    </w:rPr>
                    <w:t xml:space="preserve">${cdata(
                        `Unit ${unit.order}, `,
                      )}</w:t>
                  </w:r>
                  <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                      <w:color w:val="222222" />
                      <w:sz w:val="24" />
                    </w:rPr>
                    <w:t>${cdata(`${unit.title}`)}</w:t>
                  </w:r>
                </w:p>
              `;
            })
            .join("")}
          <w:p>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:sz w:val="28" />
              </w:rPr>
              <w:t />
            </w:r>
          </w:p>
        </XML_FRAGMENT>
      `;
    });

    return safeXml`
      <XML_FRAGMENT>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading3" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
              <w:color w:val="222222" />
              <w:sz w:val="36" />
            </w:rPr>
            <w:t xml:space="preserve">${cdata(`Thread, `)}</w:t>
          </w:r>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
              <w:b />
              <w:color w:val="222222" />
              <w:sz w:val="36" />
            </w:rPr>
            <w:t>${cdata(`‘${thread.title}’`)}</w:t>
          </w:r>
        </w:p>

        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
              <w:sz w:val="24" />
            </w:rPr>
            <w:t xml:space="preserve"> </w:t>
          </w:r>
        </w:p>

        ${yearElements.join("")}
        ${isLast
          ? ""
          : safeXml`
              <w:p>
                <w:r>
                  <w:br w:type="page" />
                </w:r>
              </w:p>
            `}
      </XML_FRAGMENT>
    `;
  });

  const pageXml = safeXml` <root>${elements.join("")}</root> `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
