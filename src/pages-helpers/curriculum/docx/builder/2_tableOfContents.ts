import { CombinedCurriculumData } from "..";
import { cdata, safeXml, xmlElementToJson } from "../xml";
import {
  appendBodyElements,
  JSZipCached,
  lineHeight,
  pointToDxa,
  wrapInLinkToBookmark,
} from "../docx";
import { formatCurriculumUnitsData } from "../tab-helpers";

import { uncapitalizeSubject } from "./helper";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { getModes, groupUnitsByPathway } from "@/utils/curriculum/by-pathway";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export default async function generate(
  zip: JSZipCached,
  {
    data,
    ks4Options,
  }: { data: CombinedCurriculumData; ks4Options: Ks4Option[] },
) {
  const yearDataOrig = formatCurriculumUnitsData(data);
  const modes = getModes(true, ks4Options);
  const yearData = groupUnitsByPathway({
    modes,
    yearData: yearDataOrig.yearData,
  });

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
      text: `${data.subjectTitle} curriculum explainer`,
    },
    ...Object.values(yearData).map((item) => {
      let typeSuffix = "";
      if (["10", "11"].includes(item.year)) {
        typeSuffix = `(${item.type === "core" ? "Core" : "GCSE"})`;
      }

      return {
        anchorId: `section_year_${item.type}-${item.year}`,
        text: getYearGroupTitle(yearData, item.year, `units ${typeSuffix}`),
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
