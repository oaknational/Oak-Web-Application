import type JSZip from "jszip";

import { CombinedCurriculumData } from "..";
import { cdata, xmlElementToJson } from "../xml";
import { appendBodyElements, wrapInLinkToBookmark } from "../docx";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const years = Array.from(
    new Set(data.units.map((unit) => parseInt(unit.year))),
  ).sort((a, b) => a - b);

  const links = [
    {
      anchorId: "section_our_curriculum",
      text: "Our curriculum",
    },
    {
      anchorId: "section_threads",
      text: "Threads",
    },
    {
      anchorId: "section_curriculum_overview",
      text: `${data.subjectTitle} curriculum overview`,
    },
    ...years.map((year) => {
      return {
        anchorId: `section_year_${year}`,
        text: `Year ${year}`,
      };
    }),
    {
      anchorId: "section_threads_appendix",
      text: `Threads in ${data.subjectTitle}`,
    },
  ];

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Contents")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:t></w:t>
                </w:r>
            </w:p>
            
            ${links
              .map((link) => {
                return `
                    <w:p>
                        ${wrapInLinkToBookmark(
                          link.anchorId,
                          `
                            <w:r>
                                <w:t>${cdata(link.text)}</w:t>
                            </w:r>
                        `,
                        )}
                    </w:p>
                `;
              })
              .join("")}
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
