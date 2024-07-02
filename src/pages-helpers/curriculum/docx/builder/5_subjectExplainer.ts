import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  wrapInBookmarkPoint,
} from "../docx";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    educationRoad:
      "src/pages-helpers/curriculum/docx/builder/images/education-road.png",
  });

  const curriculaDescLines = data.curriculaDesc
    .split("\n")
    .filter((line) => line !== "");

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading2"/>
                </w:pPr>
                ${wrapInBookmarkPoint(
                  "section_curriculum_overview",
                  `
                    <w:r>
                        <w:t>${cdata(
                          `${data.subjectTitle} curriculum overview`,
                        )}</w:t>
                    </w:r>
                `,
                )}
            </w:p>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata(`Curriculum explainer`)}</w:t>
                </w:r>
            </w:p>
            ${curriculaDescLines
              .map((line) => {
                return `
                    <w:p>
                        <w:r>
                            <w:t>${cdata(line)}</w:t>
                        </w:r>
                    </w:p>
                `;
              })
              .join("")}
            <w:p>
                <w:r>
                    ${createImage(images.educationRoad, {
                      width: cmToEmu(13.92),
                      height: cmToEmu(10.29),
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
