import { join } from "path";

import { cdata, safeXml } from "@ooxml-tools/xml";

import { xmlElementToJson } from "../xml";
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
  JSZipCached,
  insertNumbering,
} from "../docx";
import { createThreadOptions } from "../tab-helpers";

import { createCurriculumSlug } from "./helper";

import { CombinedCurriculumData } from "@/utils/curriculum/types";

export default async function generate(
  zip: JSZipCached,
  { slugs, data }: { slugs: Slugs; data: CombinedCurriculumData },
) {
  const threads = createThreadOptions(data.units);

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
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow-2.png",
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

  const numbering = await insertNumbering(zip, {
    threadsNumbering: safeXml`
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
    allThreadsNumbering: safeXml`
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

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          "section_threads",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata("Threads")}</w:t>
            </w:r>
          `,
        )}
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:sz w:val="56" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
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
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:sz w:val="36" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata(whatAreThreadsContent)}</w:t>
        </w:r>
      </w:p>
      ${Array(3)
        .fill(true)
        .map(() => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        })}
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
          <w:t>${cdata("How to use threads")}</w:t>
          ${createImage(images.underline, {
            width: cmToEmu(6.3),
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
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:sz w:val="36" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      ${howToUseThreadsItems
        .map((howToUseThreadsItem) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:numPr>
                  <w:ilvl w:val="0" />
                  <w:numId w:val="${numbering.threadsNumbering}" />
                </w:numPr>
                <w:spacing w:line="360" w:lineRule="auto" />
                <w:ind w:left="425" w:right="-17" w:hanging="360" />
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t>${cdata(howToUseThreadsItem)}</w:t>
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
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
          <w:t>${cdata(`Threads in subject`)}</w:t>
          ${createImage(images.underline, {
            width: cmToEmu(6),
            height: cmToEmu(0.21),
            xPos: cmToEmu(-0.19),
            yPos: cmToEmu(0.9),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      <w:p />
      ${threads
        .map((thread) => {
          return safeXml`
            <w:p>
              <w:pPr>
                <w:numPr>
                  <w:ilvl w:val="0" />
                  <w:numId w:val="${numbering.allThreadsNumbering}" />
                </w:numPr>
                <w:spacing w:line="360" w:lineRule="auto" />
                <w:ind w:left="425" w:right="-17" w:hanging="360" />
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t>${cdata(thread.title)}</w:t>
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
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

      <w:p />
      <w:p />

      <w:p>
        <w:r>
          ${createImage(images.curriculumScreenshot, {
            width: cmToEmu(10.5),
            height: cmToEmu(8.63),
            xPos: cmToEmu(7.62),
            yPos: cmToEmu(0.48),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            // isWrapTight: true,
            isDecorative: true,
          })}
        </w:r>
      </w:p>

      <w:p />
      <w:p />
      <w:p />

      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading4" />
          <w:ind w:right="6523" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="28" />
          </w:rPr>
          <w:t>${cdata("Online curriculum")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:right="6523" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>
            ${cdata(
              "Our interactive tool enables you to visualise how threads are sequenced across our curriculum plans.",
            )}
          </w:t>
        </w:r>
      </w:p>

      <w:p>
        <w:r>
          <w:rPr>
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>

      <w:p>
        <w:pPr>
          <w:ind w:right="6523" />
        </w:pPr>
        ${wrapInLinkTo(
          links.onlineCurriculum,
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
                <w:t>${cdata("Go to online curriculum")}</w:t>
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
                  isDecorative: true,
                })}
              </w:r>
            </XML_FRAGMENT>
          `,
        )}
      </w:p>

      ${Array(6)
        .fill(true)
        .map(() => {
          return safeXml`<w:p />`;
        })}
      <w:p>
        <w:r>
          ${createImage(images.threadScreenshot, {
            width: cmToEmu(10.65),
            height: cmToEmu(8.75),
            xPos: cmToEmu(0.02),
            yPos: cmToEmu(0.15),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            // isWrapTight: true,
            isDecorative: true,
          })}
        </w:r>
      </w:p>

      ${Array(4)
        .fill(true)
        .map(() => {
          return safeXml`<w:p />`;
        })}
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading4" />
          <w:ind w:left="6521" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:i w:val="0" />
            <w:color w:val="222222" />
            <w:sz w:val="28" />
          </w:rPr>
          <w:t>${cdata("Threads in this document")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="6521" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>
            ${cdata(
              "The appendix displays the threads and their related units.",
            )}
          </w:t>
        </w:r>
      </w:p>

      <w:p>
        <w:r>
          <w:rPr>
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>

      <w:p>
        <w:pPr>
          <w:ind w:left="6521" />
        </w:pPr>
        ${wrapInLinkToBookmark(
          "section_threads_appendix",
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
                <w:t>${cdata("Go to threads appendix")}</w:t>
              </w:r>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:b />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                  <w:u w:val="none" />
                </w:rPr>
                ${createImage(images.downArrow, {
                  width: cmToEmu(0.4),
                  height: cmToEmu(0.4),
                  isDecorative: true,
                })}
              </w:r>
            </XML_FRAGMENT>
          `,
        )}
      </w:p>

      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
