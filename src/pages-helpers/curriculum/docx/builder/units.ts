import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData, Slugs } from "..";

import {
  appendBodyElements,
  insertLinks,
  wrapInBookmarkPoint,
  wrapInLinkTo,
} from "./helper";

import { Unit } from "@/components/CurriculumComponents/CurriculumVisualiser";

export function createProgrammeSlug(
  unitData?: Unit | null,
  examboardSlug?: string | null,
) {
  if (unitData?.keystage_slug === "ks4") {
    return `${unitData.subject_slug}-${unitData.phase_slug}-${
      unitData.keystage_slug
    }${unitData.tier_slug ? "-" + unitData.tier_slug : ""}${
      examboardSlug ? "-" + examboardSlug : ""
    }`;
  }
  return unitData
    ? `${unitData.subject_slug}-${unitData.phase_slug}-${unitData.keystage_slug}`
    : "";
}

export function createCurriculumSlug(slugs: Slugs) {
  return `${slugs.subjectSlug}-${slugs.phaseSlug}`;
}

export default async function generate(
  zip: JSZip,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const linkDefs: Record<string, string> = {};
  linkDefs["interactiveSequence"] =
    `https://www.thenational.academy/teachers/curriculum/${createCurriculumSlug(
      slugs,
    )}/units`;
  data.units.forEach((unit, unitIndex) => {
    linkDefs[`unit_${unitIndex}_onlineResources`] =
      `https://www.thenational.academy/teachers/programmes/${createProgrammeSlug(
        unit,
        slugs.examboardSlug,
      )}/units/${unit.slug}/lessons`;
  });
  const links = await insertLinks(zip, linkDefs);

  const years = Array.from(
    new Set(data.units.map((unit) => parseInt(unit.year))),
  ).sort((a, b) => a - b);

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Units")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                ${wrapInLinkTo(
                  links.interactiveSequence!,
                  `
                    <w:r>
                        <w:t>View interactive sequence online</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            ${years
              .map((year) => {
                return `
                    <w:p>
                        <w:pPr>
                            <w:pStyle w:val="Heading2"/>
                        </w:pPr>
                        ${wrapInBookmarkPoint(
                          `section_year_${year}`,
                          `
                            <w:r>
                                <w:t>Year ${year}</w:t>
                            </w:r>
                        `,
                        )}
                    </w:p>
                    <w:p>
                        <w:r>
                            <w:br w:type="page"/>
                        </w:r>
                    </w:p> 
                `;
              })
              .join("")}
            ${data.units.map((unit, unitIndex) => {
              return `
                    <w:p>
                        ${wrapInLinkTo(
                          links[`unit_${unitIndex}_onlineResources`]!,
                          `
                            <w:r>
                                <w:t>${unit.title} / Go to unit resources</w:t>
                            </w:r>
                        `,
                        )}
                    </w:p>
                `;
            })}
            ${
              years.length > 0
                ? ""
                : `
                <w:p>
                    <w:r>
                        <w:br w:type="page"/>
                    </w:r>
                </w:p> 
            `
            }          
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
