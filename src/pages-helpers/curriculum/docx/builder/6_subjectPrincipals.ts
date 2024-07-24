import { join } from "path";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
  JSZipCached,
} from "../docx";

export default async function generate(
  zip: JSZipCached,
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
      <w:p>
        <w:r>
          <w:rPr>
            <w:sz w:val="36" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:tbl>
        <w:tblPr>
          <w:tblW w:type="pct" w:w="100%" />
          <w:tblBorders>
            <w:top w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:left w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:bottom w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:right w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:insideH w:val="single" w:color="FFFFFF" w:sz="4" />
            <w:insideV w:val="single" w:color="FFFFFF" w:sz="4" />
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>
          <w:gridCol w:w="10" />
          <w:gridCol w:w="10515" />
        </w:tblGrid>
        ${data.subjectPrinciples
          .map((subjectPrincipal) => {
            return safeXml`
              <w:tr>
                <w:tc>
                  <w:p>
                    <w:r>
                      ${createImage(images.arrowBullet, {
                        width: cmToEmu(1.11),
                        height: cmToEmu(1.03),
                        isDecorative: true,
                      })}
                    </w:r>
                  </w:p>
                </w:tc>
                <w:tc>
                  <w:p>
                    <w:r>
                      <w:rPr>
                        <w:rFonts
                          w:ascii="Arial"
                          w:hAnsi="Arial"
                          w:cs="Arial"
                        />
                        <w:color w:val="222222" />
                        <w:sz w:val="24" />
                      </w:rPr>
                      <w:t>${cdata(subjectPrincipal)}</w:t>
                    </w:r>
                  </w:p>
                </w:tc>
              </w:tr>
            `;
          })
          .join("")}
      </w:tbl>
      <w:p>
        <w:r>
          <w:rPr>
            <w:sz w:val="36" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
