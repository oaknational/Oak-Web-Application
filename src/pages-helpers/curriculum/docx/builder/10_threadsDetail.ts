import { safeXml } from "@ooxml-tools/xml";

import { cdata, xmlElementToJson } from "../xml";
import { appendBodyElements, insertNumbering, JSZipCached } from "../docx";
import { createThreadOptions, createUnitsListingByYear } from "../tab-helpers";

import {
  groupUnitsBySubjectCategory,
  groupUnitsByYearAndPathway,
  sortYearPathways,
  parseYearPathwayKey,
} from "./helper";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { CombinedCurriculumData, Unit } from "@/utils/curriculum/types";
import { getSuffixFromPathway } from "@/utils/curriculum/pathways";

function sortByOrder(units: Unit[]) {
  return [...units].toSorted((a, b) => a.order - b.order);
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

  const enableGroupBySubjectCategory = data.units.some((unit) => {
    return unit.actions?.subject_category_actions?.group_by_subjectcategory;
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

    const contentElements: string[] = [];

    const filterUnitsByThread = (units: Unit[]): Unit[] => {
      return units.filter(
        (u) => u.threads.findIndex((t) => t.slug === thread.slug) > -1,
      );
    };

    const nonCategorizedUnits = enableGroupBySubjectCategory
      ? data.units.filter((u) => (u.subjectcategories ?? []).length < 1)
      : data.units;

    const groupedByYearPathway =
      groupUnitsByYearAndPathway(nonCategorizedUnits);

    const sortedList = Object.entries(groupedByYearPathway)
      .map(([yearPathwayKey, unitsInGroup]) => {
        const unitsForThread = filterUnitsByThread(unitsInGroup);
        return [yearPathwayKey, unitsForThread] as [string, Unit[]];
      })
      .filter(([, units]) => units.length > 0)
      .toSorted(([keyA], [keyB]) => sortYearPathways(keyA, keyB));

    const nonCategorizedContent = sortedList
      .map(([yearPathwayKey, units]) => {
        const { year, pathway } = parseYearPathwayKey(yearPathwayKey);
        const title = getYearGroupTitle(
          yearData,
          year,
          getSuffixFromPathway(pathway),
        );

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
                <w:t>${cdata(title)}</w:t>
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

    contentElements.push(nonCategorizedContent);

    // Subject category organised content (modified for pathways)
    if (enableGroupBySubjectCategory) {
      const groupedUnitsByCat = groupUnitsBySubjectCategory(data.units);

      const categorizedContent = Object.values(groupedUnitsByCat)
        .map(
          ({
            subjectCategory,
            units: categoryUnits,
          }: ReturnType<typeof groupUnitsBySubjectCategory>[number]) => {
            // Group units within this category by year and pathway
            const categoryGroupedByYearPathway =
              groupUnitsByYearAndPathway(categoryUnits);

            const yearPathwayEntriesForThread = Object.entries(
              categoryGroupedByYearPathway,
            )
              .map(([yearPathwayKey, unitsInGroup]) => {
                const unitsForThread = filterUnitsByThread(unitsInGroup);
                return [yearPathwayKey, unitsForThread] as [string, Unit[]];
              })
              .filter(([, units]) => units.length > 0);

            if (yearPathwayEntriesForThread.length < 1) {
              return "";
            }

            // Sort the year-pathways within this category
            yearPathwayEntriesForThread.toSorted(([keyA], [keyB]) =>
              sortYearPathways(keyA, keyB),
            );

            // Render the category title and then the units grouped by year-pathway
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
                ${yearPathwayEntriesForThread
                  .map(([yearPathwayKey, units]) => {
                    const { year, pathway } =
                      parseYearPathwayKey(yearPathwayKey);
                    const yearPathwayTitle = getYearGroupTitle(
                      yearData,
                      year,
                      getSuffixFromPathway(pathway),
                    );

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
                            <w:t>${cdata(yearPathwayTitle)}</w:t>
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
        )
        .join("");

      contentElements.push(categorizedContent);
    }

    // Combine and finalise output
    return safeXml`
      <XML_FRAGMENT>
        ${threadTitle}
        ${contentElements.join("")}
        ${!isLast
          ? safeXml`
              <w:p>
                <w:r>
                  <w:br w:type="page" />
                </w:r>
              </w:p>
            `
          : ""}
      </XML_FRAGMENT>
    `;
  });

  const pageXml = safeXml` <root>${elements.join("")}</root> `;
  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
