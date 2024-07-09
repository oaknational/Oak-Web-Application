import { join } from "path";

import type JSZip from "jszip";
import { sortBy, uniqBy } from "lodash";

import { cdata, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData, Slugs } from "../..";
import {
  appendBodyElements,
  insertImages,
  insertLinks,
  wrapInBookmarkPoint,
  wrapInLinkTo,
  createImage,
  cmToEmu,
} from "../../docx";
import { createCurriculumSlug, createProgrammeSlug } from "../helper";

import { buildUnit } from "./unit_detail";

import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";

function generateGroupedUnits(combinedCurriculumData: CombinedCurriculumData) {
  const data = formatCurriculumUnitsData(
    combinedCurriculumData,
  ) as CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>;
  const unitOptions = Object.entries(data.yearData).flatMap(
    ([year, { childSubjects, tiers, units, pathways }]) => {
      let options: {
        year: string;
        tier?: string;
        childSubject?: string;
        pathway?: string;
      }[] = [];

      options.push({
        year,
      });
      if (pathways.length > 0) {
        options = options.flatMap((option) => {
          // TODO: This should be sorted by pathway_display_order, however we need to change the way this is handled.
          return sortBy(pathways, ["pathway_slug"]).map((pathway) => {
            return {
              ...option,
              pathway: pathway.pathway_slug,
            };
          });
        });
      }
      if (childSubjects.length > 0) {
        options = options.flatMap((option) => {
          return childSubjects.map((childSubject) => {
            return {
              ...option,
              childSubject: childSubject.subject_slug,
            };
          });
        });
      }
      if (tiers.length > 0) {
        options = options.flatMap((option) => {
          return tiers.map((tier) => {
            return {
              ...option,
              tier: tier.tier_slug,
            };
          });
        });
      }

      return options.map((option) => {
        return {
          ...option,
          units: units.filter((unit) => {
            if (
              option.tier &&
              unit.tier_slug !== null &&
              unit.tier_slug !== option.tier
            ) {
              return false;
            }
            if (
              option.pathway &&
              unit.pathway_slug !== null &&
              unit.pathway_slug !== option.pathway
            ) {
              return false;
            }
            if (
              option.childSubject &&
              unit.subject_slug !== option.childSubject
            ) {
              return false;
            }
            return true;
          }),
        };
      });
    },
  );

  return unitOptions;
}

