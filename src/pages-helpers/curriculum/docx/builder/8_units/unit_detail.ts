import type { Element } from "xml-js";

import { cdata, safeXml } from "../../xml";
import { CombinedCurriculumData } from "../..";
import {
  cmToEmu,
  cmToTwip,
  createImage,
  insertLinks,
  insertNumbering,
  JSZipCached,
  wrapInLinkTo,
} from "../../docx";
import { createUnitsListingByYear } from "../../tab-helpers";

import { getYearGroupTitle } from "@/utils/curriculum/formatting";
import { getUnitFeatures } from "@/utils/curriculum/features";
import { createProgrammeSlug } from "@/utils/curriculum/slugs";
import { SubjectCategory } from "@/utils/curriculum/types";
import { ENABLE_NEW_CURRIC_MV } from "@/utils/curriculum/constants";

const DISABLE_COLUMN_BREAKS = true;

type Unit = CombinedCurriculumData["units"][number];

async function buildUnitLessons(
  zip: JSZipCached,
  unit: Unit | Unit["unit_options"][number],
) {
  const numbering = await insertNumbering(zip, {
    lessonNumbering: safeXml`
      <XML_FRAGMENT>
        <w:lvl w:ilvl="0">
          <w:start w:val="1" />
          <w:numFmt w:val="decimal" />
          <w:lvlText w:val="%1." />
          <w:lvlJc w:val="left" />
          <w:pPr>
            <w:ind w:left="360" w:hanging="360" />
          </w:pPr>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
          </w:rPr>
        </w:lvl>
      </XML_FRAGMENT>
    `,
  });

  const lessonsXmls =
    unit.lessons?.map((lesson) => {
      return safeXml`
        <w:p>
          <w:pPr>
            <w:numPr>
              <w:ilvl w:val="0" />
              <w:numId w:val="${numbering.lessonNumbering}" />
            </w:numPr>
            <w:spacing w:line="276" w:lineRule="auto" />
            <w:ind w:left="425" w:right="-17" w:hanging="360" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:color w:val="222222" />
            </w:rPr>
            <w:t>${cdata(lesson.title)}</w:t>
          </w:r>
        </w:p>
      ` as Element;
    }) ?? [];

  return lessonsXmls.join("");
}

async function buildUnitThreads(zip: JSZipCached, unit: Unit) {
  const numbering = await insertNumbering(zip, {
    threadsNumbering: safeXml`
      <XML_FRAGMENT>
        <w:nsid w:val="1E776843" />
        <w:multiLevelType w:val="multilevel" />
        <w:tmpl w:val="20BC537A" />
        <w:lvl w:ilvl="0">
          <w:start w:val="1" />
          <w:numFmt w:val="bullet" />
          <w:lvlText w:val="" />
          <w:lvlJc w:val="left" />
          <w:pPr>
            <w:ind w:left="360" w:hanging="360" />
          </w:pPr>
          <w:rPr>
            <w:rFonts w:ascii="Symbol" w:hAnsi="Symbol" w:hint="default" />
          </w:rPr>
        </w:lvl>
      </XML_FRAGMENT>
    `,
  });

  if (unit.threads.length === 0) {
    return safeXml`
      <w:p>
        <w:r>
          <w:t>No threads</w:t>
        </w:r>
      </w:p>
    `;
  }

  const threadsXmls = unit.threads.map((thread) => {
    return safeXml`
      <w:p>
        <w:pPr>
          <w:numPr>
            <w:ilvl w:val="0" />
            <w:numId w:val="${numbering.threadsNumbering}" />
          </w:numPr>
          <w:spacing w:line="276" w:lineRule="auto" />
          <w:ind w:left="425" w:right="-17" w:hanging="360" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:color w:val="222222" />
          </w:rPr>
          <w:t>${cdata(thread.title)}</w:t>
        </w:r>
      </w:p>
    ` as Element;
  });
  return threadsXmls.join("");
}

function buildUnitOptionTitle(
  unitOption: CombinedCurriculumData["units"][number]["unit_options"][number],
  unitOptionIndex: number,
  images: { greenUnderline: string },
) {
  return safeXml`
    <XML_FRAGMENT>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="32" />
          </w:rPr>
          <w:t xml:space="preserve">Option ${cdata(unitOptionIndex + 1)}: </w:t>
          ${createImage(images.greenUnderline, {
            width: cmToEmu(2.74),
            height: cmToEmu(0.27),
            xPos: cmToEmu(-0.21),
            yPos: cmToEmu(0.7),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
        </w:r>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:color w:val="222222" />
            <w:sz w:val="32" />
          </w:rPr>
          <w:t>${cdata(unitOption.title)}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t />
        </w:r>
      </w:p>
    </XML_FRAGMENT>
  `;
}

