import { join } from "path";

import JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  wrapInBookmarkPoint,
  wrapInLinkToBookmark,
} from "../docx";

import { createThreadOptions, uncapitalizeSubject } from "./helper";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    upArrow: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/up-arrow.png",
    ),
  });

  const threads = createThreadOptions(data.units);
  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                ${wrapInBookmarkPoint(
                  "section_threads_appendix",
                  `
                    <w:r>
                        <w:rPr>
                            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                            <w:color w:val="222222"/>
                            <w:sz w:val="56"/>
                            <w:b/>
                        </w:rPr>
                        <w:t>${cdata(
                          `Threads in ${uncapitalizeSubject(
                            data.subjectTitle,
                          )}`,
                        )}</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            <w:p>
                ${wrapInLinkToBookmark(
                  "section_threads",
                  `
                    <w:r>
                        <w:rPr>
                            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                            <w:color w:val="222222"/>
                            <w:sz w:val="24"/>
                            <w:b/>
                            <w:u w:val="single"/>
                        </w:rPr>
                        <w:t>${cdata(`See how to use threads`)}</w:t>
                    </w:r>
                `,
                )}
                <w:r>
                    ${createImage(images.upArrow, {
                      width: cmToEmu(0.58),
                      height: cmToEmu(0.58),
                      isDecorative: true,
                    })}
                </w:r>
            </w:p>
            ${threads
              .map((thread) => {
                return `
                    <w:p>
                        <w:r>
                            <w:t>${cdata(`Threads in ${thread.title}`)}</w:t>
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
        </root>
    `;

  await appendBodyElements(zip, xmlElementToJson(pageXml).elements);
}
