import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData, Slugs } from "..";

import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  insertLinks,
  wrapInLinkToBookmark,
  wrapInLinkTo,
  wrapInBookmarkPoint,
} from "./helper";

export default async function generate(
  zip: JSZip,
  { slugs }: { data: CombinedCurriculumData; slugs: Slugs },
) {
  const links = await insertLinks(zip, {
    onlineCurriculum: `https://www.thenational.academy/teachers/curriculum/${slugs.subjectSlug}-${slugs.phaseSlug}/units`,
  });
  const images = await insertImages(zip, {
    curriculumScreenshot:
      "src/pages-helpers/curriculum/docx/builder/images/our-curriculum-screenshot.png",
    threadScreenshot:
      "src/pages-helpers/curriculum/docx/builder/images/threads-screenshot.png",
    underline: "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    jumpOutArrow:
      "src/pages-helpers/curriculum/docx/builder/images/jump-out-arrow.png",
    downArrow:
      "src/pages-helpers/curriculum/docx/builder/images/down-arrow.png",
  });

  const whatAreThreadsContent =
    "Threads are one way that we provide coherence across the curriculum. Threads highlight where and how units link together, with each specific thread containing knowledge and ideas to help frame units. Providing these threads means that we are able to support teachers' understanding of unit coherence, giving them an increasing ability to deliver great lessons to pupils.";
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
                    <w:t>${cdata("What are threads?")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:t>${cdata(whatAreThreadsContent)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("How to use threads?")}</w:t>
                </w:r>
            </w:p>
            ${howToUseThreadsItems
              .map((howToUseThreadsItem) => {
                return `
                    <w:p>
                        <w:r>
                            <w:t>${cdata(howToUseThreadsItem)}</w:t>
                        </w:r>
                    </w:p>
                `;
              })
              .join("")}
            
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Tools for using threads")}</w:t>
                </w:r>
            </w:p>

            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Online curriculum")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
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
                        <w:t>${cdata("Go to online curriculum.")}</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            <w:p>
                <w:r>
                    ${createImage(images.curriculumScreenshot, {
                      width: cmToEmu(10.5),
                      height: cmToEmu(8.63),
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Threads in this document")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
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
                        <w:t>${cdata("Go to threads appendix")}</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            <w:p>
                <w:r>
                ${createImage(images.threadScreenshot, {
                  width: cmToEmu(10.65),
                  height: cmToEmu(8.75),
                  isDecorative: true,
                })}
                </w:r>
            </w:p>

            <w:p>
                <w:r>
                    ${createImage(images.underline, {
                      width: cmToEmu(5.92),
                      height: cmToEmu(0.21),
                      isDecorative: true,
                    })}
                    ${createImage(images.underline, {
                      width: cmToEmu(6.71),
                      height: cmToEmu(0.21),
                      isDecorative: true,
                    })}
                    ${createImage(images.jumpOutArrow, {
                      width: cmToEmu(0.57),
                      height: cmToEmu(0.57),
                      isDecorative: true,
                    })}
                    ${createImage(images.downArrow, {
                      width: cmToEmu(0.62),
                      height: cmToEmu(0.62),
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    <w:br w:type="page"/>
                </w:r>
            </w:p>
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