export async function buildUnit(
  zip: JSZipCached,
  unit: Unit,
  unitIndex: number,
  unitOption: undefined | Unit["unit_options"][number] | null,
  unitOptionIndex: undefined | number,
  images: {
    greenCircle: string;
    underline: string;
    jumpOutArrow: string;
    greenUnderline: string;
  },
  slugs: {
    ks4OptionSlug?: string;
    tierSlug?: string;
  },
) {
  const unitOptionIfAvailable = unitOption ?? unit;
  const unitNumber = unitIndex + 1;
  const lessons = await buildUnitLessons(zip, unitOptionIfAvailable);
  const threads = await buildUnitThreads(zip, unit);

  const hasPublishedLessons = (unitOptionIfAvailable.lessons ?? []).some(
    (lesson) => lesson._state === "published",
  );

  let resolvedUnitSlug;
  if (ENABLE_NEW_CURRIC_MV) {
    resolvedUnitSlug = unitOption?.slug ?? unit.slug;
  } else {
    resolvedUnitSlug = unitOption?.unitvariant_id
      ? `${unit.slug}-${unitOption.unitvariant_id}`
      : unit.slug;
  }

  const links = await insertLinks(zip, {
    onlineResources: `https://www.thenational.academy/teachers/programmes/${createProgrammeSlug(
      unit,
      slugs.ks4OptionSlug,
      slugs.tierSlug,
    )}/units/${resolvedUnitSlug}/lessons`,
  });

  let unitDescriptions: string = "";
  if (unit.cycle === "1") {
    const priorUnitTitle = unitOptionIfAvailable.connection_prior_unit_title
      ? unitOptionIfAvailable.connection_prior_unit_title
      : "-";
    const futureUnitTitle = unitOptionIfAvailable.connection_future_unit_title
      ? unitOptionIfAvailable.connection_future_unit_title
      : "-";
    unitDescriptions = safeXml`
      <XML_FRAGMENT>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading4" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:b />
              <w:i w:val="0" />
              <w:color w:val="000000" />
              <w:sz w:val="28" />
            </w:rPr>
            <w:t>Previous unit description</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
              <w:b />
            </w:rPr>
            <w:t>${cdata(priorUnitTitle)}</w:t>
          </w:r>
        </w:p>
        ${!unitOptionIfAvailable.connection_prior_unit_description
          ? ""
          : safeXml`
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
                  </w:rPr>
                  <w:t>
                    ${cdata(
                      unitOptionIfAvailable.connection_prior_unit_description,
                    )}
                  </w:t>
                </w:r>
              </w:p>
            `}
        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
              <w:b />
            </w:rPr>
            <w:t />
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading4" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:b />
              <w:i w:val="0" />
              <w:color w:val="000000" />
              <w:sz w:val="28" />
            </w:rPr>
            <w:t>Future unit description</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:ind w:left="30" w:hanging="30" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:b />
              <w:color w:val="222222" />
              <w:sz w:val="24" />
            </w:rPr>
            <w:t>${cdata(futureUnitTitle)}</w:t>
          </w:r>
        </w:p>
        ${!unitOptionIfAvailable.connection_future_unit_description
          ? ""
          : safeXml`
              <w:p>
                <w:r>
                  <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
                  </w:rPr>
                  <w:t>
                    ${cdata(
                      unitOptionIfAvailable.connection_future_unit_description,
                    )}
                  </w:t>
                </w:r>
              </w:p>
            `}
      </XML_FRAGMENT>
    `;
  } else {
    const description = unitOptionIfAvailable.description
      ? unitOptionIfAvailable.description
      : "-";
    const whyThisWhyNow = unitOptionIfAvailable.why_this_why_now
      ? unitOptionIfAvailable.why_this_why_now
      : "-";
    unitDescriptions = safeXml`
      <XML_FRAGMENT>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading4" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:b />
              <w:i w:val="0" />
              <w:color w:val="000000" />
              <w:sz w:val="28" />
            </w:rPr>
            <w:t>Unit description</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
            </w:rPr>
            <w:t>${cdata(description)}</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" />
              <w:b />
            </w:rPr>
            <w:t />
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:pStyle w:val="Heading4" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:b />
              <w:i w:val="0" />
              <w:color w:val="000000" />
              <w:sz w:val="28" />
            </w:rPr>
            <w:t>Why this, why now?</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:ind w:left="30" w:hanging="30" />
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts
                w:ascii="Arial"
                w:eastAsia="Arial"
                w:hAnsi="Arial"
                w:cs="Arial"
              />
              <w:color w:val="222222" />
              <w:sz w:val="24" />
            </w:rPr>
            <w:t>${cdata(whyThisWhyNow)}</w:t>
          </w:r>
        </w:p>
      </XML_FRAGMENT>
    `;
  }

  function getSubjectCategoriesAsString(
    subjectcategories: SubjectCategory[] | null | undefined,
  ) {
    const combinedTitles = subjectcategories
      ? subjectcategories.map(({ title }) => title).join(", ")
      : "";
    return combinedTitles !== "" ? `: ${combinedTitles}` : "";
  }

  const yearData = createUnitsListingByYear([unit]);
  const yearTitle = getYearGroupTitle(
    yearData,
    getUnitFeatures(unit)?.programmes_fields_overrides?.year ?? unit.year,
  );

  const xml = safeXml`
    <XML_FRAGMENT>
      ${
        "" /*<w:p>
        <w:r>
          <w:rPr>
            <w:noProof />
          </w:rPr>
          ${createImage(images.greenCircle, {
            width: cmToEmu(1.77),
            height: cmToEmu(1.6),
            xPos: cmToEmu(1.55),
            yPos: cmToEmu(1.13),
            xPosAnchor: "page",
            yPosAnchor: "page",
            isDecorative: true,
          })}
        </w:r>
      </w:p>*/
      }
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading3" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:b />
            <w:color w:val="222222" />
            <w:sz w:val="36" />
            <w:szCs w:val="36" />
          </w:rPr>
          <w:t>${cdata(unitNumber)}. ${cdata(unit.title)}</w:t>
        </w:r>
      </w:p>

      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:b />
            <w:color w:val="222222" />
          </w:rPr>
          <w:t>${cdata(yearTitle)}</w:t>
          <w:t>
            ${cdata(getSubjectCategoriesAsString(unit.subjectcategories))}
          </w:t>
        </w:r>
      </w:p>

      <w:p />

      ${!hasPublishedLessons
        ? ""
        : safeXml`
            <w:p>
              ${wrapInLinkTo(
                links.onlineResources,
                safeXml`
                  <XML_FRAGMENT>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:eastAsia="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:b />
                        <w:u w:val="single" />
                      </w:rPr>
                      <w:t>Go to unit resources</w:t>
                    </w:r>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:eastAsia="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:b />
                        <w:u w:val="none" />
                      </w:rPr>
                      ${createImage(images.jumpOutArrow, {
                        width: cmToEmu(0.41),
                        height: cmToEmu(0.35),
                        isDecorative: true,
                      })}
                    </w:r>
                  </XML_FRAGMENT>
                `,
              )}
            </w:p>
          `}
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>

      <w:p>
        <w:r>
          <w:rPr>
            <w:noProof />
            <w:color w:val="222222" />
          </w:rPr>
          ${createImage(images.underline, {
            width: cmToEmu(19.3),
            height: cmToEmu(0.16),
            xPos: cmToEmu(0.83),
            yPos: cmToEmu(0),
            yPosAnchor: "line",
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      <w:p />
      ${unitOption && unitOptionIndex !== undefined
        ? buildUnitOptionTitle(unitOption, unitOptionIndex, images)
        : ""}
      <w:p>
        <w:pPr>
          <w:sectPr>
            <w:pgSz w:w="11909" w:h="16834" />
            <w:pgMar
              w:top="${cmToTwip(1.5)}"
              w:right="${cmToTwip(1.5)}"
              w:bottom="${cmToTwip(2.5)}"
              w:left="${cmToTwip(1.5)}"
              w:header="${cmToTwip(1.5)}"
              w:footer="${cmToTwip(1.5)}"
              w:gutter="0"
            />
            <w:cols w:space="720" />
          </w:sectPr>
        </w:pPr>
      </w:p>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading4" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="000000" />
            <w:sz w:val="28" />
          </w:rPr>
          <w:t>Threads</w:t>
        </w:r>
      </w:p>
      ${threads}
      <w:p>
        <w:pPr>
          <w:ind w:left="30" w:hanging="30" />
          <w:rPr>
            <w:color w:val="222222" />
          </w:rPr>
        </w:pPr>
      </w:p>
      ${unitDescriptions}
      ${DISABLE_COLUMN_BREAKS ? safeXml` <w:p /> ` : ""}
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading4" />
        </w:pPr>
        ${DISABLE_COLUMN_BREAKS
          ? ""
          : `<w:r>
          <w:br w:type="column" />
        </w:r>`}
        <w:r>
          <w:rPr>
            <w:rFonts
              w:ascii="Arial"
              w:eastAsia="Arial"
              w:hAnsi="Arial"
              w:cs="Arial"
            />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="000000" />
            <w:sz w:val="28" />
          </w:rPr>
          <w:t>Lessons in unit</w:t>
        </w:r>
      </w:p>
      ${lessons}
      <w:p>
        <w:pPr>
          <w:ind w:right="-1032" />
          <w:sectPr>
            <w:type w:val="continuous" />
            <w:pgSz w:w="11909" w:h="16834" />
            <w:pgMar
              w:top="${cmToTwip(1.5)}"
              w:right="${cmToTwip(1.5)}"
              w:bottom="${cmToTwip(2.5)}"
              w:left="${cmToTwip(1.5)}"
              w:header="${cmToTwip(1.5)}"
              w:footer="${cmToTwip(1.5)}"
              w:gutter="0"
            />
            <w:cols w:num="2" w:space="720" />
          </w:sectPr>
        </w:pPr>
      </w:p>
    </XML_FRAGMENT>
  `;

  return xml;
}
