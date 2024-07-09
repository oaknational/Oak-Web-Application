import { join } from "path";

import type JSZip from "jszip";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "../docx";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    arrowBullet: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/arrow-bullet.png",
    ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const pageXml = safeXml`
    <root>
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
          <w:t>${cdata("Subject principles")}</w:t>
          ${createImage(images.underline, {
            width: cmToEmu(5.96),
            height: cmToEmu(0.21),
            xPos: cmToEmu(-0.19),
            yPos: cmToEmu(0.9),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
        </w:r>
      </w:p>
      ${data.subjectPrinciples
        .map((subjectPrincipal) => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t>${cdata(subjectPrincipal)}</w:t>
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:r>
          ${createImage(images.arrowBullet, {
            width: cmToEmu(1.11),
            height: cmToEmu(1.03),
            isDecorative: true,
          })}
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
