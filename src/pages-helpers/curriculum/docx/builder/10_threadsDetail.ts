import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import { appendBodyElements, insertNumbering, JSZipCached } from "../docx";
import { createThreadOptions, createUnitsListingByYear } from "../tab-helpers";

import { groupUnitsBySubjectCategory, unitsByYear } from "./helper";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { sortYears } from "@/utils/curriculum/sorting";
import { Unit } from "@/utils/curriculum/types";
import { getUnitFeatures } from "@/utils/curriculum/features";

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
              <w:t xml:space="preserve">${cdata(
                `Unit ${unit.order + 1}, `,
              )}</w:t>
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

  const enableGroupBySubjectCategory = data.units.some((unit) => {
    const features = getUnitFeatures(unit);
    return features?.subject_category_actions?.group_by_subjectcategory;
  });

  const elements = allThreadOptions.map((thread, threadIndex) => {
    const isLast = threadIndex === allThreadOptions.length - 1;

    const threadTitle = safeXml`
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
      </XML_FRAGMENT>
    `;

    let contentElements: string[];

    // Original non-categorized format
    contentElements = Object.values(unitsByYear(data.units)).map((units) => {
      const yearGroupedUnits = unitsByYear(units);
      return Object.entries(yearGroupedUnits)
        .sort(([yearA], [yearB]) => sortYears(yearA, yearB))
        .map<[string, Unit[]]>(([year, units]) => {
          if (enableGroupBySubjectCategory) {
            const filteredUnits = units.filter(
              (u) =>
                (u.subjectcategories ?? []).length < 1 &&
                u.threads.findIndex((t) => t.slug === thread.slug) > -1,
            );
            return [year, filteredUnits];
          }
          return [year, units];
        })
        .filter(([, units]) => units.length > 0)
        .map(([year, units]) => {
          const yearTitle = getYearGroupTitle(yearData, year);
          return safeXml`
            <XML_FRAGMENT>
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
            </XML_FRAGMENT>
          `;
        })
        .join("");
    });

    // Subject category organised content
    if (enableGroupBySubjectCategory) {
      const groupedUnits = groupUnitsBySubjectCategory(data.units);

      contentElements = [
        ...contentElements,
        ...Object.values(groupedUnits).map(
          ({
            subjectCategory,
            units,
          }: ReturnType<typeof groupUnitsBySubjectCategory>[number]) => {
            const yearGroupedUnits = unitsByYear(units);
            const threadYears = Object.entries(yearGroupedUnits)
              .sort(([yearA], [yearB]) => sortYears(yearA, yearB))
              .map(([year, units]) => {
                return [
                  year,
                  units.filter(
                    (u) =>
                      u.threads.findIndex((t) => t.slug === thread.slug) > -1,
                  ),
                ] as [string, Unit[]];
              })
              .filter(([, units]) => units.length > 0);

            if (threadYears.length < 1) {
              return "";
            }

            return safeXml`
              <XML_FRAGMENT>
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
                      <w:sz w:val="28" />
                    </w:rPr>
                    <w:t>${cdata(subjectCategory.title)}</w:t>
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
                ${threadYears
                  .map(([year, units]) => {
                    const yearTitle = getYearGroupTitle(yearData, year);
                    return safeXml`
                      <XML_FRAGMENT>
                        <w:p>
                          <w:pPr>
                            <w:pStyle w:val="Heading5" />
                          </w:pPr>
                          <w:r>
                            <w:rPr>
                              <w:rFonts
                                w:ascii="Arial"
                                w:hAnsi="Arial"
                                w:cs="Arial"
                              />
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
                              <w:rFonts
                                w:ascii="Arial"
                                w:hAnsi="Arial"
                                w:cs="Arial"
                              />
                              <w:sz w:val="24" />
                            </w:rPr>
                            <w:t />
                          </w:r>
                        </w:p>
                      </XML_FRAGMENT>
                    `;
                  })
                  .join("")}
              </XML_FRAGMENT>
            `;
          },
        ),
      ];
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
