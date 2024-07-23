import { join } from "path";

import type JSZip from "jszip";

import { cdata, safeXml, xmlElementToJson } from "../xml";
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
    educationRoad: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/education-road.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const curriculaDescLines = data.curriculaDesc
    .split("\n")
    .filter((line) => line !== "");

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:pPr>
          <w:pStyle w:val="Heading2" />
        </w:pPr>
        ${wrapInBookmarkPoint(
          "section_curriculum_overview",
          safeXml`
            <w:r>
              <w:rPr>
                <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                <w:b />
                <w:color w:val="222222" />
                <w:sz w:val="56" />
              </w:rPr>
              <w:t>${cdata(`${data.subjectTitle} curriculum overview`)}</w:t>
            </w:r>
          `,
        )}
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:b />
            <w:color w:val="222222" />
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
          <w:t>${cdata(`Curriculum explainer`)}</w:t>
          ${createImage(images.underline, {
            width: cmToEmu(6.97),
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
      ${curriculaDescLines
        .map((line) => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
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
            xPos: cmToEmu(3.7),
            yPos: cmToEmu(17.57),
            isDecorative: true,
          })}
        </w:r>
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
