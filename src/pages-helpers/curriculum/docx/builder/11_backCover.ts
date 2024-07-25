import { join } from "path";

import { cdata, safeXml, xmlElementToJson } from "../xml";
import { CombinedCurriculumData } from "..";
import {
  appendBodyElements,
  cmToEmu,
  cmToTwip,
  createImage,
  insertImages,
  JSZipCached,
} from "../docx";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    // oglLogo: join(
    //   process.cwd(),
    //   "src/pages-helpers/curriculum/docx/builder/images/ogl-logo.png",
    // ),
    peopleIcon: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/people-icon.png",
    ),
    box: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/box-with-logo.png",
    ),
  });

  const pageXml = safeXml`
    <root>
      ${Array(2)
        .fill(true)
        .map(() => {
          return safeXml`
            <w:p>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:pPr>
          <w:jc w:val="center" />
        </w:pPr>
        <w:r>
          ${createImage(images.peopleIcon, {
            width: cmToEmu(9.56),
            height: cmToEmu(13.05),
            // xPos: cmToEmu(5.63),
            // yPos: cmToEmu(3.27),
            isDecorative: true,
          })}
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
                  <w:color w:val="222222" />
                  <w:sz w:val="24" />
                </w:rPr>
                <w:t />
              </w:r>
            </w:p>
          `;
        })
        .join("")}
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          ${createImage(images.box, {
            width: cmToEmu(18.26),
            height: cmToEmu(7.49),
            xPos: cmToEmu(-0.02),
            yPos: cmToEmu(-0.02),
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
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>${cdata("© Oak National Academy 2024.")}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>
            ${cdata(
              `Produced in partnership with ${data.curriculumPartner.name}.`,
            )}
          </w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t />
        </w:r>
      </w:p>
      <w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
          <w:t>
            ${cdata(
              "Licensed on the Open Government Licence v3.0, except where otherwise stated. See Oak terms and conditions.",
            )}
          </w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t />
        </w:r>
      </w:p>
      ${
        "" /*<w:p>
        <w:pPr>
          <w:ind w:left="${cmToTwip(1)}" w:right="${cmToTwip(1)}" />
          <w:jc w:val="right" />
        </w:pPr>
        <w:r>
          ${createImage(images.oglLogo, {
            width: cmToEmu(2.18),
            height: cmToEmu(1.1),
            isDecorative: true,
          })}
        </w:r>
      </w:p>*/
      }
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
