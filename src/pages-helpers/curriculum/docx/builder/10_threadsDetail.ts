import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import { appendBodyElements, insertNumbering, JSZipCached } from "../docx";
import { createThreadOptions, createUnitsListingByYear } from "../tab-helpers";

import { groupUnitsBySubjectCategory, threadUnitByYear } from "./helper";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { sortYears } from "@/utils/curriculum/sorting";
import { Unit } from "@/utils/curriculum/types";

function sortByOrder(units: Unit[]) {
  return [...units].sort((a, b) => a.order - b.order);
}

function renderUnits(units: Unit[], numbering: { unitNumbering: string }) {
  return safeXml`
    ${units
      .map(
        (unit) => safeXml`
      <w:p>
        <w:pPr>
          <w:numPr>
            <w:ilvl w:val="0" />
            <w:numId w:val="${numbering.unitNumbering}" />
          </w:numPr>
          <w:spacing w:line="276" w:lineRule="auto" />
          <w:ind w:left="425" w:right="-17" w:hanging="360" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t xml:space="preserve">${cdata(`Unit ${unit.order}, `)}</w:t>
        </w:r>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata(`'${unit.title}'`)}</w:t>
        </w:r>
      </w:p>
    `,
      )
      .join("")}
  `;
}

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const numbering = await insertNumbering(zip, {
    unitNumbering: safeXml`
      <XML_FRAGMENT>
        <w:multiLevelType w:val="multilevel" />
        <w:lvl w:ilvl="0">
          <w:start w:val="1" />
          <w:numFmt w:val="bullet" />
          <w:lvlText w:val="" />
          <w:lvlJc w:val="left" />
          <w:pPr>
            <w:tabs>
              <w:tab w:val="num" w:pos="720" />
            </w:tabs>
            <w:ind w:left="720" w:hanging="720" />
          </w:pPr>
          <w:rPr>
            <w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default" />
          </w:rPr>
        </w:lvl>
      </XML_FRAGMENT>
    `,
  });

  const yearData = createUnitsListingByYear(data.units);
  const allThreadOptions = createThreadOptions(data.units);

  const enableGroupBySubjectCategory =
    data.units[0]?.subject_slug === "english" &&
    data.units[0]?.phase_slug === "primary";

  const elements = allThreadOptions.map((thread, threadIndex) => {
    const threadInfo = threadUnitByYear(data.units, thread.slug);
    const isLast = threadIndex === allThreadOptions.length - 1;

    const threadTitle = safeXml`
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
          <w:t>${cdata(`'${thread.title}'`)}</w:t>
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
    `;

    let contentElements;
    if (enableGroupBySubjectCategory) {
      // Reorganises all curriculum units by subject category, year and units
      const categorizedContent = Object.entries(threadInfo)
        .sort(([yearA], [yearB]) => sortYears(yearA, yearB))
        .reduce(
          (acc, [year, units]) => {
            const groupedUnits = groupUnitsBySubjectCategory(units);
            groupedUnits.forEach(
              ({ subjectCategory, units: categoryUnits }) => {
                if (!acc[subjectCategory.id]) {
                  acc[subjectCategory.id] = {
                    title: subjectCategory.title,
                    yearContent: {},
                  };
                }
                acc[subjectCategory.id]!.yearContent[year] = categoryUnits;
              },
            );
            return acc;
          },
          {} as Record<
            string,
            { title: string; yearContent: Record<string, Unit[]> }
          >,
        );

      contentElements = Object.values(categorizedContent).map(
        ({ title, yearContent }) => {
          return safeXml`
            <XML_FRAGMENT>
              <w:p>
                <w:pPr>
                  <w:pStyle w:val="Heading3" />
                </w:pPr>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                    <w:b />
                    <w:i w:val="0" />
                    <w:color w:val="222222" />
                    <w:sz w:val="28" />
                  </w:rPr>
                  <w:t>${cdata(title)}</w:t>
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
              ${Object.entries(yearContent)
                .sort(([yearA], [yearB]) => sortYears(yearA, yearB))
                .map(([year, units]) => {
                  const yearTitle = getYearGroupTitle(yearData, year);
                  return safeXml`
                    <w:p>
                      <w:pPr>
                        <w:pStyle w:val="Heading4" />
                      </w:pPr>
                      <w:r>
                        <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                          <w:b />
                          <w:i w:val="0" />
                          <w:color w:val="222222" />
                          <w:sz w:val="24" />
                        </w:rPr>
                        <w:t>${cdata(yearTitle)}</w:t>
                      </w:r>
                    </w:p>
                    ${renderUnits(sortByOrder(units), numbering)}
                    <w:p>
                      <w:r>
                        <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                          <w:sz w:val="24" />
                        </w:rPr>
                        <w:t />
                      </w:r>
                    </w:p>
                  `;
                })
                .join("")}
            </XML_FRAGMENT>
          `;
        },
      );
    } else {
      // Original non-categorized format
      contentElements = Object.entries(threadInfo)
        .sort(([yearA], [yearB]) => sortYears(yearA, yearB))
        .map(([year, units]) => {
          const yearTitle = getYearGroupTitle(yearData, year);
          return safeXml`
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading4" />
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="28" />
                </w:rPr>
                <w:t>${cdata(yearTitle)}</w:t>
              </w:r>
            </w:p>
            ${renderUnits(sortByOrder(units), numbering)}
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        });
    }

    return safeXml`
      <XML_FRAGMENT>
        ${threadTitle}
        ${contentElements.join("")}
        ${
          !isLast
            ? safeXml`
              <w:p>
                <w:r>
                  <w:br w:type="page" />
                </w:r>
              </w:p>
            `
            : ""
        }
      </XML_FRAGMENT>
    `;
  });

  const pageXml = safeXml` <root>${elements.join("")}</root> `;
  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
