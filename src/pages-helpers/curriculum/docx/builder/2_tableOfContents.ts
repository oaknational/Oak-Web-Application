import { CombinedCurriculumData } from "..";
import { cdata, safeXml, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  JSZipCached,
  lineHeight,
  pointToDxa,
  wrapInLinkToBookmark,
} from "../docx";

import { uncapitalizeSubject } from "./helper";

import { formatCurriculumUnitsData } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { getYearGroupTitle } from "@/utils/curriculum/formatting";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const { yearOptions, yearData } = formatCurriculumUnitsData(data);

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
    ...yearOptions.map((year) => {
      return {
        anchorId: `section_year_${year}`,
        text: getYearGroupTitle(yearData, year, "units"),
      };
    }),
    {
      anchorId: "section_threads_appendix",
      text: `Threads in ${uncapitalizeSubject(data.subjectTitle)}`,
    },
  ];

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b w:val="true" />
            <w:color w:val="222222" />
            <w:sz w:val="56" />
          </w:rPr>
          <w:t>${cdata("Contents")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>

      ${links
        .map((link) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:spacing
                  w:line="${lineHeight(12, 1.5)}"
                  w:lineRule="auto"
                  w:before="${pointToDxa(3)}"
                />
              </w:pPr>
              ${wrapInLinkToBookmark(
                link.anchorId,
                safeXml`
                  <w:r>
                    <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                      <w:b w:val="true" />
                      <w:color w:val="222222" />
                      <w:sz w:val="28" />
                    </w:rPr>
                    <w:t>${cdata(link.text)}</w:t>
                  </w:r>
                `,
              )}
            </w:p>
          `;
        })
        .join("")}
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
