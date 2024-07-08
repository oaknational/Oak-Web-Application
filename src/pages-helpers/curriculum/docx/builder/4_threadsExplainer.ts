import { join } from "path";

import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { Slugs } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  insertLinks,
  wrapInLinkToBookmark,
  wrapInLinkTo,
  wrapInBookmarkPoint,
  cmToTwip,
} from "../docx";

import { createCurriculumSlug } from "./helper";

export default async function generate(
  zip: JSZip,
  { slugs }: { slugs: Slugs },
) {
  const links = await insertLinks(zip, {
    onlineCurriculum: `https://www.thenational.academy/teachers/curriculum/${createCurriculumSlug(
      slugs,
    )}/units`,
  });
  const images = await insertImages(zip, {
    curriculumScreenshot: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/our-curriculum-screenshot.png",
    ),
    threadScreenshot: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/threads-screenshot.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
    jumpOutArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow.png",
    ),
    downArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/down-arrow.png",
    ),
  });

  const whatAreThreadsContent =
    "We use threads to signpost groups of units that link to one another, that together build a common body of knowledge over time. We use the term thread, rather than vertical concepts, themes or big ideas, because it helps us bring to mind the visual concept of a thread weaving through the curriculum.";
  const howToUseThreadsItems = [
    "Familiarise yourself with all of the threads relating to the subject",
    "Identify the unit you will be delivering",
    "Review the threads associated with the unit",
    "Audit where pupils have and will learn about these threads in your existing curriculum sequence.",
    "Ensure you understand how the thread relating to your new unit has been framed in prior and future units",
    "Review how the thread works within the unit you will be delivering",
    "Teach and iterate your framing of the thread within the unit and across your curriculum sequence",
  ];

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                ${wrapInBookmarkPoint(
                  "section_threads",
                  `
                    <w:r>
                        <w:rPr>
                              <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                              <w:b />
                              <w:color w:val="222222"/>
                              <w:sz w:val="56"/>
                        </w:rPr>
                        <w:t>${cdata("Threads")}</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                          <w:b />
                          <w:color w:val="222222"/>
                          <w:sz w:val="36"/>
                    </w:rPr>
                    <w:t>${cdata("What are threads?")}</w:t>
                    ${createImage(images.underline, {
                      width: cmToEmu(5.92),
                      height: cmToEmu(0.21),
                      xPos: cmToEmu(-0.19),
                      yPos: cmToEmu(0.9),
                      xPosAnchor: "column",
                      yPosAnchor: "paragraph",
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                          <w:color w:val="222222"/>
                          <w:sz w:val="24"/>
                    </w:rPr>
                    <w:t>${cdata(whatAreThreadsContent)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                          <w:b />
                          <w:color w:val="222222"/>
                          <w:sz w:val="36"/>
                    </w:rPr>
                    <w:t>${cdata("How to use threads")}</w:t>
                    ${createImage(images.underline, {
                      width: cmToEmu(6.71),
                      height: cmToEmu(0.21),
                      xPos: cmToEmu(-0.19),
                      yPos: cmToEmu(0.9),
                      xPosAnchor: "column",
                      yPosAnchor: "paragraph",
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            ${howToUseThreadsItems
              .map((howToUseThreadsItem) => {
                return `
                    <w:p>
                        <w:r>
                            <w:rPr>
                                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                  <w:color w:val="222222"/>
                                  <w:sz w:val="24"/>
                            </w:rPr>
                            <w:t>${cdata(howToUseThreadsItem)}</w:t>
                        </w:r>
                    </w:p>
                `;
              })
              .join("")}
            
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                          <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                          <w:b />
                          <w:color w:val="222222"/>
                          <w:sz w:val="36"/>
                    </w:rPr>
                    <w:t>${cdata("Tools for using threads")}</w:t>
                    ${createImage(images.underline, {
                      width: cmToEmu(7.5),
                      height: cmToEmu(0.21),
                      xPos: cmToEmu(-0.19),
                      yPos: cmToEmu(0.9),
                      xPosAnchor: "column",
                      yPosAnchor: "paragraph",
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>

            <w:p></w:p>
            <w:p></w:p>

            <w:tbl>
              <w:tblPr>
                  <w:tblW w:type="pct" w:w="100%"/>
                  <w:tblBorders>
                      <w:top w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:left w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:bottom w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:right w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:insideH w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:insideV w:val="single" w:color="FFFFFF" w:sz="0"/>
                  </w:tblBorders>
              </w:tblPr>
              <w:tblGrid>
                  <w:gridCol w:w="10515"/>
              </w:tblGrid>
              <w:tr>
                <w:tc>
                  <w:tcPr>
                      <w:tcMar>
                        <w:right w:type="dxa" w:w="${cmToTwip(1)}"/>
                      </w:tcMar>
                      <w:vAlign w:val="center"/>
                  </w:tcPr>
                  <w:p>
                      <w:pPr>
                          <w:pStyle w:val="Heading3"/>
                      </w:pPr>
                      <w:r>
                          <w:rPr>
                                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                <w:b />
                                <w:color w:val="222222"/>
                                <w:sz w:val="28"/>
                          </w:rPr>
                          <w:t>${cdata("Online curriculum")}</w:t>
                      </w:r>
                  </w:p>
                  <w:p>
                      <w:r>
                          <w:rPr>
                                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                <w:color w:val="222222"/>
                                <w:sz w:val="24"/>
                          </w:rPr>
                          <w:t>${cdata(
                            "Our interactive tool enables you to visualise how threads are sequenced across our curriculum plans.",
                          )}</w:t>
                      </w:r>
                  </w:p>
                  <w:p>
                      ${wrapInLinkTo(
                        links.onlineCurriculum,
                        `
                          <w:r>
                              <w:rPr>
                                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                  <w:b />
                                  <w:color w:val="222222"/>
                                  <w:sz w:val="24"/>
                                  <w:u w:val="single"/>
                              </w:rPr>
                              <w:t>${cdata("Go to online curriculum")}</w:t>
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
                </w:tc>
                <w:tc>
                  <w:p>
                      <w:r>
                          ${createImage(images.curriculumScreenshot, {
                            width: cmToEmu(10.5),
                            height: cmToEmu(8.63),
                            isDecorative: true,
                          })}
                      </w:r>
                  </w:p>
                </w:tc>
              </w:tr>
            </w:tbl>
            <w:p></w:p>
            <w:tbl>
              <w:tblPr>
                  <w:tblW w:type="pct" w:w="100%"/>
                  <w:tblBorders>
                      <w:top w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:left w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:bottom w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:right w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:insideH w:val="single" w:color="FFFFFF" w:sz="0"/>
                      <w:insideV w:val="single" w:color="FFFFFF" w:sz="0"/>
                  </w:tblBorders>
              </w:tblPr>
              <w:tblGrid>
                  <w:gridCol w:w="10515"/>
              </w:tblGrid>
              <w:tr>
                <w:tc>
                  <w:p>
                      <w:r>
                      ${createImage(images.threadScreenshot, {
                        width: cmToEmu(10.65),
                        height: cmToEmu(8.75),
                        isDecorative: true,
                      })}
                      </w:r>
                  </w:p>
                </w:tc>
                <w:tc>
                  <w:tcPr>
                      <w:tcMar>
                        <w:left w:type="dxa" w:w="${cmToTwip(1)}"/>
                      </w:tcMar>
                      <w:vAlign w:val="center"/>
                  </w:tcPr>
                  <w:p>
                      <w:pPr>
                          <w:pStyle w:val="Heading3"/>
                      </w:pPr>
                      <w:r>
                          <w:rPr>
                                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                <w:b />
                                <w:color w:val="222222"/>
                                <w:sz w:val="28"/>
                          </w:rPr>
                          <w:t>${cdata("Threads in this document")}</w:t>
                      </w:r>
                  </w:p>
                  <w:p>
                      <w:r>
                          <w:rPr>
                                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                <w:color w:val="222222"/>
                                <w:sz w:val="24"/>
                          </w:rPr>
                          <w:t>${cdata(
                            "The appendix displays the threads and their related units.",
                          )}</w:t>
                      </w:r>
                  </w:p>
                  <w:p>
                      ${wrapInLinkToBookmark(
                        "section_threads_appendix",
                        `
                          <w:r>
                              <w:rPr>
                                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                                  <w:b />
                                  <w:color w:val="222222"/>
                                  <w:sz w:val="24"/>
                                  <w:u w:val="single"/>
                              </w:rPr>
                              <w:t>${cdata("Go to threads appendix")}</w:t>
                              ${createImage(images.downArrow, {
                                width: cmToEmu(0.62),
                                height: cmToEmu(0.62),
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
                </w:tc>
              </w:tr>
            </w:tbl>

            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
