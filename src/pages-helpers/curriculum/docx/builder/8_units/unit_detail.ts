import type { Element } from "xml-js";
import JSZip from "jszip";

import { cdata, safeXml } from "../../xml";
import { CombinedCurriculumData } from "../..";
import { cmToEmu, createImage, insertLinks, wrapInLinkTo } from "../../docx";
import { createProgrammeSlug } from "../helper";

type Unit = CombinedCurriculumData["units"][number];

function buildUnitLessons(unit: Unit | Unit["unit_options"][number]) {
  const listRules = {
    // TODO: We should be using numbering here, but the numbered lists don't reset currently.
    numbering: `
        <w:ilvl w:val="0"/>
        <w:numId w:val="8"/>
    `,
    bullets: `
        <w:ilvl w:val="0"/>
        <w:numId w:val="3"/>
    `,
  };

  const lessonsXmls =
    unit.lessons?.map((lesson) => {
      return `
          <w:p>
              <w:pPr>
                  <w:numPr>
                    ${listRules.bullets}
                  </w:numPr>
                  <w:spacing w:line="240" w:lineRule="auto"/>
                  <w:ind w:left="425" w:right="-17"/>
              </w:pPr>
              <w:r>
                  <w:rPr>
                      <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                      <w:color w:val="222222"/>
                  </w:rPr>
                  <w:t>${cdata(lesson.title)}</w:t>
              </w:r>
          </w:p>
        ` as Element;
    }) ?? [];

  return lessonsXmls.join("");
}