export default async function generate(
  zip: JSZip,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const linkDefs: Record<string, string> = {};
  const tier_slug = data.units.find((u) => u.tier_slug)?.tier_slug;
  data.units.forEach((unit, unitIndex) => {
    linkDefs[`unit_${unitIndex}_onlineResources`] =
      `https://www.thenational.academy/teachers/programmes/${createProgrammeSlug(
        unit,
        slugs.examboardSlug,
        tier_slug,
      )}/units/${unit.slug}/lessons`;
  });
  const links = await insertLinks(zip, linkDefs);

  const yearXml: string[] = [];
  const groupedUnits = generateGroupedUnits(data);
  for (const { units, year, childSubject, tier, pathway } of groupedUnits) {
    yearXml.push(
      await buildYear(zip, year, units, { childSubject, tier, pathway }, slugs),
    );
  }

  const pageXml = `
    <root>
        ${yearXml.join("")}
        ${
          false &&
          data.units
            .map((unit, unitIndex) => {
              const someLessonsPublished = unit.lessons?.some(
                (lesson) => lesson._state === "published",
              );
              return `
                <w:p>
                    <w:r>
                      <w:t>${unit.title}</w:t>
                    </w:r>
                    ${
                      !someLessonsPublished
                        ? `
                    <w:r>
                      <w:t> / No lessons published</w:t>
                    </w:r>
                    `
                        : wrapInLinkTo(
                            links[`unit_${unitIndex}_onlineResources`]!,
                            `
                        <w:r>
                            <w:t> / Go to unit resources</w:t>
                        </w:r>
                    `,
                          )
                    }
                </w:p>
            `;
            })
            .join("")
        }
        <w:p>
            <w:r>
                <w:br w:type="page"/>
            </w:r>
        </w:p> 
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}

function buildOptions({
  unitOptions,
}: {
  unitOptions: CombinedCurriculumData["units"][number]["unit_options"];
}) {
  if (unitOptions.length > 0) {
    return `
      <w:p>
          <w:pPr>
              <w:spacing w:line="240" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
          </w:r>
      </w:p>
      <w:p>
        <w:r>
            <w:rPr>
                <w:color w:val="222222"/>
                <w:shd w:val="solid" w:fill="417A3D" />
                <w:rtl w:val="0"/>
            </w:rPr>
            <w:t xml:space="preserve">${cdata(
              unitOptions.length,
            )} option${cdata(unitOptions.length > 1 ? "s" : "")}</w:t>
        </w:r>
      </w:p>
    `;
  }
  return "";
}

function buildYearColumn({
  index,
  title,
  unitOptions,
}: {
  title: string;
  index: number;
  unitOptions: CombinedCurriculumData["units"][number]["unit_options"];
}) {
  const columnIndex = index % 3;

  return `
    <w:tc>
      <w:tcPr>
          <w:tcW w:type="pct" w:w="33.333333333333336%"/>
          <w:tcBorders>
              <w:top w:val="single" w:color="FFFFFF" w:sz="48"/>
              ${
                columnIndex > 0
                  ? `<w:left w:val="single" w:color="FFFFFF" w:sz="48"/>`
                  : ""
              }
              <w:bottom w:val="single" w:color="FFFFFF" w:sz="48"/>
              ${
                columnIndex < 2
                  ? `<w:right w:val="single" w:color="FFFFFF" w:sz="48"/>`
                  : ""
              }
          </w:tcBorders>
          <w:shd w:val="solid" w:color="E4F8E0" w:fill="E4F8E0"/>
          <w:tcMar>
              <w:top w:type="dxa" w:w="226"/>
              <w:left w:type="dxa" w:w="226"/>
              <w:bottom w:type="dxa" w:w="226"/>
              <w:right w:type="dxa" w:w="226"/>
          </w:tcMar>
      </w:tcPr>
      <w:p>
          <w:pPr>
              <w:spacing w:line="240" w:lineRule="auto"/>
          </w:pPr>
          <w:r>
              <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>
                  <w:b/>
                  <w:color w:val="222222"/>
                  <w:sz w:val="44"/>
                  <w:szCs w:val="44"/>
              </w:rPr>
              <w:t xml:space="preserve">${cdata(index + 1)}</w:t>
          </w:r>
      </w:p>
      <w:p>
          <w:r>
              <w:rPr>
                  <w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>
                  <w:b/>
                  <w:color w:val="222222"/>
                  <w:sz w:val="28"/>
                  <w:szCs w:val="28"/>
              </w:rPr>
              <w:t xml:space="preserve">${cdata(title)}</w:t>
          </w:r>
      </w:p>
      ${buildOptions({ unitOptions })}
    </w:tc>
  `;
}

function buildYearRow(children: string) {
  return `
    <w:tr>
      <w:trPr>
        <w:cantSplit/>
      </w:trPr>
      ${children}
    </w:tr>
  `;
}

function removeDups(units: CombinedCurriculumData["units"]) {
  const unitSlugLookup = new Set();
  return units.filter((unit) => {
    const key = unit.slug;
    if (!unitSlugLookup.has(key)) {
      unitSlugLookup.add(key);
      return true;
    }
    return false;
  });
}

type Slug = { childSubject?: string; tier?: string; pathway?: string };

async function buildYear(
  zip: JSZip,
  year: string,
  unitsInput: CombinedCurriculumData["units"],
  yearSlugs: Slug,
  slugs: Slugs,
) {
  const images = await insertImages(zip, {
    jumpOutArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow.png",
    ),
    greenCircle: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/green-circle.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const links = await insertLinks(zip, {
    interactiveSequence: `https://www.thenational.academy/teachers/curriculum/${createCurriculumSlug(
      slugs,
    )}/units`,
  });

  const rows = [];
  const units = removeDups(unitsInput);
  for (let i = 0; i < units.length; i += 3) {
    rows.push(
      buildYearRow(
        units
          .slice(i, i + 3)
          .map((unit, j) => {
            const index = i + j;
            return buildYearColumn({
              index: index,
              title: unit.title,
              unitOptions: unit.unit_options,
            });
          })
          .join(""),
      ),
    );
  }

  const unitsXml: string[] = [];
  const unitUnitsBySlug = uniqBy(units, "slug");
  unitUnitsBySlug.forEach((unit, unitIndex) => {
    if (unit.unit_options.length > 0) {
      unit.unit_options.forEach((unitOption, unitOptionIndex) => {
        unitsXml.push(
          buildUnit(unit, unitIndex, unitOption, unitOptionIndex, images),
        );
      });
    } else {
      unitsXml.push(buildUnit(unit, unitIndex, undefined, undefined, images));
    }
  });

  let subjectTierPathwayTitle: undefined | string;

  // For the building this header we can assume all units will contain the same subject/tier/pathway
  const firstUnit = units[0];
  if (firstUnit) {
    if (firstUnit.subject || firstUnit.tier || firstUnit.pathway) {
      subjectTierPathwayTitle = [
        // HERE: Only if child subject is present.
        yearSlugs.childSubject ? firstUnit.subject : undefined,
        firstUnit.tier,
        firstUnit.pathway,
      ]
        .filter(Boolean)
        .join(", ");
    }
  }

  const xml = `
      ${
        !subjectTierPathwayTitle
          ? ""
          : `<w:p>
        <w:pPr>
            <w:sz w:val="44"/>
            <w:szCs w:val="44"/>
        </w:pPr>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>
                <w:color w:val="222222"/>
                <w:sz w:val="28"/>
                <w:szCs w:val="28"/>
            </w:rPr>
            <w:t xml:space="preserve">${cdata(subjectTierPathwayTitle)}</w:t>
        </w:r>
      </w:p>`
      }
      <w:p>
          <w:pPr>
              <w:pStyle w:val="Heading2"/>
          </w:pPr>
          ${wrapInBookmarkPoint(
            `section_year_${year}`,
            `
              <w:r>
                  <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:b />
                      <w:color w:val="222222"/>
                      <w:sz w:val="56"/>
                  </w:rPr>
                  <w:t>Year ${cdata(year)} units</w:t>
              </w:r>
          `,
          )}
      </w:p>
      <w:p>
          ${wrapInLinkTo(
            links.interactiveSequence!,
            `
              <w:r>
                  <w:rPr>
                      <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:b />
                      <w:color w:val="222222"/>
                      <w:sz w:val="24"/>
                      <w:u w:val="single"/>
                  </w:rPr>
                  <w:t>View interactive sequence online</w:t>
                  ${createImage(images.jumpOutArrow, {
                    width: cmToEmu(0.57),
                    height: cmToEmu(0.57),
                    xPos: cmToEmu(0.3),
                    yPos: cmToEmu(-0.01),
                    xPosAnchor: "character",
                    yPosAnchor: "line",
                    isDecorative: true,
                    isWrapTight: true,
                  })}
              </w:r>
          `,
          )}
      </w:p>
      <w:p>
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="Arial" w:cs="Arial" w:eastAsia="Arial" w:hAnsi="Arial"/>
                <w:color w:val="222222"/>
                <w:sz w:val="44"/>
                <w:szCs w:val="44"/>
            </w:rPr>
            <w:t xml:space="preserve"> </w:t>
        </w:r>
      </w:p>
      <w:tbl>
        <w:tblPr>
            <w:tblW w:type="pct" w:w="100%"/>
            <w:tblBorders>
                <w:insideH w:val="single" w:color="auto" w:sz="4"/>
                <w:insideV w:val="single" w:color="auto" w:sz="4"/>
            </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>
            <w:gridCol w:w="3505"/>
            <w:gridCol w:w="3505"/>
            <w:gridCol w:w="3505"/>
        </w:tblGrid>
        ${rows.join("")}
      </w:tbl>
      <w:p>
        <w:r>
          <w:br w:type="page"/>
        </w:r>
      </w:p>
      ${unitsXml}
      <w:p>
        <w:r>
          <w:br w:type="page"/>
        </w:r>
      </w:p>
  `;
  return xml;
}
