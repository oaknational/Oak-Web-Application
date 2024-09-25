import { join } from "path";

import { sortBy, uniqBy } from "lodash";

import { cdata, safeXml, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData, Slugs } from "../..";
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
import { createCurriculumSlug, generateGridCols } from "../helper";

import { buildUnit } from "./unit_detail";

import {
  CurriculumUnitsFormattedData,
  formatCurriculumUnitsData,
} from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import {
  getSuffixFromFeatures,
  getYearGroupTitle,
} from "@/utils/curriculum/formatting";
import { getUnitFeatures } from "@/utils/curriculum/features";

function generateGroupedUnits(
  data: CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>,
) {
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
  zip: JSZipCached,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const formattedData = formatCurriculumUnitsData(
    data,
  ) as CurriculumUnitsFormattedData<CombinedCurriculumData["units"][number]>;

  const yearXml: string[] = [];
  const groupedUnits = generateGroupedUnits(formattedData);
  for (const { units, year, childSubject, tier, pathway } of groupedUnits) {
    yearXml.push(
      await buildYear(
        zip,
        year,
        formattedData,
        units,
        { childSubject, tier, pathway },
        slugs,
      ),
    );
  }

  const pageXml = safeXml`
    <root>
      ${yearXml.join("")}
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
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

  const rows = [];
  const units = removeDups(unitsInput);
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

  const yearTitleSuffix = [
    getSuffixFromFeatures(getUnitFeatures(firstUnit)),
    "units",
  ]
    .filter(Boolean)
    .join(" ");
  const yearTitle = getYearGroupTitle(
    formattedData.yearData,
    year,
    yearTitleSuffix,
  );

  const isSwimming = formattedData.yearData[year]?.labels.includes("swimming");

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
          `section_year_${year}`,
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata(yearTitle)}</w:t>
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
                      "Swimming units should be selected based on the ability and experience of your pupils.",
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
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
      ${unitsXml}
    </XML_FRAGMENT>
  `;

  return xml;
}
