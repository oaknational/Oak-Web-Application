import type JSZip from "jszip";

import { cdata, xmlElementToJson } from "../../xml";
import { CombinedCurriculumData } from "..";

import {
  appendBodyElements,
  cmToEmu,
  createImage,
  insertImages,
} from "./helper";

export default async function generate(
  zip: JSZip,
  { data }: { data: CombinedCurriculumData },
) {
  const images = await insertImages(zip, {
    partnerImage:
      data.curriculumPartner.image?.asset?.url ??
      "src/pages-helpers/curriculum/docx/v2/builder/images/transparent_pixel.png",
  });

  const pageXml = `
        <root>
            <w:p>
                <w:pPr>
                    <w:pStyle w:val="Heading3"/>
                </w:pPr>
                <w:r>
                    <w:t>${cdata("Our curriculum partner")}</w:t>
                </w:r>
            </w:p>
            <w:p>
                <w:r>
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