function buildUnitThreads(unit: Unit) {
  if (unit.threads.length === 0) {
    return safeXml`
      <w:p>
        <w:r>
          <w:t>—</w:t>
        </w:r>
      </w:p>
    `;
  }

  const threadsXmls = unit.threads.map((thread) => {
    return safeXml`
      <w:p>
        <w:pPr>
          <w:widowControl w:val="0" />
          <w:numPr>
            <w:ilvl w:val="0" />
            <w:numId w:val="3" />
          </w:numPr>
          <w:spacing w:line="240" w:lineRule="auto" />
          <w:ind w:left="425" w:right="0" />
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
) {
  return `
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:color w:val="222222"/>
                    <w:sz w:val="32"/>
                </w:rPr>
                <w:t>Option ${cdata(unitOptionIndex + 1)}: ${cdata(
                  unitOption.title,
                )}</w:t>
            </w:r>
            <w:r>
                <w:drawing>
                    <wp:anchor distT="114300" distB="114300" distL="114300" distR="114300" simplePos="0" relativeHeight="251735040" behindDoc="1" locked="0" layoutInCell="1" hidden="0" allowOverlap="1" wp14:anchorId="63FFAED0" wp14:editId="008BED1E">
                        <wp:simplePos x="0" y="0"/>
                        <wp:positionH relativeFrom="column">
                            <wp:posOffset>0</wp:posOffset>
                        </wp:positionH>
                        <wp:positionV relativeFrom="paragraph">
                            <wp:posOffset>219075</wp:posOffset>
                        </wp:positionV>
                        <wp:extent cx="954964" cy="104140"/>
                        <wp:effectExtent b="0" l="0" r="0" t="0"/>
                        <wp:wrapNone/>
                        <wp:docPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                        <wp:cNvGraphicFramePr/>
                        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:nvPicPr>
                                        <pic:cNvPr id="47" name="image10.png" descr="A purple circle with black background&#xA;&#xA;Description automatically generated"/>
                                        <pic:cNvPicPr preferRelativeResize="0"/>
                                    </pic:nvPicPr>
                                    <pic:blipFill>
                                        <a:blip r:embed="rId24"/>
                                        <a:srcRect/>
                                        <a:stretch>
                                            <a:fillRect/>
                                        </a:stretch>
                                    </pic:blipFill>
                                    <pic:spPr>
                                        <a:xfrm>
                                            <a:off x="0" y="0"/>
                                            <a:ext cx="1954964" cy="104140"/>
                                        </a:xfrm>
                                        <a:prstGeom prst="rect">
                                            <a:avLst/>
                                        </a:prstGeom>
                                        <a:ln/>
                                    </pic:spPr>
                                </pic:pic>
                            </a:graphicData>
                        </a:graphic>
                        <wp14:sizeRelH relativeFrom="margin">
                            <wp14:pctWidth>0</wp14:pctWidth>
                        </wp14:sizeRelH>
                        <wp14:sizeRelV relativeFrom="margin">
                            <wp14:pctHeight>0</wp14:pctHeight>
                        </wp14:sizeRelV>
                    </wp:anchor>
                </w:drawing>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t></w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t></w:t>
            </w:r>
        </w:p>
    `;
}

export async function buildUnit(
  zip: JSZip,
  unit: Unit,
  unitIndex: number,
  unitOption: undefined | Unit["unit_options"][number] | null,
  unitOptionIndex: undefined | number,
  images: {
    greenCircle: string;
    underline: string;
  },
  slugs: {
    examboardSlug?: string;
    tierSlug?: string;
  },
) {
  const unitOptionIfAvailable = unitOption ?? unit;
  const unitNumber = unitIndex + 1;
  const lessons = buildUnitLessons(unitOptionIfAvailable);
  const threads = buildUnitThreads(unit);

  const links = await insertLinks(zip, {
    onlineResources: `https://www.thenational.academy/teachers/programmes/${createProgrammeSlug(
      unit,
      slugs.examboardSlug,
      slugs.tierSlug,
    )}/units/${unit.slug}/lessons`,
  });

  let unitDescriptions: string = "";
  if (
    unitOptionIfAvailable.connection_prior_unit_title ||
    unitOptionIfAvailable.connection_future_unit_title
  ) {
    const priorUnitTitle = unitOptionIfAvailable.connection_prior_unit_title
      ? unitOptionIfAvailable.connection_prior_unit_title
      : "-";
    const futureUnitTitle = unitOptionIfAvailable.connection_future_unit_title
      ? unitOptionIfAvailable.connection_future_unit_title
      : "-";
    unitDescriptions = `
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:b />
                    <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Previous unit description</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:b />
                </w:rPr>
                <w:t>${cdata(priorUnitTitle)}</w:t>
            </w:r>
        </w:p>
        ${
          !unitOptionIfAvailable.connection_prior_unit_description
            ? ""
            : `<w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                </w:rPr>
                <w:t>${cdata(
                  unitOptionIfAvailable.connection_prior_unit_description,
                )}</w:t>
            </w:r>
        </w:p>`
        }
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:b />
                    <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Future unit description</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:pPr>
                <w:ind w:left="30" w:hanging="30"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:b />
                    <w:color w:val="222222"/>
                    <w:sz w:val="24"/>
                </w:rPr>
                <w:t>${cdata(futureUnitTitle)}</w:t>
            </w:r>
        </w:p>
        ${
          !unitOptionIfAvailable.connection_future_unit_description
            ? ""
            : `<w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                </w:rPr>
                <w:t>${cdata(
                  unitOptionIfAvailable.connection_future_unit_description,
                )}</w:t>
            </w:r>
        </w:p>`
        }
    `;
  } else {
    const description = unitOptionIfAvailable.description
      ? unitOptionIfAvailable.description
      : "-";
    const whyThisWhyNow = unitOptionIfAvailable.why_this_why_now
      ? unitOptionIfAvailable.why_this_why_now
      : "-";
    unitDescriptions = `
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:b />
                    <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Unit description</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                </w:rPr>
                <w:t>${cdata(description)}</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:b />
                    <w:sz w:val="28"/>
                </w:rPr>
                <w:t>Why this, why now?</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:pPr>
                <w:ind w:left="30" w:hanging="30"/>
            </w:pPr>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                    <w:color w:val="222222"/>
                    <w:sz w:val="24"/>
                </w:rPr>
                <w:t>${cdata(whyThisWhyNow)}</w:t>
            </w:r>
        </w:p>
        <w:p>
            ${wrapInLinkTo(
              links.onlineResources,
              `
                <w:r>
                    <w:t>Go to unit resources</w:t>
                </w:r>
            `,
            )}
        </w:p>
    `;
  }

  const xml = `
            <w:tbl>
                <w:tblPr>
                    <w:tblStyle w:val="TableGrid"/>
                    <w:tblpPr w:leftFromText="181" w:rightFromText="181" w:vertAnchor="page" w:horzAnchor="margin" w:tblpY="568"/>
                    <w:tblW w:w="10481" w:type="dxa"/>
                    <w:tblBorders>
                        <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    </w:tblBorders>
                    <w:tblLayout w:type="fixed"/>
                    <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="1092"/>
                    <w:gridCol w:w="9389"/>
                </w:tblGrid>
                <w:tr>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="1092" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:pPr>
                                <w:jc w:val="center"/>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                            </w:pPr>
                            <w:r w:rsidR="002859F6" w:rsidRPr="00D13F46">
                                <w:rPr>
                                    <w:noProof/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                ${createImage(images.greenCircle, {
                                  width: cmToEmu(1.77),
                                  height: cmToEmu(1.6),
                                  xPos: cmToEmu(0.07),
                                  yPos: cmToEmu(0.41),
                                  isDecorative: true,
                                })}
                            </w:r>
                        </w:p>
                        <w:p>
                            <w:pPr>
                                <w:jc w:val="center"/>
                            </w:pPr>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t>${cdata(unitNumber)}</w:t>
                            </w:r>
                            <w:r>
                                <w:rPr>
                                    <w:noProof/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                <w:t xml:space="preserve"> </w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="9389" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                </w:rPr>
                                <w:t>Year ${cdata(unit.year)}</w:t>
                            </w:r>
                        </w:p>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t>${cdata(unit.title)}</w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                </w:tr>
            </w:tbl>
            <w:tbl>
                <w:tblPr>
                    <w:tblStyle w:val="TableGrid"/>
                    <w:tblW w:w="0" w:type="auto"/>
                    <w:tblBorders>
                        <w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideH w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                        <w:insideV w:val="none" w:sz="0" w:space="0" w:color="auto"/>
                    </w:tblBorders>
                    <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="10481"/>
                </w:tblGrid>
                <w:tr>
                    <w:trPr>
                        <w:trHeight w:val="787"/>
                    </w:trPr>
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="10481" w:type="dxa"/>
                        </w:tcPr>
                        <w:p>
                            <w:r>
                                <w:rPr>
                                    <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                    <w:color w:val="222222"/>
                                    <w:sz w:val="36"/>
                                    <w:szCs w:val="36"/>
                                </w:rPr>
                                <w:t xml:space="preserve"> </w:t>
                            </w:r>
                        </w:p>
                    </w:tc>
                </w:tr>
            </w:tbl>
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:noProof/>
                        <w:color w:val="222222"/>
                    </w:rPr>
                    ${createImage(images.underline, {
                      width: cmToEmu(19.3),
                      height: cmToEmu(0.16),
                      xPos: cmToEmu(0.83),
                      yPos: cmToEmu(3.63),
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            ${
              unitOption && unitOptionIndex !== undefined
                ? buildUnitOptionTitle(unitOption, unitOptionIndex)
                : ""
            }
            <w:p>
                <w:pPr>
                    <w:sectPr>
                        <w:pgSz w:w="11909" w:h="16834"/>
                        <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                        <w:cols w:space="720"/>
                    </w:sectPr>
                </w:pPr>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:b />
                        <w:sz w:val="28"/>
                    </w:rPr>
                    <w:t>Threads</w:t>
                </w:r>
            </w:p>
            ${threads}
            <w:p>
                <w:pPr>
                    <w:ind w:left="30" w:hanging="30"/>
                    <w:rPr>
                        <w:color w:val="222222"/>
                    </w:rPr>
                </w:pPr>
            </w:p>
            ${unitDescriptions}
            <w:p>
                <w:r>
                    <w:br w:type="column"/>
                </w:r>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:eastAsia="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:b />
                        <w:sz w:val="28"/>
                    </w:rPr>
                    <w:t>Lessons in unit</w:t>
                </w:r>
            </w:p>
            ${lessons}
            <w:p>
                <w:pPr>
                    <w:ind w:right="-1032"/>
                    <w:sectPr>
                        <w:type w:val="continuous"/>
                        <w:pgSz w:w="11909" w:h="16834"/>
                        <w:pgMar w:top="567" w:right="709" w:bottom="709" w:left="709" w:header="720" w:footer="720" w:gutter="0"/>
                        <w:cols w:num="2" w:space="720"/>
                    </w:sectPr>
                </w:pPr>
            </w:p>
    `;

  return xml;
}
