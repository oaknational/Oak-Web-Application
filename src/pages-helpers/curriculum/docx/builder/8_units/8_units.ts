import { join } from "path";

import { uniqBy } from "lodash";
import { safeXml } from "@ooxml-tools/xml";

import { cdata, xmlElementToJson } from "../../xml";
import { Slugs } from "../..";
import {
  insertImages,
  insertLinks,
  wrapInBookmarkPoint,
  wrapInLinkTo,
  createImage,
  cmToEmu,
  appendBodyElements,
  JSZipCached,
} from "../../docx";
import {
  createCurriculumSlug,
  generateGridCols,
  groupUnitsBySubjectCategory,
  sortYearPathways,
} from "../helper";
import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "../../tab-helpers";

import { buildUnit } from "./unit_detail";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { CombinedCurriculumData, Unit } from "@/utils/curriculum/types";
import {
  getModes,
  groupUnitsByPathway,
  MODES,
  UnitsByPathway,
} from "@/utils/curriculum/by-pathway";
import { Ks4Option } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export function generateGroupedUnits(
  data: CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>,
) {
  const unitOptions = Object.entries(data.yearData as UnitsByPathway).flatMap(
    ([year_type_key, { childSubjects, tiers, units, type }]) => {
      const year = year_type_key.split("_")[0];
      if (!year) return [];

      let options: {
        year: string;
        tier?: string;
        childSubject?: string;
        pathway?: string;
        type: MODES;
      }[] = [];

      options.push({
        year,
        type,
        pathway: type === "core" ? "core" : "gcse",
      });
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

  return unitOptions.toSorted((a, b) =>
    sortYearPathways(`${a.year}-${a.pathway}`, `${b.year}-${b.pathway}`),
  );
}

export default async function generate(
  zip: JSZipCached,
  {
    data,
    slugs,
    ks4Options,
  }: { data: CombinedCurriculumData; slugs: Slugs; ks4Options: Ks4Option[] },
) {
  const formattedData = formatCurriculumUnitsData(
    data,
  ) as CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>;
  const yearDataOrig = formatCurriculumUnitsData(data);
  const yearData = groupUnitsByPathway({
    modes: getModes(true, ks4Options),
    yearData: yearDataOrig.yearData,
  });

  const yearXml: string[] = [];
  const groupedUnits = generateGroupedUnits({
    ...formattedData,
    yearData,
  });

  for (const {
    units,
    year,
    childSubject,
    tier,
    pathway,
    type,
  } of groupedUnits) {
    const isSwimming = yearDataOrig.yearData[year]?.isSwimming ?? false;
    const ks4Suffix =
      ["10", "11"].includes(year) && type !== "all"
        ? type === "core"
          ? " (Core)"
          : " (GCSE)"
        : "";
    const suffix = ks4Suffix ? `units${ks4Suffix}` : "units";
    const displayYearTitle = getYearGroupTitle(
      yearDataOrig.yearData,
      year,
      suffix,
    );

    yearXml.push(
      await buildYear(
        zip,
        year,
        formattedData,
        units,
        { childSubject, tier, pathway },
        slugs,
        type,
        displayYearTitle,
        isSwimming,
      ),
    );
  }

  await appendBodyElements(
    zip,
    xmlElementToJson(safeXml`<root>${yearXml.join("")}</root>`)?.elements,
  );
}

function buildOptions({
  unitOptions,
}: {
  unitOptions: CombinedCurriculumData["units"][number]["unit_options"];
}) {
  if (unitOptions.length > 0) {
    return safeXml`
      <XML_FRAGMENT>
        <w:p>
          <w:pPr>
            <w:spacing w:line="240" w:lineRule="auto" w:after="0" />
          </w:pPr>
          <w:r />
        </w:p>
        <w:p>
          <w:pPr>
            <w:spacing w:line="240" w:lineRule="auto" w:after="0" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:cs="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
              />
              <w:color w:val="ffffff" />
              <w:shd w:val="clear" w:fill="287c34" />
              <w:rtl w:val="0" />
            </w:rPr>
            <w:t xml:space="preserve">${cdata(
                unitOptions.length,
              )} unit option${cdata(unitOptions.length > 1 ? "s" : "")}</w:t>
          </w:r>
        </w:p>
      </XML_FRAGMENT>
    `;
  }
  return "";
}

function buildEmpty(columnIndex: number) {
  return safeXml`
    <w:tc>
      <w:tcPr>
        <w:tcW w:type="pct" w:w="33.333333333333336%" />
        <w:tcBorders>
          <w:top w:val="single" w:color="FFFFFF" w:sz="48" />
          ${columnIndex > 0
            ? `<w:left w:val="single" w:color="FFFFFF" w:sz="48"/>`
            : ""}
          <w:bottom w:val="single" w:color="FFFFFF" w:sz="48" />
          ${columnIndex < 2
            ? `<w:right w:val="single" w:color="FFFFFF" w:sz="48"/>`
            : ""}
        </w:tcBorders>
        <w:shd w:val="solid" w:color="FFFFFF" w:fill="FFFFFF" />
        <w:tcMar>
          <w:top w:type="dxa" w:w="226" />
          <w:left w:type="dxa" w:w="226" />
          <w:bottom w:type="dxa" w:w="226" />
          <w:right w:type="dxa" w:w="226" />
        </w:tcMar>
      </w:tcPr>
      <w:p />
    </w:tc>
  `;
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

  return safeXml`
    <w:tc>
      <w:tcPr>
        <w:tcW w:type="pct" w:w="33.333333333333336%" />
        <w:tcBorders>
          <w:top w:val="single" w:color="FFFFFF" w:sz="48" />
          ${columnIndex > 0
            ? `<w:left w:val="single" w:color="FFFFFF" w:sz="48"/>`
            : ""}
          <w:bottom w:val="single" w:color="FFFFFF" w:sz="48" />
          ${columnIndex < 2
            ? `<w:right w:val="single" w:color="FFFFFF" w:sz="48"/>`
            : ""}
        </w:tcBorders>
        <w:shd w:val="solid" w:color="E4F8E0" w:fill="E4F8E0" />
        <w:tcMar>
          <w:top w:type="dxa" w:w="226" />
          <w:left w:type="dxa" w:w="226" />
          <w:bottom w:type="dxa" w:w="226" />
          <w:right w:type="dxa" w:w="226" />
        </w:tcMar>
      </w:tcPr>
      <w:p>
        <w:pPr>
          <w:spacing w:line="240" w:lineRule="auto" w:after="0" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:cs="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
            />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="44" />
            <w:szCs w:val="44" />
          </w:rPr>
          <w:t xml:space="preserve">${cdata(index + 1)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:spacing w:line="240" w:lineRule="auto" w:after="0" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:cs="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
            />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="28" />
            <w:szCs w:val="28" />
          </w:rPr>
          <w:t xml:space="preserve">${cdata(title)}</w:t>
        </w:r>
      </w:p>
      ${buildOptions({ unitOptions })}
    </w:tc>
  `;
}

function buildYearRow(children: string) {
  return safeXml`
    <w:tr>
      <w:trPr>
        <w:cantSplit />
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
  zip: JSZipCached,
  year: string,
  formattedData: CurriculumUnitsFormattedData<
    CombinedCurriculumData["units"][number]
  >,
  unitsInput: CombinedCurriculumData["units"],
  yearSlugs: Slug,
  slugs: Slugs,
  type: MODES,
  displayYearTitle: string,
  isSwimming: boolean,
) {
  const images = await insertImages(zip, {
    jumpOutArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow-2.png",
    ),
    greenCircle: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/green-circle.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
    greenUnderline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/green-underline.png",
    ),
  });

  const links = await insertLinks(zip, {
    interactiveSequence: `https://www.thenational.academy/teachers/curriculum/${createCurriculumSlug(
      slugs,
    )}/units`,
  });

  const units = removeDups(unitsInput);

  const enableGroupBySubjectCategory =
    units[0]?.actions?.subject_category_actions?.group_by_subjectcategory;

  const buildUnitBlock = (units: Unit[]) => {
    const rows = [];
    for (let i = 0; i < units.length; i += 3) {
      const unitsColumns = Array(3)
        .fill(true)
        .map((_, colIdx) => {
          const index = i + colIdx;
          const unit = units[index];
          if (unit) {
            return buildYearColumn({
              index: index,
              title: unit.title,
              unitOptions: unit.unit_options,
            });
          } else {
            return buildEmpty(index);
          }
        });
      rows.push(buildYearRow(unitsColumns.join("")));
    }

    return safeXml`
      <w:tbl>
        <w:tblPr>
          <w:tblW w:type="pct" w:w="100%" />
          <w:tblBorders>
            <w:insideH w:val="single" w:color="auto" w:sz="4" />
            <w:insideV w:val="single" w:color="auto" w:sz="4" />
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>${generateGridCols(3)}</w:tblGrid>
        ${rows.join("")}
      </w:tbl>
    `;
  };

  let yearContent: string;
  if (enableGroupBySubjectCategory) {
    const groupedContent = [];
    for (const [
      index,
      { subjectCategory, units: catUnits },
    ] of groupUnitsBySubjectCategory(units).entries()) {
      groupedContent.push(safeXml`
        <XML_FRAGMENT>
          ${index > 0 ? "<w:p></w:p><w:p></w:p>" : ""}
          <w:p>
            <w:pPr>
              <w:pStyle w:val="Heading3" />
            </w:pPr>
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="36" />
              </w:rPr>
              <w:t>${cdata(subjectCategory.title)}</w:t>
            </w:r>
          </w:p>
          ${buildUnitBlock(catUnits)};
        </XML_FRAGMENT>
      `);
    }
    yearContent = groupedContent.join("");
  } else {
    yearContent = buildUnitBlock(units);
  }

  const buildUnitsPages = async (units: Unit[]) => {
    const unitsXml: string[] = [];
    const unitUnitsBySlug = uniqBy(units, "slug");

    // FIXME: This is slow
    const tierSlug = units.find((u) => u.tier_slug)?.tier_slug ?? undefined;
    for (let unitIndex = 0; unitIndex < unitUnitsBySlug.length; unitIndex++) {
      const unit = unitUnitsBySlug[unitIndex]!;
      if (unit.unit_options.length > 0) {
        for (
          let unitOptionIndex = 0;
          unitOptionIndex < unit.unit_options.length;
          unitOptionIndex++
        ) {
          const unitOption = unit.unit_options[unitOptionIndex]!;
          unitsXml.push(
            await buildUnit(
              zip,
              unit,
              unitIndex,
              unitOption,
              unitOptionIndex,
              images,
              { ...slugs, tierSlug },
            ),
          );
        }
      } else {
        unitsXml.push(
          await buildUnit(zip, unit, unitIndex, undefined, undefined, images, {
            ...slugs,
            tierSlug,
          }),
        );
      }
    }

    return unitsXml;
  };

  let unitContent;
  if (enableGroupBySubjectCategory) {
    const parts = [];
    for (const group of groupUnitsBySubjectCategory(units)) {
      parts.push(await buildUnitsPages(group.units));
    }
    unitContent = parts.join("");
  } else {
    unitContent = await buildUnitsPages(units);
  }

  let subjectTierPathwayTitle: undefined | string;

  // For the building this header we can assume all units will contain the same subject/tier/pathway
  const firstUnit = units[0];
  if (firstUnit) {
    if (firstUnit.subject || firstUnit.tier) {
      subjectTierPathwayTitle = [
        // HERE: Only if child subject is present.
        yearSlugs.childSubject ? firstUnit.subject : undefined,
        firstUnit.tier,
        firstUnit.actions?.programme_field_overrides?.subject,
      ]
        .filter(Boolean)
        .join(", ");
    }
  }

  const xml = safeXml`
    <XML_FRAGMENT>
      ${!subjectTierPathwayTitle
        ? ""
        : safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts
                    w:ascii="Arial"
                    w:cs="Arial"
                    w:eastAsia="Arial"
                    w:hAnsi="Arial"
                  />
                  <w:color w:val="222222" />
                  <w:sz w:val="28" />
                  <w:szCs w:val="28" />
                </w:rPr>
                <w:t xml:space="preserve">${cdata(
                    subjectTierPathwayTitle,
                  )}</w:t>
              </w:r>
            </w:p>
          `}
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          `section_year_${type}-${year}`,
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata(displayYearTitle)}</w:t>
            </w:r>
          `,
        )}
      </w:p>
      ${!isSwimming
        ? ""
        : safeXml`
            <XML_FRAGMENT>
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                    <w:color w:val="222222" />
                    <w:sz w:val="24" />
                  </w:rPr>
                  <w:t>
                    ${cdata(
                      "Swimming and water safety units should be selected based on the ability and experience of your pupils.",
                    )}
                  </w:t>
                </w:r>
              </w:p>
              <w:p />
            </XML_FRAGMENT>
          `}
      <w:p>
        ${wrapInLinkTo(
          links.interactiveSequence!,
          safeXml`
            <XML_FRAGMENT>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                  <w:u w:val="single" />
                </w:rPr>
                <w:t xml:space="preserve">View interactive sequence online</w:t>
              </w:r>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                  <w:u w:val="none" />
                </w:rPr>
                ${createImage(images.jumpOutArrow, {
                  width: cmToEmu(0.41),
                  height: cmToEmu(0.35),
                  xPosAnchor: "character",
                  yPosAnchor: "line",
                  isDecorative: true,
                })}
              </w:r>
            </XML_FRAGMENT>
          `,
        )}
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:cs="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
            />
            <w:color w:val="222222" />
            <w:sz w:val="44" />
            <w:szCs w:val="44" />
          </w:rPr>
          <w:t xml:space="preserve"> </w:t>
        </w:r>
      </w:p>
      ${yearContent}
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
      ${unitContent}
    </XML_FRAGMENT>
  `;

  return xml;
}
