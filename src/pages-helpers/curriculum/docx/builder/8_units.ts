import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData, Slugs } from "..";
import {
  appendBodyElements,
  insertLinks,
  wrapInBookmarkPoint,
  wrapInLinkTo,
} from "../docx";

import { createCurriculumSlug, createProgrammeSlug } from "./helper";

export default async function generate(
  zip: JSZip,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const linkDefs: Record<string, string> = {};
  linkDefs["interactiveSequence"] =
    `https://www.thenational.academy/teachers/curriculum/${createCurriculumSlug(
      slugs,
    )}/units`;

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

  const years = Array.from(
    new Set(data.units.map((unit) => parseInt(unit.year))),
  ).sort((a, b) => a - b);

  const pageXml = `
        <root>
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
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="56"/>
                                    <w:b/>
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
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="24"/>
                                    <w:b/>
                                    <w:u w:val="single"/>
                                </w:rPr>
                                <w:t>View interactive sequence online</w:t>
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
            ${data.units
              .map((unit, unitIndex) => {
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
              })
              .join("")}
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
2.5 - 1.25;
