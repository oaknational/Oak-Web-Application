import { join } from "path";

import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData, Slugs } from "..";
import {
  appendBodyElements,
  insertImages,
  insertLinks,
  wrapInBookmarkPoint,
  wrapInLinkTo,
  createImage,
  cmToEmu,
} from "../docx";

import { createCurriculumSlug, createProgrammeSlug } from "./helper";

export default async function generate(
  zip: JSZip,
  { data, slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const images = await insertImages(zip, {
    jumpOutArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow.png",
    ),
  });

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
                            <w:br w:type="page"/>
                        </w:r>
                    </w:p> 
                `;
              })
              .join("")}
            ${data.units
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
              .join("")}
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p> 
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
2.5 - 1.25;
