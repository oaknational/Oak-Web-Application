import { join } from "path";

import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../xml";
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
    partnerImage:
      data.curriculumPartner.image?.asset?.url ??
      join(
        process.cwd(),
        "src/pages-helpers/curriculum/docx/builder/images/transparent_pixel.png",
      ),
    underline: join(
      process.cwd(),
      "src/pages-helpers/curriculum/docx/builder/images/underline.png",
    ),
  });

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:color w:val="222222"/>
                        <w:sz w:val="36"/>
                        <w:b/>
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
            <w:p>
                <w:r>
                    <w:rPr>
                        <w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>
                        <w:color w:val="222222"/>
                        <w:sz w:val="24"/>
                    </w:rPr>
                    <w:t>${cdata(data.partnerBio)}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
                    ${createImage(images.partnerImage, {
                      width: cmToEmu(7.95),
                      height: cmToEmu(7.95),
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
