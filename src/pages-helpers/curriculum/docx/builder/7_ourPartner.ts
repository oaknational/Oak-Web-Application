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

import { generateGridCols, makeTransparentIfSanity } from "./helper";

export default async function generate(
  zip: JSZipCached,
  { data }: { data: CombinedCurriculumData },
) {
  const sanityUrl = data.curriculumPartner.image?.asset?.url;
  const images = await insertImages(zip, {
    partnerImage: sanityUrl
      ? makeTransparentIfSanity(sanityUrl)
      : join(
          process.cwd(),
          "src/pages-helpers/curriculum/docx/builder/images/transparent_pixel.png",
        ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const pageXml = safeXml`
    <root>
      <w:p>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" />
            <w:color w:val="222222" />
            <w:sz w:val="24" />
          </w:rPr>
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
          <w:t>${cdata("Our curriculum partner")}</w:t>
          ${createImage(images.underline, {
            width: cmToEmu(7.74),
            height: cmToEmu(0.21),
            xPos: cmToEmu(-0.19),
            yPos: cmToEmu(0.9),
            xPosAnchor: "column",
            yPosAnchor: "paragraph",
            isDecorative: true,
          })}
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
            <w:insideH w:val="single" w:color="FFFFFF" w:sz="0" />
            <w:insideV w:val="single" w:color="FFFFFF" w:sz="0" />
          </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>${generateGridCols(2)}</w:tblGrid>
        <w:tr>
          <w:tc>
            <w:tcPr>
              <w:tcMar>
                <w:start w:type="dxa" w:w="${cmToTwip(0)}" />
                <w:end w:type="dxa" w:w="${cmToTwip(1)}" />
              </w:tcMar>
              <w:vAlign w:val="top" />
            </w:tcPr>

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
                <w:t>${cdata(data.partnerBio)}</w:t>
              </w:r>
            </w:p>
          </w:tc>
          <w:tc>
            <w:p>
              <w:r>
                ${createImage(images.partnerImage, {
                  width: cmToEmu(7.95),
                  height: cmToEmu(7.95),
                  isDecorative: true,
                })}
              </w:r>
            </w:p>
          </w:tc>
        </w:tr>
      </w:tbl>
      <w:p>
        <w:r>
          <w:br w:type="page" />
        </w:r>
      </w:p>
    </root>
  `;

  await appendBodyElements(zip, xmlElementToJson(pageXml)?.elements);
}
